/**
 * Ticket Catalog Service
 * API calls for Ticket Catalog management
 */

import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type {
    TicketCatalogResponse,
    CreateTicketCatalogRequest,
    UpdateTicketCatalogRequest,
} from '@/types/ticketCatalog';

export const ticketCatalogService = {
    /**
     * Get all ticket catalogs for an event (includes deleted)
     */
    getByEventId: async (eventId: string): Promise<ApiResponse<TicketCatalogResponse[]>> => {
        return apiClient.get<ApiResponse<TicketCatalogResponse[]>>(
            `/admin/events/${eventId}/ticket-catalogs`
        );
    },

    /**
     * Get a single ticket catalog by ID
     */
    getById: async (eventId: string, id: string): Promise<ApiResponse<TicketCatalogResponse>> => {
        return apiClient.get<ApiResponse<TicketCatalogResponse>>(
            `/admin/events/${eventId}/ticket-catalogs/${id}`
        );
    },

    /**
     * Create a new ticket catalog
     */
    create: async (
        eventId: string,
        data: CreateTicketCatalogRequest
    ): Promise<ApiResponse<TicketCatalogResponse>> => {
        return apiClient.post<ApiResponse<TicketCatalogResponse>>(
            `/admin/events/${eventId}/ticket-catalogs`,
            data
        );
    },

    /**
     * Update an existing ticket catalog
     */
    update: async (
        eventId: string,
        id: string,
        data: UpdateTicketCatalogRequest
    ): Promise<ApiResponse<TicketCatalogResponse>> => {
        return apiClient.put<ApiResponse<TicketCatalogResponse>>(
            `/admin/events/${eventId}/ticket-catalogs/${id}`,
            data
        );
    },

    /**
     * Soft delete a ticket catalog
     */
    delete: async (eventId: string, id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(
            `/admin/events/${eventId}/ticket-catalogs/${id}`
        );
    },

    /**
     * Restore a soft-deleted ticket catalog
     */
    restore: async (eventId: string, id: string): Promise<ApiResponse<TicketCatalogResponse>> => {
        return apiClient.patch<ApiResponse<TicketCatalogResponse>>(
            `/admin/events/${eventId}/ticket-catalogs/${id}/restore`
        );
    },

    /**
     * Permanently delete a ticket catalog (cannot be restored)
     */
    permanentDelete: async (eventId: string, id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(
            `/admin/events/${eventId}/ticket-catalogs/${id}/permanent`
        );
    },
};

export default ticketCatalogService;
