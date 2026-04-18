import { useCallback, useEffect, useRef, useState } from 'react';
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

/**
 * Groups daily revenue points from the API into calendar weeks for the given month.
 * A new week starts on Sunday. The first "week" covers day-1 to the first Saturday.
 *
 * Example (April 2026, where Apr 1 = Wednesday):
 *   Week 1 (1-4/4)   → days 1–4
 *   Week 2 (5-11/4)  → days 5–11
 *   Week 3 (12-18/4) → days 12–18
 *   Week 4 (19-25/4) → days 19–25
 *   Week 5 (26-30/4) → days 26–30
 *
 * `points[].label` can be a full date ("2026-04-03"), a zero-padded day ("03"),
 * or a plain day number ("3").
 */
function groupMonthByWeeks(
    points: { label: string; revenue: number }[],
    referenceDate: Date,
): RevenuePoint[] {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth(); // 0-indexed
    const monthDisplay = month + 1;         // for label (1-indexed)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Build day-number → revenue map; accumulate in case of duplicate labels
    const dayRevenue: Record<number, number> = {};
    for (let d = 1; d <= daysInMonth; d++) dayRevenue[d] = 0;

    for (const p of points) {
        // Extract the day number from labels like "2026-04-03", "03", or "3"
        const raw = p.label.split('-').pop() ?? p.label;
        const day = parseInt(raw, 10);
        if (!isNaN(day) && day >= 1 && day <= daysInMonth) {
            dayRevenue[day] += p.revenue;
        }
    }

    // Split days into week buckets; a new week starts when getDay() === 0 (Sunday)
    const weeks: { start: number; end: number; revenue: number }[] = [];
    let weekStart = 1;
    let weekRevenue = 0;

    for (let d = 1; d <= daysInMonth; d++) {
        const dayOfWeek = new Date(year, month, d).getDay(); // 0 = Sunday
        if (d > 1 && dayOfWeek === 0) {
            // Close the previous week on Saturday, open new week on Sunday
            weeks.push({ start: weekStart, end: d - 1, revenue: weekRevenue });
            weekStart = d;
            weekRevenue = 0;
        }
        weekRevenue += dayRevenue[d];
    }
    // Flush the final (possibly partial) week
    weeks.push({ start: weekStart, end: daysInMonth, revenue: weekRevenue });

    return weeks.map((w, i) => ({
        name: `${w.start}-${w.end}`,
        revenue: w.revenue,
    }));
}

export function useVendorDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>('week');
    const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
    const [revenueError, setRevenueError] = useState<string | null>(null);
    const [workshopStatus, setWorkshopStatus] = useState<WorkshopStatusPoint[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [reviews, setReviews] = useState<WorkshopReview[]>([]);
    const [sessionsData, setSessionsData] = useState<SessionsResponse | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const fetchStats = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getStats();
            setStats(data);
        } catch (err) {
            message.error('Không tải được thống kê bảng điều khiển');
        }
    }, []);

    const fetchRevenue = useCallback(async (range: RevenueFilter) => {
        setRevenueError(null);
        try {
            const data = await vendorDashboardService.getRevenue(range);
            const points = data?.points ?? [];

            if (range === 'month') {
                // Group daily points into calendar weeks (Sunday = week start)
                setRevenueData(groupMonthByWeeks(points, new Date()));
            } else {
                setRevenueData(
                    points.map((p) => ({ name: p.label, revenue: p.revenue })),
                );
            }
        } catch (err: any) {
            setRevenueError(err?.message ?? 'Không tải được dữ liệu doanh thu');
            setRevenueData([]);
        }
    }, []);

    const fetchWorkshopStatus = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getWorkshopStatus();
            setWorkshopStatus(
                data.map((d) => ({ name: d.name, value: d.value })),
            );
        } catch (err) {
            message.error('Không tải được trạng thái workshop');
        }
    }, []);

    const fetchTransactions = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getTransactions();
            setTransactions(
                data.map((t) => ({
                    id: t.id,
                    workshop: t.workshopName,
                    customer: t.customerName,
                    amount: t.amount,
                    ticketCodes: t.ticketCodes ? t.ticketCodes.split(',') : [],
                    date: t.paidAt,
                    status: t.status,
                })),
            );
        } catch (err) {
            message.error('Không tải được danh sách giao dịch');
        }
    }, []);

    const fetchReviews = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getWorkshopReviews();
            setReviews(
                data.map((r) => ({
                    workshop: r.workshopName,
                    totalReviews: r.totalReviews,
                    avgRating: r.averageRating,
                    recent: `+${r.newReviewsInWindow} tuần này`,
                })),
            );
        } catch (err) {
            message.error('Không tải được đánh giá workshop');
        }
    }, []);

    const fetchSessions = useCallback(async () => {
        try {
            const data = await vendorDashboardService.getSessions();
            setSessionsData(data);
        } catch (err) {
            message.error('Không tải được dữ liệu phiên');
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refetch only when the filter changes (not on initial mount — handled above)
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
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
            d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
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
        revenueError,
        workshopStatus,
        transactions,
        reviews,
        selectedDate,
        setSelectedDate,
        sessionDates,
        selectedDaySessions,
    };
}
