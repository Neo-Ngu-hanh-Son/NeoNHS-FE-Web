import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

// Fix for default marker icon issue in Leaflet with focus on generic icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
    value?: { lat: number; lng: number };
    onChange?: (value: { lat: number; lng: number }) => void;
}

function LocationMarker({ value, onChange }: MapPickerProps) {
    useMapEvents({
        click(e) {
            onChange?.(e.latlng);
        },
    });

    return value ? <Marker position={[value.lat, value.lng]} /> : null;
}

export function MapPicker({ value, onChange }: MapPickerProps) {
    const [showMap, setShowMap] = useState(false);

    // Default center (Da Nang, Vietnam as a reasonable default for NeoNHS)
    const defaultCenter: [number, number] = [16.0544, 108.2022];
    const center: [number, number] = value ? [value.lat, value.lng] : defaultCenter;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Button
                    icon={<EnvironmentOutlined />}
                    onClick={() => setShowMap(!showMap)}
                    className="rounded-xl border-gray-300 hover:border-green-400"
                >
                    {showMap ? 'Hide Map' : 'Select Location on Map'}
                </Button>
                {value && (
                    <div className="text-sm text-gray-500">
                        Coordinates: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                    </div>
                )}
            </div>

            {showMap && (
                <div className="h-[400px] w-full rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-inner relative z-10">
                    <MapContainer
                        center={center}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker value={value} onChange={onChange} />
                    </MapContainer>
                </div>
            )}
        </div>
    );
}
