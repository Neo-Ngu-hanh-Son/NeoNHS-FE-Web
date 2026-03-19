import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { vendorDashboardService } from '@/services/api/vendorDashboardService';
import type {
    DashboardStats,
    DaySessionItem,
    RevenueFilter,
    RevenuePoint,
    SessionsResponse,
    Transaction,
    WorkshopReview,
    WorkshopStatusPoint,
} from '@/pages/vendor/dashboard/types';

export function useVendorDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>('week');
    const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
    const [workshopStatus, setWorkshopStatus] = useState<WorkshopStatusPoint[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [reviews, setReviews] = useState<WorkshopReview[]>([]);
    const [sessionsData, setSessionsData] = useState<SessionsResponse | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const fetchStats = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getStats();
            console.log('[Dashboard] stats:', data);
            setStats(data);
        } catch (err) {
            console.error('[Dashboard] stats error:', err);
            message.error('Failed to load dashboard stats');
        }
    }, []);

    const fetchRevenue = useCallback(async (range: RevenueFilter) => {
        try {
            const data = await vendorDashboardService.getRevenue(range);
            console.log('[Dashboard] revenue:', data);
            setRevenueData(
                data.points.map((p) => ({ name: p.label, revenue: p.revenue })),
            );
        } catch (err) {
            console.error('[Dashboard] revenue error:', err);
            message.error('Failed to load revenue data');
        }
    }, []);

    const fetchWorkshopStatus = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getWorkshopStatus();
            console.log('[Dashboard] workshopStatus:', data);
            setWorkshopStatus(
                data.map((d) => ({ name: d.name, value: d.value })),
            );
        } catch (err) {
            console.error('[Dashboard] workshopStatus error:', err);
            message.error('Failed to load workshop status');
        }
    }, []);

    const fetchTransactions = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getTransactions();
            console.log('[Dashboard] transactions:', data);
            setTransactions(
                data.map((t) => ({
                    id: t.id,
                    workshop: t.workshopName,
                    customer: t.customerName,
                    amount: t.amount,
                    date: t.paidAt,
                    status: t.status,
                })),
            );
        } catch (err) {
            console.error('[Dashboard] transactions error:', err);
            message.error('Failed to load transactions');
        }
    }, []);

    const fetchReviews = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getWorkshopReviews();
            console.log('[Dashboard] reviews:', data);
            setReviews(
                data.map((r) => ({
                    workshop: r.workshopName,
                    totalReviews: r.totalReviews,
                    avgRating: r.averageRating,
                    recent: `+${r.newReviewsInWindow} this week`,
                })),
            );
        } catch (err) {
            console.error('[Dashboard] reviews error:', err);
            message.error('Failed to load workshop reviews');
        }
    }, []);

    const fetchSessions = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getSessions();
            console.log('[Dashboard] sessions:', data);
            setSessionsData(data);
        } catch (err) {
            console.error('[Dashboard] sessions error:', err);
            message.error('Failed to load session data');
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchStats(),
            fetchRevenue(revenueFilter),
            fetchWorkshopStatus(),
            fetchTransactions(),
            fetchReviews(),
            fetchSessions(),
        ]).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchRevenue(revenueFilter);
    }, [revenueFilter, fetchRevenue]);

    const sessionDates: Date[] = (sessionsData?.highlightDates ?? []).map(
        (d) => new Date(d),
    );

    const selectedDateStr = selectedDate
        ? selectedDate.toISOString().slice(0, 10)
        : '';

    const selectedDaySessions: DaySessionItem[] = (
        sessionsData?.byDate?.[selectedDateStr] ?? []
    ).map((s) => {
        const start = new Date(s.startAt);
        const end = new Date(s.endAt);
        const fmt = (d: Date) =>
            d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return {
            workshopName: s.workshopName,
            workshopId: s.workshopId,
            time: `${fmt(start)} - ${fmt(end)}`,
            slots: s.remainingSlots,
            date: start,
        };
    });

    return {
        loading,
        stats,
        revenueFilter,
        setRevenueFilter,
        revenueData,
        workshopStatus,
        transactions,
        reviews,
        selectedDate,
        setSelectedDate,
        sessionDates,
        selectedDaySessions,
    };
}
