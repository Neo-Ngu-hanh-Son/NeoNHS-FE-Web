import apiClient from './apiClient';
import type {
    DashboardStats,
    RevenueFilter,
    RevenueSeriesResponse,
    SessionsResponse,
    TransactionResponse,
    WorkshopReviewResponse,
    WorkshopStatusItem,
} from '@/pages/vendor/dashboard/types';

interface ApiEnvelope<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

const BASE = '/vendor/dashboard';

export const vendorDashboardService = {
    getStats: () =>
        apiClient.get<ApiEnvelope<DashboardStats>>(`${BASE}/stats`).then((res) => res.data),

    getRevenue: (range: RevenueFilter) =>
        apiClient.get<ApiEnvelope<RevenueSeriesResponse>>(`${BASE}/revenue?range=${range}`).then((res) => res.data),

    getWorkshopStatus: () =>
        apiClient.get<ApiEnvelope<WorkshopStatusItem[]>>(`${BASE}/workshop-status`).then((res) => res.data),

    getTransactions: (limit = 10) =>
        apiClient.get<ApiEnvelope<TransactionResponse[]>>(`${BASE}/transactions?limit=${limit}`).then((res) => res.data),

    getWorkshopReviews: (limit = 10) =>
        apiClient.get<ApiEnvelope<WorkshopReviewResponse[]>>(`${BASE}/workshop-reviews?limit=${limit}`).then((res) => res.data),

    getSessions: () =>
        apiClient.get<ApiEnvelope<SessionsResponse>>(`${BASE}/sessions`).then((res) => res.data),
};
