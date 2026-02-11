import { apiClient } from './apiClient';
import { AttractionRequest, AttractionResponse } from '../../types/attraction';
import { ApiResponse } from '../../types';

export const attractionService = {
    getAllAttractions: async (): Promise<ApiResponse<AttractionResponse[]>> => {
        return apiClient.get<ApiResponse<AttractionResponse[]>>('/attractions/all');
    },

    getAttractionsWithPagination: async (params: {
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

        return apiClient.get<ApiResponse<any>>(`/attractions?${query.toString()}`);
    },

    getAttractionById: async (id: string): Promise<ApiResponse<AttractionResponse>> => {
        return apiClient.get<ApiResponse<AttractionResponse>>(`/attractions/${id}`);
    },

    createAttraction: async (data: AttractionRequest): Promise<ApiResponse<AttractionResponse>> => {
        return apiClient.post<ApiResponse<AttractionResponse>>('/attractions', data);
    },

    updateAttraction: async (id: string, data: AttractionRequest): Promise<ApiResponse<AttractionResponse>> => {
        return apiClient.put<ApiResponse<AttractionResponse>>(`/attractions/${id}`, data);
    },

    deleteAttraction: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/attractions/${id}`);
    },
};

export default attractionService;
