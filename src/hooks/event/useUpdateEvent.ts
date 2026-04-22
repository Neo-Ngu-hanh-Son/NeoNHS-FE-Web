/**
 * Custom Hook: useUpdateEvent
 * Handles event updates
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { eventService } from '@/services/api/eventService';
import type { UpdateEventRequest, EventResponse } from '@/types/event';

interface UseUpdateEventReturn {
    updateEvent: (id: string, data: UpdateEventRequest, file?: File) => Promise<EventResponse | null>;
    loading: boolean;
}

export function useUpdateEvent(): UseUpdateEventReturn {
    const [loading, setLoading] = useState(false);

    const updateEvent = useCallback(async (
        id: string,
        data: UpdateEventRequest,
        file?: File
    ): Promise<EventResponse | null> => {
        setLoading(true);
        try {
            const response = await eventService.updateEvent(id, data, file);
            if (response.success) {
                message.success('Cập nhật sự kiện thành công');
                return response.data;
            } else {
                message.error(response.message || 'Cập nhật sự kiện thất bại');
                return null;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Cập nhật sự kiện thất bại: ' + (err.message || 'Lỗi không xác định'));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateEvent, loading };
}
