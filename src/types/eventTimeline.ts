/**
 * Event Timeline Type Definitions
 */

export interface EventPointTagRequest {
  id?: string | null;
  name?: string;
  description?: string;
  tagColor?: string;
  iconUrl?: string;
  restore?: boolean; // For update operations to indicate if a deleted tag should be restored
}

export interface EventPointRequest {
  id?: string | null;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  address?: string;
  imageUrl?: string;
  eventPointTagId?: string | null;
  eventPointTagRequest?: EventPointTagRequest;
  restore?: boolean; // For update operations to indicate if a deleted point should be restored
}

export interface EventPointTagResponse {
  id?: string;
  name?: string;
  description?: string;
  tagColor?: string;
  iconUrl?: string;
  deletedAt?: string;
}

export interface EventPointResponse {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  imageList?: string;
  imageUrl?: string;
  eventPointTag?: EventPointTagResponse;
  deletedAt?: string;
}

export interface EventTimelineResponse {
  id: string;
  name: string;
  description?: string;
  date: string; // "2026-04-04" (LocalDate)
  startTime: string; // "08:00:00" (LocalTime)
  endTime: string; // "09:30:00" (LocalTime)
  organizer?: string;
  coOrganizer?: string;
  eventId: string;
  eventPoint?: EventPointResponse;
  lunarDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventTimelineRequest {
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  organizer?: string;
  coOrganizer?: string;
  eventPointId?: string | null;
  eventPoint?: EventPointRequest;
}

export interface UpdateEventTimelineRequest {
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  organizer?: string;
  coOrganizer?: string;
  eventPointId?: string | null;
  eventPoint?: EventPointRequest;
}
