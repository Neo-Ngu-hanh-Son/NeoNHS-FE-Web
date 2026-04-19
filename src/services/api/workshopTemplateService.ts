import apiClient from './apiClient';
import type {
  WorkshopTemplateResponse,
  CreateWorkshopTemplateRequest,
  UpdateWorkshopTemplateRequest,
  PageResponse,
  ApiResponse,
} from '@/pages/vendor/WorkshopTemplates/types';

/**
 * Workshop Template Service
 * Handles all Workshop Template CRUD operations
 */

export const WorkshopTemplateService = {
  /**
   * Get vendor's own templates (paginated)
   * GET /api/workshops/templates/my
   */
  async getMyTemplates(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<PageResponse<WorkshopTemplateResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);

      const endpoint = `/workshops/templates/my${queryParams.toString() ? `?${queryParams}` : ''}`;
      const res = await apiClient.get<ApiResponse<PageResponse<WorkshopTemplateResponse>>>(endpoint);

      // Handle both response formats
      const data = (res?.data ?? res) as PageResponse<WorkshopTemplateResponse>;
      //console.log('getMyTemplates response:', data);
      return data;
    } catch (error) {
      //console.error('getMyTemplates error:', error);
      throw error;
    }
  },

  /**
   * Get single template by ID
   * GET /api/workshops/templates/{id}
   */
  async getTemplateById(id: string): Promise<WorkshopTemplateResponse> {
    try {
      const res = await apiClient.get<ApiResponse<WorkshopTemplateResponse>>(`/workshops/templates/${id}`);
      const data = (res?.data ?? res) as WorkshopTemplateResponse;
      //console.log('getTemplateById response:', data);
      return data;
    } catch (error) {
      //console.error('getTemplateById error:', error);
      throw error;
    }
  },

  /**
   * Create new template (status: DRAFT)
   * POST /api/workshops/templates
   */
  async createTemplate(data: CreateWorkshopTemplateRequest): Promise<WorkshopTemplateResponse> {
    try {
      //console.log('Creating template with data:', data);
      const res = await apiClient.post<ApiResponse<WorkshopTemplateResponse>>('/workshops/templates', data);
      const created = (res?.data ?? res) as WorkshopTemplateResponse;
      //console.log('createTemplate response:', created);
      return created;
    } catch (error) {
      //console.error('createTemplate error:', error);
      throw error;
    }
  },

  /**
   * Update template (DRAFT or REJECTED only)
   * PUT /api/workshops/templates/{id}
   */
  async updateTemplate(id: string, data: UpdateWorkshopTemplateRequest): Promise<WorkshopTemplateResponse> {
    try {
      //console.log('Updating template', id, 'with data:', data);
      const res = await apiClient.put<ApiResponse<WorkshopTemplateResponse>>(`/workshops/templates/${id}`, data);
      const updated = (res?.data ?? res) as WorkshopTemplateResponse;
      //console.log('updateTemplate response:', updated);
      return updated;
    } catch (error) {
      //console.error('updateTemplate error:', error);
      throw error;
    }
  },

  /**
   * Toggle publish status (ACTIVE templates only)
   * POST /api/workshops/templates/{id}/toggle-publish
   */
  async togglePublish(id: string): Promise<WorkshopTemplateResponse> {
    try {
      const res = await apiClient.post<ApiResponse<WorkshopTemplateResponse>>(
        `/workshops/templates/${id}/toggle-publish`, {}
      );
      const data = (res?.data ?? res) as WorkshopTemplateResponse;
      return data;
    } catch (error) {
      //console.error('togglePublish error:', error);
      throw error;
    }
  },

  /**
   * Submit template for approval (DRAFT/REJECTED → PENDING)
   * POST /api/workshops/templates/{id}/register
   */
  async submitForApproval(id: string): Promise<WorkshopTemplateResponse> {
    try {
      //console.log('Submitting template for approval:', id);
      const res = await apiClient.post<ApiResponse<WorkshopTemplateResponse>>(`/workshops/templates/${id}/register`, {});
      const submitted = (res?.data ?? res) as WorkshopTemplateResponse;
      //console.log('submitForApproval response:', submitted);
      return submitted;
    } catch (error) {
      //console.error('submitForApproval error:', error);
      throw error;
    }
  },

  /**
   * Delete template (cannot delete ACTIVE)
   * DELETE /api/workshops/templates/{id}
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      //console.log('Deleting template:', id);
      await apiClient.delete(`/workshops/templates/${id}`);
      //console.log('Template deleted successfully');
    } catch (error) {
      //console.error('deleteTemplate error:', error);
      throw error;
    }
  },

  /**
   * Filter templates (public search)
   * GET /api/workshops/templates/filter
   */
  async filterTemplates(params: {
    keyword?: string;
    status?: string;
    tagIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<PageResponse<WorkshopTemplateResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.status) queryParams.append('status', params.status);
      if (params.tagIds?.length) params.tagIds.forEach(id => queryParams.append('tagIds', id));
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

      const endpoint = `/workshops/templates/filter?${queryParams}`;
      const res = await apiClient.get<ApiResponse<PageResponse<WorkshopTemplateResponse>>>(endpoint);
      const data = (res?.data ?? res) as PageResponse<WorkshopTemplateResponse>;
      return data;
    } catch (error) {
      //console.error('filterTemplates error:', error);
      throw error;
    }
  },
};

export default WorkshopTemplateService;
