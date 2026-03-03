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

export interface RevenueKPIs {
    totalRevenue: number;
    netRevenue: number;
    totalTransactions: number;
    avgOrderValue: number;
    revenueGrowth: number;
    netRevenueGrowth: number;
    avgOrderValueGrowth: number;
}

export interface RevenueByVendor {
    vendorName: string;
    totalRevenue: number;
    percentage: number;
}

export interface Transaction {
    date: string;
    transactionId: string;
    vendorName: string;
    itemName: string;
    grossAmount: number;
    fee: number;
    netAmount: number;
    status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
}

export interface RevenueReport {
    kpis: RevenueKPIs;
    revenueTrends: RevenueTrendPoint[];
    revenueByVendor: RevenueByVendor[];
    transactions: Transaction[];
}
