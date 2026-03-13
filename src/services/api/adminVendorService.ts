import apiClient from './apiClient';
import {
    VendorProfileResponse,
    ApiResponse,
    PageResponse,
    VendorFilterOptions,
    CreateVendorRequest,
    UpdateVendorRequest,
    BanVendorRequest
} from '@/pages/admin/vendors/types';

const adminVendorService = {
    /**
     * Get all vendors with pagination and filtering
     */
    getAllVendors: async (options: VendorFilterOptions): Promise<PageResponse<VendorProfileResponse>> => {
        const params = new URLSearchParams();
        if (options.page !== undefined) params.append('page', options.page.toString());
        if (options.size !== undefined) params.append('size', options.size.toString());
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.sortDirection) params.append('sortDirection', options.sortDirection);

        // Filters
        if (options.keyword) params.append('keyword', options.keyword);
        if (options.isVerified !== undefined) params.append('isVerified', options.isVerified.toString());
        if (options.isBanned !== undefined) params.append('isBanned', options.isBanned.toString());
        if (options.isActive !== undefined) params.append('isActive', options.isActive.toString());

        const response = await apiClient.get<ApiResponse<PageResponse<VendorProfileResponse>>>(`/admin/vendors?${params.toString()}`);
        return response.data;
    },

    /**
     * Get vendor detail by ID
     */
    getVendorById: async (id: string): Promise<VendorProfileResponse> => {
        const response = await apiClient.get<ApiResponse<VendorProfileResponse>>(`/admin/vendors/${id}`);
        return response.data;
    },

    /**
     * Create a new vendor
     */
    createVendor: async (data: CreateVendorRequest): Promise<VendorProfileResponse> => {
        const response = await apiClient.post<ApiResponse<VendorProfileResponse>>('/admin/vendors', data);
        return response.data;
    },

    /**
     * Update vendor information
     */
    updateVendor: async (id: string, data: UpdateVendorRequest): Promise<VendorProfileResponse> => {
        const response = await apiClient.put<ApiResponse<VendorProfileResponse>>(`/admin/vendors/${id}`, data);
        return response.data;
    },

    /**
     * Ban a vendor
     */
    banVendor: async (id: string, data: BanVendorRequest): Promise<void> => {
        await apiClient.post(`/admin/vendors/${id}/ban`, data);
    },

    /**
     * Unban a vendor
     */
    unbanVendor: async (id: string): Promise<void> => {
        await apiClient.post(`/admin/vendors/${id}/unban`, {});
    },

    /**
     * Verify a vendor
     */
    verifyVendor: async (id: string): Promise<void> => {
        await apiClient.post(`/admin/vendors/${id}/verify`, {});
    },

    /**
     * Get vendor statistics (optional if backend supports)
     */
    getVendorStats: async (): Promise<{
        total: number;
        active: number;
        banned: number;
        pendingVerification: number;
        verified: number;
    }> => {
        try {
            const response = await apiClient.get<ApiResponse<any>>('/admin/vendors/stats');
            return response.data;
        } catch (error) {
            return { total: 0, active: 0, banned: 0, pendingVerification: 0, verified: 0 };
        }
    }
};

export default adminVendorService;
