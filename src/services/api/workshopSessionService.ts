import apiClient from './apiClient';
import type {
  WorkshopSessionResponse,
  CreateWorkshopSessionRequest,
  UpdateWorkshopSessionRequest,
  PageResponse,
  ApiResponse,
} from '@/pages/vendor/WorkshopSessions/types';

/**
 * Workshop Session Service
 * Handles all Workshop Session CRUD operations
 */

/**
 * Transform flat API response to nested structure expected by frontend
 */
const transformSessionResponse = (apiSession: any): WorkshopSessionResponse => {
  return {
    id: apiSession.id,
    startTime: apiSession.startTime,
    endTime: apiSession.endTime,
    price: apiSession.price,
    maxParticipants: apiSession.maxParticipants,
    currentEnrollments: apiSession.currentEnrolled || 0, // API uses currentEnrolled
    availableSlots: apiSession.availableSlots,
    status: apiSession.status,
    createdAt: apiSession.createdAt,
    updatedAt: apiSession.updatedAt,
    
    // Transform template data (flat → nested)
    workshopTemplate: {
      id: apiSession.workshopTemplateId,
      name: apiSession.name,
      shortDescription: apiSession.shortDescription,
      fullDescription: apiSession.fullDescription,
      estimatedDuration: apiSession.estimatedDuration,
      minParticipants: apiSession.minParticipants || 1,
      averageRating: apiSession.averageRating,
      totalReview: apiSession.totalReview,
      totalRatings: apiSession.totalRatings,
      images: apiSession.images || [],
      tags: apiSession.tags || [],
    },
    
    // Transform vendor data (flat → nested)
    vendor: {
      id: apiSession.vendorId,
      name: apiSession.vendorName,
      email: apiSession.vendorEmail || '',
      avatar: apiSession.vendorAvatar,
    },
  };
};

