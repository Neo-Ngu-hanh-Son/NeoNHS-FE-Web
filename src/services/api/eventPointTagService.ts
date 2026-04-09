/**
 * Event Point Tag Service
 * API calls for admin event point tag management
 */

import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type { EventPointTagRequest, EventPointTagResponse } from '@/types/eventTimeline';

export interface EventPointTagQueryParams {
  name?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

function buildQuery(params: EventPointTagQueryParams = {}): string {
  const query = new URLSearchParams();

  if (params.name) query.append('name', params.name);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortDir) query.append('sortDir', params.sortDir);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export const eventPointTagService = {
  getAll: async (params: EventPointTagQueryParams = {}): Promise<ApiResponse<EventPointTagResponse[]>> => {
    return apiClient.get<ApiResponse<EventPointTagResponse[]>>(`/admin/event-point-tags${buildQuery(params)}`);
  },

  getById: async (id: string): Promise<ApiResponse<EventPointTagResponse>> => {
    return apiClient.get<ApiResponse<EventPointTagResponse>>(`/admin/event-point-tags/${id}`);
  },

  create: async (data: EventPointTagRequest): Promise<ApiResponse<EventPointTagResponse>> => {
    return apiClient.post<ApiResponse<EventPointTagResponse>>('/admin/event-point-tags', data);
  },

  update: async (id: string, data: Partial<EventPointTagRequest>): Promise<ApiResponse<EventPointTagResponse>> => {
    return apiClient.put<ApiResponse<EventPointTagResponse>>(`/admin/event-point-tags/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/admin/event-point-tags/${id}`);
  },
};

export default eventPointTagService;
