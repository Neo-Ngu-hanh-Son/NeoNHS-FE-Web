import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { usePanoramaForm } from '../hooks/usePanoramaForm';
import PanoramaEditorHeader from './PanoramaEditorHeader';
import PanoramaImageUpload from './PanoramaImageUpload';
import CameraDefaultsForm from './CameraDefaultsForm';
import HotSpotManager from './HotSpotManager';
import PanoramaPreview from './PanoramaPreview';
import { Spinner } from '@/components/ui/spinner';
import PanoramaList from './PanoramaList';
import { Button } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PanoramaEditorPanelProps {
  /** `embedded`: trong modal POI — nút quay lại gọi `onBackToParent` thay vì `navigate(-1)` */
  variant?: 'page' | 'embedded';
  /** Bắt buộc khi `variant="embedded"` — id điểm POI */
  embedPointId?: string;
  pointName?: string;
  onBackToParent?: () => void;
}

export default function PanoramaEditorPanel({
  variant = 'page',
  embedPointId,
  pointName,
  onBackToParent,
}: PanoramaEditorPanelProps) {
  const navigate = useNavigate();
  const embedded = variant === 'embedded';
  const form = usePanoramaForm({ embedPointId });

  if (form.isLoading) {
    return (
      <div className={embedded ? 'py-12' : 'mx-auto max-w-[1200px] p-6'}>
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu panorama…</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (embedded && onBackToParent) {
      onBackToParent();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={embedded ? 'space-y-4' : 'mx-auto max-w-[1200px] space-y-6 p-6'}>
      <Button type="button" variant="ghost" size={'sm'} className={'shrink-0 gap-2 px-2'} onClick={handleBack}>
        <ArrowLeft className="h-4 w-4" />
        {embedded ? <span className="text-sm font-medium">Về thông tin điểm</span> : <span>Quay lại</span>}
      </Button>
      <PanoramaList
        panoramas={form.panoramas}
        selectedPanoramaId={form.selectedPanoramaId}
        onSelectPanorama={form.changeEditingPanorama}
        onCreatePanorama={form.startCreatePanorama}
        disabled={form.isSaving}
      />
      <Separator />

      <PanoramaEditorHeader
        variant={variant}
        panorama={form.selectedPanorama}
        targetPointId={form.targetPointId}
        saving={form.isSaving}
        hasImage={!!form.panoramaImageUrl}
        onSave={form.handleSave}
        onDelete={form.handleDelete}
        pointName={pointName}
        onBackToParent={onBackToParent}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="space-y-5 p-5">
            <div className="space-y-2">
              <h2 className="text-base font-semibold">Tiêu đề panorama</h2>
              <Input
                placeholder="Ví dụ: Sảnh chính, Hang phía Đông..."
                value={form.panoramaTitle}
                onChange={(event) => form.handleTitleChange(event.target.value)}
              />
            </div>

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
            currentPanoramaId={form.selectedPanoramaId}
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
