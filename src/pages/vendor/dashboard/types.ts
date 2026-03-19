export type RevenueFilter = 'week' | 'month' | 'year';

export type TrendDirection = 'up' | 'down' | 'flat';

// ── Backend API response types ──

export interface StatItem {
    value: number;
    currency?: string;
    trendPercent: number;
    trendDirection: TrendDirection;
}

export interface DashboardStats {
    revenue: StatItem;
    workshops: StatItem;
    bookings: StatItem;
    vouchers: StatItem;
}

export interface RevenueSeriesResponse {
    range: RevenueFilter;
    points: { label: string; revenue: number }[];
}

export interface WorkshopStatusItem {
    name: 'Active' | 'Pending' | 'Register' | 'Draft';
    value: number;
}

export interface TransactionResponse {
    id: string;
    workshopName: string;
    customerName: string;
    amount: number;
    currency?: string;
    paidAt: string;
    status: 'completed' | 'pending' | 'refunded';
}

export interface WorkshopReviewResponse {
    workshopId: number;
    workshopName: string;
    totalReviews: number;
    averageRating: number;
    newReviewsInWindow: number;
}

export interface SessionItem {
    workshopId: number;
    workshopName: string;
    sessionId: number;
    startAt: string;
    endAt: string;
    remainingSlots: number;
}

export interface SessionsResponse {
    highlightDates: string[];
    byDate: Record<string, SessionItem[]>;
}

// ── Frontend UI types (used by components) ──

export interface RevenuePoint {
    name: string;
    revenue: number;
}

export interface WorkshopStatusPoint {
    name: 'Active' | 'Pending' | 'Register' | 'Draft';
    value: number;
}

export interface Transaction {
    id: string;
    workshop: string;
    customer: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'refunded';
}

export interface WorkshopReview {
    workshop: string;
    totalReviews: number;
    avgRating: number;
    recent: string;
}

export interface DaySessionItem {
    workshopName: string;
    workshopId: number;
    time: string;
    slots: number;
    date: Date;
}

export interface NotificationItem {
    id: number;
    type: 'booking' | 'system' | 'review' | 'payment';
    message: string;
    time: string;
    read: boolean;
}
