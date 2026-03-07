/** A single marker / point of interest on the 360° image */
export interface PanoramaHotSpot {
  id: string;
  /** Horizontal angle in radians (or degrees — whatever the API returns) */
  yaw: number;
  /** Vertical angle in radians (or degrees) */
  pitch: number;
  /** Short label shown as a tooltip on hover */
  tooltip: string;
  /** Title displayed in the info panel when the marker is clicked */
  title: string;
  /** Rich description shown in the info panel body */
  description: string;
  /** Optional thumbnail image URL for the marker detail */
  imageUrl?: string;
  isSelected?: boolean; // client-side only field to track if this marker is currently selected
}

/** Place data returned by the backend for the panorama screen */
export interface PanoramaPlace {
  id: string;
  /** Display name of the place */
  name: string;
  /** Formatted address / location string */
  address: string;
  /** Short description of the place (shown on the place-level panel) */
  description: string;
  /** URL of the equirectangular 360° image */
  panoramaImageUrl: string;
  /** Optional thumbnail / cover image */
  thumbnailUrl?: string;
  /** Initial camera orientation */
  defaultYaw?: number;
  defaultPitch?: number;
  /** List of markers rendered on the panorama */
  hotSpots: PanoramaHotSpot[];
}
