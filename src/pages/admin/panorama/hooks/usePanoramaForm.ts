import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import type { UsePanoramaEditorOptions } from "./usePanoramaEditor";
import type { HotSpotFormValues } from "../schema";
import type { PanoramaHotSpotRequest, PanoramaRequest, PointPanoramaResponse } from "@/types";
import { adminPanoramaService } from "@/services/api/panoramaService";

/**
 * Manage panorama for ONE panorama only.
 */
export function usePanoramaForm(editorOptions?: UsePanoramaEditorOptions) {
  const params = useParams<{ pointId: string }>();
  const targetPointId = editorOptions?.embedPointId ?? params.pointId ?? "";
  const normalizeTitle = (value: unknown): string => (typeof value === "string" ? value : "");

  const [panoramas, setPanoramas] = useState<PointPanoramaResponse[]>([]);
  const [selectedPanoramaId, setSelectedPanoramaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Local form state ───
  const [panoramaTitle, setPanoramaTitle] = useState("");
  const [panoramaImageUrl, setPanoramaImageUrl] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [defaultYaw, setDefaultYaw] = useState(0);
  const [defaultPitch, setDefaultPitch] = useState(0);
  const [hotSpots, setHotSpots] = useState<HotSpotFormValues[]>([]);
  const [imageError, setImageError] = useState("");
  const [viewSelectionMode, setViewSelectionMode] = useState(false);
  const [hasCustomView, setHasCustomView] = useState(false);

  const selectedPanorama = useMemo(
    () => panoramas.find((p) => p.id === selectedPanoramaId) ?? null,
    [panoramas, selectedPanoramaId]
  );

  const resetLocalForm = useCallback(() => {
    setPanoramaTitle("");
    setPanoramaImageUrl("");
    setIsDefault(false);
    setDefaultYaw(0);
    setDefaultPitch(0);
    setHotSpots([]);
    setImageError("");
    setViewSelectionMode(false);
    setHasCustomView(false);
    setClickedPosition(null);
  }, []);

  const fetchPanoramas = useCallback(async () => {
    if (!targetPointId) {
      setPanoramas([]);
      setSelectedPanoramaId(null);
      setError("Không xác định được điểm cần chỉnh sửa panorama");
      setIsLoading(false);
      return [] as PointPanoramaResponse[];
    }

    setIsLoading(true);
    try {
      const data = await adminPanoramaService.getPointPanoramas(targetPointId);
      const normalized = data.map((panorama) => ({
        ...panorama,
        title: normalizeTitle(panorama.title),
      }));
      setPanoramas(normalized);
      setError(null);
      return normalized;
    } catch (fetchError) {
      console.log("[usePanoramaForm] Error fetching panoramas:", fetchError);
      setError("Đã xảy ra lỗi khi tải dữ liệu panorama. Vui lòng thử lại.");
      setPanoramas([]);
      message.error("Tải panorama thất bại, vui lòng thử lại sau");
      return [] as PointPanoramaResponse[];
    } finally {
      setIsLoading(false);
    }
  }, [targetPointId]);

  // Fetch panoramas of the current point on load
  useEffect(() => {
    (async () => {
      const data = await fetchPanoramas();
      const initialId = editorOptions?.panoramaId
        && data.some((panorama) => panorama.id === editorOptions.panoramaId)
        ? editorOptions.panoramaId
        : (data.find((panorama) => panorama.isDefault)?.id ?? data[0]?.id ?? null);

      setSelectedPanoramaId(initialId);
    })();
  }, [editorOptions?.panoramaId, fetchPanoramas]);

  // ─── Hydrate form when panorama data arrives ───
  useEffect(() => {
    if (selectedPanorama) {
      setPanoramaTitle(normalizeTitle(selectedPanorama.title));
      setPanoramaImageUrl(selectedPanorama.panoramaImageUrl);
      setIsDefault(Boolean(selectedPanorama.isDefault));
      setDefaultYaw(selectedPanorama.defaultYaw);
      setDefaultPitch(selectedPanorama.defaultPitch);
      if (selectedPanorama.hotSpots && selectedPanorama.hotSpots.length > 0) {
        setHotSpots(
          selectedPanorama.hotSpots.map((hs) => ({
            yaw: hs.yaw,
            pitch: hs.pitch,
            tooltip: hs.tooltip,
            title: hs.title,
            description: hs.description,
            imageUrl: hs.imageUrl ?? "",
            orderIndex: hs.orderIndex,
            type: hs.type,
            targetPanoramaId: hs.targetPanoramaId ?? "",
          })),
        );
      } else {
        setHotSpots([]);
      }
      setHasCustomView(
        selectedPanorama.defaultYaw !== 0 || selectedPanorama.defaultPitch !== 0,
      );
      setClickedPosition(null);
      setImageError("");
      return;
    }

    resetLocalForm();
  }, [selectedPanorama, resetLocalForm]);

  const changeEditingPanorama = (panoramaId: string) => {
    setSelectedPanoramaId(panoramaId);
  };

  const startCreatePanorama = () => {
    setSelectedPanoramaId(null);
    resetLocalForm();
    setPanoramaTitle(`Panorama ${panoramas.length + 1}`);
    setIsDefault(panoramas.length === 0);
  };

  // ─── Save ───
  const handleSavePanoramaAndHotSpots = async () => {
    if (!targetPointId) {
      message.error("Không xác định được điểm để lưu panorama");
      return;
    }

    const normalizedTitle = normalizeTitle(panoramaTitle).trim();

    if (!normalizedTitle) {
      message.error("Vui lòng nhập tiêu đề panorama");
      return;
    }

    if (!panoramaImageUrl.trim()) {
      setImageError("Vui lòng tải lên ảnh panorama để xem trước.");
      return;
    }
    try {
      new URL(panoramaImageUrl);
      setImageError("");
    } catch {
      setImageError("Phải là URL hợp lệ");
      return;
    }

    const payload: PanoramaRequest = {
      title: normalizedTitle,
      panoramaImageUrl,
      defaultYaw,
      defaultPitch,
      isDefault,
      hotSpots: hotSpots.map((hs, i) => {
        const base = {
          yaw: hs.yaw,
          pitch: hs.pitch,
          tooltip: hs.tooltip,
          title: hs.title,
          description: hs.description,
          imageUrl: hs.imageUrl || undefined,
          orderIndex: hs.orderIndex ?? i,
        };

        if (hs.type === "LINK") {
          return {
            ...base,
            type: "LINK" as const,
            targetPanoramaId: hs.targetPanoramaId,
          };
        }

        return {
          ...base,
          type: "INFO" as const,
        };
      }) as PanoramaHotSpotRequest[],
    };

    setIsSaving(true);
    try {
      let saved: PointPanoramaResponse;

      if (selectedPanorama) {
        saved = await adminPanoramaService.updatePanorama(selectedPanorama.id, payload);
        message.success("Cập nhật panorama thành công");
      } else {
        saved = await adminPanoramaService.addPanoramaToPoint(targetPointId, payload);
        message.success("Tạo panorama thành công");
      }

      const refreshed = await fetchPanoramas();
      const exists = refreshed.some((panorama) => panorama.id === saved.id);
      setSelectedPanoramaId(exists ? saved.id : (refreshed[0]?.id ?? null));
    } catch (error) {
      message.error("Đã xảy ra lỗi khi lưu panorama");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete ───
  const handleDelete = async () => {
    if (!selectedPanorama) {
      message.warning("Chưa chọn panorama để xóa");
      return;
    }

    setIsSaving(true);
    try {
      await adminPanoramaService.deletePanorama(selectedPanorama.id);
      message.success("Đã xóa panorama");

      const refreshed = await fetchPanoramas();
      const nextId = refreshed.find((panorama) => panorama.isDefault)?.id ?? refreshed[0]?.id ?? null;
      setSelectedPanoramaId(nextId);
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xóa panorama: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Image ───
  const handleImageChange = (url: string) => {
    setPanoramaImageUrl(url);
    setImageError("");
  };

  const handleTitleChange = (title: string) => {
    setPanoramaTitle(normalizeTitle(title));
  };

  const handleDefaultChange = (checked: boolean) => {
    setIsDefault(checked);
  };

  // ─── Default view ───
  const enterViewSelection = () => setViewSelectionMode(true);
  const cancelViewSelection = () => setViewSelectionMode(false);
  const captureDefaultView = (yaw: number, pitch: number) => {
    setDefaultYaw(yaw);
    setDefaultPitch(pitch);
    setHasCustomView(true);
    setViewSelectionMode(false);
    message.success("Đã lưu góc nhìn mặc định");
  };
  const resetDefaultView = () => {
    setDefaultYaw(0);
    setDefaultPitch(0);
    setHasCustomView(false);
    message.success("Đã đặt lại góc nhìn về trung tâm");
  };

  // ─── Hot spot CRUD ───
  const addHotSpot = (data: HotSpotFormValues) => {
    setHotSpots((prev) => [...prev, { ...data, orderIndex: prev.length }]);
  };

  const updateHotSpot = (index: number, data: HotSpotFormValues) => {
    setHotSpots((prev) => prev.map((hs, i) => (i === index ? data : hs)));
  };

  const deleteHotSpot = (index: number) => {
    setHotSpots((prev) => prev.filter((_, i) => i !== index));
    message.success("Đã xóa điểm nóng");
  };

  const reorderHotSpots = (fromIndex: number, toIndex: number) => {
    setHotSpots((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy.map((hs, i) => ({ ...hs, orderIndex: i }));
    });
  };

  // ─── Preview click → create new hot spot with captured position ───
  const [clickedPosition, setClickedPosition] = useState<{
    yaw: number;
    pitch: number;
  } | null>(null);

  const handlePreviewClick = useCallback((yaw: number, pitch: number) => {
    const roundedYaw = Math.round(yaw * 100) / 100;
    const roundedPitch = Math.round(pitch * 100) / 100;
    setClickedPosition({ yaw: roundedYaw, pitch: roundedPitch });
  }, []);

  const clearClickedPosition = () => setClickedPosition(null);

  return {
    // States / variable
    panoramas,
    selectedPanoramaId,
    selectedPanorama,
    targetPointId,
    panoramaTitle,
    panoramaImageUrl,
    isDefault,
    defaultYaw,
    defaultPitch,
    hotSpots,
    imageError,
    viewSelectionMode,
    hasCustomView,
    clickedPosition,
    isLoading,
    isSaving,
    error,

    // Actions
    handleSave: handleSavePanoramaAndHotSpots,
    handleDelete,
    handleTitleChange,
    handleDefaultChange,
    handleImageChange,
    enterViewSelection,
    cancelViewSelection,
    captureDefaultView,
    resetDefaultView,
    addHotSpot,
    updateHotSpot,
    deleteHotSpot,
    reorderHotSpots,
    handlePreviewClick,
    clearClickedPosition,
    changeEditingPanorama,
    startCreatePanorama,
    refetchPanoramas: fetchPanoramas,
  };
}
