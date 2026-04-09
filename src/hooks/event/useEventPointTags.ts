/**
 * Custom Hook: useEventPointTags
 * Manages event point tag data
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { eventPointTagService } from '@/services/api/eventPointTagService';
import type { EventPointTagRequest, EventPointTagResponse } from '@/types/eventTimeline';

interface UseEventPointTagsReturn {
  tags: EventPointTagResponse[];
  loading: boolean;
  fetchTags: () => Promise<void>;
  createTag: (data: EventPointTagRequest) => Promise<boolean>;
  updateTag: (id: string, data: Partial<EventPointTagRequest>) => Promise<boolean>;
  deleteTag: (id: string) => Promise<boolean>;
}

type ApiLikeError = Error & {
  status?: number;
  response?: {
    status?: number;
  };
};

function handleTagApiError(error: unknown, fallback: string): void {
  const err = error as ApiLikeError;
  const status = err?.status ?? err?.response?.status;

  if (status === 401) {
    localStorage.removeItem('token');
    message.error('Session expired. Please sign in again.');
    window.location.href = '/login';
    return;
  }

  if (status === 403) {
    message.error('Access denied. ADMIN role is required to manage event point tags.');
    return;
  }

  if (status === 404) {
    message.error('The requested event point tag was not found.');
    return;
  }

  message.error(`${fallback}: ${err?.message || 'Unknown error'}`);
}

export function useEventPointTags(): UseEventPointTagsReturn {
  const [tags, setTags] = useState<EventPointTagResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const response = await eventPointTagService.getAll();
      if (response.success) {
        setTags(response.data);
      } else {
        message.error(response.message || 'Failed to fetch event point tags');
      }
    } catch (error: unknown) {
      handleTagApiError(error, 'Failed to fetch event point tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = useCallback(async (data: EventPointTagRequest): Promise<boolean> => {
    try {
      const response = await eventPointTagService.create(data);
      if (response.success) {
        message.success('Event point tag created successfully');
        await fetchTags();
        return true;
      }

      message.error(response.message || 'Failed to create event point tag');
      return false;
    } catch (error: unknown) {
      handleTagApiError(error, 'Failed to create event point tag');
      return false;
    }
  }, [fetchTags]);

  const updateTag = useCallback(async (id: string, data: Partial<EventPointTagRequest>): Promise<boolean> => {
    try {
      const response = await eventPointTagService.update(id, data);
      if (response.success) {
        message.success('Event point tag updated successfully');
        await fetchTags();
        return true;
      }

      message.error(response.message || 'Failed to update event point tag');
      return false;
    } catch (error: unknown) {
      handleTagApiError(error, 'Failed to update event point tag');
      return false;
    }
  }, [fetchTags]);

  const deleteTag = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await eventPointTagService.delete(id);
      if (response.success) {
        message.success('Event point tag deleted successfully');
        await fetchTags();
        return true;
      }

      message.error(response.message || 'Failed to delete event point tag');
      return false;
    } catch (error: unknown) {
      handleTagApiError(error, 'Failed to delete event point tag');
      return false;
    }
  }, [fetchTags]);

  return {
    tags,
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
  };
}
