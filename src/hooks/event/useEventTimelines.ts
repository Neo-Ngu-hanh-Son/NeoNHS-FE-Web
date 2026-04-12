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
    EventPointResponse,
    EventPointTagResponse,
} from '@/types/eventTimeline';

interface UseEventTimelinesReturn {
    timelines: EventTimelineResponse[];
    loading: boolean;
    fetchTimelines: () => Promise<void>;
    fetchTimelineById: (id: string) => Promise<EventTimelineResponse | null>;
    createTimeline: (data: CreateEventTimelineRequest) => Promise<boolean>;
    updateTimeline: (id: string, data: UpdateEventTimelineRequest) => Promise<boolean>;
    deleteTimeline: (id: string) => Promise<boolean>;
    fetchEventPoints: () => Promise<EventPointResponse[]>;
    fetchEventPointTags: () => Promise<EventPointTagResponse[]>;
}

type ApiLikeError = Error & {
    status?: number;
    response?: {
        status?: number;
    };
};

function handleTimelineApiError(error: unknown, fallback: string): void {
    const err = error as ApiLikeError;
    const status = err?.status ?? err?.response?.status;

    if (status === 401) {
        localStorage.removeItem('token');
        message.error('Session expired. Please sign in again.');
        window.location.href = '/login';
        return;
    }

    if (status === 403) {
        message.error('Access denied. ADMIN role is required to manage event timelines.');
        return;
    }

    if (status === 404) {
        message.error('The event or timeline entry no longer exists.');
        return;
    }

    message.error(`${fallback}: ${err?.message || 'Unknown error'}`);
}

export function useEventTimelines(eventId: string, autoFetch: boolean = true): UseEventTimelinesReturn {
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
            handleTimelineApiError(error, 'Failed to fetch timelines');
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (eventId && autoFetch) fetchTimelines();
    }, [eventId, autoFetch, fetchTimelines]);

    const fetchTimelineById = useCallback(async (id: string): Promise<EventTimelineResponse | null> => {
        if (!eventId || !id) return null;

        setLoading(true);
        try {
            const response = await eventTimelineService.getById(eventId, id);
            if (response.success) {
                return response.data;
            }

            message.error(response.message || 'Failed to fetch timeline entry');
            return null;
        } catch (error: unknown) {
            handleTimelineApiError(error, 'Failed to fetch timeline entry');
            return null;
        } finally {
            setLoading(false);
        }
    }, [eventId]);

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
            handleTimelineApiError(error, 'Failed to create timeline entry');
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
            handleTimelineApiError(error, 'Failed to update timeline entry');
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
            handleTimelineApiError(error, 'Failed to delete timeline entry');
            return false;
        }
    }, [eventId, fetchTimelines]);

    const fetchEventPoints = useCallback(async () => {
        try {
            const response = await eventTimelineService.getEventPoints(eventId);
            if (response.success) {
                return response.data;
            } else {
                message.error(response.message || 'Failed to fetch event points');
                return [];
            }
        } catch (error: unknown) {
            handleTimelineApiError(error, 'Failed to fetch event points');
            return [];
        }
    }, [eventId]);

    const fetchEventPointTags = useCallback(async () => {
        try {
            const response = await eventTimelineService.getEventPointTags(eventId);
            if (response.success) {
                return response.data;
            } else {
                message.error(response.message || 'Failed to fetch event point tags');
                return [];
            }
        } catch (error: unknown) {
            handleTimelineApiError(error, 'Failed to fetch event point tags');
            return [];
        }
    }, [eventId]);

    return {
        timelines,
        loading,
        fetchTimelines,
        fetchTimelineById,
        createTimeline,
        updateTimeline,
        deleteTimeline,
        fetchEventPoints,
        fetchEventPointTags,
    };
}
