import { apiClient } from "./apiClient";
import type {
  ApiResponse,
  PointPanoramaResponse,
  PanoramaRequest,
  PanoramaHotSpotRequest,
  PanoramaHotSpotResponse,
} from "@/types";

// ─── Public endpoints (no auth) ───

export const panoramaService = {
  /** Get panorama for a Point */
  getPointPanorama: async (pointId: string): Promise<PointPanoramaResponse> => {
    const res = await apiClient.get<ApiResponse<PointPanoramaResponse>>(
      `points/${pointId}/panorama`
    );
    return res.data;
  },

  /** Get panorama for a CheckinPoint */
  getCheckinPointPanorama: async (
    checkinPointId: string
  ): Promise<PointPanoramaResponse> => {
    const res = await apiClient.get<ApiResponse<PointPanoramaResponse>>(
      `checkin-points/${checkinPointId}/panorama`
    );
    return res.data;
  },
};

// ─── Admin endpoints (requires ADMIN role) ───

export const adminPanoramaService = {
  // --- Point panorama ---

  createOrUpdatePointPanorama: async (
    pointId: string,
    data: PanoramaRequest
  ): Promise<PointPanoramaResponse> => {
    const res = await apiClient.put<ApiResponse<PointPanoramaResponse>>(
      `/admin/panorama/points/${pointId}`,
      data
    );
    return res.data;
  },

  getPointPanorama: async (
    pointId: string
  ): Promise<PointPanoramaResponse> => {
    const res = await apiClient.get<ApiResponse<PointPanoramaResponse>>(
      `/admin/panorama/points/${pointId}`
    );
    return res.data;
  },

  deletePointPanorama: async (pointId: string): Promise<void> => {
    await apiClient.delete(`/admin/panorama/points/${pointId}`);
  },

  // --- CheckinPoint panorama ---

  createOrUpdateCheckinPointPanorama: async (
    checkinPointId: string,
    data: PanoramaRequest
  ): Promise<PointPanoramaResponse> => {
    const res = await apiClient.put<ApiResponse<PointPanoramaResponse>>(
      `/admin/panorama/checkin-points/${checkinPointId}`,
      data
    );
    return res.data;
  },

  getCheckinPointPanorama: async (
    checkinPointId: string
  ): Promise<PointPanoramaResponse> => {
    const res = await apiClient.get<ApiResponse<PointPanoramaResponse>>(
      `/admin/panorama/checkin-points/${checkinPointId}`
    );
    return res.data;
  },

  deleteCheckinPointPanorama: async (
    checkinPointId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/admin/panorama/checkin-points/${checkinPointId}`
    );
  },

  // --- Individual hot spot CRUD ---

  addHotSpotToPoint: async (
    pointId: string,
    data: PanoramaHotSpotRequest
  ): Promise<PanoramaHotSpotResponse> => {
    const res = await apiClient.post<ApiResponse<PanoramaHotSpotResponse>>(
      `/admin/panorama/points/${pointId}/hotspots`,
      data
    );
    return res.data;
  },

  addHotSpotToCheckinPoint: async (
    checkinPointId: string,
    data: PanoramaHotSpotRequest
  ): Promise<PanoramaHotSpotResponse> => {
    const res = await apiClient.post<ApiResponse<PanoramaHotSpotResponse>>(
      `/admin/panorama/checkin-points/${checkinPointId}/hotspots`,
      data
    );
    return res.data;
  },

  getHotSpotsByPoint: async (
    pointId: string
  ): Promise<PanoramaHotSpotResponse[]> => {
    const res = await apiClient.get<ApiResponse<PanoramaHotSpotResponse[]>>(
      `/admin/panorama/points/${pointId}/hotspots`
    );
    return res.data;
  },

  getHotSpotsByCheckinPoint: async (
    checkinPointId: string
  ): Promise<PanoramaHotSpotResponse[]> => {
    const res = await apiClient.get<ApiResponse<PanoramaHotSpotResponse[]>>(
      `/admin/panorama/checkin-points/${checkinPointId}/hotspots`
    );
    return res.data;
  },

  updateHotSpot: async (
    hotSpotId: string,
    data: PanoramaHotSpotRequest
  ): Promise<PanoramaHotSpotResponse> => {
    const res = await apiClient.put<ApiResponse<PanoramaHotSpotResponse>>(
      `/admin/panorama/hotspots/${hotSpotId}`,
      data
    );
    return res.data;
  },

  deleteHotSpot: async (hotSpotId: string): Promise<void> => {
    await apiClient.delete(`/admin/panorama/hotspots/${hotSpotId}`);
  },
};

export default panoramaService;
