export interface FormData {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  organizer: string;
  coOrganizer: string;
  destinationName: string;
  destinationAddress: string;
  destinationLatitude: string;
  destinationLongitude: string;
  destinationImageUrl: string;
  destinationMarkerIconUrl: string;
  destinationTagColor: string;
  destinationTagName: string;
  destinationTagDescription: string;

  // id of point and tag for reuse
  eventPointId: string;
  eventPointTagId: string;
}