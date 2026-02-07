import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
    ShoppingOutlined,
    HeartOutlined,
    StarOutlined,
    PlusOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { authService } from '@/services/api/authService';
import type { User } from '@/types';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export function UserDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to load user data:', error);
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
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.fullname || 'Guest'}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Ready to explore amazing destinations today?
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Bookings"
                    value="12"
                    icon={<ShoppingOutlined />}
                    trend={{ value: 15, isPositive: true }}
                    gradientFrom="from-blue-500"
                    gradientTo="to-blue-600"
                />
                <StatsCard
                    title="Favorites"
                    value="24"
                    icon={<HeartOutlined />}
                    trend={{ value: 8, isPositive: true }}
                    gradientFrom="from-pink-500"
                    gradientTo="to-rose-600"
                />
                <StatsCard
                    title="Reviews"
                    value="8"
                    icon={<StarOutlined />}
                    trend={{ value: 3, isPositive: false }}
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Bookings */}
                <DashboardCard
                    title="Recent Bookings"
                    subtitle="Your latest travel bookings"
                    actions={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                        >
                            New Booking
                        </Button>
                    }
                >
                    <EmptyState
                        icon={<ShoppingOutlined />}
                        title="No bookings yet"
                        description="Start exploring and book your first adventure!"
                        action={
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                                onClick={() => navigate('/')}
                            >
                                Explore Tours
                            </Button>
                        }
                    />
                </DashboardCard>

                {/* Upcoming Trips */}
                <DashboardCard
                    title="Upcoming Trips"
                    subtitle="Your scheduled adventures"
                >
                    <EmptyState
                        icon={<CalendarOutlined />}
                        title="No upcoming trips"
                        description="Book a tour to see your upcoming adventures here"
                    />
                </DashboardCard>
            </div>

            {/* Recommended Tours */}
            <DashboardCard
                title="Recommended for You"
                subtitle="Popular destinations based on your interests"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <EnvironmentOutlined className="text-white text-6xl opacity-50" />
                                </div>
                            </div>
                            <div className="p-4 bg-white">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Amazing Destination {item}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    Explore beautiful places
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-600 font-bold">$299</span>
                                    <Button
                                        type="primary"
                                        size="small"
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        </DashboardLayout>
    );
}

export default UserDashboardPage;
