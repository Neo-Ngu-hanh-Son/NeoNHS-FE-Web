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
                message.error(response.message || 'Lấy danh mục vé thất bại');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Lấy danh mục vé thất bại: ' + (err.message || 'Lỗi không xác định'));
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
                message.success('Tạo loại vé thành công');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Tạo loại vé thất bại');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Tạo loại vé thất bại: ' + (err.message || 'Lỗi không xác định'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    const updateCatalog = useCallback(async (id: string, data: UpdateTicketCatalogRequest): Promise<boolean> => {
        try {
            const response = await ticketCatalogService.update(eventId, id, data);
            if (response.success) {
                message.success('Cập nhật loại vé thành công');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Cập nhật loại vé thất bại');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Cập nhật loại vé thất bại: ' + (err.message || 'Lỗi không xác định'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    const deleteCatalog = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await ticketCatalogService.delete(eventId, id);
            if (response.success) {
                message.success('Xóa loại vé thành công');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Xóa loại vé thất bại');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Xóa loại vé thất bại: ' + (err.message || 'Lỗi không xác định'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    const restoreCatalog = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await ticketCatalogService.restore(eventId, id);
            if (response.success) {
                message.success('Khôi phục loại vé thành công');
                await fetchCatalogs();
                return true;
            } else {
                message.error(response.message || 'Khôi phục loại vé thất bại');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Khôi phục loại vé thất bại: ' + (err.message || 'Lỗi không xác định'));
            return false;
        }
    }, [eventId, fetchCatalogs]);

    return { catalogs, loading, fetchCatalogs, createCatalog, updateCatalog, deleteCatalog, restoreCatalog };
}
