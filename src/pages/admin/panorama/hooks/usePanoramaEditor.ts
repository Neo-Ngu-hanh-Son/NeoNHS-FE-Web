import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { adminPanoramaService } from "@/services/api/panoramaService";
import type { PointPanoramaResponse, PanoramaRequest } from "@/types";
import { message } from "antd";

/** Khi `embedPointId` có giá trị (nhúng trong modal POI), bỏ qua `pointId`/`checkinPointId` trên URL. */
export interface UsePanoramaEditorOptions {
  embedPointId?: string;
}

export function usePanoramaEditor(options?: UsePanoramaEditorOptions) {
  const params = useParams<{
    pointId: string;
    checkinPointId?: string;
  }>();

  const pointId = options?.embedPointId ?? params.pointId;
  const checkinPointId = options?.embedPointId ? undefined : params.checkinPointId;

  const isCheckinPoint = Boolean(checkinPointId);
  const targetId = isCheckinPoint ? checkinPointId! : pointId!;

  const [panorama, setPanorama] = useState<PointPanoramaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPanorama = useCallback(async () => {
    if (!targetId) {
      setPanorama(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = isCheckinPoint
        ? await adminPanoramaService.getCheckinPointPanorama(targetId)
        : await adminPanoramaService.getPointPanorama(targetId);
      setPanorama(data);
    } catch (error: Error | any) {
      if (error?.status === 400) {
        setPanorama(null);
      } else {
        console.log("[usePanoramaEditor] Error fetching panorama: ", error);
        message.error("Tải panorama thất bại");
        setError("Đã xảy ra lỗi khi tải dữ liệu panorama. Vui lòng thử lại.");
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
      message.success("Đã lưu panorama");
    } catch (error) {
      message.error("Lưu panorama thất bại");
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
      message.success("Đã xóa panorama");
    } catch {
      message.error("Xóa panorama thất bại");
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
