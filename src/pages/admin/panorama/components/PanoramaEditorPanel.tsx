import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePanoramaForm } from "../hooks/usePanoramaForm";
import PanoramaEditorHeader from "./PanoramaEditorHeader";
import PanoramaImageUpload from "./PanoramaImageUpload";
import CameraDefaultsForm from "./CameraDefaultsForm";
import HotSpotManager from "./HotSpotManager";
import PanoramaPreview from "./PanoramaPreview";
import { Spinner } from "@/components/ui/spinner";

export interface PanoramaEditorPanelProps {
  /** `embedded`: trong modal POI — nút quay lại gọi `onBackToParent` thay vì `navigate(-1)` */
  variant?: "page" | "embedded";
  /** Bắt buộc khi `variant="embedded"` — id điểm POI */
  embedPointId?: string;
  pointName?: string;
  onBackToParent?: () => void;
}

export default function PanoramaEditorPanel({
  variant = "page",
  embedPointId,
  pointName,
  onBackToParent,
}: PanoramaEditorPanelProps) {
  const embedded = variant === "embedded";
  const form = usePanoramaForm(embedded && embedPointId ? { embedPointId } : undefined);

  const entityLabel = form.isCheckinPoint ? "Điểm check-in" : "Điểm POI";

  if (form.loading) {
    return (
      <div className={embedded ? "py-12" : "mx-auto max-w-[1200px] p-6"}>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu panorama…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? "space-y-4" : "mx-auto max-w-[1200px] space-y-6 p-6"}>
      <PanoramaEditorHeader
        variant={variant}
        panorama={form.panorama}
        targetId={form.targetId}
        entityLabel={entityLabel}
        saving={form.saving}
        hasImage={!!form.panoramaImageUrl}
        onSave={form.handleSave}
        onDelete={form.handleDelete}
        pointName={pointName}
        onBackToParent={onBackToParent}
      />

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="space-y-5 p-5">
            <h2 className="text-base font-semibold">Ảnh panorama</h2>
            <PanoramaImageUpload
              value={form.panoramaImageUrl}
              onChange={form.handleImageChange}
              error={form.imageError}
            />
          </Card>

          <Card className="space-y-5 p-5">
            <CameraDefaultsForm
              hasCustomView={form.hasCustomView}
              hasImage={!!form.panoramaImageUrl}
              onSetDefaultView={form.enterViewSelection}
              onResetView={form.resetDefaultView}
            />
          </Card>

          <HotSpotManager
            hotSpots={form.hotSpots}
            clickedPosition={form.clickedPosition}
            onAdd={form.addHotSpot}
            onUpdate={form.updateHotSpot}
            onDelete={form.deleteHotSpot}
            onReorder={form.reorderHotSpots}
            onClearClickedPosition={form.clearClickedPosition}
          />
        </div>

        <div className="z-0 space-y-4">
          <Card className="space-y-4 p-5">
            <h2 className="text-base font-semibold">Xem trước 360°</h2>
            <PanoramaPreview
              imageUrl={form.panoramaImageUrl}
              defaultYaw={form.defaultYaw}
              defaultPitch={form.defaultPitch}
              hotSpots={form.hotSpots}
              onClickPosition={form.handlePreviewClick}
              viewSelectionMode={form.viewSelectionMode}
              onCaptureDefaultView={form.captureDefaultView}
              onCancelViewSelection={form.cancelViewSelection}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
