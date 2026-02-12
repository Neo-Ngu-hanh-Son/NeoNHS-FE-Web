import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Eye, Navigation } from 'lucide-react';
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

let PreviewIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: 'preview-marker-hue'
});

let PointMarkerIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [22, 36],
    iconAnchor: [11, 36],
    className: 'point-marker-hue'
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map Interaction Component
function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
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
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface DestinationMapProps {
    destinations: Destination[];
    currentPointDestination: Destination | null;
    mapCenter: [number, number];
    mapZoom: number;
    previewPos: [number, number] | null;
    onMapClick: (lat: number, lng: number) => void;
    onViewDestination: (dest: Destination) => void;
    onViewPoint: (point: Point) => void;
}

export function DestinationMap({
    destinations,
    currentPointDestination,
    mapCenter,
    mapZoom,
    previewPos,
    onMapClick,
    onViewDestination,
    onViewPoint,
}: DestinationMapProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500';
            case 'CLOSED': return 'bg-red-500';
            case 'MAINTENANCE': return 'bg-orange-500';
            case 'TEMPORARILY_CLOSED': return 'bg-rose-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Card className="shadow-sm border-none bg-white/80 backdrop-blur-sm overflow-hidden">
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
                    
                    .popup-poi-scroll::-webkit-scrollbar {
                        width: 4px;
                    }
                    .popup-poi-scroll::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .popup-poi-scroll::-webkit-scrollbar-thumb {
                        background: #10b981;
                        border-radius: 10px;
                    }
                `}
            </style>
            <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    Destinations Map
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div style={{ height: '450px', width: '100%' }} className="relative">
                    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                        <ChangeView center={mapCenter} zoom={mapZoom} />
                        <MapEvents onMapClick={onMapClick} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {destinations.map(dest => {
                            const statusClass = dest.status === 'OPEN' ? 'marker-open' :
                                dest.status === 'CLOSED' ? 'marker-closed' :
                                    dest.status === 'MAINTENANCE' ? 'marker-maintenance' :
                                        'marker-temp-closed';

                            const statusIcon = L.icon({
                                iconUrl: icon,
                                shadowUrl: iconShadow,
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                className: `attraction-marker-hue ${statusClass}`
                            });

                            return (
                                <Marker key={dest.id} position={[dest.latitude, dest.longitude]} opacity={dest.isActive ? 1 : 0.5} icon={statusIcon}>
                                    <Popup minWidth={220}>
                                        <div className="p-1">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <h3 className="font-bold text-primary text-sm m-0 leading-tight">{dest.name}</h3>
                                                <Badge className={`${getStatusColor(dest.status)} text-white text-[9px] px-1.5 py-0 border-none h-4 uppercase`}>
                                                    {dest.status}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mb-2 italic flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate max-w-[150px]">{dest.address}</span>
                                            </p>
                                            <p className="text-[11px] font-semibold text-gray-700 m-0 flex items-center gap-1 mb-2">
                                                <Clock className="w-3 h-3 text-primary" /> {dest.openHour} - {dest.closeHour}
                                            </p>

                                            <Separator className="my-2" />

                                            <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Points of interest ({dest.points?.length || 0}):</p>
                                            <div className="max-h-[100px] overflow-y-auto popup-poi-scroll mb-3 pr-1">
                                                <ul className="text-xs list-none p-0 m-0">
                                                    {(dest.points || []).map(p => (
                                                        <li key={p.id} className="flex items-center gap-1 py-1 border-b border-gray-50 last:border-0 opacity-80">
                                                            <span className="text-[10px] font-bold text-gray-400 w-4">{p.orderIndex}.</span>
                                                            <span className="text-[11px] truncate">{p.name}</span>
                                                            <span className="text-[9px] ml-auto text-muted-foreground">{p.estTimeSpent}m</span>
                                                        </li>
                                                    ))}
                                                    {(dest.points || []).length === 0 && <li className="text-gray-400 italic text-[10px]">No points added yet</li>}
                                                </ul>
                                            </div>

                                            <Button size="sm" variant="outline" className="w-full text-xs h-8 border-primary/30 text-primary hover:bg-primary/5" onClick={() => onViewDestination(dest)}>
                                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                                View Details
                                            </Button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {currentPointDestination && (currentPointDestination.points || []).map(p => (
                            <Marker key={`poi-${p.id}`} position={[p.latitude, p.longitude]} icon={PointMarkerIcon}>
                                <Popup>
                                    <div className="p-1">
                                        <Badge className="bg-orange-500 text-white text-[9px] px-1.5 py-0 border-none h-4 mb-1 uppercase">Point of Interest</Badge>
                                        <h4 className="font-bold text-sm m-0 leading-tight">{p.name}</h4>
                                        <p className="text-muted-foreground text-[10px] mt-0.5">{currentPointDestination.name}</p>
                                        <Separator className="my-2" />
                                        <Button size="sm" variant="outline" className="w-full text-xs h-8 border-primary/30 text-primary hover:bg-primary/5" onClick={() => onViewPoint(p)}>
                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                            View Details
                                        </Button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {previewPos && (
                            <Marker position={previewPos} icon={PreviewIcon}>
                                <Popup autoPan={false}>
                                    <div className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">
                                        Preview New Position
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            </CardContent>
        </Card>
    );
}
