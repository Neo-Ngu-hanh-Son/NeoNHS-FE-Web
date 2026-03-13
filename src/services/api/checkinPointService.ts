import { apiClient } from '@/services/api/apiClient';
import type { ApiResponse } from '@/types';
import type {
  CheckinPointRequest,
  PagedCheckinPointResponse,
  PointCheckinResponse,
} from '@/types/checkinPoint';

export interface CheckinPointQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  includeDeleted?: boolean;
}

const BASE_PATH = '/admin/checkin-points';

const buildQuery = (params: CheckinPointQueryParams): string => {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.append('page', String(params.page));
  if (params.size !== undefined) query.append('size', String(params.size));
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortDir) query.append('sortDir', params.sortDir);
  if (params.search) query.append('search', params.search);
  if (params.includeDeleted !== undefined) {
    query.append('includeDeleted', String(params.includeDeleted));
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const checkinPointService = {
  create: async (
    payload: CheckinPointRequest,
  ): Promise<ApiResponse<PointCheckinResponse>> => {
    return apiClient.post<ApiResponse<PointCheckinResponse>>(BASE_PATH, payload);
  },

  getById: async (id: string): Promise<ApiResponse<PointCheckinResponse>> => {
    return apiClient.get<ApiResponse<PointCheckinResponse>>(`${BASE_PATH}/${id}`);
  },

  getAll: async (
    params: CheckinPointQueryParams,
  ): Promise<ApiResponse<PagedCheckinPointResponse>> => {
    return apiClient.get<ApiResponse<PagedCheckinPointResponse>>(
      `${BASE_PATH}/all${buildQuery(params)}`,
    );
  },

  update: async (
    id: string,
    payload: CheckinPointRequest,
  ): Promise<ApiResponse<PointCheckinResponse>> => {
    return apiClient.put<ApiResponse<PointCheckinResponse>>(
      `${BASE_PATH}/${id}`,
      payload,
    );
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`${BASE_PATH}/${id}`);
  },
};

export default checkinPointService;