export const WorkshopSessionService = {
  /**
   * Get vendor's own sessions (paginated)
   * GET /api/workshops/sessions/my
   */
  async getMySessions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<PageResponse<WorkshopSessionResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);

      const endpoint = `/workshops/sessions/my${queryParams.toString() ? `?${queryParams}` : ''}`;
      const res = await apiClient.get<ApiResponse<PageResponse<any>>>(endpoint);
      
      const data = (res?.data ?? res) as PageResponse<any>;
      //console.log('getMySessions raw response:', data);
      
      // Transform flat structure to nested structure
      const transformedData: PageResponse<WorkshopSessionResponse> = {
        ...data,
        content: (data.content || []).map(transformSessionResponse),
      };
      
      //console.log('getMySessions transformed:', transformedData);
      return transformedData;
    } catch (error) {
      //console.error('getMySessions error:', error);
      throw error;
    }
  },

  /**
   * Get single session by ID
   * GET /api/workshops/sessions/{id}
   */
  async getSessionById(id: string): Promise<WorkshopSessionResponse> {
    try {
      const res = await apiClient.get<ApiResponse<any>>(`/workshops/sessions/${id}`);
      const data = (res?.data ?? res) as any;
      //console.log('getSessionById raw response:', data);
      
      // Transform flat structure to nested structure
      const transformed = transformSessionResponse(data);
      //console.log('getSessionById transformed:', transformed);
      return transformed;
    } catch (error) {
      //console.error('getSessionById error:', error);
      throw error;
    }
  },

  /**
   * Create new session from ACTIVE template
   * POST /api/workshops/sessions
   */
  async createSession(data: CreateWorkshopSessionRequest): Promise<WorkshopSessionResponse> {
    try {
      //console.log('Creating session with data:', data);
      const res = await apiClient.post<ApiResponse<any>>('/workshops/sessions', data);
      const created = (res?.data ?? res) as any;
      //console.log('createSession raw response:', created);
      
      // Transform response
      const transformed = transformSessionResponse(created);
      //console.log('createSession transformed:', transformed);
      return transformed;
    } catch (error) {
      //console.error('createSession error:', error);
      throw error;
    }
  },

  /**
   * Create multiple new sessions (batch)
   * POST /api/workshops/sessions/batch
   */
  async createBatchSessions(data: CreateWorkshopSessionRequest[]): Promise<WorkshopSessionResponse[]> {
    try {
      //console.log('Creating batch sessions with data:', data);
      const res = await apiClient.post<ApiResponse<any>>('/workshops/sessions/batch', data);
      const created = (res?.data ?? res) as any[] | { content?: any[] };
      //console.log('createBatchSessions raw response:', created);

      const sessionsArray = Array.isArray(created) ? created : (created.content ?? []);
      const transformed = sessionsArray.map((session: any) => transformSessionResponse(session));
      return transformed;
    } catch (error) {
      //console.error('createBatchSessions error:', error);
      throw error;
    }
  },

  /**
   * Update session (SCHEDULED only)
   * PUT /api/workshops/sessions/{id}
   */
  async updateSession(id: string, data: UpdateWorkshopSessionRequest): Promise<WorkshopSessionResponse> {
    try {
      //console.log('Updating session', id, 'with data:', data);
      const res = await apiClient.put<ApiResponse<any>>(`/workshops/sessions/${id}`, data);
      const updated = (res?.data ?? res) as any;
      //console.log('updateSession raw response:', updated);
      
      // Transform response
      const transformed = transformSessionResponse(updated);
      //console.log('updateSession transformed:', transformed);
      return transformed;
    } catch (error) {
      //console.error('updateSession error:', error);
      throw error;
    }
  },

  /**
   * Update session status
   * PATCH /api/workshops/sessions/{id}/status
   */
  async updateSessionStatus(id: string, status: 'ONGOING' | 'COMPLETED' | 'CANCELLED'): Promise<WorkshopSessionResponse> {
    try {
      const res = await apiClient.patch<ApiResponse<any>>(`/workshops/sessions/${id}/status`, { status });
      const data = (res?.data ?? res) as any;
      return transformSessionResponse(data);
    } catch (error) {
      //console.error('updateSessionStatus error:', error);
      throw error;
    }
  },

  /**
   * Cancel session (soft delete)
   * POST /api/workshops/sessions/{id}/cancel
   */
  async cancelSession(id: string): Promise<WorkshopSessionResponse> {
    try {
      //console.log('Cancelling session:', id);
      const res = await apiClient.post<ApiResponse<any>>(`/workshops/sessions/${id}/cancel`, {});
      const cancelled = (res?.data ?? res) as any;
      //console.log('cancelSession raw response:', cancelled);
      
      // Transform response
      const transformed = transformSessionResponse(cancelled);
      //console.log('cancelSession transformed:', transformed);
      return transformed;
    } catch (error) {
      //console.error('cancelSession error:', error);
      throw error;
    }
  },

  /**
   * Delete session (no enrollments only)
   * DELETE /api/workshops/sessions/{id}
   */
  async deleteSession(id: string): Promise<void> {
    try {
      //console.log('Deleting session:', id);
      await apiClient.delete(`/workshops/sessions/${id}`);
      //console.log('Session deleted successfully');
    } catch (error) {
      //console.error('deleteSession error:', error);
      throw error;
    }
  },

  /**
   * Get all upcoming sessions (public)
   * GET /api/workshops/sessions
   */
  async getAllSessions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<PageResponse<WorkshopSessionResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);

      const endpoint = `/workshops/sessions${queryParams.toString() ? `?${queryParams}` : ''}`;
      const res = await apiClient.get<ApiResponse<PageResponse<WorkshopSessionResponse>>>(endpoint);
      const data = (res?.data ?? res) as PageResponse<WorkshopSessionResponse>;
      return data;
    } catch (error) {
      //console.error('getAllSessions error:', error);
      throw error;
    }
  },

  /**
   * Get sessions for specific template
   * GET /api/workshops/sessions/template/{templateId}
   */
  async getSessionsByTemplate(templateId: string, params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<WorkshopSessionResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());

      const endpoint = `/workshops/sessions/template/${templateId}${queryParams.toString() ? `?${queryParams}` : ''}`;
      const res = await apiClient.get<ApiResponse<PageResponse<WorkshopSessionResponse>>>(endpoint);
      const data = (res?.data ?? res) as PageResponse<WorkshopSessionResponse>;
      return data;
    } catch (error) {
      //console.error('getSessionsByTemplate error:', error);
      throw error;
    }
  },

  /**
   * Advanced search/filter sessions
   * GET /api/workshops/sessions/filter
   */
  async filterSessions(params: {
    keyword?: string;
    vendorId?: string;
    tagId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    availableOnly?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<PageResponse<WorkshopSessionResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.vendorId) queryParams.append('vendorId', params.vendorId);
      if (params.tagId) queryParams.append('tagId', params.tagId);
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.availableOnly !== undefined) queryParams.append('availableOnly', params.availableOnly.toString());
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

      const endpoint = `/workshops/sessions/filter?${queryParams}`;
      const res = await apiClient.get<ApiResponse<PageResponse<WorkshopSessionResponse>>>(endpoint);
      const data = (res?.data ?? res) as PageResponse<WorkshopSessionResponse>;
      return data;
    } catch (error) {
      //console.error('filterSessions error:', error);
      throw error;
    }
  },
};

export default WorkshopSessionService;
