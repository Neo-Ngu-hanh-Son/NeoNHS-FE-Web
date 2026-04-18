/**
 * Event Service
 * API calls for Event management
 */

import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type {
    EventResponse,
    EventImageResponse,
    CreateEventRequest,
    UpdateEventRequest,
    EventStatus,
    PagedEventResponse,
} from '@/types/event';

export interface EventQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    status?: EventStatus;
    name?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    tagIds?: string[];
    deleted?: boolean;
    includeDeleted?: boolean;
}

export const eventService = {
    /**
     * Get all events with pagination and optional filters
     */
    getAllEvents: async (params: EventQueryParams = {}): Promise<ApiResponse<PagedEventResponse>> => {
        const query = new URLSearchParams();

        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);

        if (params.status) query.append('status', params.status);
        if (params.name) query.append('name', params.name);
        if (params.location) query.append('location', params.location);
        if (params.startDate) query.append('startDate', params.startDate);
        if (params.endDate) query.append('endDate', params.endDate);
        if (params.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
        if (params.tagIds && params.tagIds.length > 0) {
            params.tagIds.forEach(id => query.append('tagIds', id));
        }
        if (params.deleted !== undefined) query.append('deleted', params.deleted.toString());
        if (params.includeDeleted !== undefined) query.append('includeDeleted', params.includeDeleted.toString());

        const queryString = query.toString();
        const url = queryString ? `/admin/events?${queryString}` : '/admin/events';

        return apiClient.get<ApiResponse<PagedEventResponse>>(url);
    },

    /**
     * Get a single event by ID (includes images album)
     */
    getEventById: async (id: string): Promise<ApiResponse<EventResponse>> => {
        return apiClient.get<ApiResponse<EventResponse>>(`/admin/events/${id}`);
    },

    /**
     * Create a new event
     */
    createEvent: async (data: CreateEventRequest, file?: File): Promise<ApiResponse<EventResponse>> => {
        const formData = new FormData();
        formData.append('event', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (file) {
            formData.append('thumbnail', file);
        }
        return apiClient.post<ApiResponse<EventResponse>>('/admin/events', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    /**
     * Update an existing event
     */
    updateEvent: async (id: string, data: UpdateEventRequest, file?: File): Promise<ApiResponse<EventResponse>> => {
        const formData = new FormData();
        formData.append('event', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (file) {
            formData.append('thumbnail', file);
        }
        return apiClient.put<ApiResponse<EventResponse>>(`/admin/events/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    /**
     * Soft delete an event
     */
    deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/events/${id}`);
    },

    /**
     * Restore a soft-deleted event
     */
    restoreEvent: async (id: string): Promise<ApiResponse<EventResponse>> => {
        return apiClient.patch<ApiResponse<EventResponse>>(`/admin/events/${id}/restore`);
    },

    /**
     * Permanently delete an event (cannot be restored)
     */
    permanentDeleteEvent: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/events/${id}/permanent`);
    },

    // ─── Gallery Management ────────────────────────────────────────────

    /**
     * Get all images for an event
     */
    getEventImages: async (eventId: string): Promise<ApiResponse<EventImageResponse[]>> => {
        return apiClient.get<ApiResponse<EventImageResponse[]>>(`/admin/events/${eventId}/images`);
    },

    /**
     * Upload one or more images to an event gallery
     */
    uploadEventImages: async (eventId: string, files: File[]): Promise<ApiResponse<EventImageResponse[]>> => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        return apiClient.post<ApiResponse<EventImageResponse[]>>(`/admin/events/${eventId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * Delete a single image from an event gallery
     */
    deleteEventImage: async (eventId: string, imageId: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/events/${eventId}/images/${imageId}`);
    },

    /**
     * Delete multiple images from an event gallery
     */
    deleteMultipleEventImages: async (eventId: string, imageIds: string[]): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/events/${eventId}/images`, {
            data: imageIds,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    /**
     * Set an image as the event thumbnail
     */
    setEventThumbnail: async (eventId: string, imageId: string): Promise<ApiResponse<EventImageResponse>> => {
        return apiClient.patch<ApiResponse<EventImageResponse>>(`/admin/events/${eventId}/images/${imageId}/set-thumbnail`);
    },
};

export default eventService;
