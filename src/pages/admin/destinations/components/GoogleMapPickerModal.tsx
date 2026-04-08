import { useEffect, useState, useRef } from 'react';
import { NGU_HANH_SON_BOUNDARY, MAP_CENTER, NGU_HANH_SON_GEOJSON_POLYGON } from '../constants';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Map as MapIcon, Sparkles, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { uploadImageToCloudinary } from '@/utils/cloudinary';
import { message } from 'antd';
import * as turf from '@turf/turf';

// ─── Initialize Google Maps Engine (Call Once Globally) ───
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (apiKey) {
    setOptions({
        key: apiKey,
        v: "weekly"
    });
}

// ─── Types ───
interface DiscoveryResult {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    googlePlaceId: string;
    photoUrl?: string;
}

interface GoogleMapPickerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (result: DiscoveryResult) => void;
    initialCoord?: [number, number];
}

// ─── Turf Point-in-Polygon Check ───
function isPointInBoundary(lat: number, lng: number): boolean {
    const point = turf.point([lng, lat]);
    const polygon = turf.polygon(NGU_HANH_SON_GEOJSON_POLYGON);
    return turf.booleanPointInPolygon(point, polygon);
}

export function GoogleMapPickerModal({
    open,
    onOpenChange,
    onSelect,
    initialCoord
}: GoogleMapPickerModalProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMap = useRef<google.maps.Map | null>(null);
    const marker = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const boundaryPolygon = useRef<google.maps.Polygon | null>(null);
    const geocoder = useRef<google.maps.Geocoder | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);

    const [selectedPoint, setSelectedPoint] = useState<{
        lat: number;
        lng: number;
        name?: string;
        address?: string;
        placeId?: string;
        photoUrl?: string;
        types?: string[];
    } | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [geocoding, setGeocoding] = useState(false);
    const [processingImage, setProcessingImage] = useState(false);
    const [apiLoading, setApiLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    // Initialize Google Engine
    useEffect(() => {
        if (!open) return;


        Promise.all([
            importLibrary("maps"),
            importLibrary("places"),
            importLibrary("marker")
        ]).then(() => {
            initMap();
            setApiLoading(false);
        }).catch(err => {
            setApiError(`Failed to load Google Maps: ${err.message}`);
            setApiLoading(false);
        });

        return () => {
            googleMap.current = null;
        };
    }, [open]);

    const initMap = () => {
        if (!mapRef.current) return;

        const center = initialCoord ? { lat: initialCoord[0], lng: initialCoord[1] } : { lat: MAP_CENTER[0], lng: MAP_CENTER[1] };

        const mapOptions: google.maps.MapOptions = {
            center: center,
            zoom: initialCoord ? 19 : 15,
            mapId: '98d54d19d6797a1',
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'greedy',
        };

        const map = new google.maps.Map(mapRef.current, mapOptions);
        googleMap.current = map;
        geocoder.current = new google.maps.Geocoder();
        placesService.current = new google.maps.places.PlacesService(map);

        if (initialCoord) {
            handleLocationSelection(initialCoord[0], initialCoord[1]);
        }

        // Add Boundary
        const boundaryCoords = NGU_HANH_SON_BOUNDARY.map(c => ({ lat: c[0], lng: c[1] }));
        boundaryPolygon.current = new google.maps.Polygon({
            paths: boundaryCoords,
            strokeColor: "#6366f1",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#6366f1",
            fillOpacity: 0.1,
            map: map,
            clickable: false,
        });

        // Fit Bounds only if not an initial coordination focus
        if (!initialCoord) {
            const bounds = new google.maps.LatLngBounds();
            boundaryCoords.forEach(c => bounds.extend(c));
            map.fitBounds(bounds);
        }

        // Click Handler
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                handleLocationSelection(e.latLng.lat(), e.latLng.lng(), (e as any).placeId);
            }
        });
    };

    const handleLocationSelection = (lat: number, lng: number, placeId?: string) => {
        if (!isPointInBoundary(lat, lng)) {
            setError("This location is outside the boundary of Ngũ Hành Sơn.");
            return;
        }

        setError(null);
        setGeocoding(true);
        updateMarker(lat, lng);

        if (placeId) {
            fetchPlaceDetails(placeId, lat, lng);
        } else {
            reverseGeocode(lat, lng);
        }
    };

    const updateMarker = (lat: number, lng: number) => {
        if (!googleMap.current) return;

        if (!marker.current) {
            const pinElement = document.createElement('div');
            pinElement.innerHTML = `
                <div class="relative flex flex-col items-center animate-bounce-short">
                    <div class="w-10 h-10 rounded-full border-4 border-white shadow-2xl flex items-center justify-center bg-indigo-600">
                        <span class="material-symbols-outlined text-white text-xl">location_on</span>
                    </div>
                </div>
            `;

            marker.current = new google.maps.marker.AdvancedMarkerElement({
                map: googleMap.current,
                position: { lat, lng },
                content: pinElement,
            });
        } else {
            marker.current.position = { lat, lng };
        }

        googleMap.current.setCenter({ lat, lng });
        googleMap.current.setZoom(19);
    };

    const fetchPlaceDetails = (placeId: string, lat: number, lng: number) => {
        if (!placesService.current) return;

        placesService.current.getDetails({
            placeId: placeId,
            fields: ['name', 'formatted_address', 'geometry', 'photos', 'types']
        }, (place, status) => {
            setGeocoding(false);
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                const pLat = typeof place.geometry?.location?.lat === 'function' ? place.geometry.location.lat() : (place.geometry?.location as any)?.lat || lat;
                const pLng = typeof place.geometry?.location?.lng === 'function' ? place.geometry.location.lng() : (place.geometry?.location as any)?.lng || lng;

                setSelectedPoint({
                    lat: pLat,
                    lng: pLng,
                    name: place.name,
                    address: place.formatted_address,
                    placeId: placeId,
                    photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
                    types: place.types
                });
            } else {
                reverseGeocode(lat, lng);
            }
        });
    };

    const reverseGeocode = (lat: number, lng: number) => {
        if (!geocoder.current) return;

        geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
            setGeocoding(false);
            if (status === "OK" && results && results[0]) {
                const result = results[0];
                setSelectedPoint({
                    lat,
                    lng,
                    name: "Dropped Pin",
                    address: result.formatted_address,
                    placeId: result.place_id
                });
            } else {
                setSelectedPoint({
                    lat,
                    lng,
                    name: "Unknown Location",
                    address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                });
            }
        });
    };

    const handlePlaceSearchSelect = (place: DiscoveryResult) => {
        const lat = place.latitude;
        const lng = place.longitude;

        if (isPointInBoundary(lat, lng)) {
            setError(null);
            setSelectedPoint({
                lat: lat,
                lng: lng,
                name: place.name,
                address: place.address,
                placeId: place.googlePlaceId,
                photoUrl: place.photoUrl
            });
            updateMarker(lat, lng);
        } else {
            setError("Vị trí đã tìm thấy nằm ngoài ranh giới Ngũ Hành Sơn.");
            // Still move the map there so user sees where it is, but show error
            updateMarker(lat, lng);
        }
    };

    const handleConfirmSelection = async () => {
        if (!selectedPoint) return;

        let finalPhotoUrl = selectedPoint.photoUrl;

        // If it's an external URL (not already on Cloudinary), move it to Cloudinary to shorten it
        if (selectedPoint.photoUrl && !selectedPoint.photoUrl.includes('cloudinary.com')) {
            setProcessingImage(true);
            console.log('Shortening URL via Cloudinary:', selectedPoint.photoUrl);
            try {
                const cloudinaryUrl = await uploadImageToCloudinary(selectedPoint.photoUrl);
                if (cloudinaryUrl) {
                    finalPhotoUrl = cloudinaryUrl;
                    console.log('Shortened URL:', cloudinaryUrl);
                } else {
                    message.warning("Không thể tối ưu hóa ảnh qua Cloudinary. URL của Google có thể quá dài để lưu.");
                }
            } catch (err) {
                console.error("Failed to shorten image URL via Cloudinary:", err);
                message.error("Lỗi khi tải ảnh lên Cloudinary.");
            } finally {
                setProcessingImage(false);
            }
        }

        onSelect({
            name: selectedPoint.name || 'Selected Location',
            address: selectedPoint.address || '',
            latitude: selectedPoint.lat,
            longitude: selectedPoint.lng,
            googlePlaceId: selectedPoint.placeId || '',
            photoUrl: finalPhotoUrl,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] h-[90vh] p-0 overflow-hidden border-none shadow-2xl bg-white flex flex-col">
                <DialogHeader className="px-6 py-4 bg-slate-50 border-b shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-indigo-100 rounded-xl">
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight text-slate-800">
                                    Interactive Location Discoverer
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium">
                                    Native Google Maps Hub • Boundary Restricted
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="relative flex-1 bg-slate-100">
                    {apiLoading && (
                        <div className="absolute inset-0 z-[50] bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            <p className="text-sm font-bold text-slate-600">Waking up Google Engine...</p>
                        </div>
                    )}

                    {apiError && (
                        <div className="absolute inset-0 z-[50] bg-white flex flex-col items-center justify-center p-8 text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Google Maps Failed to Load</h3>
                            <p className="text-sm text-slate-500 mb-6">{apiError}</p>
                            <Button onClick={() => window.location.reload()}>Retry Connection</Button>
                        </div>
                    )}

                    <div ref={mapRef} className="w-full h-full" />

                    {/* Overlay: Search Bar */}
                    <div className="absolute top-4 left-4 z-[10] w-[400px]">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)]">
                            <GooglePlacesAutocomplete onPlaceSelect={handlePlaceSearchSelect} className="w-full border-none shadow-none" />
                        </div>
                    </div>

                    {/* Overlay: Legend */}
                    <div className="absolute top-4 right-4 z-[10] flex flex-col gap-2">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/50 shadow-lg flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500/20 border-2 border-indigo-500"></div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Boundary Restricted</span>
                        </div>
                    </div>

                    {/* Overlay: Error */}
                    {error && (
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[10] w-[400px] animate-in slide-in-from-bottom-4">
                            <div className="bg-red-50/95 backdrop-blur-xl border border-red-200 p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-sm font-bold text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Overlay: Selection Details */}
                    {selectedPoint && (
                        <div className="absolute bottom-6 left-6 right-6 z-[10] flex justify-center animate-in slide-in-from-bottom-8 duration-500">
                            <div className="bg-white/98 backdrop-blur-xl border border-indigo-100 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-2xl pointer-events-auto">
                                <div className="flex items-start gap-5">
                                    <div className="relative shrink-0">
                                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200">
                                            {selectedPoint.photoUrl ? (
                                                <img src={selectedPoint.photoUrl} alt="Location" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 opacity-40">
                                                    <Building2 className="w-8 h-8" />
                                                    <span className="text-[8px] font-bold uppercase">No Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        {geocoding && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
                                                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h4 className="text-lg font-black text-slate-800 truncate leading-none">
                                                {selectedPoint.name}
                                            </h4>
                                            {selectedPoint.placeId && (
                                                <Badge className="bg-indigo-600 hover:bg-indigo-700 text-[9px] h-4.5 px-1.5 rounded-full border-none">Google POI</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-1 mb-3 font-medium">
                                            {selectedPoint.address}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="px-2.5 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
                                                <MapIcon className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] font-mono font-bold text-slate-600">
                                                    {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                                                </span>
                                            </div>
                                            {selectedPoint.types && selectedPoint.types.length > 0 && (
                                                <div className="px-2.5 py-1 bg-indigo-50 rounded-lg flex items-center gap-1.5 border border-indigo-100/50">
                                                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">
                                                        {selectedPoint.types[0].replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={handleConfirmSelection}
                                            disabled={geocoding || processingImage}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70"
                                        >
                                            {processingImage ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Use this Place
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setSelectedPoint(null)}
                                            className="text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 h-10 rounded-xl"
                                        >
                                            Discard Selection
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-white border-t flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Ready</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium italic border-l pl-4 border-slate-100">
                            POI ID mapping active for persistence
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold border-slate-200 text-slate-600">
                        Close Explorer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
