import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet default icon
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER: [number, number] = [16.0028, 108.2638]; // Ngũ Hành Sơn

interface MapPickerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialPosition?: { lat: number; lng: number } | null;
    onConfirm: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export function MapPickerModal({ open, onOpenChange, initialPosition, onConfirm }: MapPickerModalProps) {
    const [position, setPosition] = useState<[number, number]>(
        initialPosition ? [initialPosition.lat, initialPosition.lng] : DEFAULT_CENTER
    );

    useEffect(() => {
        if (open && initialPosition) {
            setPosition([initialPosition.lat, initialPosition.lng]);
        } else if (open) {
            setPosition(DEFAULT_CENTER);
        }
    }, [open, initialPosition]);

    const handleMapClick = (lat: number, lng: number) => {
        setPosition([lat, lng]);
    };

    const handleConfirm = () => {
        onConfirm(
            Number(position[0].toFixed(6)),
            Number(position[1].toFixed(6))
        );
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Select Location on Map
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Click anywhere on the map to pick coordinates for the event location.
                    </p>

                    <div style={{ height: '450px', width: '100%' }} className="rounded-lg overflow-hidden border">
                        {open && (
                            <MapContainer
                                center={position}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <MapClickHandler onMapClick={handleMapClick} />
                                <Marker position={position} />
                            </MapContainer>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                            Lat: {position[0].toFixed(6)}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-mono">
                            Lng: {position[1].toFixed(6)}
                        </Badge>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        <MapPin className="h-4 w-4 mr-1" />
                        Confirm Location
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
