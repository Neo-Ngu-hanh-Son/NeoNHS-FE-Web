import { useEffect, useRef, useState } from 'react';
import * as turf from '@turf/turf';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { message } from 'antd';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DragImageUploader from '@/components/common/DragImageUploader';
import { uploadImageToBackend, uploadImageUrlToBackend } from '@/utils/cloudinary';
import { NGU_HANH_SON_BOUNDARY, MAP_CENTER, NGU_HANH_SON_GEOJSON_POLYGON } from '@/pages/admin/destinations/constants';
import type { DiscoveryResult } from '@/pages/admin/destinations/components/GoogleMapPickerModal';
import GoogleMapPickerCompact from '@/pages/admin/destinations/components/GoogleMapPickerCompact';
import { FormData } from '../../type';
import EventPointPicker from './EventPointPicker';
import { useEventTimelines } from '@/hooks/event/useEventTimelines';
import { EventPointResponse } from '@/types/eventTimeline';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (apiKey) {
  setOptions({
    key: apiKey,
    v: 'weekly',
  });
}

function isPointInBoundary(lat: number, lng: number): boolean {
  const point = turf.point([lng, lat]);
  const polygon = turf.polygon(NGU_HANH_SON_GEOJSON_POLYGON);
  return turf.booleanPointInPolygon(point, polygon);
}

type Props = {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  handleChange: (field: keyof FormData, value: string) => void;
  eventId: string;
};

