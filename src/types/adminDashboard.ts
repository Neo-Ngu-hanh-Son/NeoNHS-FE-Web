export interface AdminKPIs {
    totalUsers: number;
    activeVendors: number;
    ticketsSold: number;
    revenue: number;
}

export interface RevenueTrendPoint {
    period: string;
    revenue: number;
}

export interface ActivityStatus {
    workshop: {
        TOTAL: number;
    };
    event: {
        TOTAL: number;
    };
}

export interface SalesByType {
    workshop: {
        ticketsSold: number;
        revenue: number;
    };
    event: {
        ticketsSold: number;
        revenue: number;
    };
}

export interface TopActivity {
    id: string;
    name: string;
    ticketsSold: number;
}

export interface RegistrationTrendPoint {
    period: string;
    count: number;
}

export interface RecentActivity {
    vendorId: string | null;
    vendorName: string;
    action: string;
    targetName: string;
    time: string;
}
