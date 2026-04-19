/**
 * constants.ts
 * Shared constants for the Admin Destinations page.
 */

// Ngũ Hành Sơn District Boundary (Leaflet format: [lat, lng])
export const NGU_HANH_SON_BOUNDARY: [number, number][] = [
    [16.051414, 108.231120],//taybac
    [16.051528, 108.231912],
    [16.051237, 108.235035],
    [16.053485, 108.236943],
    [16.054886, 108.241330],
    [16.056612, 108.247802], // Đông Bắc (ven biển)
    [16.040740, 108.252954],
    [16.028083, 108.258469],
    [15.995611, 108.273984],
    [15.967667, 108.289902],// điểm giao với quảng nam(Đông Nam)
    [15.966436, 108.290600],
    [15.964469, 108.284321],// 
    [15.961509, 108.279240],//
    [15.961946, 108.274237],//
    [15.959238, 108.272862],//
    [15.959382, 108.266650],//
    [15.965837, 108.267236],//song co co
    [15.964420, 108.261113],//
    [15.972443, 108.254542],//
    [15.960705, 108.231817],//
    [15.956424, 108.231915],//
    [15.955226, 108.222717],//
    [15.971658, 108.214433],//
    [15.981612, 108.220846],//
    [15.988871, 108.219446],//new hoa xuan
    [15.993538, 108.226117],//sau hoa xuan 1
    [16.010268, 108.230271],//sau hoa xuan 2
    [16.018713, 108.237557],//sau hoa xuan 3
    [16.012996, 108.246704],//sau hoa xuan 4
    [16.015826, 108.248748],//dao hoa xuan
    [16.018687, 108.245777],//dao hoa xuan 2
    [16.019818, 108.239566],//dao hoa xuan 3
    [16.027978, 108.233463],//
    [16.035445, 108.236099],
    [16.051211, 108.228826],
    [16.051414, 108.231120], // Closed
];

export const MAP_CENTER: [number, number] = [16.0028, 108.2638];

export const POINT_TYPE_CONFIG: Record<string, { color: string, icon: string }> = {
    PAGODA: { color: '#ef4444', icon: 'temple_buddhist' }, // Red
    CAVE: { color: '#8b5cf6', icon: 'landslide' }, // Violet
    VIEWPOINT: { color: '#10b981', icon: 'visibility' }, // Green
    GENERAL: { color: '#6366f1', icon: 'location_on' }, // Indigo
    CHECKIN: { color: '#ec4899', icon: 'photo_camera' }, // Pink
    STATUE: { color: '#f59e0b', icon: 'sculpture' }, // Amber
    GATE: { color: '#64748b', icon: 'door_front' }, // Slate
    SHOP: { color: '#06b6d4', icon: 'shopping_bag' }, // Cyan
    ELEVATOR: { color: '#71717a', icon: 'elevator' }, // Zinc
    EVENT: { color: '#f43f5e', icon: 'event' }, // Rose
    WORKSHOP: { color: '#d946ef', icon: 'auto_fix_high' }, // Fuchsia
    ATTRACTION: { color: '#3b82f6', icon: 'star' }, // Blue
    DEFAULT: { color: '#94a3b8', icon: 'location_on' },
};

// Convert Leaflet boundary to Turf (GeoJSON) format: [lng, lat]
export const NGU_HANH_SON_GEOJSON_POLYGON = [
    NGU_HANH_SON_BOUNDARY.map(([lat, lng]) => [lng, lat])
];

/** Nhãn loại điểm (POI) — dùng chung admin destinations */
export const POINT_TYPE_LABEL_VI: Record<string, string> = {
    PAGODA: 'Chùa',
    CAVE: 'Hang động',
    VIEWPOINT: 'Điểm ngắm cảnh',
    GENERAL: 'Điểm chung',
    CHECKIN: 'Check-in',
    STATUE: 'Tượng',
    GATE: 'Cổng',
    SHOP: 'Cửa hàng',
    ELEVATOR: 'Thang máy',
    EVENT: 'Sự kiện',
    WORKSHOP: 'Workshop',
    ATTRACTION: 'Điểm tham quan',
    DEFAULT: 'Khác',
};

export function getPointTypeLabelVi(type: string): string {
    return POINT_TYPE_LABEL_VI[type] ?? type;
}

/** Trạng thái điểm đến */
export const DESTINATION_STATUS_LABEL_VI: Record<string, string> = {
    OPEN: 'Đang mở',
    CLOSED: 'Đóng cửa',
    TEMPORARILY_CLOSED: 'Tạm đóng',
    MAINTENANCE: 'Bảo trì',
};

export function getDestinationStatusLabelVi(status: string): string {
    return DESTINATION_STATUS_LABEL_VI[status] ?? status;
}
