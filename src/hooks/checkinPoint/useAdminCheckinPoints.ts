import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { checkinPointService } from '@/services/api/checkinPointService';
import { pointService } from '@/services/api/pointService';
import type { PointResponse } from '@/types/point';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import type {
  CheckinPointRequest,
  ParentPointOption,
  PointCheckinResponse,
} from '@/types/checkinPoint';

export interface AdminCheckinPointFilters {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  search: string;
  includeDeleted: boolean;
}

interface UseAdminCheckinPointsReturn {
  checkinPoints: PointCheckinResponse[];
  parentPoints: ParentPointOption[];
  loading: boolean;
  parentPointsLoading: boolean;
  totalElements: number;
  totalPages: number;
  refresh: () => Promise<void>;
  createCheckinPoint: (payload: CheckinPointRequest) => Promise<boolean>;
  updateCheckinPoint: (id: string, payload: CheckinPointRequest) => Promise<boolean>;
  deleteCheckinPoint: (id: string) => Promise<boolean>;
  getCheckinPointById: (id: string) => Promise<PointCheckinResponse | null>;
  restoreCheckinPoint: (id: string) => Promise<boolean>;
}

export function useAdminCheckinPoints(
  filters: AdminCheckinPointFilters,
): UseAdminCheckinPointsReturn {
  const [checkinPoints, setCheckinPoints] = useState<PointCheckinResponse[]>([]);
  const [parentPoints, setParentPoints] = useState<ParentPointOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [parentPointsLoading, setParentPointsLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await checkinPointService.getAll({
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        search: filters.search.trim() || undefined,
        includeDeleted: filters.includeDeleted,
      });

      if (response.success) {
        setCheckinPoints(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        message.error(response.message || 'Failed to fetch checkin points');
      }
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Failed to fetch checkin points'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchParentPoints = useCallback(async () => {
    setParentPointsLoading(true);
    try {
      const response = await pointService.getAllPointsWithPagination({
        page: 0,
        size: 1000,
        sortBy: 'name',
        sortDir: 'asc',
      });

      if (response.success) {
        const content = response.data.content || [];
        const pointOptions = content.map((point: PointResponse) => ({
          id: point.id,
          name: point.name,
          latitude: point.latitude,
          longitude: point.longitude,
        }));

        setParentPoints(pointOptions);
      } else {
        message.error(response.message || 'Failed to load parent points');
      }
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Failed to load parent points'));
    } finally {
      setParentPointsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [filtersKey, refresh]);

  useEffect(() => {
    fetchParentPoints();
  }, [fetchParentPoints]);

  const createCheckinPoint = useCallback(
    async (payload: CheckinPointRequest): Promise<boolean> => {
      try {
        const response = await checkinPointService.create(payload);
        if (!response.success) {
          message.error(response.message || 'Failed to create checkin point');
          return false;
        }

        message.success(response.message || 'Checkin point created successfully');
        await refresh();
        return true;
      } catch (error: unknown) {
        message.error(getApiErrorMessage(error, 'Failed to create checkin point'));
        return false;
      }
    },
    [refresh],
  );

  const updateCheckinPoint = useCallback(
    async (id: string, payload: CheckinPointRequest): Promise<boolean> => {
      try {
        const response = await checkinPointService.update(id, payload);
        if (!response.success) {
          message.error(response.message || 'Failed to update checkin point');
          return false;
        }

        message.success(response.message || 'Checkin point updated successfully');
        await refresh();
        return true;
      } catch (error: unknown) {
        message.error(getApiErrorMessage(error, 'Failed to update checkin point'));
        return false;
      }
    },
    [refresh],
  );

  const deleteCheckinPoint = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await checkinPointService.delete(id);
        if (!response.success) {
          message.error(response.message || 'Failed to delete checkin point');
          return false;
        }

        message.success(response.message || 'Checkin point soft-deleted successfully');
        await refresh();
        return true;
      } catch (error: unknown) {
        message.error(getApiErrorMessage(error, 'Failed to delete checkin point'));
        return false;
      }
    },
    [refresh],
  );

  const restoreCheckinPoint = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await checkinPointService.restore(id);
        if (!response.success) {
          message.error(response.message || 'Failed to restore checkin point');
          return false;
        }

        message.success(response.message || 'Checkin point restored successfully');
        await refresh();
        return true;
      } catch (error: unknown) {
        message.error(getApiErrorMessage(error, 'Failed to restore checkin point'));
        return false;
      }
    },
    [refresh],
  )

  const getCheckinPointById = useCallback(
    async (id: string): Promise<PointCheckinResponse | null> => {
      try {
        const response = await checkinPointService.getById(id);
        if (!response.success) {
          message.error(response.message || 'Failed to load checkin point details');
          return null;
        }

        return response.data;
      } catch (error: unknown) {
        message.error(getApiErrorMessage(error, 'Failed to load checkin point details'));
        return null;
      }
    },
    [],
  );

  return {
    checkinPoints,
    parentPoints,
    loading,
    parentPointsLoading,
    totalElements,
    totalPages,
    refresh,
    createCheckinPoint,
    updateCheckinPoint,
    deleteCheckinPoint,
    getCheckinPointById,
    restoreCheckinPoint,
  };
}
