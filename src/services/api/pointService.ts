import { apiClient } from './apiClient';
import { PagedPointResponse, PointQueryParams, PointRequest, PointResponse } from '../../types/point';
import { ApiResponse } from '../../types';

export const pointService = {
    getPointsByAttraction: async (attractionId: string): Promise<ApiResponse<PointResponse[]>> => {
        return apiClient.get<ApiResponse<PointResponse[]>>(`/admin/points/attraction/${attractionId}`);
    },

    getPointsWithPagination: async (
        attractionId: string,
        params: PointQueryParams,
    ): Promise<ApiResponse<PagedPointResponse>> => {
        const query = new URLSearchParams();
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);
        if (params.search) query.append('search', params.search);

        return apiClient.get<ApiResponse<PagedPointResponse>>(
            `/admin/points/attraction/${attractionId}?${query.toString()}`,
        );
    },

    getAllPointsWithPagination: async (
        params: PointQueryParams,
    ): Promise<ApiResponse<PagedPointResponse>> => {
        const query = new URLSearchParams();
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);
        if (params.search) query.append('search', params.search);

        return apiClient.get<ApiResponse<PagedPointResponse>>(`/admin/points/all?${query.toString()}`);
    },

    getPointById: async (id: string): Promise<ApiResponse<PointResponse>> => {
        return apiClient.get<ApiResponse<PointResponse>>(`/admin/points/${id}`);
    },

    createPoint: async (data: PointRequest): Promise<ApiResponse<PointResponse>> => {
        return apiClient.post<ApiResponse<PointResponse>>('/admin/points', data);
    },

    updatePoint: async (id: string, data: PointRequest): Promise<ApiResponse<PointResponse>> => {
        return apiClient.put<ApiResponse<PointResponse>>(`/admin/points/${id}`, data);
    },

    deletePoint: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/points/${id}/hard`);
    },
};

export default pointService;
