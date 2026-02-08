export type AttractionStatus = 'OPEN' | 'CLOSED' | 'CONSTRUCTION' | 'TEMPORARILY_CLOSED';

import { PointResponse } from './point';

export interface AttractionResponse {
    id: string;
    name: string;
    description?: string;
    mapImageUrl?: string;
    address?: string;
    latitude: number;
    longitude: number;
    status: AttractionStatus;
    thumbnailUrl?: string;
    openHour?: string;
    closeHour?: string;
    isActive: boolean;
    points?: PointResponse[];
}

export interface AttractionRequest {
    name: string;
    description?: string;
    mapImageUrl?: string;
    address?: string;
    latitude: number;
    longitude: number;
    status: AttractionStatus;
    thumbnailUrl?: string;
    openHour?: string;
    closeHour?: string;
    isActive: boolean;
}
