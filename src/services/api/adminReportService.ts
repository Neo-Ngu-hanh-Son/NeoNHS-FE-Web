import apiClient from './apiClient';
import { ApiResponse } from '@/types';
import { AdminReport, ReportFilter, ResolveReportRequest, SpringPage } from '@/types/adminReport';

const adminReportService = {
    getReports: async (params: ReportFilter): Promise<SpringPage<AdminReport>> => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
        const query = queryParams.toString();
        const response = await apiClient.get<ApiResponse<SpringPage<AdminReport>>>(`/admin/reports${query ? `?${query}` : ''}`);
        return response.data;
    },

    getReportDetail: async (id: number | string): Promise<AdminReport> => {
        const response = await apiClient.get<ApiResponse<AdminReport>>(`/admin/reports/${id}`);
        return response.data;
    },

    resolveReport: async (id: number | string, data: ResolveReportRequest): Promise<void> => {
        await apiClient.patch<ApiResponse<void>>(`/admin/reports/${id}/resolve`, data);
    }
};

export default adminReportService;
