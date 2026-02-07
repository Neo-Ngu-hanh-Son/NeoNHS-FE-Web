import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
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
import type { User, VendorProfile, VendorStats } from '@/types';
import { Button } from 'antd';

export function VendorDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [stats, setStats] = useState<VendorStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [userData, vendorData] = await Promise.all([
                authService.getCurrentUser(),
                VendorService.getVendorProfile(),
            ]);
            setUser(userData);
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
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                        {vendor?.businessName || 'Your Business'} Dashboard 🏪
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Manage your business and track performance
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
                    title="Products"
                    value={stats?.totalProducts || 0}
                    icon={<AppstoreOutlined />}
                    trend={{ value: 3, isPositive: false }}
                    gradientFrom="from-purple-500"
                    gradientTo="to-purple-600"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats?.pendingOrders || 0}
                    icon={<ClockCircleOutlined />}
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-600"
                />
            </div>

            {/* Revenue Chart */}
            <div className="mb-8">
                <DashboardCard
                    title="Revenue Overview"
                    subtitle="Last 7 days performance"
                    actions={
                        <Button icon={<LineChartOutlined />}>
                            View Full Report
                        </Button>
                    }
                >
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                        <div className="text-center">
                            <LineChartOutlined className="text-6xl text-blue-400 mb-4" />
                            <p className="text-gray-600">Chart visualization coming soon</p>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCard
                    title="Recent Orders"
                    subtitle="Latest customer orders"
                    actions={
                        <Button type="link">View All</Button>
                    }
                >
                    <EmptyState
                        icon={<ShoppingOutlined />}
                        title="No recent orders"
                        description="New orders will appear here"
                    />
                </DashboardCard>

                <DashboardCard
                    title="Top Products"
                    subtitle="Best performing products"
                    actions={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 border-0"
                        >
                            Add Product
                        </Button>
                    }
                >
                    <EmptyState
                        icon={<AppstoreOutlined />}
                        title="No products yet"
                        description="Start adding products to your shop"
                        action={
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 border-0"
                            >
                                Add Your First Product
                            </Button>
                        }
                    />
                </DashboardCard>
            </div>
        </DashboardLayout>
    );
}

export default VendorDashboardPage;
