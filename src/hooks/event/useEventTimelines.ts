/**
 * Custom Hook: useEventTimelines
 * Manages event timeline data for a specific event
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { eventTimelineService } from '@/services/api/eventTimelineService';
import type {
    EventTimelineResponse,
    CreateEventTimelineRequest,
    UpdateEventTimelineRequest,
} from '@/types/eventTimeline';

interface UseEventTimelinesReturn {
    timelines: EventTimelineResponse[];
    loading: boolean;
    fetchTimelines: () => Promise<void>;
    createTimeline: (data: CreateEventTimelineRequest) => Promise<boolean>;
    updateTimeline: (id: string, data: UpdateEventTimelineRequest) => Promise<boolean>;
    deleteTimeline: (id: string) => Promise<boolean>;
}

export function useEventTimelines(eventId: string): UseEventTimelinesReturn {
    const [timelines, setTimelines] = useState<EventTimelineResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTimelines = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);
        try {
            const response = await eventTimelineService.getByEventId(eventId);
            if (response.success) {
                setTimelines(response.data);
            } else {
                message.error(response.message || 'Failed to fetch timelines');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to fetch timelines: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (eventId) fetchTimelines();
    }, [eventId, fetchTimelines]);

    const createTimeline = useCallback(async (data: CreateEventTimelineRequest): Promise<boolean> => {
        try {
            const response = await eventTimelineService.create(eventId, data);
            if (response.success) {
                message.success('Timeline entry created successfully');
                await fetchTimelines();
                return true;
            } else {
                message.error(response.message || 'Failed to create timeline entry');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to create timeline entry: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [eventId, fetchTimelines]);

    const updateTimeline = useCallback(async (id: string, data: UpdateEventTimelineRequest): Promise<boolean> => {
        try {
            const response = await eventTimelineService.update(eventId, id, data);
            if (response.success) {
                message.success('Timeline entry updated successfully');
                await fetchTimelines();
                return true;
            } else {
                message.error(response.message || 'Failed to update timeline entry');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to update timeline entry: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [eventId, fetchTimelines]);

    const deleteTimeline = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await eventTimelineService.delete(eventId, id);
            if (response.success) {
                message.success('Timeline entry deleted successfully');
                await fetchTimelines();
                return true;
            } else {
                message.error(response.message || 'Failed to delete timeline entry');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to delete timeline entry: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [eventId, fetchTimelines]);

    return { timelines, loading, fetchTimelines, createTimeline, updateTimeline, deleteTimeline };
}
