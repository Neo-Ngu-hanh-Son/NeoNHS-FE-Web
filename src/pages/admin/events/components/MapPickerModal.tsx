import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const createPinIcon = (color: string) =>
  L.divIcon({
    className: "custom-map-pin",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 2px rgba(15,23,42,0.25);"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const ParentMarkerIcon = createPinIcon("#dc2626");
const ChildMarkerIcon = createPinIcon("#2563eb");

const DEFAULT_CENTER: [number, number] = [16.0028, 108.2638]; // Ngũ Hành Sơn

interface MapPickerModalOptions {
  helperText?: string;
  showParentMarker?: boolean;
  showChildMarker?: boolean;
  useBlueChildMarker?: boolean;
  childMarkerVisibility?: "always" | "after-select";
  parentMarkerLabel?: string;
  defaultZoom?: number;
  zoomWhenParentPosition?: number;
  zoomWhenInitialPosition?: number;
  maxZoom?: number;
}

interface MapPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPosition?: { lat: number; lng: number } | null;
  parentPosition?: { lat: number; lng: number } | null;
  options?: MapPickerModalOptions;
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

export function MapPickerModal({
  open,
  onOpenChange,
  initialPosition,
  parentPosition,
  options,
  onConfirm,
}: MapPickerModalProps) {
  const {
    helperText = "Click anywhere on the map to pick coordinates for the event location.",
    showParentMarker = false,
    showChildMarker = true,
    useBlueChildMarker = false,
    childMarkerVisibility = "always",
    parentMarkerLabel,
    defaultZoom = 15,
    zoomWhenParentPosition = 18,
    zoomWhenInitialPosition = 19,
    maxZoom = 22,
  } = options || {};

  const initialCenter: [number, number] = initialPosition
    ? [initialPosition.lat, initialPosition.lng]
    : parentPosition
      ? [parentPosition.lat, parentPosition.lng]
      : DEFAULT_CENTER;

  const [position, setPosition] = useState<[number, number]>(initialCenter);
  const [hasUserSelectedPosition, setHasUserSelectedPosition] = useState(Boolean(initialPosition));

  useEffect(() => {
    if (open && initialPosition) {
      setPosition([initialPosition.lat, initialPosition.lng]);
      setHasUserSelectedPosition(true);
    } else if (open && parentPosition) {
      setPosition([parentPosition.lat, parentPosition.lng]);
      setHasUserSelectedPosition(false);
    } else if (open) {
      setPosition(DEFAULT_CENTER);
      setHasUserSelectedPosition(false);
    }
  }, [open, initialPosition, parentPosition]);

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setHasUserSelectedPosition(true);
  };

  const handleConfirm = () => {
    onConfirm(Number(position[0].toFixed(6)), Number(position[1].toFixed(6)));
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
          <p className="text-sm text-muted-foreground">{helperText}</p>

          <div
            style={{ height: "450px", width: "100%" }}
            className="rounded-lg overflow-hidden border"
          >
            {open && (
              <MapContainer
                center={position}
                zoom={
                  initialPosition
                    ? zoomWhenInitialPosition
                    : parentPosition
                      ? zoomWhenParentPosition
                      : defaultZoom
                }
                maxZoom={maxZoom}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {showParentMarker && parentPosition && (
                  <Marker
                    position={[parentPosition.lat, parentPosition.lng]}
                    icon={ParentMarkerIcon}
                  >
                    {parentMarkerLabel && (
                      <Tooltip permanent direction="top" offset={[0, -10]}>
                        {parentMarkerLabel}
                      </Tooltip>
                    )}
                  </Marker>
                )}
                {showChildMarker &&
                  (childMarkerVisibility === "always" || hasUserSelectedPosition) && (
                    <Marker
                      position={position}
                      {...(useBlueChildMarker ? { icon: ChildMarkerIcon } : {})}
                    />
                  )}
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
