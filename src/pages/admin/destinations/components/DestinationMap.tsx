import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NGU_HANH_SON_BOUNDARY, POINT_TYPE_CONFIG } from '../constants';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, X, Clock, Navigation, Edit } from 'lucide-react';
import { Destination, Point } from '../types';

// Fix for leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const PreviewIcon = L.divIcon({
    className: 'custom-preview-marker',
    html: `
        <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
            <div class="relative w-7 h-7 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-blue-600 rotate-45"></div>
        </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

const getPointIcon = (type: string) => {
    const config = POINT_TYPE_CONFIG[type] || POINT_TYPE_CONFIG.DEFAULT;
    return L.divIcon({
        className: 'custom-point-marker',
        html: `
            <div class="relative flex flex-col items-center">
                <div class="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center overflow-hidden" style="background-color: ${config.color}">
                    <span class="material-symbols-outlined text-white text-[18px]">${config.icon}</span>
                </div>
                <div class="w-0.5 h-1.5" style="background-color: ${config.color}"></div>
                <div class="w-1.5 h-1.5 rounded-full border border-white shadow-sm" style="background-color: ${config.color}"></div>
            </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
    });
};

L.Marker.prototype.options.icon = DefaultIcon;

// Map Interaction Component
function MapEvents({ onMapClick, onDeselect }: { onMapClick: (lat: number, lng: number) => void; onDeselect: () => void }) {
    useMapEvents({
        click(e) {
            onDeselect();
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Map Fixer Component
function FixMapRendering() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map]);
    return null;
}

// Map Updater Component
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (center && zoom) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

// Fit Boundary Component - Automatically shows the whole district once
function FitBoundary({ enabled }: { enabled: boolean }) {
    const map = useMap();
    const [hasFitted, setHasFitted] = useState(false);

    useEffect(() => {
        if (enabled && !hasFitted && NGU_HANH_SON_BOUNDARY.length > 0) {
            const bounds = L.latLngBounds(NGU_HANH_SON_BOUNDARY);
            map.fitBounds(bounds, { padding: [20, 20] });
            setHasFitted(true);
        }
    }, [enabled, hasFitted, map]);
    return null;
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

    const [selectedPoint, setSelectedPoint] = useState<(Point & { parentDestinationName?: string }) | null>(null);

    // Compute which points to show on the map
    const pointsToShow = useMemo(() => {
        if (!allPoints) return [];

        if (currentPointDestination) {
            return allPoints.filter(p => (p.attractionId === currentPointDestination.id || (p as any).attraction?.id === currentPointDestination.id));
        }

        return allPoints;
    }, [allPoints, currentPointDestination]);

    const handleMarkerClick = (point: Point & { parentDestinationName?: string }) => {
        setSelectedPoint(point);
        onPointClick?.(point.latitude, point.longitude);
    };

    const typeConfig = selectedPoint ? (POINT_TYPE_CONFIG[selectedPoint.type] || POINT_TYPE_CONFIG.DEFAULT) : null;

    return (
        <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm overflow-hidden h-full ring-1 ring-black/5">
            <style>
                {`
                    .preview-marker-hue {
                        filter: hue-rotate(140deg) brightness(1.2);
                        z-index: 1000 !important;
                    }
                    .point-marker-hue {
                        filter: hue-rotate(280deg) brightness(1.1);
                        z-index: 900 !important;
                    }
                    .attraction-marker-hue {
                        z-index: 800 !important;
                    }
                    .marker-open { filter: hue-rotate(-15deg) brightness(0.8) contrast(1.2); }
                    .marker-closed { filter: hue-rotate(120deg) brightness(0.8); }
                    .marker-maintenance { filter: hue-rotate(40deg) brightness(1.1); }
                    .marker-temp-closed { filter: hue-rotate(180deg) grayscale(0.5); }
                    
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
            <div className="h-full w-full relative">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                    <ChangeView center={mapCenter} zoom={mapZoom} />
                    {previewPos ? (
                        <ChangeView center={[previewPos[0], previewPos[1]]} zoom={18} />
                    ) : (
                        <FitBoundary enabled={true} />
                    )}
                    <MapEvents onMapClick={onMapClick} onDeselect={() => setSelectedPoint(null)} />
                    <FixMapRendering />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Ngũ Hành Sơn Boundary Polygon */}
                    <Polygon
                        positions={NGU_HANH_SON_BOUNDARY}
                        pathOptions={{
                            color: '#6366f1',
                            weight: 3,
                            opacity: 0.85,
                            fillColor: '#6366f1',
                            fillOpacity: 0.08,
                            dashArray: '8, 4',
                        }}
                    />

                    {/* Point Markers — click to zoom & show detail panel */}
                    {pointsToShow.map((p: any) => (
                        <Marker
                            key={`poi-${p.id}`}
                            position={[Number(p.latitude), Number(p.longitude)]}
                            icon={getPointIcon(p.type)}
                            eventHandlers={{
                                click: (e) => {
                                    L.DomEvent.stopPropagation(e.originalEvent);
                                    handleMarkerClick(p);
                                },
                            }}
                        />
                    ))}

                    {previewPos && (
                        <Marker position={previewPos} icon={PreviewIcon}>
                            <Popup autoPan={false}>
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">
                                    Spatial Projection<br />(Preview)
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Detail Overlay Panel */}
                {selectedPoint && typeConfig && (
                    <div
                        className="absolute bottom-4 left-4 right-4 z-[1000] animate-in slide-in-from-bottom-4 fade-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden ring-1 ring-black/5">
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedPoint(null)}
                                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md border border-slate-200/50 transition-all hover:scale-110"
                            >
                                <X className="w-3.5 h-3.5 text-slate-500" />
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
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: typeConfig.color }}
                                            >
                                                <span className="material-symbols-outlined text-white text-[12px]">{typeConfig.icon}</span>
                                            </div>
                                            <Badge
                                                className="text-[9px] px-1.5 py-0 border-none h-4 uppercase font-bold text-white"
                                                style={{ backgroundColor: typeConfig.color }}
                                            >
                                                {selectedPoint.type}
                                            </Badge>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 text-[10px] font-bold text-primary hover:bg-primary/10"
                                            onClick={() => onViewPoint(selectedPoint)}
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Manage Point
                                        </Button>
                                    </div>

                                    <h4 className="font-bold text-sm text-slate-800 leading-tight truncate mb-1">
                                        {selectedPoint.name}
                                    </h4>

                                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-2">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span className="truncate">
                                            {(selectedPoint as any).parentDestinationName || (selectedPoint as any).destinationName || "Unassigned"}
                                        </span>
                                    </p>

                                    {selectedPoint.description && (
                                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                                            {selectedPoint.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Navigation className="w-3 h-3" />
                                            {selectedPoint.latitude.toFixed(5)}, {selectedPoint.longitude.toFixed(5)}
                                        </span>
                                        {selectedPoint.estTimeSpent && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {selectedPoint.estTimeSpent} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
