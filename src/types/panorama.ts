// ─── Response Types (from API) ───

export const PanoramaHotSpotType = {
  INFO: "INFO",
  LINK: "LINK",
} as const;

export type PanoramaHotSpotType =
  (typeof PanoramaHotSpotType)[keyof typeof PanoramaHotSpotType];

export interface PanoramaHotSpotResponse {
  id: string;
  yaw: number;
  pitch: number;
  tooltip: string;
  title: string;
  description: string;
  imageUrl: string | null;
  orderIndex: number;
  type: PanoramaHotSpotType;
  targetPanoramaId: string | null;
}

export interface PointPanoramaResponse {
  id: string;
  title: string;
  panoramaImageUrl: string;
  defaultYaw: number;
  defaultPitch: number;
  isDefault: boolean;
  hotSpots: PanoramaHotSpotResponse[];
}

export interface LinkingPanoramaItemResponse {
  id: string;
  title: string;
  panoramaImageUrl: string;
}

export interface LinkingPanoramaResponse {
  pointName: string;
  pointId: string;
  panoramas: LinkingPanoramaItemResponse[];
}

// ─── Request Types (to API) ───


export type PanoramaHotSpotRequest = {
  yaw: number;
  pitch: number;
  tooltip: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  orderIndex?: number;
  type: PanoramaHotSpotType;
  targetPanoramaId?: string;
}

export interface PanoramaRequest {
  title: string;
  panoramaImageUrl: string;
  defaultYaw?: number;
  defaultPitch?: number;
  isDefault?: boolean;
  hotSpots?: PanoramaHotSpotRequest[];
}
