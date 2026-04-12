export const PointType = {
    PAGODA: 'PAGODA',
    CAVE: 'CAVE',
    VIEWPOINT: 'VIEWPOINT',
    GENERAL: 'GENERAL',
    CHECKIN: 'CHECKIN',
    STATUE: 'STATUE',
    GATE: 'GATE',
    SHOP: 'SHOP',
    ELEVATOR: 'ELEVATOR',
    EVENT: 'EVENT',
    WORKSHOP: 'WORKSHOP',
    ATTRACTION: 'ATTRACTION',
    DEFAULT: 'DEFAULT'
} as const;

export type PointType = typeof PointType[keyof typeof PointType];

export interface PointRequest {
    name: string;
    description?: string;
    thumbnailUrl?: string;
    latitude: number;
    longitude: number;
    orderIndex: number;
    estTimeSpent?: number;
    attractionId?: string;
    type: PointType;
    googlePlaceId?: string
}

export interface PointResponse {
    id: string;
    name: string;
    description?: string;
    thumbnailUrl?: string;
    latitude: number;
    longitude: number;
    orderIndex: number;
    estTimeSpent?: number;
    attractionId?: string;
    type: PointType;
    googlePlaceId?: string;
    panoramaImageUrl?: string | null;
    defaultYaw?: number | null;
    defaultPitch?: number | null;
    checkinPoints?: unknown[] | null;
    historyAudioCount: number;
    deletedAt?: string | null;
}

export interface PointQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
}

export interface SpringSortInfo {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface SpringPageableInfo {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: SpringSortInfo;
}

export interface PagedPointResponse {
    content: PointResponse[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: SpringPageableInfo;
    size: number;
    sort: SpringSortInfo;
    totalElements: number;
    totalPages: number;
}
