import type { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Map as MapIcon, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';

interface PlaceSearchResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
  photoUrl?: string;
}

export interface GoogleMapSelectedPoint {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
  placeId?: string;
  photoUrl?: string;
  types?: string[];
}

/** Nhãn tiếng Việt cho `types[0]` từ Google Places API */
const GOOGLE_PLACE_TYPE_VI: Record<string, string> = {
  tourist_attraction: 'Danh lam thắng cảnh',
  point_of_interest: 'Điểm quan tâm',
  establishment: 'Địa điểm',
  park: 'Công viên',
  natural_feature: 'Thiên nhiên',
  museum: 'Bảo tàng',
  art_gallery: 'Phòng trưng bày nghệ thuật',
  church: 'Nhà thờ',
  hindu_temple: 'Đền Hindu',
  mosque: 'Nhà thờ Hồi giáo',
  synagogue: 'Giáo đường Do Thái',
  buddhist_temple: 'Chùa',
  place_of_worship: 'Nơi thờ tự',
  restaurant: 'Nhà hàng',
  cafe: 'Quán cà phê',
  bar: 'Quán bar',
  bakery: 'Tiệm bánh',
  meal_takeaway: 'Mang đi',
  meal_delivery: 'Giao món',
  lodging: 'Lưu trú',
  hotel: 'Khách sạn',
  store: 'Cửa hàng',
  shopping_mall: 'Trung tâm thương mại',
  supermarket: 'Siêu thị',
  school: 'Trường học',
  university: 'Đại học',
  hospital: 'Bệnh viện',
  pharmacy: 'Nhà thuốc',
  gym: 'Phòng gym',
  spa: 'Spa',
  beauty_salon: 'Tiệm làm đẹp',
  zoo: 'Sở thú',
  amusement_park: 'Công viên giải trí',
  aquarium: 'Thủy cung',
  stadium: 'Sân vận động',
  movie_theater: 'Rạp chiếu phim',
  library: 'Thư viện',
  cemetery: 'Nghĩa trang',
  campground: 'Khu cắm trại',
  rv_park: 'Bãi xe RV',
  night_club: 'Vũ trường',
  casino: 'Sòng bạc',
  airport: 'Sân bay',
  train_station: 'Ga tàu',
  bus_station: 'Bến xe buýt',
  subway_station: 'Ga metro',
  transit_station: 'Trạm giao thông',
  locality: 'Địa phương',
  political: 'Hành chính',
  premise: 'Trụ sở',
  subpremise: 'Phần trong tòa nhà',
  street_address: 'Địa chỉ đường',
  route: 'Tuyến đường',
  intersection: 'Giao lộ',
  neighborhood: 'Khu phố',
  administrative_area_level_1: 'Tỉnh / thành',
  administrative_area_level_2: 'Quận / huyện',
  administrative_area_level_3: 'Phường / xã',
  country: 'Quốc gia',
  postal_code: 'Mã bưu chính',
  geocode: 'Mã địa lý',
  finance: 'Tài chính',
  bank: 'Ngân hàng',
  atm: 'ATM',
  gas_station: 'Trạm xăng',
  parking: 'Bãi đỗ xe',
  car_rental: 'Thuê xe',
  car_dealer: 'Đại lý xe',
  car_repair: 'Sửa xe',
  laundry: 'Giặt là',
  florist: 'Tiệm hoa',
  lawyer: 'Văn phòng luật',
  real_estate_agency: 'Bất động sản',
  insurance_agency: 'Bảo hiểm',
  travel_agency: 'Du lịch',
  food: 'Ẩm thực',
  health: 'Sức khỏe',
  doctor: 'Phòng khám',
  dentist: 'Nha khoa',
  veterinary_care: 'Thú y',
  physiotherapist: 'Vật lý trị liệu',
  electrician: 'Điện',
  plumber: 'Ống nước',
  roofing_contractor: 'Mái nhà',
  general_contractor: 'Xây dựng',
  moving_company: 'Chuyển nhà',
  storage: 'Kho bãi',
  post_office: 'Bưu điện',
  city_hall: 'Ủy ban',
  courthouse: 'Tòa án',
  embassy: 'Đại sứ quán',
  fire_station: 'Cứu hỏa',
  police: 'Công an',
  local_government_office: 'Cơ quan nhà nước',
};

