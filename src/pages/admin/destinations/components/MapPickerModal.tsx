import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface MapPickerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pickerCoord: [number, number];
    onMapClick: (lat: number, lng: number) => void;
    onConfirm: () => void;
}

export function MapPickerModal({
    open,
    onOpenChange,
    pickerCoord,
    onMapClick,
    onConfirm,
}: MapPickerModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Select Location on Map</DialogTitle>
                </DialogHeader>

                <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden border mt-2">
                    <MapContainer center={pickerCoord} zoom={16} style={{ height: '100%', width: '100%' }}>
                        <FixMapRendering />
                        <ChangeView center={pickerCoord} zoom={16} />
                        <MapEvents onMapClick={onMapClick} />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={pickerCoord} />
                    </MapContainer>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground italic">Click anywhere on the map to pick coordinates</p>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="font-mono">Lat: {pickerCoord[0].toFixed(6)}</Badge>
                        <Badge variant="outline" className="font-mono">Lng: {pickerCoord[1].toFixed(6)}</Badge>
                    </div>
                </div>

                <DialogFooter className="mt-4 gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={onConfirm}>Confirm Location</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
