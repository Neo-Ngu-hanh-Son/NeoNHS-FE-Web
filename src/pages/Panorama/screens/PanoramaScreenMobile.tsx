import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';
import '../styles/panorama.css';
import { getNormalMarkerHTML } from '../helpers/panoramaHelpers';
import InfoPanel, { type InfoPanelContent } from '../components/InfoPanel';
import ViewTitle from '../components/ScreenComponents/ViewTitle';
import { panoramaService } from '@/services/api/panoramaService';
import type { PointPanoramaResponse, PanoramaHotSpotResponse } from '@/types';
import PanoramaBackButton from '../components/ScreenComponents/PanoramaBackButton';

/**
 * This version differ from the other version is that it will only load once, then the mobile webview will just keep sending message to update the panorama data without unmounting this component. This is because:
 * 1. The webview component in React Native is expensive to mount/unmount, so we want to avoid that as much as possible.
 * 2. The webview need to download the entire front end bundle every time it mounts, which is also expensive and causes unnecessary data usage and load time for the user.
 */
export default function PanoramaScreenMobile() {
  // ─── Data fetching state ───
  const [place, setPlace] = useState<PointPanoramaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Panel state ───
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<InfoPanelContent | undefined>(undefined);

  const [placeId, setPlaceId] = useState<string | null>(null);

  // ─── Handle messages from React Native (via postMessage) ───
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        //console.log('Parsed message data:', data);
        if (data?.type === 'SET_PLACE_ID') {
          // If placeId is the same as current, do nothing to avoid unnecessary re-fetch and viewer update
          if (data.payload === placeId) {
            //console.log('Received placeId is the same as current, ignoring:', data.payload);
            return;
          }
          //console.log('Setting placeId to:', data.payload);
          setPlaceId(data.payload);
        }
      } catch (err) {
        //console.error('Error parsing message data:', err);
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
      title: place?.name ?? '',
      subtitle: place?.address ? `At ${place.address}` : undefined,
      description: place?.description ?? '',
    });
    setIsPanelOpen((prev) => !prev);
  };

  const handleClosePanel = useCallback(() => setIsPanelOpen(false), []);

  // ─── Viewer refs ───
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  //console.log('Web viewer ref on render:', viewerRef.current);

  const isMobile = navigator.userAgent.includes('NeoNHS-Mobile');

  // ─── Fetch panorama data on placeId change ───
  useEffect(() => {
    if (!placeId) return;

    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        //console.log('Fetching panorama data for placeId:', placeId);
        const data = await panoramaService.getPointPanorama(placeId);
        //console.log('Fetched panorama data:', data);
        if (!cancelled) setPlace(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [placeId]);

  // --- Init viewer with no data for later dynamic updates ---
  useLayoutEffect(() => {
    //console.log(
      'Initializing viewer in useLayoutEffect, viewer ref:',
      viewerRef.current,
      'container ref:',
      containerRef.current,
    );
    if (!containerRef.current || viewerRef.current) return;
    //console.log('Initializing panorama viewer with empty data');
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

      marker.domElement.classList.add('scale-125');

      setPanelContent({
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || undefined,
      });

      setIsPanelOpen(true);
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

  // ─── Dynamic update the viewer base on the place id and place received and fetched ───
  useEffect(() => {
    //console.log('Place data changed, updating viewer if needed. Place:', place);
    //console.log('Viewer ref:', viewerRef.current);

    if (!place || !viewerRef.current) return;

    let cancelled = false;
    const viewer = viewerRef.current;

    (async () => {
      //console.log('Updating panorama viewer with new place data:', place);
      await viewer.setPanorama(place.panoramaImageUrl, {
        transition: true,
        showLoader: true,
      });

      if (cancelled) return;

      viewer.rotate({
        yaw: place.defaultYaw ?? 0,
        pitch: place.defaultPitch ?? 0,
      });

      const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      markersPlugin.clearMarkers();

      place.hotSpots.forEach((m) => {
        markersPlugin.addMarker({
          id: m.id,
          position: { yaw: m.yaw, pitch: m.pitch },
          tooltip: m.tooltip,
          anchor: 'bottom center',
          size: { width: 24, height: 24 },
          html: getNormalMarkerHTML(),
          data: m,
        });
      });

      // Update the place info panel if it's open to reflect the new place data
      setPanelContent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          title: place.name ?? '',
          subtitle: place.address ? `At ${place.address}` : undefined,
          description: place.description ?? '',
        };
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [place]);

  // // ─── Loading state ───
  // if (isLoading) {
  //   return <PanoramaLoading />;
  // }

  // // ─── Error state ───
  // if (error || !place) {
  //   return <PanoramaError error={error || "Failed to load panorama or no place data available"} />;
  // }

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <ViewTitle>
        {!isMobile && <PanoramaBackButton />}
        {place?.name ? place.name : 'Loading...'}
      </ViewTitle>
      <div ref={containerRef} className="psv-container w-full h-full z-10" />

      {/* Info panel — shows place info or marker detail depending on what was tapped */}
      <InfoPanel isOpen={isPanelOpen} onClose={handleClosePanel} content={panelContent} />
    </div>
  );
}
