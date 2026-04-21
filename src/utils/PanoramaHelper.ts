import { PointPanoramaResponse } from "@/types";

/**
 * Get the default panorama, default to the first panorama if no panorama is marked as default.
 */
const getDefaultPanorama = (panoramas: PointPanoramaResponse[]): PointPanoramaResponse | null => {
  if (panoramas.length === 0) return null;
  const defaultPano = panoramas.find((p) => p.isDefault);
  return defaultPano ?? panoramas[0];
}

export const PanoramaHelper = {
  getDefaultPanorama,
}