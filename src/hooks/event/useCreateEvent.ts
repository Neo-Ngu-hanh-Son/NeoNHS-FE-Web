/**
 * Custom Hook: useCreateEvent
 * Handles event creation
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { eventService } from '@/services/api/eventService';
import type { CreateEventRequest, EventResponse } from '@/types/event';

interface UseCreateEventReturn {
    createEvent: (data: CreateEventRequest, file?: File) => Promise<EventResponse | null>;
    loading: boolean;
}

export function useCreateEvent(): UseCreateEventReturn {
    const [loading, setLoading] = useState(false);

    const createEvent = useCallback(async (data: CreateEventRequest, file?: File): Promise<EventResponse | null> => {
        setLoading(true);
        try {
            const response = await eventService.createEvent(data, file);
            if (response.success) {
                message.success('Tạo sự kiện thành công');
                return response.data;
            } else {
                message.error(response.message || 'Tạo sự kiện thất bại');
                return null;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Tạo sự kiện thất bại: ' + (err.message || 'Lỗi không xác định'));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createEvent, loading };
}
