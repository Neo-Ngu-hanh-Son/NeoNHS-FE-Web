import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import {
    UserOutlined,
    ShopOutlined,
    DollarOutlined,
    ShoppingOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { authService } from '@/services/api/authService';
import type { User } from '@/types';

export function AdminDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
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
            <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Admin Dashboard 🛡️
                    </h1>
                    <p className="text-pink-100 text-lg">
                        Monitor and manage the entire platform
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Users"
                    value="1,234"
                    icon={<UserOutlined />}
                    trend={{ value: 12, isPositive: true }}
                    gradientFrom="from-blue-500"
                    gradientTo="to-blue-600"
                />
                <StatsCard
                    title="Total Vendors"
                    value="156"
                    icon={<ShopOutlined />}
                    trend={{ value: 8, isPositive: true }}
                    gradientFrom="from-purple-500"
                    gradientTo="to-purple-600"
                />
                <StatsCard
                    title="Total Revenue"
                    value="$125,430"
                    icon={<DollarOutlined />}
                    trend={{ value: 15, isPositive: true }}
                    gradientFrom="from-green-500"
                    gradientTo="to-emerald-600"
                />
                <StatsCard
                    title="Total Bookings"
                    value="2,456"
                    icon={<ShoppingOutlined />}
                    trend={{ value: 5, isPositive: false }}
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-600"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <DashboardCard
                    title="User Growth"
                    subtitle="New users over time"
                >
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                        <div className="text-center">
                            <LineChartOutlined className="text-6xl text-blue-400 mb-4" />
                            <p className="text-gray-600">User growth chart coming soon</p>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard
                    title="Revenue Overview"
                    subtitle="Platform revenue trends"
                >
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                        <div className="text-center">
                            <DollarOutlined className="text-6xl text-green-400 mb-4" />
                            <p className="text-gray-600">Revenue chart coming soon</p>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* Recent Activity */}
            <DashboardCard
                title="Recent Activities"
                subtitle="Latest platform activities"
            >
                <div className="space-y-4">
                    {[
                        { action: 'New user registered', user: 'John Doe', time: '5 minutes ago', color: 'blue' },
                        { action: 'Vendor verified', user: 'ABC Shop', time: '15 minutes ago', color: 'green' },
                        { action: 'New booking created', user: 'Jane Smith', time: '1 hour ago', color: 'purple' },
                        { action: 'Product added', user: 'XYZ Store', time: '2 hours ago', color: 'amber' },
                    ].map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{activity.action}</p>
                                <p className="text-sm text-gray-600">{activity.user}</p>
                            </div>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        </DashboardLayout>
    );
}

export default AdminDashboardPage;
