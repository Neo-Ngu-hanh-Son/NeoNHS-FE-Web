import apiClient from './apiClient';
import type { User, ApiResponse } from '@/types';

/**
 * Build query string từ params object
 */
function buildQuery(params?: Record<string, any>) {
    if (!params) return '';
    const query = new URLSearchParams(
        Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== null && value !== ''
        )
    ).toString();
    return query ? `?${query}` : '';
}

export interface SpringPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const adminUserService = {
    /**
     * Get all users for admin management
     */
    async getAllUsers(params?: {
        page?: number;
        size?: number;
        search?: string;
        role?: string;
        status?: string;
    }): Promise<ApiResponse<SpringPage<User>>> {
        try {
            const query = buildQuery(params);
            const res = await apiClient.get<ApiResponse<SpringPage<User>>>(
                `/admin/users${query}`
            );
            return res; // res chính là data
        } catch (error) {
            console.error('getAllUsers error:', error);
            throw error;
        }
    },

    /**
     * Toggle ban status of a user
     */
    async toggleBan(userId: string): Promise<ApiResponse<User>> {
        try {
            const res = await apiClient.patch<ApiResponse<User>>(
                `/admin/users/${userId}/toggle-ban`
            );
            return res; // res chính là data
        } catch (error) {
            console.error('toggleBan error:', error);
            throw error;
        }
    },
};

export default adminUserService;