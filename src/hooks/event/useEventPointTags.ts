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
  restoreTag: (id: string) => Promise<boolean>;
}

interface UseEventPointTagsOptions {
  autoFetch?: boolean;
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
    message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/login';
    return;
  }

  if (status === 403) {
    message.error('Từ chối truy cập. Cần có quyền ADMIN để quản lý thẻ điểm sự kiện.');
    return;
  }

  if (status === 404) {
    message.error('Không tìm thấy thẻ điểm sự kiện yêu cầu.');
    return;
  }

  message.error(`${fallback}: ${err?.message || 'Lỗi không xác định'}`);
}

export function useEventPointTags(options: UseEventPointTagsOptions = {}): UseEventPointTagsReturn {
  const [tags, setTags] = useState<EventPointTagResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { autoFetch = true } = options;

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const response = await eventPointTagService.getAll();
      if (response.success) {
        setTags(response.data);
      } else {
        message.error(response.message || 'Lấy sự kiện thất bại point tags');
      }
    } catch (error: unknown) {
      handleTagApiError(error, 'Lấy sự kiện thất bại point tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchTags();
    }
  }, [fetchTags, autoFetch]);

  const createTag = useCallback(
    async (data: EventPointTagRequest): Promise<boolean> => {
      try {
        const response = await eventPointTagService.create(data);
        if (response.success) {
          message.success('Tạo thẻ điểm sự kiện thành công');
          await fetchTags();
          return true;
        }

        message.error(response.message || 'Tạo sự kiện thất bại point tag');
        return false;
      } catch (error: unknown) {
        handleTagApiError(error, 'Tạo sự kiện thất bại point tag');
        return false;
      }
    },
    [fetchTags],
  );

  const updateTag = useCallback(
    async (id: string, data: Partial<EventPointTagRequest>): Promise<boolean> => {
      try {
        const response = await eventPointTagService.update(id, data);
        if (response.success) {
          message.success('Cập nhật thẻ điểm sự kiện thành công');
          await fetchTags();
          return true;
        }

        message.error(response.message || 'Cập nhật sự kiện thất bại point tag');
        return false;
      } catch (error: unknown) {
        handleTagApiError(error, 'Cập nhật sự kiện thất bại point tag');
        return false;
      }
    },
    [fetchTags],
  );

  const deleteTag = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await eventPointTagService.delete(id);
        if (response.success) {
          message.success('Xóa thẻ điểm sự kiện thành công');
          await fetchTags();
          return true;
        }

        message.error(response.message || 'Xóa sự kiện thất bại point tag');
        return false;
      } catch (error: unknown) {
        handleTagApiError(error, 'Xóa sự kiện thất bại point tag');
        return false;
      }
    },
    [fetchTags],
  );

  const restoreTag = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await eventPointTagService.restore(id);
        if (response.success) {
          message.success('Khôi phục thẻ điểm sự kiện thành công');
          await fetchTags();
          return true;
        }

        message.error(response.message || 'Khôi phục sự kiện thất bại point tag');
        return false;
      } catch (error: unknown) {
        handleTagApiError(error, 'Khôi phục sự kiện thất bại point tag');
        return false;
      }
    },
    [fetchTags],
  );

  return {
    tags,
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    restoreTag,
  };
}
