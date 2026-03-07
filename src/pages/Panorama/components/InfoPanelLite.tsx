interface InfoPanelLiteProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Lightweight info panel for mobile.
 * No drag-to-dismiss, no pointer tracking, no backdrop-filter.
 * Just a simple toggle panel with tap-outside-to-close.
 */
export default function InfoPanelLite({ isOpen, onClose }: InfoPanelLiteProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — tap to close */}
      <div className="pano-lite-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="pano-lite-panel">
        {/* Handle bar (visual only, no drag) */}
        <div className="pano-lite-handle" onClick={onClose}>
          <div className="pano-lite-handle-bar" />
        </div>

        {/* Scrollable body */}
        <div className="pano-lite-body">
          {/* Location header */}
          <div className="pano-lite-header">
            <span className="pano-lite-icon">📍</span>
            <div>
              <h2 className="pano-lite-title">Alte Nationalgalerie</h2>
              <p className="pano-lite-subtitle">
                Bodestraße 1-3, 10178 Berlin, Germany
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="pano-lite-stats">
            <div className="pano-lite-stat">
              <span className="pano-lite-stat-label">Built</span>
              <span className="pano-lite-stat-value">1876</span>
            </div>
            <div className="pano-lite-stat">
              <span className="pano-lite-stat-label">Style</span>
              <span className="pano-lite-stat-value">Neoclassical</span>
            </div>
            <div className="pano-lite-stat">
              <span className="pano-lite-stat-label">Rating</span>
              <span className="pano-lite-stat-value">4.7 ⭐</span>
            </div>
          </div>

          {/* About */}
          <div className="pano-lite-section">
            <h3 className="pano-lite-section-title">About</h3>
            <p className="pano-lite-text">
              The Alte Nationalgalerie (Old National Gallery) is a gallery on
              Museum Island in Berlin showing a collection of Neoclassical,
              Romantic, Biedermeier, Impressionist and early Modernist artwork.
            </p>
          </div>

          {/* Opening hours */}
          <div className="pano-lite-section">
            <h3 className="pano-lite-section-title">Opening Hours</h3>
            <div className="pano-lite-hours">
              <div className="pano-lite-hour-row">
                <span>Mon</span>
                <span className="pano-lite-closed">Closed</span>
              </div>
              <div className="pano-lite-hour-row">
                <span>Tue – Fri</span>
                <span>10:00 – 18:00</span>
              </div>
              <div className="pano-lite-hour-row">
                <span>Thu</span>
                <span>10:00 – 20:00</span>
              </div>
              <div className="pano-lite-hour-row">
                <span>Sat – Sun</span>
                <span>11:00 – 18:00</span>
              </div>
            </div>
          </div>

          {/* Admission */}
          <div className="pano-lite-section">
            <h3 className="pano-lite-section-title">Admission</h3>
            <p className="pano-lite-text">
              <strong style={{ fontSize: "1.1rem" }}>€12</strong>{" "}
              <span style={{ opacity: 0.5 }}>/ adult</span>
            </p>
            <p className="pano-lite-text" style={{ fontSize: "0.7rem", opacity: 0.5 }}>
              Free for visitors under 18. Reduced rates available.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
