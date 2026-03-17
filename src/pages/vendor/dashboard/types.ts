export type RevenueFilter = 'week' | 'month' | 'year';

export interface RevenuePoint {
    name: string;
    revenue: number;
}

export interface WorkshopStatusPoint {
    name: 'Active' | 'Pending' | 'Register' | 'Draft';
    value: number;
    fill: string;
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

export interface WorkshopSession {
    date: Date;
    time: string;
    slots: number;
}

export interface Workshop {
    id: number;
    name: string;
    sessions: WorkshopSession[];
}

export interface NotificationItem {
    id: number;
    type: 'booking' | 'system' | 'review' | 'payment';
    message: string;
    time: string;
    read: boolean;
}

export interface WeeklySessionItem extends WorkshopSession {
    workshopName: string;
    workshopId: number;
}
