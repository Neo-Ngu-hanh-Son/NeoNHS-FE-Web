import { useEffect, useState, useRef } from 'react';
import { NGU_HANH_SON_BOUNDARY, MAP_CENTER, NGU_HANH_SON_GEOJSON_POLYGON } from '../constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { GoogleMapPicker } from './GoogleMapPicker';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { uploadImageToCloudinary } from '@/utils/cloudinary';
import { message } from 'antd';
import * as turf from '@turf/turf';

// ─── Initialize Google Maps Engine (Call Once Globally) ───
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (apiKey) {
  setOptions({
    key: apiKey,
    v: 'weekly',
  });
}

// ─── Types ───
export interface DiscoveryResult {
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

export function GoogleMapPickerModal({ open, onOpenChange, onSelect, initialCoord }: GoogleMapPickerModalProps) {
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

    Promise.all([importLibrary('maps'), importLibrary('places'), importLibrary('marker')])
      .then(() => {
        initMap();
        setApiLoading(false);
      })
      .catch((err) => {
        setApiError(`Failed to load Google Maps: ${err.message}`);
        setApiLoading(false);
      });

    return () => {
      googleMap.current = null;
    };
  }, [open]);

  const initMap = () => {
    if (!mapRef.current) return;

    // Reset stale refs from previous modal openings
    if (marker.current) {
      marker.current.map = null;
      marker.current = null;
    }
    if (boundaryPolygon.current) {
      boundaryPolygon.current.setMap(null);
      boundaryPolygon.current = null;
    }

    const center = initialCoord
      ? { lat: initialCoord[0], lng: initialCoord[1] }
      : { lat: MAP_CENTER[0], lng: MAP_CENTER[1] };

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
    const boundaryCoords = NGU_HANH_SON_BOUNDARY.map((c) => ({ lat: c[0], lng: c[1] }));
    boundaryPolygon.current = new google.maps.Polygon({
      paths: boundaryCoords,
      strokeColor: '#6366f1',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#6366f1',
      fillOpacity: 0.1,
      map: map,
      clickable: false,
    });

    // Fit Bounds only if not an initial coordination focus
    if (!initialCoord) {
      const bounds = new google.maps.LatLngBounds();
      boundaryCoords.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds);
    }

    // Click Handler
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        handleLocationSelection(e.latLng.lat(), e.latLng.lng(), (e as any).placeId);
      }
    });
  };

  const handleLocationSelection = (lat: number, lng: number, placeId?: string) => {
    if (!isPointInBoundary(lat, lng)) {
      setError('This location is outside the boundary of Ngũ Hành Sơn.');
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

    placesService.current.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'geometry', 'photos', 'types'],
      },
      (place, status) => {
        setGeocoding(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const pLat =
            typeof place.geometry?.location?.lat === 'function'
              ? place.geometry.location.lat()
              : (place.geometry?.location as any)?.lat || lat;
          const pLng =
            typeof place.geometry?.location?.lng === 'function'
              ? place.geometry.location.lng()
              : (place.geometry?.location as any)?.lng || lng;

          setSelectedPoint({
            lat: pLat,
            lng: pLng,
            name: place.name,
            address: place.formatted_address,
            placeId: placeId,
            photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
            types: place.types,
          });
        } else {
          reverseGeocode(lat, lng);
        }
      },
    );
  };

  const reverseGeocode = (lat: number, lng: number) => {
    if (!geocoder.current) return;

    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
      setGeocoding(false);
      if (status === 'OK' && results && results[0]) {
        const result = results[0];
        setSelectedPoint({
          lat,
          lng,
          name: 'Điểm đánh dấu',
          address: result.formatted_address,
          placeId: result.place_id,
        });
      } else {
        setSelectedPoint({
          lat,
          lng,
          name: 'Unknown Location',
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
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
        photoUrl: place.photoUrl,
      });
      updateMarker(lat, lng);
    } else {
      setError('Vị trí đã tìm thấy nằm ngoài ranh giới Ngũ Hành Sơn.');
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
      //console.log('Shortening URL via Cloudinary:', selectedPoint.photoUrl);
      try {
        const cloudinaryUrl = await uploadImageToCloudinary(selectedPoint.photoUrl);
        if (cloudinaryUrl) {
          finalPhotoUrl = cloudinaryUrl;
          //console.log('Shortened URL:', cloudinaryUrl);
        } else {
          message.warning('Không thể tối ưu hóa ảnh qua Cloudinary. URL của Google có thể quá dài để lưu.');
        }
      } catch (err) {
        //console.error('Failed to shorten image URL via Cloudinary:', err);
        message.error('Lỗi khi tải ảnh lên Cloudinary.');
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
                  Công cụ chọn địa điểm trên bản đồ
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Google Maps Hub • Ranh giới Ngũ Hành Sơn
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <GoogleMapPicker
          apiLoading={apiLoading}
          apiError={apiError}
          mapRef={mapRef}
          onPlaceSelect={handlePlaceSearchSelect}
          error={error}
          selectedPoint={selectedPoint}
          geocoding={geocoding}
          processingImage={processingImage}
          onConfirmSelection={handleConfirmSelection}
          onDiscardSelection={() => setSelectedPoint(null)}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
