/**
 * Voucher Service
 * API calls for Voucher management (Admin, Vendor, Tourist)
 */

import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types';
import type {
    VoucherResponse,
    UserVoucherResponse,
    CreateVoucherRequest,
    UpdateVoucherRequest,
    PagedVoucherResponse,
    PagedUserVoucherResponse,
    VoucherType,
    VoucherScope,
    VoucherStatus,
    ApplicableProduct,
} from '@/types/voucher';

// --- Query Params ---

export interface AdminVoucherQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    scope?: VoucherScope;
    voucherType?: VoucherType;
    status?: VoucherStatus;
    applicableProduct?: ApplicableProduct;
    code?: string;
    startDate?: string;
    endDate?: string;
    deleted?: boolean;
    includeDeleted?: boolean;
}

export interface VendorVoucherQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    voucherType?: VoucherType;
    status?: VoucherStatus;
    applicableProduct?: ApplicableProduct;
    code?: string;
    startDate?: string;
    endDate?: string;
    deleted?: boolean;
    includeDeleted?: boolean;
}

export interface TouristVoucherQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface TouristMyVoucherQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    isUsed?: boolean;
}

// --- Helper: Build query string ---

function buildQuery(params: Record<string, any>): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    }
    const qs = query.toString();
    return qs ? `?${qs}` : '';
}

// --- Admin Voucher Service ---

export const adminVoucherService = {
    getAll: async (params: AdminVoucherQueryParams = {}): Promise<ApiResponse<PagedVoucherResponse>> => {
        const url = `/admin/vouchers${buildQuery(params)}`;
        return apiClient.get<ApiResponse<PagedVoucherResponse>>(url);
    },

    getById: async (id: string): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.get<ApiResponse<VoucherResponse>>(`/admin/vouchers/${id}`);
    },

    create: async (data: CreateVoucherRequest): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.post<ApiResponse<VoucherResponse>>('/admin/vouchers', data);
    },

    update: async (id: string, data: UpdateVoucherRequest): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.put<ApiResponse<VoucherResponse>>(`/admin/vouchers/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/vouchers/${id}`);
    },

    permanentDelete: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/admin/vouchers/${id}/permanent`);
    },

    restore: async (id: string): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.patch<ApiResponse<VoucherResponse>>(`/admin/vouchers/${id}/restore`);
    },
};

// --- Vendor Voucher Service ---

export const vendorVoucherService = {
    getAll: async (params: VendorVoucherQueryParams = {}): Promise<ApiResponse<PagedVoucherResponse>> => {
        const url = `/vendor/vouchers/my${buildQuery(params)}`;
        return apiClient.get<ApiResponse<PagedVoucherResponse>>(url);
    },
    getMyVouchers: (params?: VendorVoucherQueryParams) => {
        // Alias for backward compatibility during refactor
        return vendorVoucherService.getAll(params);
    },

    getById: async (id: string): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.get<ApiResponse<VoucherResponse>>(`/vendor/vouchers/${id}`);
    },

    create: async (data: CreateVoucherRequest): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.post<ApiResponse<VoucherResponse>>('/vendor/vouchers/create', data);
    },

    update: async (id: string, data: UpdateVoucherRequest): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.put<ApiResponse<VoucherResponse>>(`/vendor/vouchers/update/${id}`, data);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/vendor/vouchers/${id}`);
    },

    permanentDelete: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<ApiResponse<void>>(`/vendor/vouchers/${id}/permanent`);
    },

    restore: async (id: string): Promise<ApiResponse<VoucherResponse>> => {
        return apiClient.patch<ApiResponse<VoucherResponse>>(`/vendor/vouchers/${id}/restore`);
    },
};

// --- Tourist Voucher Service ---

export const touristVoucherService = {
    getAvailable: async (params: TouristVoucherQueryParams = {}): Promise<ApiResponse<PagedVoucherResponse>> => {
        const url = `/vouchers/available${buildQuery(params)}`;
        return apiClient.get<ApiResponse<PagedVoucherResponse>>(url);
    },

    getVendorVouchers: async (vendorId: string, params: TouristVoucherQueryParams = {}): Promise<ApiResponse<PagedVoucherResponse>> => {
        const url = `/vouchers/available/vendor/${vendorId}${buildQuery(params)}`;
        return apiClient.get<ApiResponse<PagedVoucherResponse>>(url);
    },

    collect: async (voucherId: string): Promise<ApiResponse<UserVoucherResponse>> => {
        return apiClient.post<ApiResponse<UserVoucherResponse>>(`/vouchers/collect/${voucherId}`, {});
    },

    getMyVouchers: async (params: TouristMyVoucherQueryParams = {}): Promise<ApiResponse<PagedUserVoucherResponse>> => {
        const url = `/vouchers/my${buildQuery(params)}`;
        return apiClient.get<ApiResponse<PagedUserVoucherResponse>>(url);
    },
};

export default { adminVoucherService, vendorVoucherService, touristVoucherService };
