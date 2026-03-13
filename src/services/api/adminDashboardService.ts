import apiClient from './apiClient';
import {
    AdminKPIs,
    ActivityStatus,
    SalesByType,
    TopActivity,
    RecentActivity,
    RevenueReport,
    RevenueTrendResponse,
    RegistrationTrendResponse
} from '@/types/adminDashboard';
import { ApiResponse } from '@/types';

const adminDashboardService = {
    getKPIs: async (): Promise<AdminKPIs> => {
        const response = await apiClient.get<ApiResponse<AdminKPIs>>('/admin/dashboard/kpi');
        return (response as any)?.data ?? response;
    },

    getRevenueReport: async (startDate: string, endDate: string): Promise<RevenueReport> => {
        const response = await apiClient.get<ApiResponse<RevenueReport>>(`/admin/revenue/revenue-report?startDate=${startDate}&endDate=${endDate}`);
        return (response as any)?.data ?? response;
    },

    getRevenueTrends: async (periodType: 'MONTHLY' | 'WEEKLY' = 'MONTHLY', limit: number = 6): Promise<RevenueTrendResponse> => {
        const response = await apiClient.get<ApiResponse<RevenueTrendResponse>>(`/admin/dashboard/revenue-trends?periodType=${periodType}&limit=${limit}`);
        return response.data;
    },

    getActivityStatus: async (): Promise<ActivityStatus> => {
        const response = await apiClient.get<ApiResponse<ActivityStatus>>('/admin/dashboard/activity-status');
        return response.data;
    },

    getSalesByType: async (): Promise<SalesByType> => {
        const response = await apiClient.get<ApiResponse<SalesByType>>('/admin/dashboard/sales-by-type');
        return response.data;
    },

    getTopActivities: async (type: 'WORKSHOP' | 'EVENT' = 'WORKSHOP', limit: number = 5): Promise<TopActivity[]> => {
        const response = await apiClient.get<ApiResponse<TopActivity[]>>(`/admin/dashboard/top-activities?type=${type}&limit=${limit}`);
        return response.data;
    },

    getRegistrations: async (type: 'USER' | 'VENDOR' = 'USER', periodType: 'MONTHLY' | 'WEEKLY' = 'MONTHLY', limit: number = 6): Promise<RegistrationTrendResponse> => {
        const response = await apiClient.get<ApiResponse<RegistrationTrendResponse>>(`/admin/dashboard/registrations?type=${type}&periodType=${periodType}&limit=${limit}`);
        return response.data;
    },

    getRecentActivities: async (limit: number = 10): Promise<RecentActivity[]> => {
        const response = await apiClient.get<ApiResponse<RecentActivity[]>>(`/admin/dashboard/recent-activities?limit=${limit}`);
        return response.data;
    }
};

export default adminDashboardService;
