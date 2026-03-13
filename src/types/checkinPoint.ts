export interface CheckinPointRequest {
  pointId: string;
  name: string;
  description?: string;
  position?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  qrCode?: string;
  longitude?: number;
  latitude?: number;
  rewardPoints?: number;
  panoramaImageUrl?: string;
  defaultYaw?: number;
  defaultPitch?: number;
}

export interface PointCheckinResponse {
  id: string;
  pointId?: string;
  pointName?: string;
  parentPointId?: string;
  parentPointName?: string;
  name: string;
  description?: string;
  position?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  qrCode?: string;
  longitude?: number;
  latitude?: number;
  rewardPoints?: number;
  panoramaImageUrl?: string;
  defaultYaw?: number;
  defaultPitch?: number;
  isUserCheckedIn?: boolean;
  deletedAt?: string | null;
}

export interface PagedCheckinPointResponse {
  content: PointCheckinResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty?: boolean;
}

export interface ParentPointOption {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
}
