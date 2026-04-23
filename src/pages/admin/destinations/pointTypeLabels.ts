import type { PointType } from '@/types/point';

export const POINT_TYPE_VI: Record<PointType, string> = {
    PAGODA: 'Chùa',
    CAVE: 'Hang động',
    VIEWPOINT: 'Điểm ngắm cảnh',
    GENERAL: 'Chung',
    STATUE: 'Tượng',
    GATE: 'Cổng',
    SHOP: 'Cửa hàng',
    ELEVATOR: 'Thang máy',
    EVENT: 'Sự kiện',
    WORKSHOP: 'Workshop',
    ATTRACTION: 'Danh thắng',
    DEFAULT: 'Mặc định',
};

export function pointTypeLabel(type: string): string {
    return POINT_TYPE_VI[type as PointType] ?? type;
}
