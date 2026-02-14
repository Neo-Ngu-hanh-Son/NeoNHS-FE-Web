/**
 * Custom Hook: useTicketCatalogs
 * Manages ticket catalog data for a specific event
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { ticketCatalogService } from '@/services/api/ticketCatalogService';
import type {
    TicketCatalogResponse,
    CreateTicketCatalogRequest,
    UpdateTicketCatalogRequest,
} from '@/types/ticketCatalog';

interface UseTicketCatalogsReturn {
    catalogs: TicketCatalogResponse[];
    loading: boolean;
    fetchCatalogs: () => Promise<void>;
    createCatalog: (data: CreateTicketCatalogRequest) => Promise<boolean>;
    updateCatalog: (id: string, data: UpdateTicketCatalogRequest) => Promise<boolean>;
    deleteCatalog: (id: string) => Promise<boolean>;
    restoreCatalog: (id: string) => Promise<boolean>;
}

export function useTicketCatalogs(eventId: string): UseTicketCatalogsReturn {
    const [catalogs, setCatalogs] = useState<TicketCatalogResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCatalogs = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);
        try {
            const response = await ticketCatalogService.getByEventId(eventId);
            if (response.success) {
                setCatalogs(response.data);
            } else {
                message.error(response.message || 'Failed to fetch ticket catalogs');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to fetch ticket catalogs: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (eventId) fetchCatalogs();
    }, [eventId, fetchCatalogs]);

    const createCatalog = useCallback(async (data: CreateTicketCatalogRequest): Promise<boolean> => {
        try {
            const response = await ticketCatalogService.create(eventId, data);
            if (response.success) {
                message.success('Ticket type created successfully');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Failed to create ticket type');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to create ticket type: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    const updateCatalog = useCallback(async (id: string, data: UpdateTicketCatalogRequest): Promise<boolean> => {
        try {
            const response = await ticketCatalogService.update(eventId, id, data);
            if (response.success) {
                message.success('Ticket type updated successfully');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Failed to update ticket type');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to update ticket type: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    const deleteCatalog = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await ticketCatalogService.delete(eventId, id);
            if (response.success) {
                message.success('Ticket type deleted successfully');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Failed to delete ticket type');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to delete ticket type: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    const restoreCatalog = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await ticketCatalogService.restore(eventId, id);
            if (response.success) {
                message.success('Ticket type restored successfully');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Failed to restore ticket type');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to restore ticket type: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    return { catalogs, loading, fetchCatalogs, createCatalog, updateCatalog, deleteCatalog, restoreCatalog };
}
