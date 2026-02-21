import apiClient from './apiClient';
import type { WTagResponse, ApiResponse, PageResponse } from '@/pages/vendor/WorkshopTemplates/types';

/**
 * WTag (Workshop Tag) Service
 * Handles Workshop Tag operations
 */

export const WTagService = {
  /**
   * Get all tags (no pagination)
   * GET /api/wtags/all
   */
  async getAllTags(): Promise<WTagResponse[]> {
    try {
      const res = await apiClient.get<ApiResponse<WTagResponse[]>>('/wtags/all');
      const data = (res?.data ?? res) as WTagResponse[];
      console.log('getAllTags response:', data);
      return data;
    } catch (error) {
      console.error('getAllTags error:', error);
      throw error;
    }
  },

  /**
   * Get all tags (paginated)
   * GET /api/wtags
   */
  async getTags(params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<WTagResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());

      const endpoint = `/wtags${queryParams.toString() ? `?${queryParams}` : ''}`;
      const res = await apiClient.get<ApiResponse<PageResponse<WTagResponse>>>(endpoint);
      const data = (res?.data ?? res) as PageResponse<WTagResponse>;
      return data;
    } catch (error) {
      console.error('getTags error:', error);
      throw error;
    }
  },

  /**
   * Get single tag by ID
   * GET /api/wtags/{id}
   */
  async getTagById(id: string): Promise<WTagResponse> {
    try {
      const res = await apiClient.get<ApiResponse<WTagResponse>>(`/wtags/${id}`);
      const data = (res?.data ?? res) as WTagResponse;
      return data;
    } catch (error) {
      console.error('getTagById error:', error);
      throw error;
    }
  },
};

export default WTagService;
