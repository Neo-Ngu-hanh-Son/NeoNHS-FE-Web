import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { usePanoramaForm } from "./hooks/usePanoramaForm";
import PanoramaEditorHeader from "./components/PanoramaEditorHeader";
import PanoramaImageUpload from "./components/PanoramaImageUpload";
import CameraDefaultsForm from "./components/CameraDefaultsForm";
import HotSpotManager from "./components/HotSpotManager";
import PanoramaPreview from "./components/PanoramaPreview";
import { Spinner } from "@/components/ui/spinner";

export default function AdminPanoramaEditorPage() {
  const form = usePanoramaForm();

  const entityLabel = form.isCheckinPoint ? "Check-in Point" : "Point";

  // ─── Loading state ───
  if (form.loading) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">Loading panorama data…</p>
          </div>
        </div>
      </div>
    );
  }

  if (form.error) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-destructive">Error: {form.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <PanoramaEditorHeader
        panorama={form.panorama}
        targetId={form.targetId}
        entityLabel={entityLabel}
        saving={form.saving}
        hasImage={!!form.panoramaImageUrl}
        onSave={form.handleSave}
        onDelete={form.handleDelete}
      />

      <Separator />

      {/* ── Main content: 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Form */}
        <div className="space-y-6">
          <Card className="p-5 space-y-5">
            <h2 className="text-base font-semibold">Panorama Image</h2>
            <PanoramaImageUpload
              value={form.panoramaImageUrl}
              onChange={form.handleImageChange}
              error={form.imageError}
            />
          </Card>

          <Card className="p-5 space-y-5">
            <h2 className="text-base font-semibold">Default Starting View</h2>
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

        {/* Right column: Live preview */}
        <div className="space-y-4 z-0">
          <Card className="p-5 space-y-4">
            <h2 className="text-base font-semibold">360° Preview</h2>
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
