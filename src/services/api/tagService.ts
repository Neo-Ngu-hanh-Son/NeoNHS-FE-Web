/**
 * Tag Service
 * API calls for Tag management
 */

import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type { TagResponse, CreateTagRequest, UpdateTagRequest, PagedTagResponse } from '@/types/tag';

export interface TagQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    name?: string;
}

export const tagService = {
    /**
     * Get all active tags (public endpoint, for dropdowns)
     */
    getAllTagsList: async (): Promise<ApiResponse<TagResponse[]>> => {
        return apiClient.get<ApiResponse<TagResponse[]>>('/tags');
    },

    /**
     * Get all tags with pagination (admin, includes deleted)
     */
    getAllTags: async (params: TagQueryParams = {}): Promise<ApiResponse<PagedTagResponse>> => {
        const query = new URLSearchParams();

        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);
        if (params.name) query.append('name', params.name);

        const queryString = query.toString();
        const url = queryString ? `/admin/tags?${queryString}` : '/admin/tags';

        return apiClient.get<ApiResponse<PagedTagResponse>>(url);
    },

    /**
     * Get a single tag by ID
     */
    getTagById: async (id: string): Promise<ApiResponse<TagResponse>> => {
        return apiClient.get<ApiResponse<TagResponse>>(`/admin/tags/${id}`);
    },

    /**
     * Create a new tag
     */
    createTag: async (data: CreateTagRequest): Promise<ApiResponse<TagResponse>> => {
        return apiClient.post<ApiResponse<TagResponse>>('/admin/tags', data);
    },

    /**
     * Update an existing tag
     */
    updateTag: async (id: string, data: UpdateTagRequest): Promise<ApiResponse<TagResponse>> => {
        return apiClient.put<ApiResponse<TagResponse>>(`/admin/tags/${id}`, data);
    },

    /**
     * Soft delete a tag
     */
    deleteTag: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/tags/${id}`);
    },

    /**
     * Restore a soft-deleted tag
     */
    restoreTag: async (id: string): Promise<ApiResponse<TagResponse>> => {
        return apiClient.patch<ApiResponse<TagResponse>>(`/admin/tags/${id}/restore`);
    },
};

export default tagService;
