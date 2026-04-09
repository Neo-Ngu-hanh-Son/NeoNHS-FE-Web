/**
 * Event Timeline Service
 * API calls for Event Timeline management
 */

import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type {
    EventTimelineResponse,
    CreateEventTimelineRequest,
    UpdateEventTimelineRequest,
    EventPointResponse,
    EventPointTagResponse,
} from '@/types/eventTimeline';

export const eventTimelineService = {
    /**
     * Get all timelines for an event
     */
    getByEventId: async (eventId: string): Promise<ApiResponse<EventTimelineResponse[]>> => {
        return apiClient.get<ApiResponse<EventTimelineResponse[]>>(
            `/admin/events/${eventId}/timelines`
        );
    },

    /**
     * Get a single timeline by ID
     */
    getById: async (eventId: string, id: string): Promise<ApiResponse<EventTimelineResponse>> => {
        return apiClient.get<ApiResponse<EventTimelineResponse>>(
            `/admin/events/${eventId}/timelines/${id}`
        );
    },

    /**
     * Create a new timeline entry
     */
    create: async (
        eventId: string,
        data: CreateEventTimelineRequest
    ): Promise<ApiResponse<EventTimelineResponse>> => {
        return apiClient.post<ApiResponse<EventTimelineResponse>>(
            `/admin/events/${eventId}/timelines`,
            data
        );
    },

    /**
     * Update an existing timeline entry
     */
    update: async (
        eventId: string,
        id: string,
        data: UpdateEventTimelineRequest
    ): Promise<ApiResponse<EventTimelineResponse>> => {
        return apiClient.put<ApiResponse<EventTimelineResponse>>(
            `/admin/events/${eventId}/timelines/${id}`,
            data
        );
    },

    /**
     * Delete a timeline entry
     */
    delete: async (eventId: string, id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(
            `/admin/events/${eventId}/timelines/${id}`
        );
    },

    /**
     * Get all event points for an event (for timeline point creation)
     */
    getEventPoints: async (eventId: string): Promise<ApiResponse<EventPointResponse[]>> => {
        return apiClient.get<ApiResponse<EventPointResponse[]>>(
            `/admin/events/${eventId}/timelines/event-points`
        );
    },

    /**
     * Get all event point tags for an event (for timeline point tag reuse)
     */
    getEventPointTags: async (eventId: string): Promise<ApiResponse<EventPointTagResponse[]>> => {
        return apiClient.get<ApiResponse<EventPointTagResponse[]>>(
            `/admin/events/${eventId}/timelines/point-tags`
        );
    }
};

export default eventTimelineService;
