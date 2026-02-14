/**
 * Custom Hook: useEvent
 * Fetches a single event by ID (includes images for detail view)
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { eventService } from '@/services/api/eventService';
import type { EventResponse } from '@/types/event';

interface UseEventReturn {
    event: EventResponse | null;
    loading: boolean;
    fetchEvent: () => Promise<void>;
}

export function useEvent(id: string): UseEventReturn {
    const [event, setEvent] = useState<EventResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchEvent = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await eventService.getEventById(id);
            if (response.success) {
                setEvent(response.data);
            } else {
                message.error(response.message || 'Failed to fetch event');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to fetch event: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    return { event, loading, fetchEvent };
}
