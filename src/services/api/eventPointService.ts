/**
 * Event Point Service
 * API calls for admin event point management
 */

import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type { EventPointRequest, EventPointResponse } from '@/types/eventTimeline';

export interface EventPointQueryParams {
  name?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

function buildQuery(params: EventPointQueryParams = {}): string {
  const query = new URLSearchParams();

  if (params.name) query.append('name', params.name);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortDir) query.append('sortDir', params.sortDir);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export const eventPointService = {
  getAll: async (params: EventPointQueryParams = {}): Promise<ApiResponse<EventPointResponse[]>> => {
    return apiClient.get<ApiResponse<EventPointResponse[]>>(`/admin/event-points${buildQuery(params)}`);
  },

  getById: async (id: string): Promise<ApiResponse<EventPointResponse>> => {
    return apiClient.get<ApiResponse<EventPointResponse>>(`/admin/event-points/${id}`);
  },

  create: async (data: EventPointRequest): Promise<ApiResponse<EventPointResponse>> => {
    return apiClient.post<ApiResponse<EventPointResponse>>('/admin/event-points', data);
  },

  update: async (id: string, data: Partial<EventPointRequest>): Promise<ApiResponse<EventPointResponse>> => {
    return apiClient.put<ApiResponse<EventPointResponse>>(`/admin/event-points/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/admin/event-points/${id}`);
  },

  restore: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.put<ApiResponse<void>>(`/admin/event-points/${id}/restore`, {});
  },
};

export default eventPointService;
