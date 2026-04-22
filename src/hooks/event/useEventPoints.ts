/**
 * Custom Hook: useEventPoints
 * Manages event point data
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { eventPointService } from '@/services/api/eventPointService';
import type { EventPointRequest, EventPointResponse } from '@/types/eventTimeline';

interface UseEventPointsReturn {
  points: EventPointResponse[];
  loading: boolean;
  fetchPoints: () => Promise<void>;
  createPoint: (data: EventPointRequest) => Promise<boolean>;
  updatePoint: (id: string, data: Partial<EventPointRequest>) => Promise<boolean>;
  deletePoint: (id: string) => Promise<boolean>;
}

type ApiLikeError = Error & {
  status?: number;
  response?: {
    status?: number;
  };
};

function handlePointApiError(error: unknown, fallback: string): void {
  const err = error as ApiLikeError;
  const status = err?.status ?? err?.response?.status;

  if (status === 401) {
    localStorage.removeItem('token');
    message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/login';
    return;
  }

  if (status === 403) {
    message.error('Từ chối truy cập. Cần có quyền ADMIN để quản lý điểm sự kiện.');
    return;
  }

  if (status === 404) {
    message.error('The requested event point was not found.');
    return;
  }

  message.error(`${fallback}: ${err?.message || 'Lỗi không xác định'}`);
}

export function useEventPoints(): UseEventPointsReturn {
  const [points, setPoints] = useState<EventPointResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await eventPointService.getAll();
      if (response.success) {
        setPoints(response.data);
      } else {
        message.error(response.message || 'Lấy sự kiện thất bại points');
      }
    } catch (error: unknown) {
      handlePointApiError(error, 'Lấy sự kiện thất bại points');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const createPoint = useCallback(async (data: EventPointRequest): Promise<boolean> => {
    try {
      const response = await eventPointService.create(data);
      if (response.success) {
        message.success('Event point created successfully');
        await fetchPoints();
        return true;
      }

      message.error(response.message || 'Tạo sự kiện thất bại point');
      return false;
    } catch (error: unknown) {
      handlePointApiError(error, 'Tạo sự kiện thất bại point');
      return false;
    }
  }, [fetchPoints]);

  const updatePoint = useCallback(async (id: string, data: Partial<EventPointRequest>): Promise<boolean> => {
    try {
      const response = await eventPointService.update(id, data);
      if (response.success) {
        message.success('Event point updated successfully');
        await fetchPoints();
        return true;
      }

      message.error(response.message || 'Cập nhật sự kiện thất bại point');
      return false;
    } catch (error: unknown) {
      handlePointApiError(error, 'Cập nhật sự kiện thất bại point');
      return false;
    }
  }, [fetchPoints]);

  const deletePoint = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await eventPointService.delete(id);
      if (response.success) {
        message.success('Event point deleted successfully');
        await fetchPoints();
        return true;
      }

      message.error(response.message || 'Xóa sự kiện thất bại point');
      return false;
    } catch (error: unknown) {
      handlePointApiError(error, 'Xóa sự kiện thất bại point');
      return false;
    }
  }, [fetchPoints]);

  return {
    points,
    loading,
    fetchPoints,
    createPoint,
    updatePoint,
    deletePoint,
  };
}
