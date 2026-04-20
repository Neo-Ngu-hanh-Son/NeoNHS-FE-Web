import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '../styles/panorama.css';
import { getLinkMarkerHTML, getNormalMarkerHTML } from '../helpers/panoramaHelpers';
import InfoPanel, { type InfoPanelContent } from '../components/InfoPanel';
import ViewTitle from '../components/ScreenComponents/ViewTitle';
import { panoramaService } from '@/services/api/panoramaService';
import type { PointPanoramaResponse, PanoramaHotSpotResponse } from '@/types';
import adminPointService from '@/services/api/pointService';
import { PointResponse } from '@/types/point';
import { PanoramaHelper } from '@/utils/PanoramaHelper';
import ErrorModal from '../components/ErrorModal';
import PanoramaLoading from '../components/PanoramaLoading';
import PanoramaBackButton from '../components/ScreenComponents/PanoramaBackButton';

export default function PanoramaScreen() {
  const { placeId: urlPlaceId } = useParams<{ placeId: string }>();

  // ─── State ───
  const [currentPano, setCurrentPano] = useState<PointPanoramaResponse | null>(null);
  const [currentPlace, setCurrentPlace] = useState<PointResponse | null>(null);
  const [activePanoramaId, setActivePanoramaId] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(urlPlaceId || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Panel state ───
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<InfoPanelContent | undefined>(undefined);

  const viewerRef = useRef<Viewer | null>(null);
  const firstVisitRef = useRef(true);

  // ─── Info Panel Toggle ───
  const togglePlacePanelRef = useRef<() => void>(() => {});
  togglePlacePanelRef.current = () => {
    setPanelContent({
      title: currentPlace?.name ?? '',
      description: currentPlace?.description ?? '',
    });
    setIsPanelOpen((prev) => !prev);
  };

  const handleClosePanel = useCallback(() => setIsPanelOpen(false), []);

  // ─── 1. Place-level Effect (Metadata) ───
  useEffect(() => {
    if (!placeId) return;
    if (currentPlace?.id === placeId) return;

    let cancelled = false;
    const fetchPlace = async () => {
      try {
        if (!firstVisitRef.current) setIsLoading(true);
        const response = await adminPointService.getPointById(placeId);
        if (cancelled) return;

        setCurrentPlace(response.data);

        // Reset to default if current pano doesn't belong to new place
        const belongs = response.data.panoramas?.some((p) => p.id === activePanoramaId);
        if (!belongs) {
          const defaultPano = PanoramaHelper.getDefaultPanorama(response.data.panoramas ?? []);
          setActivePanoramaId(defaultPano?.id || null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        setIsLoading(false);
        firstVisitRef.current = false;
      }
    };

    fetchPlace();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  // ─── 2. Panorama-level Effect (Navigation) ───
  useEffect(() => {
    if (!activePanoramaId) return;

    let cancelled = false;
    const fetchPano = async () => {
      try {
        const activePanoData = await panoramaService.getPanoramaById(activePanoramaId);
        if (cancelled) return;

        setCurrentPano(activePanoData);
        if (activePanoData.placeId !== placeId) {
          setPlaceId(activePanoData.placeId);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      }
    };

    fetchPano();
    return () => {
      cancelled = true;
    };
  }, [activePanoramaId]);

  // ─── 3. Initialize Viewer (Once) ───
  useLayoutEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    const viewer = new Viewer({
      container: containerRef.current,
      navbar: [
        'zoom',
        {
          id: 'custom-info',
          title: 'Location Info',
          content: '<svg ...></svg>', // Use your SVG here
          onClick: () => togglePlacePanelRef.current(),
        },
        'caption',
        'fullscreen',
      ],
      plugins: [[MarkersPlugin, {}]],
      defaultZoomLvl: 50,
    });

    const markersPlugin = viewer.getPlugin(MarkersPlugin);

    markersPlugin.addEventListener('select-marker', ({ marker }) => {
      const data = marker.data as PanoramaHotSpotResponse | undefined;
      if (!data) return;

      if (data.type === 'INFO') {
        marker.domElement.classList.add('scale-125');
        setPanelContent({
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl ?? undefined,
        });
        setIsPanelOpen(true);
      } else if (data.type === 'LINK') {
        setActivePanoramaId(data.targetPanoramaId);
      }
    });

    markersPlugin.addEventListener('unselect-marker', ({ marker }) => {
      marker.domElement.classList.remove('scale-125');
    });

    viewerRef.current = viewer;
    return () => viewer.destroy();
  }, []);

  // ─── 4. Scene Update Effect ───
  useEffect(() => {
    if (!currentPlace || !currentPano || !viewerRef.current) return;

    let cancelled = false;
    const viewer = viewerRef.current;
    const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);

    (async () => {
      markersPlugin.clearMarkers();

      await viewer.setPanorama(currentPano.panoramaImageUrl, {
        transition: true,
        showLoader: true,
      });

      if (cancelled) return;

      await viewer.animate({
        yaw: currentPano.defaultYaw ?? 0,
        pitch: currentPano.defaultPitch ?? 0,
        speed: 1000,
      });

      currentPano.hotSpots.forEach((m) => {
        markersPlugin.addMarker({
          id: m.id,
          position: { yaw: m.yaw, pitch: m.pitch },
          tooltip: m.tooltip,
          anchor: 'bottom center',
          size: { width: 28, height: 28 }, // Slightly larger for desktop
          html: m.type === 'INFO' ? getNormalMarkerHTML() : getLinkMarkerHTML(),
          data: m,
        });
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPlace, currentPano]);

  const handleRetry = () => {
    setError(null);
    const id = activePanoramaId;
    setActivePanoramaId(null);
    setTimeout(() => setActivePanoramaId(id), 50);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading && firstVisitRef.current) return <PanoramaLoading />;

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[#0f1115]">
      <ViewTitle>
        <PanoramaBackButton />
        {currentPlace?.name || 'Loading...'}
      </ViewTitle>

      <div ref={containerRef} className="psv-container w-full h-full z-10" />

      <ErrorModal error={error} onRetry={handleRetry} onClose={() => setError(null)} />
      <InfoPanel isOpen={isPanelOpen} onClose={handleClosePanel} content={panelContent} />
    </div>
  );
}
