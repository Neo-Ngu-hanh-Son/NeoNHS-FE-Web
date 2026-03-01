import apiClient from './apiClient';
import {
    AdminKPIs,
    RevenueTrendPoint,
    ActivityStatus,
    SalesByType,
    TopActivity,
    RegistrationTrendPoint,
    RecentActivity,
    RevenueReport
} from '@/types/adminDashboard';
import { ApiResponse } from '@/types';

const adminDashboardService = {
    getKPIs: async (): Promise<AdminKPIs> => {
        const response = await apiClient.get<ApiResponse<AdminKPIs>>('/admin/dashboard/kpi');
        return response.data;
    },

    getRevenueReport: async (startDate: string, endDate: string): Promise<RevenueReport> => {
        const response = await apiClient.get<ApiResponse<RevenueReport>>(`/admin/revenue/revenue-report?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    },

    getRevenueTrends: async (periodType: 'MONTHLY' | 'WEEKLY' = 'MONTHLY', limit: number = 6): Promise<RevenueTrendPoint[]> => {
        const response = await apiClient.get<ApiResponse<RevenueTrendPoint[]>>(`/admin/dashboard/revenue-trends?periodType=${periodType}&limit=${limit}`);
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

    getRegistrations: async (type: 'USER' | 'VENDOR' = 'USER', periodType: 'MONTHLY' | 'WEEKLY' = 'MONTHLY', limit: number = 6): Promise<RegistrationTrendPoint[]> => {
        const response = await apiClient.get<ApiResponse<RegistrationTrendPoint[]>>(`/admin/dashboard/registrations?type=${type}&periodType=${periodType}&limit=${limit}`);
        return response.data;
    },

    getRecentActivities: async (limit: number = 10): Promise<RecentActivity[]> => {
        const response = await apiClient.get<ApiResponse<RecentActivity[]>>(`/admin/dashboard/recent-activities?limit=${limit}`);
        return response.data;
    }
};

export default adminDashboardService;
