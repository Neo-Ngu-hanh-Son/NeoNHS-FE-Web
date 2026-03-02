import React, { useCallback, useRef, useState, useEffect } from "react";

export interface InfoPanelContent {
  /** Panel heading */
  title: string;
  /** Sub-heading (e.g. address) */
  subtitle?: string;
  /** Body text / description */
  description: string;
  /** Optional image shown above the description */
  imageUrl?: string;
}

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Dynamic content to display. Falls back to a placeholder when omitted. */
  content?: InfoPanelContent;
}

/**
 * A bottom-sheet style info panel that sits above the PSV navbar.
 * - Drag the handle bar down to dismiss
 * - Tap the backdrop to dismiss
 * - Renders React components for content
 */
export default function InfoPanel({ isOpen, onClose, content }: InfoPanelProps) {
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
        className={`pano-info-backdrop ${isOpen ? "pano-info-backdrop--visible" : "hidden"}`}
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

        {/* Scrollable body */}
        <div className="pano-info-panel__body">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
              📍
            </div>
            <div>
              <h2 className="text-white text-lg font-bold leading-tight">
                {content?.title ?? "Unknown Place"}
              </h2>
              {content?.subtitle && <p className="text-white/50 text-sm">{content.subtitle}</p>}
            </div>
          </div>

          {/* Optional image */}
          {content?.imageUrl && (
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}

          {/* Description */}
          <p className="text-white/75 text-sm leading-relaxed">
            {content?.description ?? "No description available."}
          </p>
        </div>
      </div>
    </>
  );
}
