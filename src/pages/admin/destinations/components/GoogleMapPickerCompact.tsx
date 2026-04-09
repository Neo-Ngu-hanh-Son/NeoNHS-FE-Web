import type { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Map as MapIcon, AlertTriangle, Check, Loader2, X } from 'lucide-react';
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';

interface PlaceSearchResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
  photoUrl?: string;
}

export interface GoogleMapSelectedPoint {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
  placeId?: string;
  photoUrl?: string;
  types?: string[];
}

interface GoogleMapPickerProps {
  apiLoading: boolean;
  apiError: string | null;
  mapRef: RefObject<HTMLDivElement | null>;
  onPlaceSelect: (place: PlaceSearchResult) => void;
  error: string | null;
  selectedPoint: GoogleMapSelectedPoint | null;
  geocoding: boolean;
  processingImage: boolean;
  onConfirmSelection: () => void;
  onDiscardSelection: () => void;
  onClose: () => void; // Kept in interface in case the parent relies on it, but removed from UI
}

export default function GoogleMapPickerCompact({
  apiLoading,
  apiError,
  mapRef,
  onPlaceSelect,
  error,
  selectedPoint,
  geocoding,
  processingImage,
  onConfirmSelection,
  onDiscardSelection,
}: GoogleMapPickerProps) {
  return (
    <div className="h-full flex flex-col relative bg-slate-100 rounded-b-lg overflow-hidden">
      {/* Loading State */}
      {apiLoading && (
        <div className="absolute inset-0 z-[50] bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Waking up Google Engine...</p>
        </div>
      )}

      {/* Error State */}
      {apiError && (
        <div className="absolute inset-0 z-[50] bg-white flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Google Maps Failed to Load</h3>
          <p className="text-sm text-slate-500 mb-4">{apiError}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      )}

      {/* The Map */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Overlay: Search Bar */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-[10] sm:w-[400px]">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 overflow-hidden transition-shadow hover:shadow-lg">
          <GooglePlacesAutocomplete onPlaceSelect={onPlaceSelect} className="w-full border-none shadow-none" />
        </div>
      </div>

      {/* Overlay: Error Toast */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[10] w-[90%] max-w-[400px] animate-in fade-in slide-in-from-top-4">
          <div className="bg-red-50/95 backdrop-blur-md border border-red-200 py-2 px-4 rounded-lg shadow-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-xs font-semibold text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Overlay: Selection Details */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 right-4 z-[10] flex justify-center animate-in slide-in-from-bottom-6 duration-300 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-xl w-full max-w-2xl pointer-events-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Left: Thumbnail */}
              <div className="relative shrink-0 w-full sm:w-16 h-32 sm:h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                {selectedPoint.photoUrl ? (
                  <img src={selectedPoint.photoUrl} alt="Location" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 opacity-40">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
                {geocoding && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  </div>
                )}
              </div>

              {/* Middle: Details */}
              <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h4 className="text-base font-bold text-slate-800 truncate">{selectedPoint.name}</h4>
                  {selectedPoint.placeId && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 shrink-0">
                      POI
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mb-2.5">{selectedPoint.address}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <div className="px-2 py-1 bg-slate-100 rounded flex items-center gap-1">
                    <MapIcon className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-mono font-medium text-slate-600">
                      {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}
                    </span>
                  </div>
                  {selectedPoint.types && selectedPoint.types.length > 0 && (
                    <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-tight bg-indigo-50 px-2 py-1 rounded">
                      {selectedPoint.types[0].replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-row sm:flex-col w-full sm:w-auto gap-2 shrink-0 mt-2 sm:mt-0">
                <Button
                  onClick={onConfirmSelection}
                  disabled={geocoding || processingImage}
                  className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {processingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1.5" />
                      Select
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onDiscardSelection}
                  className="flex-[0.5] sm:flex-none h-10 px-3 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  title="Discard Selection"
                >
                  <X className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Discard</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
