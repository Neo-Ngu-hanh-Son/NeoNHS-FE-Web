import { apiClient } from './apiClient';
import { PointRequest, PointResponse } from '../../types/point';
import { ApiResponse } from '../../types';

export const pointService = {
    getPointsByAttraction: async (attractionId: string): Promise<ApiResponse<PointResponse[]>> => {
        return apiClient.get<ApiResponse<PointResponse[]>>(`/points/all/${attractionId}`);
    },

    getPointsWithPagination: async (attractionId: string, params: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: string;
        search?: string;
    }): Promise<ApiResponse<any>> => {
        const query = new URLSearchParams();
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);
        if (params.search) query.append('search', params.search);

        return apiClient.get<ApiResponse<any>>(`/points/attraction/${attractionId}?${query.toString()}`);
    },

    getPointById: async (id: string): Promise<ApiResponse<PointResponse>> => {
        return apiClient.get<ApiResponse<PointResponse>>(`/points/${id}`);
    },

    createPoint: async (data: PointRequest): Promise<ApiResponse<PointResponse>> => {
        return apiClient.post<ApiResponse<PointResponse>>('/points', data);
    },

    updatePoint: async (id: string, data: PointRequest): Promise<ApiResponse<PointResponse>> => {
        return apiClient.put<ApiResponse<PointResponse>>(`/points/${id}`, data);
    },

    deletePoint: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/points/${id}`);
    },
};

export default pointService;