export default function EventTimeLinePointCreationTab({ form, errors, handleChange, eventId }: Props) {
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const { fetchEventPoints } = useEventTimelines(eventId, false);
  const [existingPoints, setExistingPoints] = useState<EventPointResponse[]>([]);

  useEffect(() => {
    Promise.all([importLibrary('maps'), importLibrary('places'), importLibrary('marker')])
      .then(() => {
        initMap();
        setApiLoading(false);
      })
      .catch((err) => {
        setApiError(`Không thể tải Google Maps: ${err.message}`);
        setApiLoading(false);
      });

    return () => {
      googleMap.current = null;
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const hasInitialCoord = !!(form.destinationLatitude && form.destinationLongitude);
    const parsedLat = Number.parseFloat(form.destinationLatitude);
    const parsedLng = Number.parseFloat(form.destinationLongitude);
    const useInitialCoord = hasInitialCoord && Number.isFinite(parsedLat) && Number.isFinite(parsedLng);
    const center = useInitialCoord ? { lat: parsedLat, lng: parsedLng } : { lat: MAP_CENTER[0], lng: MAP_CENTER[1] };

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: useInitialCoord ? 19 : 15,
      mapId: '98d54d19d6797a1',
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
      mapTypeId: 'hybrid',
    });

    googleMap.current = map;
    geocoder.current = new google.maps.Geocoder();
    placesService.current = new google.maps.places.PlacesService(map);

    const boundaryCoords = NGU_HANH_SON_BOUNDARY.map((c) => ({ lat: c[0], lng: c[1] }));
    boundaryPolygon.current = new google.maps.Polygon({
      paths: boundaryCoords,
      strokeColor: '#6366f1',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#6366f1',
      fillOpacity: 0.1,
      map,
      clickable: false,
    });

    if (useInitialCoord) {
      updateMarker(parsedLat, parsedLng);
    } else {
      const bounds = new google.maps.LatLngBounds();
      boundaryCoords.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds);
    }

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        handleLocationSelection(e.latLng.lat(), e.latLng.lng(), (e as { placeId?: string }).placeId);
      }
    });
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

    googleMap.current.setZoom(19);
    googleMap.current.panTo({ lat, lng });
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
          name: 'Vị trí đã thả',
          address: result.formatted_address,
          placeId: result.place_id,
        });
      } else {
        setSelectedPoint({
          lat,
          lng,
          name: 'Vị trí không xác định',
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      }
    });
  };

  const fetchPlaceDetails = (placeId: string, lat: number, lng: number) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId,
        fields: ['name', 'formatted_address', 'geometry', 'photos', 'types'],
      },
      (place, status) => {
        setGeocoding(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setSelectedPoint({
            lat: place.geometry?.location?.lat() || lat,
            lng: place.geometry?.location?.lng() || lng,
            name: place.name,
            address: place.formatted_address,
            placeId,
            photoUrl: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
            types: place.types,
          });
        } else {
          reverseGeocode(lat, lng);
        }
      },
    );
  };

  const handleLocationSelection = (lat: number, lng: number, placeId?: string) => {
    if (!isPointInBoundary(lat, lng)) {
      setError('Địa điểm này nằm ngoài Ngũ Hành Sơn');
      return;
    }

    handleChange('eventPointId', '');
    setError(null);
    setGeocoding(true);
    updateMarker(lat, lng);

    if (placeId) {
      fetchPlaceDetails(placeId, lat, lng);
    } else {
      reverseGeocode(lat, lng);
    }
  };

  const handlePlaceSearchSelect = (place: DiscoveryResult) => {
    if (isPointInBoundary(place.latitude, place.longitude)) {
      handleChange('eventPointId', '');
      setError(null);
      setSelectedPoint({
        lat: place.latitude,
        lng: place.longitude,
        name: place.name,
        address: place.address,
        placeId: place.googlePlaceId,
        photoUrl: place.photoUrl,
      });
      updateMarker(place.latitude, place.longitude);
      googleMap.current?.setZoom(19);
    } else {
      setError('Vị trí đã tìm thấy nằm ngoài ranh giới Ngũ Hành Sơn.');
    }
  };

  const applyPointToForm = (point: {
    id: string | null;
    lat: number;
    lng: number;
    name?: string;
    address?: string;
    photoUrl?: string;
  }) => {
    handleChange('destinationName', point.name || 'Điểm đến đã chọn');
    handleChange('destinationAddress', point.address || '');
    handleChange('destinationLatitude', point.lat.toFixed(6));
    handleChange('destinationLongitude', point.lng.toFixed(6));
    handleChange('destinationImageUrl', point.photoUrl || '');
    handleChange('eventPointId', point.id || '');
  };

  const handleConfirmSelection = async () => {
    if (!selectedPoint) return;

    let finalPhotoUrl = selectedPoint.photoUrl;
    if (selectedPoint.photoUrl && !selectedPoint.photoUrl.includes('cloudinary.com')) {
      setProcessingImage(true);
      try {
        const backendUrl = await uploadImageUrlToBackend(selectedPoint.photoUrl);
        if (backendUrl) {
          finalPhotoUrl = backendUrl.mediaUrl;
        }
      } catch {
        message.warning('Không thể tối ưu URL ảnh Google đã chọn.');
      } finally {
        setProcessingImage(false);
      }
    }

    applyPointToForm({ ...selectedPoint, photoUrl: finalPhotoUrl, id: null });
  };

  useEffect(() => {
    async function fetchPreviouslyUsedPoints() {
      try {
        const result = await fetchEventPoints();
        setExistingPoints(result);
      } catch (error: unknown) {
        message.error(`Không thể tải các điểm sự kiện đã có: ${(error as Error).message}`);
      }
    }
    fetchPreviouslyUsedPoints();
  }, [eventId]);

  const handleSelectExistingPoint = (pointId: string) => {
    const point = existingPoints.find((p) => p.id === pointId);
    if (point) {
      const { latitude, longitude, name, address, imageUrl } = point;
      const lat = Number.parseFloat(latitude.toString());
      const lng = Number.parseFloat(longitude.toString());
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setSelectedPoint({ lat, lng, name, address, photoUrl: imageUrl });
        updateMarker(lat, lng);
        googleMap.current?.setZoom(19);
        applyPointToForm({ id: point.id, lat, lng, name, address, photoUrl: imageUrl });
      } else {
        message.error('Điểm sự kiện đã chọn có tọa độ không hợp lệ.');
      }
    }
  };

  return (
    <div className="mt-2 grid grid-cols-1 xl:grid-cols-2 gap-3">
      <section className="space-y-3 xl:pr-3">
        <div className="border-b pb-2">
          <h3 className="text-sm font-semibold">Chi tiết điểm đến</h3>
        </div>

        <div className="space-y-1">
          <Label htmlFor="point-destination-name">Tên điểm đến</Label>
          <Input
            id="point-destination-name"
            value={form.destinationName}
            onChange={(e) => {
              handleChange('destinationName', e.target.value);
              handleChange('eventPointId', '');
            }}
            placeholder="VD: Chùa Quán Thế Âm"
          />
          {errors.destinationName && <p className="text-xs text-destructive">{errors.destinationName}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="point-destination-address">Địa chỉ</Label>
          <Input
            id="point-destination-address"
            value={form.destinationAddress}
            onChange={(e) => {
              handleChange('destinationAddress', e.target.value);
              handleChange('eventPointId', '');
            }}
            placeholder="VD: Ngũ Hành Sơn, Đà Nẵng"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="point-latitude">Vĩ độ</Label>
            <Input
              id="point-latitude"
              value={form.destinationLatitude}
              onChange={(e) => {
                handleChange('destinationLatitude', e.target.value);
                handleChange('eventPointId', '');
              }}
              placeholder="15.998600"
            />
            {errors.destinationLatitude && <p className="text-xs text-destructive">{errors.destinationLatitude}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="point-longitude">Kinh độ</Label>
            <Input
              id="point-longitude"
              value={form.destinationLongitude}
              onChange={(e) => {
                handleChange('destinationLongitude', e.target.value);
                handleChange('eventPointId', '');
              }}
              placeholder="108.261800"
            />
            {errors.destinationLongitude && <p className="text-xs text-destructive">{errors.destinationLongitude}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <Label>Ảnh điểm đến</Label>
          <DragImageUploader
            value={form.destinationImageUrl}
            onUpload={(url) => {
              handleChange('destinationImageUrl', url);
              handleChange('eventPointId', '');
            }}
            onError={(msg) => message.error(msg)}
            minHeight={110}
            imageClassName="!w-auto max-w-[220px] mx-auto"
            placeholder="Tải ảnh điểm đến"
          />
        </div>

        <div className="space-y-1">
          <Label>Sử dụng điểm đến hiện có</Label>
          <EventPointPicker
            points={existingPoints}
            selectedPointId={form.eventPointId || undefined}
            onPointSelect={handleSelectExistingPoint}
          />
        </div>
      </section>

      <section className="space-y-2 xl:border-l xl:pl-3">
        <div className="border-b pb-2">
          <h3 className="text-sm font-semibold">Chọn Điểm Đến trên Bản đồ</h3>
        </div>
        <div className="h-[280px] sm:h-[330px] lg:h-[380px] xl:h-[420px] overflow-hidden rounded-md border">
          <GoogleMapPickerCompact
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
            onClose={() => setSelectedPoint(null)}
          />
        </div>
      </section>
    </div>
  );
}
