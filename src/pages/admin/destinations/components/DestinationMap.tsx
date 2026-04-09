import { useEffect, useMemo, useState, useRef } from 'react';
import { NGU_HANH_SON_BOUNDARY, POINT_TYPE_CONFIG } from '../constants';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, X, Clock, Navigation, Edit, Loader2, AlertTriangle } from 'lucide-react';
import { Destination, Point } from '../types';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// Initialize Google Maps Engine
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (apiKey) {
    setOptions({
        key: apiKey,
        v: "weekly"
    });
}

interface DestinationMapProps {
    destinations: Destination[];
    allPoints: Point[];
    currentPointDestination: Destination | null;
    mapCenter: [number, number];
    mapZoom: number;
    previewPos: [number, number] | null;
    onMapClick: (lat: number, lng: number) => void;
    onViewPoint: (point: Point) => void;
    onPointClick?: (lat: number, lng: number) => void;
}

export function DestinationMap({
    destinations: _destinations,
    allPoints,
    currentPointDestination,
    mapCenter,
    mapZoom,
    previewPos,
    onMapClick,
    onViewPoint,
    onPointClick,
}: DestinationMapProps) {

    const mapRef = useRef<HTMLDivElement>(null);
    const googleMap = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<Record<string, google.maps.marker.AdvancedMarkerElement>>({});
    const previewMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const polygonRef = useRef<google.maps.Polygon | null>(null);

    const [selectedPoint, setSelectedPoint] = useState<(Point & { parentDestinationName?: string }) | null>(null);
    const [apiLoading, setApiLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    // Compute which points to show on the map
    const pointsToShow = useMemo(() => {
        if (!allPoints) return [];
        if (currentPointDestination) {
            return allPoints.filter(p => (p.attractionId === currentPointDestination.id || (p as any).attraction?.id === currentPointDestination.id));
        }
        return allPoints;
    }, [allPoints, currentPointDestination]);

    // Initialize map
    useEffect(() => {
        let isMounted = true;
        Promise.all([
            importLibrary("maps"),
            importLibrary("marker")
        ]).then(() => {
            if (isMounted) {
                initMap();
                setApiLoading(false);
            }
        }).catch(err => {
            if (isMounted) {
                setApiError(`Failed to load Google Maps: ${err.message}`);
                setApiLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    const initMap = () => {
        if (!mapRef.current || googleMap.current) return;

        const mapOptions: google.maps.MapOptions = {
            center: { lat: mapCenter[0], lng: mapCenter[1] },
            zoom: mapZoom,
            mapId: 'destinations_map_admin_123',
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'greedy',
        };

        const map = new google.maps.Map(mapRef.current, mapOptions);
        googleMap.current = map;

        // Draw Polygon
        const boundaryCoords = NGU_HANH_SON_BOUNDARY.map(c => ({ lat: c[0], lng: c[1] }));
        polygonRef.current = new google.maps.Polygon({
            paths: boundaryCoords,
            strokeColor: "#6366f1",
            strokeOpacity: 0.85,
            strokeWeight: 3,
            fillColor: "#6366f1",
            fillOpacity: 0.08,
            map: map,
            clickable: false,
        });

        // Fit Bounds
        if (!previewPos) {
            const bounds = new google.maps.LatLngBounds();
            boundaryCoords.forEach(c => bounds.extend(c));
            map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
        } else {
            map.setCenter({ lat: previewPos[0], lng: previewPos[1] });
            map.setZoom(18);
        }

        // Add Click Listener
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                setSelectedPoint(null);
                onMapClick(e.latLng.lat(), e.latLng.lng());
            }
        });

        // Render markers immediately if points are available
        renderPoints(map);
        renderPreview(map);
    };

    // Keep map center/zoom synced with props (if map is already initialized)
    useEffect(() => {
        if (!googleMap.current) return;
        if (previewPos) {
            googleMap.current.setCenter({ lat: previewPos[0], lng: previewPos[1] });
            googleMap.current.setZoom(18);
        } else if (mapCenter) {
            googleMap.current.setCenter({ lat: mapCenter[0], lng: mapCenter[1] });
            googleMap.current.setZoom(mapZoom);
        }
    }, [mapCenter, mapZoom, previewPos]);

    // Re-render markers when pointsToShow changes
    useEffect(() => {
        if (googleMap.current) {
            renderPoints(googleMap.current);
        }
    }, [pointsToShow]);

    // Handle preview marker
    useEffect(() => {
        if (googleMap.current) {
            renderPreview(googleMap.current);
        }
    }, [previewPos]);

    const renderPreview = (map: google.maps.Map) => {
        if (typeof window === 'undefined') return;
        if (!window.google || !window.google.maps || !window.google.maps.marker) return;

        if (previewMarkerRef.current) {
            previewMarkerRef.current.map = null;
            previewMarkerRef.current = null;
        }

        if (previewPos) {
            const el = document.createElement('div');
            el.className = 'custom-preview-marker';
            el.innerHTML = `
                <div class="relative flex items-center justify-center -translate-y-[14px]">
                    <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
                    <div class="relative w-7 h-7 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div class="absolute -bottom-1 w-2 h-2 bg-blue-600 rotate-45"></div>
                </div>
                <div class="absolute top-[20px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-lg border border-blue-100 opacity-90 transition-opacity">
                    <span class="text-[9px] font-black tracking-widest uppercase text-blue-600">Preview</span>
                </div>
            `;
            previewMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
                map,
                position: { lat: previewPos[0], lng: previewPos[1] },
                content: el,
                zIndex: 1000
            });
        }
    };

    const renderPoints = (map: google.maps.Map) => {
        if (typeof window === 'undefined') return;
        if (!window.google || !window.google.maps || !window.google.maps.marker) return;

        // Collect new required IDs
        const newIds = new Set(pointsToShow.map(p => p.id));

        // Remove markers not in the new set
        Object.keys(markersRef.current).forEach(id => {
            if (!newIds.has(id)) {
                markersRef.current[id].map = null;
                delete markersRef.current[id];
            }
        });

        // Add or update markers
        pointsToShow.forEach(p => {
            const config = POINT_TYPE_CONFIG[p.type] || POINT_TYPE_CONFIG.DEFAULT;
            const lat = Number(p.latitude);
            const lng = Number(p.longitude);

            if (!markersRef.current[p.id]) {
                const el = document.createElement('div');
                el.className = 'custom-point-marker cursor-pointer transition-transform hover:scale-110';
                el.innerHTML = `
                    <div class="relative flex flex-col items-center -translate-y-[21px]">
                        <div class="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center overflow-hidden" style="background-color: ${config.color}">
                            <span class="material-symbols-outlined text-white text-[18px]">${config.icon}</span>
                        </div>
                        <div class="w-0.5 h-1.5" style="background-color: ${config.color}"></div>
                        <div class="w-1.5 h-1.5 rounded-full border border-white shadow-sm" style="background-color: ${config.color}"></div>
                    </div>
                `;

                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setSelectedPoint(p);
                    onPointClick?.(lat, lng);
                });

                markersRef.current[p.id] = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: { lat, lng },
                    content: el,
                    zIndex: 900
                });
            } else {
                // Just update position in case it changed
                markersRef.current[p.id].position = { lat, lng };
            }
        });
    };

    const handleMarkerClick = (point: Point & { parentDestinationName?: string }) => {
        setSelectedPoint(point);
        onPointClick?.(point.latitude, point.longitude);
    };

    const typeConfig = selectedPoint ? (POINT_TYPE_CONFIG[selectedPoint.type] || POINT_TYPE_CONFIG.DEFAULT) : null;

    return (
        <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm overflow-hidden h-full ring-1 ring-black/5 relative">
            <style>
                {`
                    .detail-panel-scroll::-webkit-scrollbar {
                        width: 4px;
                    }
                    .detail-panel-scroll::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .detail-panel-scroll::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 10px;
                    }
                `}
            </style>

            {apiLoading && (
                <div className="absolute inset-0 z-[50] bg-slate-50 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm font-bold text-slate-600 tracking-wide">Loading Maps Engine...</p>
                </div>
            )}

            {apiError && (
                <div className="absolute inset-0 z-[50] bg-white flex flex-col items-center justify-center p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Maps Engine Failed</h3>
                    <p className="text-sm text-slate-500 mb-6">{apiError}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            )}

            {/* Google Map Container */}
            <div ref={mapRef} className="w-full h-full" />

            {/* Detail Overlay Panel */}
            {selectedPoint && typeConfig && (
                <div
                    className="absolute bottom-4 left-4 right-4 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden ring-1 ring-black/5">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedPoint(null)}
                            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 shadow-sm border border-slate-200/50 transition-all hover:scale-110"
                        >
                            <X className="w-3.5 h-3.5 text-slate-600" />
                        </button>

                        <div className="flex gap-0">
                            {/* Thumbnail */}
                            {selectedPoint.thumbnailUrl && (
                                <div className="w-32 shrink-0">
                                    <img
                                        src={selectedPoint.thumbnailUrl}
                                        alt={selectedPoint.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 p-4 pr-4 min-w-0 detail-panel-scroll overflow-y-auto max-h-[180px]">
                                <div className="flex items-center justify-between mb-1.5 pr-6">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: typeConfig.color }}
                                        >
                                            <span className="material-symbols-outlined text-white text-[12px]">{typeConfig.icon}</span>
                                        </div>
                                        <Badge
                                            className="text-[9px] px-1.5 py-0 border-none h-4 uppercase font-bold text-white shrink-0"
                                            style={{ backgroundColor: typeConfig.color }}
                                        >
                                            {selectedPoint.type}
                                        </Badge>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 text-[10px] font-bold text-primary hover:bg-primary/10 shrink-0"
                                        onClick={() => onViewPoint(selectedPoint)}
                                    >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Manage
                                    </Button>
                                </div>

                                <h4 className="font-bold text-sm text-slate-800 leading-tight truncate mb-1 pr-6" title={selectedPoint.name}>
                                    {selectedPoint.name}
                                </h4>

                                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-2">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    <span className="truncate" title={(selectedPoint as any).parentDestinationName || (selectedPoint as any).destinationName || "Unassigned"}>
                                        {(selectedPoint as any).parentDestinationName || (selectedPoint as any).destinationName || "Unassigned"}
                                    </span>
                                </p>

                                {selectedPoint.description && (
                                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-2 pr-2">
                                        {selectedPoint.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium pb-1">
                                    <span className="flex items-center gap-1">
                                        <Navigation className="w-3 h-3 shrink-0" />
                                        {selectedPoint.latitude.toFixed(5)}, {selectedPoint.longitude.toFixed(5)}
                                    </span>
                                    {selectedPoint.estTimeSpent && (
                                        <span className="flex items-center gap-1 shrink-0">
                                            <Clock className="w-3 h-3" />
                                            {selectedPoint.estTimeSpent}m
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
