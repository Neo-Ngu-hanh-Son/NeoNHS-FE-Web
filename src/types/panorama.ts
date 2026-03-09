// ─── Response Types (from API) ───

export interface PanoramaHotSpotResponse {
  id: string;
  yaw: number;
  pitch: number;
  tooltip: string;
  title: string;
  description: string;
  imageUrl: string | null;
  orderIndex: number;
}

export interface PointPanoramaResponse {
  id: string;
  name: string | null;
  address: string | null;
  description: string | null;
  panoramaImageUrl: string | null;
  thumbnailUrl: string | null;
  defaultYaw: number;
  defaultPitch: number;
  hotSpots: PanoramaHotSpotResponse[];
}

// ─── Request Types (to API) ───

export interface PanoramaHotSpotRequest {
  yaw: number;
  pitch: number;
  tooltip: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  orderIndex?: number;
}

export interface PanoramaRequest {
  panoramaImageUrl: string;
  defaultYaw?: number;
  defaultPitch?: number;
  hotSpots?: PanoramaHotSpotRequest[];
}
