import React, { useCallback, useRef, useState, useEffect } from "react";

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A bottom-sheet style info panel that sits above the PSV navbar.
 * - Drag the handle bar down to dismiss
 * - Tap the backdrop to dismiss
 * - Renders React components for content
 */
export default function InfoPanel({ isOpen, onClose }: InfoPanelProps) {
  const [translateY, setTranslateY] = useState(0);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const translateYRef = useRef(0);

  // Reset drag offset when panel opens
  useEffect(() => {
    if (isOpen) {
      setTranslateY(0);
      translateYRef.current = 0;
    }
  }, [isOpen]);

  /* ─── Pointer-based drag handling (works for mouse + touch) ─── */

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientY - startY.current;
    const clamped = Math.max(0, delta); // only allow downward drag
    translateYRef.current = clamped;
    setTranslateY(clamped);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // If dragged past threshold → close, otherwise snap back
    if (translateYRef.current > 80) {
      onClose();
    }
    translateYRef.current = 0;
    setTranslateY(0);
  }, [onClose]);

  return (
    <>
      {/* ── Backdrop: tap outside to close ── */}
      <div
        className={`pano-info-backdrop ${isOpen ? "pano-info-backdrop--visible" : ""}`}
        onClick={onClose}
      />

      {/* ── Panel ── */}
      <div
        className={`pano-info-panel ${isOpen ? "pano-info-panel--open" : ""}`}
        style={{
          transform:
            isDragging.current && translateY > 0 ? `translateY(${translateY}px)` : undefined,
          transition: isDragging.current ? "none" : undefined,
        }}
      >
        {/* Drag handle */}
        <div
          className="pano-info-panel__handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="pano-info-panel__handle-bar" />
        </div>

        {/* Scrollable body — static content for now */}
        <div className="pano-info-panel__body">
          {/* Location header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
              📍
            </div>
            <div>
              <h2 className="text-white text-lg font-bold leading-tight">Alte Nationalgalerie</h2>
              <p className="text-white/50 text-sm">Bodestraße 1-3, 10178 Berlin, Germany</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white/40 text-[11px] uppercase tracking-wide">Built</p>
              <p className="text-white font-semibold mt-0.5">1876</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white/40 text-[11px] uppercase tracking-wide">Style</p>
              <p className="text-white font-semibold text-sm mt-0.5">Neoclassical</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white/40 text-[11px] uppercase tracking-wide">Rating</p>
              <p className="text-white font-semibold mt-0.5">4.7 ⭐</p>
            </div>
          </div>

          {/* About */}
          <div className="mb-5">
            <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1.5">
              About
            </h3>
            <p className="text-white/75 text-sm leading-relaxed">
              The Alte Nationalgalerie (Old National Gallery) is a gallery on Museum Island in
              Berlin showing a collection of Neoclassical, Romantic, Biedermeier, Impressionist and
              early Modernist artwork. The building was designed by Friedrich August Stüler and
              constructed between 1862 and 1876.
            </p>
          </div>

          {/* Opening hours */}
          <div className="mb-5">
            <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">
              Opening Hours
            </h3>
            <div className="space-y-1.5">
              {[
                { day: "Mon", hours: "Closed" },
                { day: "Tue – Fri", hours: "10:00 – 18:00" },
                { day: "Thu", hours: "10:00 – 20:00" },
                { day: "Sat – Sun", hours: "11:00 – 18:00" },
              ].map((row) => (
                <div key={row.day} className="flex justify-between text-sm">
                  <span className="text-white/50">{row.day}</span>
                  <span className={row.hours === "Closed" ? "text-red-400/80" : "text-white"}>
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Admission */}
          <div className="mb-2">
            <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">
              Admission
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-xl font-bold">€12</span>
              <span className="text-white/40 text-sm">/ adult</span>
            </div>
            <p className="text-white/50 text-xs mt-1">
              Free for visitors under 18. Reduced rates available.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
