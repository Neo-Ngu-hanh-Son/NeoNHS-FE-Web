import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
    DollarOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { authService } from '@/services/api/authService';
import VendorService from '@/services/api/vendorService';
import type { VendorProfile, VendorStats } from '@/types';
import { Button } from 'antd';

export default function VendorDashboardPage() {
    const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [stats, setStats] = useState<VendorStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [_, vendorData] = await Promise.all([
                authService.getCurrentUser(),
                VendorService.getVendorProfile(),
            ]);
            setVendor(vendorData);

            // Mock stats - replace with actual API call
            setStats({
                totalOrders: 156,
                totalRevenue: 45280,
                totalProducts: 24,
                pendingOrders: 8,
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="bg-[#0f2e1b] rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                        {vendor?.businessName || 'Your Business'} Dashboard 🏪
                    </h1>
                    <p className="text-green-100 text-lg opacity-80">
                        Manage your workshops, track your performance, and grow your business.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue.toLocaleString() || '0'}`}
                    icon={<DollarOutlined />}
                    trend={{ value: 12.5, isPositive: true }}
                    gradientFrom="from-green-500"
                    gradientTo="to-emerald-600"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    icon={<ShoppingOutlined />}
                    trend={{ value: 8.2, isPositive: true }}
                    gradientFrom="from-blue-500"
                    gradientTo="to-blue-600"
                />
                <StatsCard
                    title="Workshops"
                    value={stats?.totalProducts || 0}
                    icon={<AppstoreOutlined />}
                    trend={{ value: 3, isPositive: false }}
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-600"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats?.pendingOrders || 0}
                    icon={<ClockCircleOutlined />}
                    gradientFrom="from-purple-500"
                    gradientTo="to-purple-600"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <DashboardCard
                        title="Revenue Overview"
                        subtitle="Last 7 days performance"
                        actions={
                            <Button icon={<LineChartOutlined />} className="border-primary text-primary">
                                View Full Report
                            </Button>
                        }
                    >
                        <div className="h-64 flex items-center justify-center bg-background-light dark:bg-white/5 rounded-xl border border-dashed border-primary/20">
                            <div className="text-center">
                                <LineChartOutlined className="text-6xl text-primary/30 mb-4" />
                                <p className="text-gray-500">Revenue analytics visualization coming soon</p>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
                <div>
                    <DashboardCard
                        title="Recent Orders"
                        subtitle="Latest customer orders"
                    >
                        <EmptyState
                            icon={<ShoppingOutlined />}
                            title="No recent orders"
                            description="New orders will appear here"
                        />
                    </DashboardCard>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <DashboardCard
                    title="Your Workshops"
                    subtitle="Best performing workshop templates"
                    actions={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="bg-primary border-0"
                        >
                            Create Workshop
                        </Button>
                    }
                >
                    <EmptyState
                        icon={<AppstoreOutlined />}
                        title="No workshops yet"
                        description="Start by creating a workshop template for tourists to book"
                        action={
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                className="bg-primary border-0"
                            >
                                Add Your First Workshop
                            </Button>
                        }
                    />
                </DashboardCard>
            </div>
        </div>
    );
}
