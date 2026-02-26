import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type {
  CreateTagRequest,
  UpdateTagRequest,
  WorkshopTagResponse,
  PagedTagResponse,
} from '@/types/tag';

export interface WorkshopTagQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const workshopTagService = {
  getAllWorkshopTags: async (
    params: WorkshopTagQueryParams = {},
  ): Promise<ApiResponse<PagedTagResponse<WorkshopTagResponse>>> => {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.size !== undefined) query.append('size', params.size.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    const url = queryString ? `/wtags?${queryString}` : '/wtags';

    return apiClient.get<ApiResponse<PagedTagResponse<WorkshopTagResponse>>>(url);
  },

  getAllWorkshopTagsList: async (): Promise<ApiResponse<WorkshopTagResponse[]>> => {
    return apiClient.get<ApiResponse<WorkshopTagResponse[]>>('/wtags/all');
  },

  getWorkshopTagById: async (id: string): Promise<ApiResponse<WorkshopTagResponse>> => {
    return apiClient.get<ApiResponse<WorkshopTagResponse>>(`/wtags/${id}`);
  },

  createWorkshopTag: async (
    data: CreateTagRequest,
  ): Promise<ApiResponse<WorkshopTagResponse>> => {
    return apiClient.post<ApiResponse<WorkshopTagResponse>>('/wtags', data);
  },

  updateWorkshopTag: async (
    id: string,
    data: UpdateTagRequest,
  ): Promise<ApiResponse<WorkshopTagResponse>> => {
    return apiClient.put<ApiResponse<WorkshopTagResponse>>(`/wtags/${id}`, data);
  },

  deleteWorkshopTag: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/wtags/${id}`);
  },
};

export default workshopTagService;