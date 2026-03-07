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
    history?: string;
    historyAudioUrl?: string;
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
    history?: string;
    historyAudioUrl?: string;
    latitude: number;
    longitude: number;
    orderIndex: number;
    estTimeSpent?: number;
    attractionId?: string;
    type: PointType;
    googlePlaceId?: string
}
