import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import PanoramaBackButton from '../components/ScreenComponents/PanoramaBackButton';
import { PointResponse } from '@/types/point';
import adminPointService from '@/services/api/pointService';
import { PanoramaHelper } from '@/utils/PanoramaHelper';
import ErrorModal from '../components/ErrorModal';

/**
 * This version differ from the other version is that it will only load once, then the mobile webview will just keep sending message to update the panorama data without unmounting this component. This is because:
 * 1. The webview need to download the entire front end bundle every time it mounts, which is also expensive and causes unnecessary data usage and load time for the user.
 */
export default function PanoramaScreenMobile() {
  // ─── Data fetching state ───
  const [currentPano, setCurrentPano] = useState<PointPanoramaResponse | null>(null);
  const [currentPlace, setCurrentPlace] = useState<PointResponse | null>(null);
  const [activePanoramaId, setActivePanoramaId] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Panel state ───
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<InfoPanelContent | undefined>(undefined);

  // ─── Handle messages from React Native (via postMessage) ───
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        console.log('Parsed message data:', data);
        if (data?.type === 'SET_PLACE_ID') {
          // If placeId is the same as current, do nothing to avoid unnecessary re-fetch and viewer update
          if (data.payload === placeId) {
            console.log('Received placeId is the same as current, ignoring:', data.payload);
            return;
          }
          console.log('Setting placeId to:', data.payload);
          setPlaceId(data.payload);
          setActivePanoramaId(null);
        }
      } catch (err) {
        console.error('Error parsing message data:', err);
      }
    };
    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as any);

    return () => {
      document.removeEventListener('message', handleMessage as any);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Stable ref so the PSV button callback always sees the latest toggle fn
  const togglePlacePanelRef = useRef<() => void>(() => {});
  togglePlacePanelRef.current = () => {
    // When toggling via the ℹ button, show place-level info
    setPanelContent({
      title: currentPlace?.name ?? '',
      // subtitle: place?.address ? `At ${place.address}` : undefined, // We currently dont have any address
      description: currentPlace?.description ?? '',
    });
    setIsPanelOpen((prev) => !prev);
  };

  const handleClosePanel = useCallback(() => setIsPanelOpen(false), []);

  // ─── Viewer refs ───
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const firstVisitRef = useRef(true); // To track if it's the first time we're loading data into the viewer

  const isMobile = navigator.userAgent.includes('NeoNHS-Mobile');

  // 1. Place-level Effect
  useEffect(() => {
    if (!placeId) return;
    if (currentPlace?.id === placeId) {
      setIsLoading(false); // Already have it, skip fetch
      return;
    }
    let cancelled = false;
    setError(null);
    const fetchPlace = async () => {
      try {
        if (!firstVisitRef.current) {
          setIsLoading(true);
        }
        const response = await adminPointService.getPointById(placeId);
        if (cancelled) return;
        setCurrentPlace(response.data);

        // Only reset to default IF the currently active panorama
        // doesn't belong to this new place.
        const belongsToNewPlace = response.data.panoramas?.some((p) => p.id === activePanoramaId);

        if (!belongsToNewPlace) {
          const defaultPano = PanoramaHelper.getDefaultPanorama(response.data.panoramas ?? []);
          setActivePanoramaId(defaultPano?.id || null);
        }
        // Else just do nothing to keep the current panorama if it's still valid for the new place. This allows smoother transition when jumping between places that are closely linked via hotspots.
      } catch (err: any) {
        console.error('Error fetching place data:', err);
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
  }, [placeId]); // Only runs when we jump to a different physical location

  // 2. Panorama-level Effect: Handles Navigation between panos in one place
  useEffect(() => {
    if (!activePanoramaId) return;

    let cancelled = false;
    setError(null);
    const fetchPano = async () => {
      try {
        const activePanoData = await panoramaService.getPanoramaById(activePanoramaId);
        if (!cancelled) {
          setCurrentPano(activePanoData);
          let newPanoramaPlaceId = activePanoData.placeId;
          // If the new panorama doesn't belong to the current place, we need to update the place data as well to reflect the correct hotspots and info panel content
          if (newPanoramaPlaceId !== placeId) {
            setPlaceId(newPanoramaPlaceId);
          }
        }
      } catch (err: any) {
        console.error('Error fetching panorama data:', err);
        if (!cancelled) setError(err.message);
      }
    };

    fetchPano();
    return () => {
      cancelled = true;
    };
  }, [activePanoramaId]);

  // --- Init viewer with no data for later dynamic updates ---
  useLayoutEffect(() => {
    console.log(
      'Initializing viewer in useLayoutEffect, viewer ref:',
      viewerRef.current,
      'container ref:',
      containerRef.current,
    );
    if (!containerRef.current || viewerRef.current) return;
    console.log('Initializing panorama viewer with empty data');
    const viewer = new Viewer({
      container: containerRef.current,
      navbar: [
        'zoom',
        {
          id: 'custom-info',
          title: 'Location Info',
          className: 'psv-custom-info-button',
          content:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.25v2.25a.75.75 0 001.5 0V10A.75.75 0 0010 9H9z" clip-rule="evenodd"/></svg>',
          onClick: () => togglePlacePanelRef.current(),
        },
        'caption',
      ],
      plugins: [[MarkersPlugin, {}]],
      minFov: 30,
      maxFov: 120,
      defaultZoomLvl: 50,
      loadingTxt: 'Loading panorama…',
      moveSpeed: 1.5,
      zoomSpeed: 1.2,
    });

    const markersPlugin = viewer.getPlugin(MarkersPlugin);

    const onSelect = ({ marker }: { marker: any }) => {
      const data = marker.data as PanoramaHotSpotResponse | undefined;
      if (!data) return;
      console.log('Marker selected with data:', data);
      switch (data.type) {
        case 'INFO':
          marker.domElement.classList.add('scale-125');
          setPanelContent({
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl ?? undefined,
          });
          setIsPanelOpen(true);
          break;
        case 'LINK':
          setActivePanoramaId(data.targetPanoramaId);
          break;
        default:
          console.warn('Unknown hotspot type:', data.type);
      }
    };

    const onUnselect = ({ marker }: { marker: any }) => {
      marker.domElement.classList.remove('scale-125');
    };

    markersPlugin.addEventListener('select-marker', onSelect);
    markersPlugin.addEventListener('unselect-marker', onUnselect);

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
      viewerRef.current = null;
      markersPlugin.removeEventListener('select-marker', onSelect);
      markersPlugin.removeEventListener('unselect-marker', onUnselect);
    };
  }, []);

  /**
   * When will we update our view ?
   * 1. When we first receive a new placeId from the mobile (reactnative)
   * 2. When we click on a hotspot of type LINK, which will update the activePanoramaId to the target panorama, triggering the panorama-level effect to fetch the new panorama data and update the viewer.
   * In all cases, we try to be smart about only updating the viewer when necessary (e.g. if the new panorama belongs to the same place and we already have it loaded, we won't do anything).
   * This way we can minimize unnecessary updates and provide a smoother experience for users navigating between closely linked panoramas.
   */
  useEffect(() => {
    if (!currentPlace || !currentPano || !viewerRef.current) return;

    let cancelled = false;
    const viewer = viewerRef.current;

    (async () => {
      const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      markersPlugin.clearMarkers();
      await viewer.setPanorama(currentPano.panoramaImageUrl, {
        transition: true,
        showLoader: true,
      });

      if (cancelled) return;

      await viewer.animate({
        yaw: currentPano.defaultYaw ?? 0,
        pitch: currentPano.defaultPitch ?? 0,
        zoom: 50, // You can also animate the zoom level
        speed: 1000,
      });

      currentPano.hotSpots.forEach((m) => {
        markersPlugin.addMarker({
          id: m.id,
          position: { yaw: m.yaw, pitch: m.pitch },
          tooltip: m.tooltip,
          anchor: 'bottom center',
          size: { width: 24, height: 24 },
          html: m.type === 'INFO' ? getNormalMarkerHTML() : getLinkMarkerHTML(),
          data: m,
        });
      });

      // Update the place-level info panel if it's open to reflect the new place data
      setPanelContent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          title: currentPlace.name ?? '',
          // subtitle: currentPlace.address ? `At ${currentPlace.address}` : undefined,
          description: currentPlace.description ?? '',
        };
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPlace, currentPano]);

  const handleRetry = () => {
    const failedId = activePanoramaId;
    setError(null);
    setIsLoading(true);

    if (failedId) {
      // We temporarily nullify the ID and reset it to force React
      // to re-run the Panorama-level useEffect
      setActivePanoramaId(null);
      setTimeout(() => {
        setActivePanoramaId(failedId);
      }, 50);
    } else if (placeId) {
      // If we haven't even gotten a panorama yet, retry the place fetch
      const currentPlaceId = placeId;
      setPlaceId(null);
      setTimeout(() => setPlaceId(currentPlaceId), 50);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <ViewTitle>
        {!isMobile && <PanoramaBackButton />}
        {currentPlace?.name ? currentPlace.name : 'Loading...'}
      </ViewTitle>
      <div ref={containerRef} className="psv-container w-full h-full z-10" />

      <ErrorModal error={error} onRetry={handleRetry} onClose={() => setError(null)} />

      {/* Info panel — shows place info or marker detail depending on what was tapped */}
      <InfoPanel isOpen={isPanelOpen} onClose={handleClosePanel} content={panelContent} />
    </div>
  );
}