function formatGooglePlaceTypeVi(type: string): string {
  const key = type.trim().toLowerCase();
  return GOOGLE_PLACE_TYPE_VI[key] ?? 'Địa điểm';
}

interface GoogleMapPickerProps {
  apiLoading: boolean;
  apiError: string | null;
  mapRef: RefObject<HTMLDivElement | null>;
  onPlaceSelect: (place: PlaceSearchResult) => void;
  error: string | null;
  selectedPoint: GoogleMapSelectedPoint | null;
  geocoding: boolean;
  processingImage: boolean;
  onConfirmSelection: () => void;
  onDiscardSelection: () => void;
  onClose: () => void;
}

export function GoogleMapPicker({
  apiLoading,
  apiError,
  mapRef,
  onPlaceSelect,
  error,
  selectedPoint,
  geocoding,
  processingImage,
  onConfirmSelection,
  onDiscardSelection,
  onClose,
}: GoogleMapPickerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-1 bg-slate-100">
        {apiLoading && (
          <div className="absolute inset-0 z-[50] bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-slate-600">Khởi động Google Engine...</p>
          </div>
        )}

        {apiError && (
          <div className="absolute inset-0 z-[50] bg-white flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Google Maps Không tải được</h3>
            <p className="text-sm text-slate-500 mb-6">{apiError}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        {/* Overlay: Search Bar */}
        <div className="absolute top-4 left-4 z-[10] w-[400px]">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)]">
            <GooglePlacesAutocomplete onPlaceSelect={onPlaceSelect} className="w-full border-none shadow-none" />
          </div>
        </div>

        {/* Overlay: Legend */}
        <div className="absolute top-4 right-4 z-[10] flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/50 shadow-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500/20 border-2 border-indigo-500"></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Ranh giới Ngũ Hành Sơn</span>
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
                        <span className="text-[8px] font-bold uppercase">Không có ảnh</span>
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
                    <h4 className="text-lg font-black text-slate-800 truncate leading-none">{selectedPoint.name}</h4>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1 font-medium">{selectedPoint.address}</p>
                  {selectedPoint.placeId && (
                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-[9px] h-4.5 px-1.5 rounded-full border-none mb-2">
                      Điểm đánh dấu trên Google Maps
                    </Badge>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-2.5 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
                      <MapIcon className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-mono font-bold text-slate-600">
                        {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                      </span>
                    </div>
                    {selectedPoint.types && selectedPoint.types.length > 0 && (
                      <div className="flex items-center gap-1.5 rounded-lg border border-indigo-100/50 bg-indigo-50 px-2.5 py-1 dark:border-indigo-900/40 dark:bg-indigo-950/40">
                        <span className="text-[10px] font-semibold capitalize leading-tight text-indigo-700 dark:text-indigo-300">
                          {formatGooglePlaceTypeVi(selectedPoint.types[0])}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={onConfirmSelection}
                    disabled={geocoding || processingImage}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70"
                  >
                    {processingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Sử dụng địa điểm này
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onDiscardSelection}
                    className="text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-100 h-10 rounded-xl"
                  >
                    Bỏ chọn
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hệ thống sẵn sàng</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium italic border-l pl-4 border-slate-100">
            Định danh POI đang hoạt động để lưu trữ
          </p>
        </div>
        <Button variant="outline" onClick={onClose} className="rounded-xl font-bold border-slate-200 text-slate-600">
          Đóng
        </Button>
      </div>
    </div>
  );
}
