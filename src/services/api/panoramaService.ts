import { apiClient } from "./apiClient";
import type {
  ApiResponse,
  PointPanoramaResponse,
  PanoramaRequest,
  PanoramaHotSpotRequest,
  PanoramaHotSpotResponse,
  LinkingPanoramaResponse,
} from "@/types";

// ─── Public endpoints (no auth) ───

export const panoramaService = {
  /** Get all panoramas for a Point */
  getPointPanoramas: async (pointId: string): Promise<PointPanoramaResponse[]> => {
    const res = await apiClient.get<ApiResponse<PointPanoramaResponse[]>>(
      `/points/${pointId}/panorama`
    );
    return res.data;
  },

  /**
   * @deprecated Prefer getPointPanoramas.
   * Returns default panorama if present, otherwise first panorama.
   */
  getPointPanorama: async (pointId: string): Promise<PointPanoramaResponse> => {
    const panoramas = await panoramaService.getPointPanoramas(pointId);
    const selected = panoramas.find((item) => item.isDefault) ?? panoramas[0];

    if (!selected) {
      throw new Error("No panorama found for this point");
    }

    return selected;
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
  addPanoramaToPoint: async (
    pointId: string,
    data: PanoramaRequest
  ): Promise<PointPanoramaResponse> => {
    const res = await apiClient.post<ApiResponse<PointPanoramaResponse>>(
      `/admin/points/${pointId}/panoramas`,
      data
    );
    return res.data;
  },

  updatePanorama: async (
    panoramaId: string,
    data: PanoramaRequest
  ): Promise<PointPanoramaResponse> => {
    const res = await apiClient.put<ApiResponse<PointPanoramaResponse>>(
      `/admin/panoramas/${panoramaId}`,
      data
    );
    return res.data;
  },

  getPointPanoramas: async (
    pointId: string
  ): Promise<PointPanoramaResponse[]> => {
    const res = await apiClient.get<ApiResponse<PointPanoramaResponse[]>>(
      `/admin/points/${pointId}/panoramas`
    );
    return res.data;
  },

  getPanoramaById: async (panoramaId: string): Promise<PointPanoramaResponse> => {
    const res = await apiClient.get<ApiResponse<PointPanoramaResponse>>(
      `/admin/panoramas/${panoramaId}`
    );
    return res.data;
  },

  getLinkingPanoramas: async (panoramaId: string): Promise<LinkingPanoramaResponse[]> => {
    const res = await apiClient.get<
      ApiResponse<LinkingPanoramaResponse | LinkingPanoramaResponse[]>
    >(`/admin/panoramas/linking?currentPanoramaId=${panoramaId}`);

    if (Array.isArray(res.data)) {
      return res.data;
    }

    return res.data ? [res.data] : [];
  },

  deletePanorama: async (panoramaId: string): Promise<void> => {
    await apiClient.delete(`/admin/panoramas/${panoramaId}`);
  },

  // --- Individual hot spot CRUD ---

  addHotSpotToPanorama: async (
    panoramaId: string,
    data: PanoramaHotSpotRequest
  ): Promise<PanoramaHotSpotResponse> => {
    const res = await apiClient.post<ApiResponse<PanoramaHotSpotResponse>>(
      `/admin/panoramas/${panoramaId}/hotspots`,
      data
    );
    return res.data;
  },

  getHotSpotsByPanorama: async (
    panoramaId: string
  ): Promise<PanoramaHotSpotResponse[]> => {
    const res = await apiClient.get<ApiResponse<PanoramaHotSpotResponse[]>>(
      `/admin/panoramas/${panoramaId}/hotspots`
    );
    return res.data;
  },

  updateHotSpot: async (
    hotSpotId: string,
    data: PanoramaHotSpotRequest
  ): Promise<PanoramaHotSpotResponse> => {
    const res = await apiClient.put<ApiResponse<PanoramaHotSpotResponse>>(
      `/admin/hotspots/${hotSpotId}`,
      data
    );
    return res.data;
  },

  deleteHotSpot: async (hotSpotId: string): Promise<void> => {
    await apiClient.delete(`/admin/hotspots/${hotSpotId}`);
  },
};

export default panoramaService;
