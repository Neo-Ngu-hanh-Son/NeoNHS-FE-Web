/**
 * Custom Hook: useEvents
 * Manages event list fetching, pagination, delete and restore
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { eventService, EventQueryParams } from '@/services/api/eventService';
import type { EventResponse } from '@/types/event';

interface UseEventsReturn {
    events: EventResponse[];
    loading: boolean;
    totalElements: number;
    totalPages: number;
    fetchEvents: () => Promise<void>;
    deleteEvent: (id: string) => Promise<boolean>;
    restoreEvent: (id: string) => Promise<boolean>;
}

export function useEvents(params: EventQueryParams): UseEventsReturn {
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const paramsRef = useRef<string>('');
    const paramsKey = JSON.stringify(params);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await eventService.getAllEvents(params);
            if (response.success) {
                setEvents(response.data.content);
                setTotalElements(response.data.totalElements);
                setTotalPages(response.data.totalPages);
            } else {
                message.error(response.message || 'Lấy sự kiện thất bạis');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Lấy sự kiện thất bạis: ' + (err.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);

    useEffect(() => {
        if (paramsRef.current !== paramsKey) {
            paramsRef.current = paramsKey;
            fetchEvents();
        }
    }, [paramsKey, fetchEvents]);

    const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await eventService.deleteEvent(id);
            if (response.success) {
                message.success('Xóa sự kiện thành công');
                await fetchEvents();
                return true;
            } else {
                message.error(response.message || 'Xóa sự kiện thất bại');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Xóa sự kiện thất bại: ' + (err.message || 'Lỗi không xác định'));
            return false;
        }
    }, [fetchEvents]);

    const restoreEvent = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await eventService.restoreEvent(id);
            if (response.success) {
                message.success('Khôi phục sự kiện thành công');
                await fetchEvents();
                return true;
            } else {
                message.error(response.message || 'Khôi phục sự kiện thất bại');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Khôi phục sự kiện thất bại: ' + (err.message || 'Lỗi không xác định'));
            return false;
        }
    }, [fetchEvents]);

    return { events, loading, totalElements, totalPages, fetchEvents, deleteEvent, restoreEvent };
}
