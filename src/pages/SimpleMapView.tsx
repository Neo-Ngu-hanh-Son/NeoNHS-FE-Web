import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ngu Hanh Son mountain coordinates (Marble Mountains, Da Nang, Vietnam)
const NGU_HANH_SON_LAT = 15.9989;
const NGU_HANH_SON_LNG = 108.2644;

interface ClickedLocation {
  lat: number;
  lng: number;
}

interface RoutePoint {
  id: string;
  lat: number;
  lng: number;
  description: string;
}

interface Route {
  id: string;
  name: string;
  points: RoutePoint[];
  createdAt: string;
}

// Custom icons
const clickMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const routeMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const createModeMarkerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// LocalStorage key
const ROUTES_STORAGE_KEY = 'simple-map-routes';

// Helper functions for localStorage
const loadRoutes = (): Route[] => {
  try {
    const saved = localStorage.getItem(ROUTES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveRoutes = (routes: Route[]) => {
  localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
};

export function SimpleMapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clickMarkerRef = useRef<L.Marker | null>(null);
  const routeMarkersRef = useRef<L.Marker[]>([]);
  const createModeMarkersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [copied, setCopied] = useState(false);

  // Search state
  const [searchCoords, setSearchCoords] = useState('');
  const [searchError, setSearchError] = useState('');

  // Routes state
  const [showRoutesPanel, setShowRoutesPanel] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [createModePoints, setCreateModePoints] = useState<RoutePoint[]>([]);
  const [newRouteName, setNewRouteName] = useState('');
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [contextMenuPoint, setContextMenuPoint] = useState<{ x: number; y: number; pointId: string } | null>(null);
  const [descriptionInput, setDescriptionInput] = useState('');

  // Load routes from localStorage on mount
  useEffect(() => {
    setRoutes(loadRoutes());
  }, []);

  // Clear route markers from map
  const clearRouteMarkers = useCallback(() => {
    routeMarkersRef.current.forEach(marker => marker.remove());
    routeMarkersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
  }, []);

  // Clear create mode markers
  const clearCreateModeMarkers = useCallback(() => {
    createModeMarkersRef.current.forEach(marker => marker.remove());
    createModeMarkersRef.current = [];
  }, []);

  // Display route on map
  const displayRoute = useCallback((route: Route) => {
    if (!mapRef.current) return;

    clearRouteMarkers();

    const latlngs: L.LatLngExpression[] = [];

    route.points.forEach((point, index) => {
      const marker = L.marker([point.lat, point.lng], { icon: routeMarkerIcon }).addTo(mapRef.current!);
      marker.bindPopup(`<b>Point ${index + 1}</b><br>${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}${point.description ? `<br><i>${point.description}</i>` : ''}`);
      routeMarkersRef.current.push(marker);
      latlngs.push([point.lat, point.lng]);
    });

    if (latlngs.length > 1) {
      polylineRef.current = L.polyline(latlngs, { color: '#3b82f6', weight: 3, opacity: 0.8 }).addTo(mapRef.current);
    }

    if (latlngs.length > 0) {
      const bounds = L.latLngBounds(latlngs as L.LatLngExpression[]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [clearRouteMarkers]);

  // Update create mode markers on map
  const updateCreateModeMarkers = useCallback(() => {
    if (!mapRef.current) return;

    clearCreateModeMarkers();

    createModePoints.forEach((point, index) => {
      const marker = L.marker([point.lat, point.lng], { icon: createModeMarkerIcon }).addTo(mapRef.current!);
      marker.bindPopup(`<b>Point ${index + 1}</b><br>${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}${point.description ? `<br><i>${point.description}</i>` : ''}`);
      createModeMarkersRef.current.push(marker);
    });
  }, [createModePoints, clearCreateModeMarkers]);

  useEffect(() => {
    if (isCreateMode) {
      updateCreateModeMarkers();
    }
  }, [isCreateMode, createModePoints, updateCreateModeMarkers]);

  // Map click handler - needs to be a ref to avoid stale closure
  const isCreateModeRef = useRef(isCreateMode);
  isCreateModeRef.current = isCreateMode;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(
      [NGU_HANH_SON_LAT, NGU_HANH_SON_LNG],
      15
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 22,
      maxNativeZoom: 19,
    }).addTo(map);

    // Left click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isCreateModeRef.current) {
        // In create mode, add point to route
        const newPoint: RoutePoint = {
          id: Date.now().toString(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          description: '',
        };
        setCreateModePoints(prev => [...prev, newPoint]);
      } else {
        // Normal mode - show clicked location
        if (clickMarkerRef.current) {
          clickMarkerRef.current.remove();
        }

        const newMarker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: clickMarkerIcon,
        }).addTo(map);

        newMarker.bindPopup(
          `<b>Selected Location</b><br>Lat: ${e.latlng.lat.toFixed(6)}<br>Lng: ${e.latlng.lng.toFixed(6)}`
        ).openPopup();
        clickMarkerRef.current = newMarker;

        setClickedLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        setCopied(false);
      }
    });

    // Add initial marker for Ngu Hanh Son
    const marker = L.marker([NGU_HANH_SON_LAT, NGU_HANH_SON_LNG]).addTo(map);
    marker.bindPopup('<b>Ngũ Hành Sơn</b><br>Marble Mountains').openPopup();

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleCopyCoordinates = async () => {
    if (!clickedLocation) return;

    const coordText = `${clickedLocation.lat.toFixed(6)}, ${clickedLocation.lng.toFixed(6)}`;
    try {
      await navigator.clipboard.writeText(coordText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy coordinates:', err);
    }
  };

  const handleClosePopup = () => {
    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove();
      clickMarkerRef.current = null;
    }
    setClickedLocation(null);
    setCopied(false);
  };

  const handleSearch = () => {
    setSearchError('');

    const coordMatch = searchCoords.trim().match(/^([\-\d.]+)[,\s]+([\-\d.]+)$/);

    if (!coordMatch) {
      setSearchError('Use format: lat, lng');
      return;
    }

    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);

    if (isNaN(lat) || isNaN(lng)) {
      setSearchError('Invalid numbers');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setSearchError('Coords out of range');
      return;
    }

    if (!mapRef.current) return;

    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove();
    }

    mapRef.current.flyTo([lat, lng], 20, {
      animate: false
    });

    const newMarker = L.marker([lat, lng], { icon: clickMarkerIcon }).addTo(mapRef.current);
    newMarker.bindPopup(`<b>Searched Location</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`).openPopup();

    clickMarkerRef.current = newMarker;
    setClickedLocation({ lat, lng });
    setCopied(false);
  };

  // Route management functions
  const handleEnterCreateMode = () => {
    setIsCreateMode(true);
    setCreateModePoints([]);
    setNewRouteName('');
    clearRouteMarkers();
    setSelectedRoute(null);
    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove();
      clickMarkerRef.current = null;
    }
    setClickedLocation(null);
  };

  const handleExitCreateMode = () => {
    setIsCreateMode(false);
    setCreateModePoints([]);
    setNewRouteName('');
    clearCreateModeMarkers();
    setEditingRoute(null);
  };

  const handleSaveRoute = () => {
    if (createModePoints.length === 0) return;

    const routeName = newRouteName.trim() || `Route ${routes.length + 1}`;

    if (editingRoute) {
      // Update existing route
      const updatedRoutes = routes.map(r =>
        r.id === editingRoute.id
          ? { ...r, name: routeName, points: createModePoints }
          : r
      );
      setRoutes(updatedRoutes);
      saveRoutes(updatedRoutes);
    } else {
      // Create new route
      const newRoute: Route = {
        id: Date.now().toString(),
        name: routeName,
        points: createModePoints,
        createdAt: new Date().toISOString(),
      };
      const updatedRoutes = [...routes, newRoute];
      setRoutes(updatedRoutes);
      saveRoutes(updatedRoutes);
    }

    handleExitCreateMode();
  };

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route);
    displayRoute(route);
    setIsCreateMode(false);
    clearCreateModeMarkers();
  };

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route);
    setIsCreateMode(true);
    setCreateModePoints([...route.points]);
    setNewRouteName(route.name);
    clearRouteMarkers();
    setSelectedRoute(null);
  };

  const handleDeleteRoute = (routeId: string) => {
    const updatedRoutes = routes.filter(r => r.id !== routeId);
    setRoutes(updatedRoutes);
    saveRoutes(updatedRoutes);
    if (selectedRoute?.id === routeId) {
      setSelectedRoute(null);
      clearRouteMarkers();
    }
  };

  const handleDeselectRoute = () => {
    setSelectedRoute(null);
    clearRouteMarkers();
  };

  // Right-click context menu for adding description
  const handlePointRightClick = (e: React.MouseEvent, pointId: string) => {
    e.preventDefault();
    const point = createModePoints.find(p => p.id === pointId);
    setContextMenuPoint({ x: e.clientX, y: e.clientY, pointId });
    setDescriptionInput(point?.description || '');
  };

  const handleSaveDescription = () => {
    if (!contextMenuPoint) return;
    setCreateModePoints(prev =>
      prev.map(p =>
        p.id === contextMenuPoint.pointId
          ? { ...p, description: descriptionInput }
          : p
      )
    );
    setContextMenuPoint(null);
    setDescriptionInput('');
  };

  const handleRemovePoint = (pointId: string) => {
    setCreateModePoints(prev => prev.filter(p => p.id !== pointId));
  };

  return (
    <div className="simple-map-view">
      <style>
        {`
        .simple-map-view {
          width: 100%;
          height: 100vh;
          position: relative;
          font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .map-container {
          width: 100%;
          height: 100%;
        }

        /* Search Panel - Compact */
        .search-panel {
          position: absolute;
          top: 10px;
          left: 50px;
          z-index: 999;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 10px;
          padding: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .search-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .search-input {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 8px 12px;
          color: #fff;
          font-size: 0.85rem;
          font-family: 'Fira Code', 'Monaco', monospace;
          width: 180px;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .search-button, .btn {
          padding: 8px 12px;
          background: #3b82f6;
          border: none;
          border-radius: 6px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .search-button:hover, .btn:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #475569;
        }

        .btn-secondary:hover {
          background: #64748b;
        }

        .btn-success {
          background: #10b981;
        }

        .btn-success:hover {
          background: #059669;
        }

        .btn-danger {
          background: #ef4444;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 0.75rem;
        }

        .search-error {
          margin-top: 6px;
          padding: 6px 10px;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          color: #fca5a5;
          font-size: 0.75rem;
        }

        /* Routes Panel */
        .routes-toggle {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
        }

        .routes-panel {
          position: absolute;
          top: 50px;
          right: 10px;
          z-index: 999;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          width: 320px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
        }

        .routes-panel h3 {
          color: #fff;
          font-size: 1rem;
          margin: 0 0 12px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .route-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .route-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 10px 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }

        .route-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .route-item.active {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.15);
        }

        .route-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .route-item-name {
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .route-item-meta {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
          margin-top: 4px;
        }

        .route-item-actions {
          display: flex;
          gap: 4px;
        }

        /* Create Mode */
        .create-mode-banner {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1001;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 10px 20px;
          border-radius: 20px;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        }

        .create-mode-panel {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          min-width: 400px;
        }

        .create-mode-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .create-mode-header h4 {
          color: #fff;
          margin: 0;
          font-size: 0.95rem;
        }

        .route-name-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 10px 12px;
          color: #fff;
          font-size: 0.9rem;
          margin-bottom: 12px;
          outline: none;
        }

        .route-name-input:focus {
          border-color: #10b981;
        }

        .points-list {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 12px;
        }

        .point-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 6px;
          color: #fff;
          font-size: 0.85rem;
          font-family: 'Fira Code', monospace;
        }

        .point-item-content {
          flex: 1;
        }

        .point-item-coords {
          color: #10b981;
        }

        .point-item-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          font-style: italic;
          margin-top: 2px;
          font-family: inherit;
        }

        .point-item-actions {
          display: flex;
          gap: 4px;
          margin-left: 8px;
        }

        .create-mode-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        /* Context Menu */
        .context-menu {
          position: fixed;
          z-index: 2000;
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(12px);
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          min-width: 250px;
        }

        .context-menu h5 {
          color: #fff;
          margin: 0 0 8px 0;
          font-size: 0.85rem;
        }

        .context-menu input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 8px 10px;
          color: #fff;
          font-size: 0.85rem;
          margin-bottom: 8px;
          outline: none;
        }

        .context-menu-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        /* Selected Route Panel */
        .selected-route-panel {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          min-width: 350px;
          max-width: 500px;
        }

        .selected-route-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .selected-route-header h4 {
          color: #fff;
          margin: 0;
          font-size: 1rem;
        }

        .selected-route-points {
          max-height: 200px;
          overflow-y: auto;
        }

        .selected-point-item {
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 6px;
          color: #fff;
          font-size: 0.85rem;
        }

        .selected-point-coords {
          font-family: 'Fira Code', monospace;
          color: #3b82f6;
        }

        .selected-point-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          margin-top: 2px;
        }

        /* Coordinate Popup */
        .coordinate-popup {
          position: fixed;
          bottom: 32px;
          left: 20px;
          z-index: 1001;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 16px 20px;
          min-width: 280px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .popup-title {
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          width: 24px;
          height: 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .coordinates-display {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 12px;
        }

        .coord-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
        }

        .coord-row:first-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .coord-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        .coord-value {
          color: #10b981;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Fira Code', monospace;
        }

        .copy-button {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .copy-button.copied {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }

        .empty-state {
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          padding: 20px;
          font-size: 0.85rem;
        }

        /* Leaflet Overrides */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
        }

        .leaflet-control-zoom a {
          background: rgba(15, 23, 42, 0.95) !important;
          color: #fff !important;
          border: none !important;
        }

        .leaflet-control-zoom a:hover {
          background: rgba(30, 41, 59, 0.95) !important;
        }
      `}
      </style>

      {/* Search Panel - hidden in create mode */}
      {!isCreateMode && (
        <div className="search-panel">
          <div className="search-row">
            <input
              type="text"
              className="search-input"
              placeholder="lat, lng"
              value={searchCoords}
              onChange={(e) => setSearchCoords(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>Go</button>
          </div>
          {searchError && <div className="search-error">{searchError}</div>}
        </div>
      )}

      {/* Routes Toggle Button */}
      <div className="routes-toggle">
        <button
          className={`btn ${showRoutesPanel ? 'btn-secondary' : ''}`}
          onClick={() => setShowRoutesPanel(!showRoutesPanel)}
        >
          {showRoutesPanel ? '✕ Close' : '🗺️ My Routes'}
        </button>
      </div>

      {/* Routes Panel */}
      {showRoutesPanel && !isCreateMode && (
        <div className="routes-panel">
          <h3>📍 My Routes</h3>

          <button className="btn btn-success" onClick={handleEnterCreateMode} style={{ width: '100%', marginBottom: '12px' }}>
            + Create New Route
          </button>

          {routes.length === 0 ? (
            <div className="empty-state">No routes yet. Create your first route!</div>
          ) : (
            <div className="route-list">
              {routes.map(route => (
                <div
                  key={route.id}
                  className={`route-item ${selectedRoute?.id === route.id ? 'active' : ''}`}
                  onClick={() => handleSelectRoute(route)}
                >
                  <div className="route-item-header">
                    <span className="route-item-name">{route.name}</span>
                    <div className="route-item-actions" onClick={e => e.stopPropagation()}>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleEditRoute(route)}>✎</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRoute(route.id)}>✕</button>
                    </div>
                  </div>
                  <div className="route-item-meta">{route.points.length} points</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Mode Banner */}
      {isCreateMode && (
        <div className="create-mode-banner">
          🚀 Route Creation Mode - Click on map to add points
        </div>
      )}

      {/* Create Mode Panel */}
      {isCreateMode && (
        <div className="create-mode-panel">
          <div className="create-mode-header">
            <h4>{editingRoute ? `Editing: ${editingRoute.name}` : 'New Route'}</h4>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              Right-click on point for description
            </span>
          </div>

          <input
            type="text"
            className="route-name-input"
            placeholder="Route name..."
            value={newRouteName}
            onChange={(e) => setNewRouteName(e.target.value)}
          />

          {createModePoints.length === 0 ? (
            <div className="empty-state">Click on the map to add points</div>
          ) : (
            <div className="points-list">
              {createModePoints.map((point, index) => (
                <div
                  key={point.id}
                  className="point-item"
                  onContextMenu={(e) => handlePointRightClick(e, point.id)}
                >
                  <div className="point-item-content">
                    <div className="point-item-coords">
                      {index + 1}. {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                    </div>
                    {point.description && (
                      <div className="point-item-desc">{point.description}</div>
                    )}
                  </div>
                  <div className="point-item-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={(e) => { e.stopPropagation(); handlePointRightClick(e, point.id); }}
                      title="Add description"
                    >
                      💬
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemovePoint(point.id)}
                      title="Remove point"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="create-mode-actions">
            <button className="btn btn-secondary" onClick={handleExitCreateMode}>Cancel</button>
            <button
              className="btn btn-success"
              onClick={handleSaveRoute}
              disabled={createModePoints.length === 0}
            >
              💾 Save Route
            </button>
          </div>
        </div>
      )}

      {/* Context Menu for Description */}
      {contextMenuPoint && (
        <div
          className="context-menu"
          style={{ left: contextMenuPoint.x, top: contextMenuPoint.y }}
        >
          <h5>📝 Add Description</h5>
          <input
            type="text"
            placeholder="Enter description..."
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveDescription()}
            autoFocus
          />
          <div className="context-menu-actions">
            <button className="btn btn-sm btn-secondary" onClick={() => setContextMenuPoint(null)}>Cancel</button>
            <button className="btn btn-sm btn-success" onClick={handleSaveDescription}>Save</button>
          </div>
        </div>
      )}

      {/* Selected Route View */}
      {selectedRoute && !isCreateMode && (
        <div className="selected-route-panel">
          <div className="selected-route-header">
            <h4>📍 {selectedRoute.name}</h4>
            <button className="btn btn-sm btn-secondary" onClick={handleDeselectRoute}>Close</button>
          </div>
          <div className="selected-route-points">
            {selectedRoute.points.map((point, index) => (
              <div key={point.id} className="selected-point-item">
                <div className="selected-point-coords">
                  {index + 1}. {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                </div>
                {point.description && (
                  <div className="selected-point-desc">({point.description})</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="map-container" />

      {/* Coordinate Popup - only show when not in create mode and no route selected */}
      {clickedLocation && !isCreateMode && !selectedRoute && (
        <div className="coordinate-popup">
          <div className="popup-header">
            <h3 className="popup-title">📍 Location</h3>
            <button className="close-button" onClick={handleClosePopup}>×</button>
          </div>
          <div className="coordinates-display">
            <div className="coord-row">
              <span className="coord-label">Latitude</span>
              <span className="coord-value">{clickedLocation.lat.toFixed(6)}</span>
            </div>
            <div className="coord-row">
              <span className="coord-label">Longitude</span>
              <span className="coord-value">{clickedLocation.lng.toFixed(6)}</span>
            </div>
          </div>
          <button
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopyCoordinates}
          >
            {copied ? '✓ Copied!' : '📋 Copy Coordinates'}
          </button>
        </div>
      )}
    </div>
  );
}

export default SimpleMapView;
