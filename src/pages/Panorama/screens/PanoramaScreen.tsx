import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "../styles/panorama.css";
import { getNormalMarkerHTML } from "../helpers/panoramaHelpers";
import InfoPanel, { type InfoPanelContent } from "../components/InfoPanel";
import ViewTitle from "../components/ScreenComponents/ViewTitle";
import { panoramaService } from "@/services/api/panoramaService";
import type { PointPanoramaResponse, PanoramaHotSpotResponse } from "@/types";
import PanoramaError from "../components/PanoramaError";
import PanoramaLoading from "../components/PanoramaLoading";
import PanoramaBackButton from "../components/ScreenComponents/PanoramaBackButton";

export default function PanoramaScreen() {
  const { placeId } = useParams<{ placeId: string }>();

  // ─── Data fetching state ───
  const [place, setPlace] = useState<PointPanoramaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Panel state ───
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<InfoPanelContent | undefined>(undefined);

  // Stable ref so the PSV button callback always sees the latest toggle fn
  const togglePlacePanelRef = useRef<() => void>(() => {});
  togglePlacePanelRef.current = () => {
    // When toggling via the ℹ button, show place-level info
    setPanelContent({
      title: place?.name ?? "",
      subtitle: place?.address,
      description: place?.description ?? "",
    });
    setIsPanelOpen((prev) => !prev);
  };

  const handleClosePanel = useCallback(() => setIsPanelOpen(false), []);

  // ─── Viewer refs ───
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  const isMobile = navigator.userAgent.includes("NeoNHS-Mobile");

  // ─── Fetch panorama data (With pre-data might be sent from the mobile) ───
  useEffect(() => {
    if (!placeId) return;

    // 1. Check if React Native already injected the data
    const injectedData = (window as any).preLoadedPanoramaData;

    if (injectedData) {
      console.log("Using injected data from Native side ", injectedData);
      setPlace(injectedData);
      setIsLoading(false);

      // Clean up the global variable so it doesn't persist weirdly
      delete (window as any).preLoadedPanoramaData;
      return;
    }

    // 2. Fallback to normal fetching if no injected data exists
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        console.log("Fetching panorama data for placeId:", placeId);
        const data = await panoramaService.getPointPanorama(placeId);
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

  // ─── Initialize viewer once place data is available ───
  useEffect(() => {
    if (!containerRef.current || !place) return;

    let viewer: Viewer | null = null;
    let frameId: number;

    frameId = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      viewer = new Viewer({
        container: containerRef.current,
        panorama: place.panoramaImageUrl,
        navbar: [
          "zoom",
          {
            id: "custom-info",
            title: "Location Info",
            className: "psv-custom-info-button",
            content:
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.25v2.25a.75.75 0 001.5 0V10A.75.75 0 0010 9H9z" clip-rule="evenodd"/></svg>',
            onClick: () => togglePlacePanelRef.current(),
          },
          "caption",
        ],
        plugins: [[MarkersPlugin, {}]],
        minFov: 30,
        maxFov: 120,
        defaultZoomLvl: 50,
        defaultYaw: place.defaultYaw ?? 0,
        defaultPitch: place.defaultPitch ?? 0,
        loadingTxt: "Loading panorama…",
        moveSpeed: isMobile ? 1.5 : 1,
        zoomSpeed: isMobile ? 1.2 : 1,
      });

      const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);

      // Add markers from backend data
      place.hotSpots.forEach((m: PanoramaHotSpotResponse) => {
        markersPlugin.addMarker({
          id: m.id,
          position: { yaw: m.yaw, pitch: m.pitch },
          tooltip: m.tooltip,
          anchor: "bottom center",
          size: { width: 24, height: 24 },
          html: getNormalMarkerHTML(),
          data: m, // stash the full marker data so we can read it on click
        });
      });

      markersPlugin.addEventListener("select-marker", ({ marker }) => {
        const data = marker.data as PanoramaHotSpotResponse | undefined;
        if (!data) return;
        marker.domElement.classList.add("scale-125");
        setPanelContent({
          title: data.title,
          subtitle: place.name,
          description: data.description,
          imageUrl: data.imageUrl ? data.imageUrl : undefined,
        });
        setIsPanelOpen(true);
      });

      markersPlugin.addEventListener("unselect-marker", ({ marker }) => {
        marker.domElement.classList.remove("scale-125");
      });

      viewerRef.current = viewer;
    });

    return () => {
      cancelAnimationFrame(frameId);
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, [place]);

  // ─── Loading state ───
  if (isLoading) {
    return <PanoramaLoading />;
  }

  // ─── Error state ───
  if (error || !place) {
    return <PanoramaError error={error || "Failed to load panorama"} />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <ViewTitle>
        {!isMobile && <PanoramaBackButton />}
        {place.name}
      </ViewTitle>
      <div ref={containerRef} className="psv-container w-full h-full z-10" />

      {/* Info panel — shows place info or marker detail depending on what was tapped */}
      <InfoPanel isOpen={isPanelOpen} onClose={handleClosePanel} content={panelContent} />
    </div>
  );
}
