import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { adminPanoramaService } from "@/services/api/panoramaService";
import type { PointPanoramaResponse, PanoramaRequest } from "@/types";
import { message } from "antd";

/** Khi `embedPointId` có giá trị (nhúng trong modal POI), bỏ qua `pointId`/`checkinPointId` trên URL. */
export interface UsePanoramaEditorOptions {
  embedPointId?: string;
  panoramaId?: string;
}

export function usePanoramaEditor(options?: UsePanoramaEditorOptions) {
  const params = useParams<{ pointId: string }>();
  const pointId = options?.embedPointId ?? params.pointId ?? "";

  const [panoramas, setPanoramas] = useState<PointPanoramaResponse[]>([]);
  const [selectedPanoramaId, setSelectedPanoramaId] = useState<string | null>(
    options?.panoramaId ?? null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPanorama = panoramas.find((p) => p.id === selectedPanoramaId) ?? null;

  const fetchPanoramas = useCallback(async () => {
    if (!pointId) {
      setPanoramas([]);
      setSelectedPanoramaId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await adminPanoramaService.getPointPanoramas(pointId);
      setPanoramas(data);
      if (!selectedPanoramaId || !data.some((p) => p.id === selectedPanoramaId)) {
        const defaultId = data.find((p) => p.isDefault)?.id ?? data[0]?.id ?? null;
        setSelectedPanoramaId(defaultId);
      }
      setError(null);
    } catch (error: Error | any) {
      if (error?.status === 400) {
        setPanoramas([]);
      } else {
        console.log("[usePanoramaEditor] Error fetching panorama: ", error);
        message.error("Tải panorama thất bại");
        setError("Đã xảy ra lỗi khi tải dữ liệu panorama. Vui lòng thử lại.");
      }
      setPanoramas([]);
    } finally {
      setLoading(false);
    }
  }, [pointId, selectedPanoramaId]);

  useEffect(() => {
    fetchPanoramas();
  }, [fetchPanoramas]);

  const savePanorama = async (data: PanoramaRequest) => {
    if (!pointId) {
      message.error("Không xác định được điểm để lưu panorama");
      return;
    }

    setSaving(true);
    try {
      const saved = selectedPanorama
        ? await adminPanoramaService.updatePanorama(selectedPanorama.id, data)
        : await adminPanoramaService.addPanoramaToPoint(pointId, data);

      setPanoramas((prev) => {
        const others = prev.filter((p) => p.id !== saved.id);
        return [...others, saved];
      });
      setSelectedPanoramaId(saved.id);
      message.success("Đã lưu panorama");
    } catch (error) {
      message.error("Lưu panorama thất bại");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const deletePanorama = async () => {
    if (!selectedPanorama) {
      message.warning("Chưa có panorama để xóa");
      return;
    }

    try {
      await adminPanoramaService.deletePanorama(selectedPanorama.id);
      const remained = panoramas.filter((p) => p.id !== selectedPanorama.id);
      setPanoramas(remained);
      setSelectedPanoramaId(remained.find((p) => p.isDefault)?.id ?? remained[0]?.id ?? null);
      message.success("Đã xóa panorama");
    } catch {
      message.error("Xóa panorama thất bại");
    }
  };

  return {
    pointId,
    panoramas,
    selectedPanoramaId,
    setSelectedPanoramaId,
    loading,
    saving,
    savePanorama,
    deletePanorama,
    refetch: fetchPanoramas,
    error,
    selectedPanorama,
  };
}
