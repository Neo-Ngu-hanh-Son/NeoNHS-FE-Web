export interface AdminKPIs {
    totalUsers: number;
    activeVendors: number;
    ticketsSold: number;
    revenue: number;
}

export interface RevenueTrendPoint {
    periodKey: string;
    period: string;
    revenue: number;
    previousRevenue: number;
    transactionCount: number;
}

export interface RevenueTrendResponse {
    summary: {
        currentTotal: number;
        previousTotal: number;
        growthRate: number;
        averageValue: number;
        peakValue: number;
        peakPeriod: string;
    };
    trends: RevenueTrendPoint[];
    metadata: {
        currency: string;
        periodType: string;
        pointCount: number;
    };
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
    periodKey: string;
    period: string;
    count: number;
    previousCount: number;
    breakdown: {
        individual: number;
        organization: number;
    };
}

export interface RegistrationTrendResponse {
    summary: {
        totalJoined: number;
        previousTotal: number;
        growthRate: number;
        activePercentage: number;
    };
    trends: RegistrationTrendPoint[];
}

export interface RecentActivity {
    vendorId: string | null;
    vendorName: string;
    action: string;
    targetName: string;
    time: string;
}

export interface RevenueKPIs {
    adminEarnings: number;
    totalGross: number;
    totalTransactions: number;
    vendorPayouts: number;
    // Optional since not in current report response
    revenueGrowth?: number;
    netRevenueGrowth?: number;
    avgOrderValueGrowth?: number;
}

export interface RevenueByVendor {
    vendorName: string;
    amount: number;
    percentage?: number; // Calculated on frontend if missing
}

export interface Transaction {
    date: string;
    fee: number;
    gross: number;
    id: string;
    item: string;
    net: number;
    status: 'SUCCESS' | 'COMPLETED' | 'PENDING' | 'REFUNDED';
    vendor: string;
}

export interface RevenueReport {
    summary: RevenueKPIs;
    revenueTrends: RevenueTrendPoint[];
    vendorBreakdown: RevenueByVendor[];
    transactions: Transaction[];
}
