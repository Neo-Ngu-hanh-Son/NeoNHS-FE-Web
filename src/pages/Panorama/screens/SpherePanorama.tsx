import React, { useCallback, useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { Marker, MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
// CRITICAL: You must import the CSS for the viewer to render properly
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "../styles/panorama.css";
import { useNavigate } from "react-router-dom";
import GetDescriptionHeader, { PulseMarkerHTML } from "../helpers/panoramaHelpers";
import InfoPanel from "../components/InfoPanel";

const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";

type Props = {};
export default function SpherePanorama({}: Props) {
  const navigate = useNavigate();

  // 1. Create a reference to the DOM element
  const containerRef = useRef<HTMLDivElement>(null);
  // 2. Keep track of the viewer instance for cleanup
  const viewerRef = useRef<Viewer | null>(null);

  // Custom info panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const togglePanelRef = useRef<() => void>(() => {});
  togglePanelRef.current = () => setIsPanelOpen((prev) => !prev);
  const handleClosePanel = useCallback(() => setIsPanelOpen(false), []);

  useEffect(() => {
    if (!containerRef.current) return;

    let viewer: Viewer | null = null;
    let frameId: number;

    frameId = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      viewer = new Viewer({
        container: containerRef.current,
        panorama:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Alte_Nationalgalerie%2C_Berlin-Mitte%2C_360_Grad_Panorama%2C_160101%2C_ako.jpg/3840px-Alte_Nationalgalerie%2C_Berlin-Mitte%2C_360_Grad_Panorama%2C_160101%2C_ako.jpg",
        navbar: [
          "zoom",
          "description",
          {
            id: "custom-info",
            title: "Location Info",
            className: "psv-custom-info-button",
            content:
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.25v2.25a.75.75 0 001.5 0V10A.75.75 0 0010 9H9z" clip-rule="evenodd"/></svg>',
            onClick: () => togglePanelRef.current(),
          },
          "caption",
        ],
        plugins: [[MarkersPlugin, {}]],
        minFov: 30,
        maxFov: 120,
        defaultZoomLvl: 50,
        canvasBackground: "#77DD77",
        defaultYaw: 0,
        defaultPitch: 0,
        description:
          GetDescriptionHeader({
            text: "This is a long caption i think Idat quae harum ut quam dolores! Temporaneque quas ipsam, nisi, animi tempora! Sitratione, neque quo, vero minima, tempora! Atvero, nobis, modi, ullam quo velit! ",
          }) +
          `<h1 class="text-white text-xl mb-2">Odioipsa autem unde, velit tempora, quae.</h1>
          Quoaut culpa, sed, laborum quia id. Nisiamet id alias sunt, in sunt. Oditvitae, odio eveniet nihil ut quos. Odioipsa autem unde, velit tempora, quae. Quoaut culpa, sed, laborum quia id. Nisiamet id alias sunt, in sunt. Oditvitae, odio eveniet nihil ut quos. Odioipsa autem unde, velit tempora, quae. 
          <h1 class="text-white text-xl mb-2">Odioipsa autem unde, velit tempora, quae.</h1>
          Quoaut culpa, sed, laborum quia id. Nisiamet id alias sunt, in sunt. Oditvitae, odio eveniet nihil ut quos. Odioipsa autem unde, velit tempora, quae. Quoaut culpa, sed, laborum quia id. Nisiamet id alias sunt, in sunt. Oditvitae, odio eveniet nihil ut quos. `,
        zoomSpeed: 5,
        loadingTxt: "Please wait...",
      });

      viewer.addEventListener("ready", () => {
        console.log("Viewer is ready");
      });

      const markersPlugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      // Test add an animated marker
      markersPlugin.addMarker({
        id: "animated-marker",
        position: { yaw: 0, pitch: 0 },
        content: `Here is the content of the marker, it can be HTML!`,
        anchor: "bottom center",
        tooltip: "Animated marker",
        hoverScale: 1.5,
        size: { width: 32, height: 32 },
        html: PulseMarkerHTML(),
      });
      // Add markers whenever user click on the panorama
      viewer.addEventListener("click", ({ data }) => {
        if (!data.rightclick) {
          markersPlugin.addMarker({
            id: "#" + Math.random(),
            position: { yaw: data.yaw, pitch: data.pitch },
            image: baseUrl + "pictos/pin-red.png",
            size: { width: 32, height: 32 },
            anchor: "bottom center",
            tooltip: "Generated pin",
            data: {
              generated: true,
            },
          });
        }
      });

      /**
       * Delete a generated marker when the user double-clicks on it
       * Or change the image if the user right-clicks on it
       */
      markersPlugin.addEventListener("select-marker", ({ marker, doubleClick, rightClick }) => {
        if (marker.data?.generated) {
          if (doubleClick) {
            markersPlugin.removeMarker(marker.id);
          } else if (rightClick) {
            markersPlugin.updateMarker({
              id: marker.id,
              image: baseUrl + "pictos/pin-blue.png",
            });
          }
        }
      });
      viewerRef.current = viewer;
    });

    return () => {
      cancelAnimationFrame(frameId);
      viewer?.destroy();
      viewerRef.current = null;
    };
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute top-0 left-0 p-4 bg-gradient-to-b from-black to-black/0 z-10 text-white text-center w-full">
        <h1>360° Panorama Viewer</h1>
      </div>
      <div ref={containerRef} className="psv-container w-full h-full z-10" />

      {/* Custom React info panel — sits above the PSV navbar */}
      <InfoPanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </div>
  );
}
