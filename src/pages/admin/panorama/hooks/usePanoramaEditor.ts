import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { adminPanoramaService } from "@/services/api/panoramaService";
import type { PointPanoramaResponse, PanoramaRequest } from "@/types";
import { message } from "antd";
import axios from "axios";

export function usePanoramaEditor() {
  const { pointId, checkinPointId } = useParams<{
    pointId: string;
    checkinPointId?: string;
  }>();

  const isCheckinPoint = !!checkinPointId;
  const targetId = isCheckinPoint ? checkinPointId! : pointId!;

  const [panorama, setPanorama] = useState<PointPanoramaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPanorama = useCallback(async () => {
    setLoading(true);
    try {
      const data = isCheckinPoint
        ? await adminPanoramaService.getCheckinPointPanorama(targetId)
        : await adminPanoramaService.getPointPanorama(targetId);
      setPanorama(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setPanorama(null);
      } else {
        message.error("Failed to load panorama");
        setError("An error occurred while fetching panorama data, please try again");
      }
      setPanorama(null);
    } finally {
      setLoading(false);
    }
  }, [targetId, isCheckinPoint]);

  useEffect(() => {
    fetchPanorama();
  }, [fetchPanorama]);

  const savePanorama = async (data: PanoramaRequest) => {
    setSaving(true);
    try {
      const saved = isCheckinPoint
        ? await adminPanoramaService.createOrUpdateCheckinPointPanorama(
          targetId,
          data
        )
        : await adminPanoramaService.createOrUpdatePointPanorama(
          targetId,
          data
        );
      setPanorama(saved);
      message.success("Panorama saved successfully");
    } catch (error) {
      message.error("Failed to save panorama");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const deletePanorama = async () => {
    try {
      if (isCheckinPoint) {
        await adminPanoramaService.deleteCheckinPointPanorama(targetId);
      } else {
        await adminPanoramaService.deletePointPanorama(targetId);
      }
      setPanorama(null);
      message.success("Panorama deleted successfully");
    } catch {
      message.error("Failed to delete panorama");
    }
  };

  return {
    panorama,
    loading,
    saving,
    isCheckinPoint,
    targetId,
    savePanorama,
    deletePanorama,
    refetch: fetchPanorama,
    error,
  };
}
