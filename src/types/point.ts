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
}
