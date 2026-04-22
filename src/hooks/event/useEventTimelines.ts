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
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
        return;
    }

    if (status === 403) {
        message.error('Từ chối truy cập. Cần có quyền ADMIN để quản lý dòng thời gian sự kiện.');
        return;
    }

    if (status === 404) {
        message.error('Sự kiện hoặc dòng thời gian không còn tồn tại.');
        return;
    }

    message.error(`${fallback}: ${err?.message || 'Lỗi không xác định'}`);
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
                message.success('Tạo dòng thời gian thành công');
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
                message.success('Cập nhật dòng thời gian thành công');
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
                message.success('Xóa dòng thời gian thành công');
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
                message.error(response.message || 'Lấy sự kiện thất bại points');
                return [];
            }
        } catch (error: unknown) {
            handleTimelineApiError(error, 'Lấy sự kiện thất bại points');
            return [];
        }
    }, [eventId]);

    const fetchEventPointTags = useCallback(async () => {
        try {
            const response = await eventTimelineService.getEventPointTags(eventId);
            if (response.success) {
                return response.data;
            } else {
                message.error(response.message || 'Lấy sự kiện thất bại point tags');
                return [];
            }
        } catch (error: unknown) {
            handleTimelineApiError(error, 'Lấy sự kiện thất bại point tags');
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
