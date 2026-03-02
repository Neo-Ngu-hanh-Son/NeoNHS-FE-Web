import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { usePanoramaEditor } from "./usePanoramaEditor";
import type { HotSpotFormValues } from "../schema";
import type { PanoramaRequest } from "@/types";

export function usePanoramaForm() {
  const editor = usePanoramaEditor();
  const { panorama, savePanorama, deletePanorama } = editor;

  // ─── Local form state ───
  const [panoramaImageUrl, setPanoramaImageUrl] = useState("");
  const [defaultYaw, setDefaultYaw] = useState(0);
  const [defaultPitch, setDefaultPitch] = useState(0);
  const [hotSpots, setHotSpots] = useState<HotSpotFormValues[]>([]);
  const [imageError, setImageError] = useState("");
  const [viewSelectionMode, setViewSelectionMode] = useState(false);
  const [hasCustomView, setHasCustomView] = useState(false);


  // ─── Hydrate form when panorama data arrives ───
  useEffect(() => {
    if (panorama) {
      setPanoramaImageUrl(panorama.panoramaImageUrl);
      setDefaultYaw(panorama.defaultYaw);
      setDefaultPitch(panorama.defaultPitch);
      setHotSpots(
        panorama.hotSpots.map((hs) => ({
          yaw: hs.yaw,
          pitch: hs.pitch,
          tooltip: hs.tooltip,
          title: hs.title,
          description: hs.description,
          imageUrl: hs.imageUrl ?? "",
          orderIndex: hs.orderIndex,
        })),
      );
      setHasCustomView(
        panorama.defaultYaw !== 0 || panorama.defaultPitch !== 0,
      );
    }
  }, [panorama]);

  // ─── Save ───
  const handleSave = async () => {
    if (!panoramaImageUrl.trim()) {
      setImageError("Panorama image URL is required");
      return;
    }
    try {
      new URL(panoramaImageUrl);
      setImageError("");
    } catch {
      setImageError("Must be a valid URL");
      return;
    }

    const payload: PanoramaRequest = {
      panoramaImageUrl,
      defaultYaw,
      defaultPitch,
      hotSpots: hotSpots.map((hs, i) => ({
        yaw: hs.yaw,
        pitch: hs.pitch,
        tooltip: hs.tooltip,
        title: hs.title,
        description: hs.description,
        imageUrl: hs.imageUrl || undefined,
        orderIndex: hs.orderIndex ?? i,
      })),
    };

    try {
      await savePanorama(payload);
    } catch {
      // Error already toasted in usePanoramaEditor
    }
  };

  // ─── Delete ───
  const handleDelete = async () => {
    await deletePanorama();
    setPanoramaImageUrl("");
    setDefaultYaw(0);
    setDefaultPitch(0);
    setHotSpots([]);
    setHasCustomView(false);
  };

  // ─── Image ───
  const handleImageChange = (url: string) => {
    setPanoramaImageUrl(url);
    setImageError("");
  };

  // ─── Default view ───
  const enterViewSelection = () => setViewSelectionMode(true);
  const cancelViewSelection = () => setViewSelectionMode(false);
  const captureDefaultView = (yaw: number, pitch: number) => {
    setDefaultYaw(yaw);
    setDefaultPitch(pitch);
    setHasCustomView(true);
    setViewSelectionMode(false);
    message.success("Default starting view saved");
  };
  const resetDefaultView = () => {
    setDefaultYaw(0);
    setDefaultPitch(0);
    setHasCustomView(false);
    message.success("Default view reset to center");
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
    message.success("Hot spot removed");
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
    message.info(`Position captured: yaw=${roundedYaw}, pitch=${roundedPitch}`);
    setClickedPosition({ yaw: roundedYaw, pitch: roundedPitch });
  }, []);

  const clearClickedPosition = () => setClickedPosition(null);

  return {
    // From usePanoramaEditor (pass-through)
    ...editor,

    // Form values
    panoramaImageUrl,
    defaultYaw,
    defaultPitch,
    hotSpots,
    imageError,
    viewSelectionMode,
    hasCustomView,
    clickedPosition,

    // Actions
    handleSave,
    handleDelete,
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
  };
}
