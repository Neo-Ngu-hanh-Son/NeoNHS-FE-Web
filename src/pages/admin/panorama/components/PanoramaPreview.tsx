import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import type { HotSpotFormValues } from '../schema';
import { getLinkMarkerHTML, getNormalMarkerHTML } from '@/pages/Panorama/helpers/panoramaHelpers';
import { Button } from '@/components/ui/button';
import { Camera, Check, X } from 'lucide-react';

interface PanoramaPreviewProps {
  imageUrl: string;
  defaultYaw: number;
  defaultPitch: number;
  hotSpots: HotSpotFormValues[];
  /** Called when the user clicks on the panorama to place a new hot spot */
  onClickPosition?: (yaw: number, pitch: number) => void;
  /** When true, the preview is in "set default view" mode */
  viewSelectionMode?: boolean;
  /** Called when the user confirms the default view in view-selection mode */
  onCaptureDefaultView?: (yaw: number, pitch: number) => void;
  /** Called when the user cancels view-selection mode */
  onCancelViewSelection?: () => void;
}

export default function PanoramaPreview({
  imageUrl,
  defaultYaw,
  defaultPitch,
  hotSpots,
  onClickPosition,
  viewSelectionMode = false,
  onCaptureDefaultView,
  onCancelViewSelection,
}: PanoramaPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const viewSelectionModeRef = useRef(viewSelectionMode);

  // Keep ref in sync so the click handler can read the latest mode
  useEffect(() => {
    viewSelectionModeRef.current = viewSelectionMode;
  }, [viewSelectionMode]);

  // Build / rebuild the viewer when imageUrl changes
  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    let viewer: Viewer | null = null;
    let frameId: number;

    frameId = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      viewer = new Viewer({
        container: containerRef.current,
        panorama: imageUrl,
        navbar: ['zoom', 'caption'],
        plugins: [[MarkersPlugin, {}]],
        minFov: 30,
        maxFov: 120,
        defaultZoomLvl: 50,
        defaultYaw: defaultYaw ?? 0,
        defaultPitch: defaultPitch ?? 0,
        canvasBackground: '#1a1a1a',
        loadingTxt: 'Đang tải xem trước…',
      });

      const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);

      // Render preview markers
      hotSpots.forEach((hs, i) => {
        const isLink = hs.type === 'LINK';
        markersPlugin.addMarker({
          id: `preview-${i}`,
          position: { yaw: hs.yaw, pitch: hs.pitch },
          tooltip: hs.tooltip || `Điểm nóng #${i + 1}`,
          anchor: 'bottom center',
          size: { width: 24, height: 24 },
          html: isLink ? getLinkMarkerHTML() : getNormalMarkerHTML(),
        });
      });

      // Click on panorama → report position for placing a new hot spot
      // Only fires in normal (non-view-selection) mode
      if (onClickPosition) {
        viewer.addEventListener('click', ({ data }) => {
          if (!viewSelectionModeRef.current) {
            onClickPosition(data.yaw, data.pitch);
          }
        });
      }

      viewerRef.current = viewer;
    });

    return () => {
      cancelAnimationFrame(frameId);
      viewer?.destroy();
      viewerRef.current = null;
    };
    // Intentionally re-create when imageUrl, hotSpots, or defaults change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, defaultYaw, defaultPitch, JSON.stringify(hotSpots)]);

  /** Read the current camera position from the viewer */
  const handleCaptureView = () => {
    const viewer = viewerRef.current;
    if (!viewer || !onCaptureDefaultView) return;
    const pos = viewer.getPosition();
    onCaptureDefaultView(pos.yaw, pos.pitch);
  };

  if (!imageUrl) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 h-[400px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Vui lòng tải lên ảnh panorama để xem trước.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {viewSelectionMode
          ? 'Xoay khung hình đến góc khách cần thấy trước, rồi xác nhận.'
          : 'Bấm bất kỳ đâu trên ảnh xem trước để đặt điểm nóng mới.'}
      </p>
      <div className="relative">
        <div ref={containerRef} className="rounded-lg overflow-hidden border border-gray-200" style={{ height: 400 }} />

        {/* View-selection mode overlay */}
        {viewSelectionMode && (
          <>
            {/* Pulsing border to indicate active mode */}
            <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse pointer-events-none" />

            {/* Top banner */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 pointer-events-none">
              <Camera className="h-4 w-4" />
              Setting Default View
            </div>

            {/* Bottom action bar */}
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 backdrop-blur-sm shadow-md"
                onClick={onCancelViewSelection}
              >
                <X className="h-4 w-4 mr-1" />
                Hủy
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                onClick={handleCaptureView}
              >
                <Check className="h-4 w-4 mr-1" />
                Xác nhận góc nhìn
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
