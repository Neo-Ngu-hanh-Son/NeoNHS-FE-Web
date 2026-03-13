import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { ClockCircleOutlined } from '@ant-design/icons';
import adminDashboardService from '@/services/api/adminDashboardService';
import {
    AdminKPIs,
    ActivityStatus,
    SalesByType,
    TopActivity,
    RecentActivity,
    RevenueTrendResponse,
    RegistrationTrendResponse
} from '@/types/adminDashboard';

// Modular Components
import { KPIStats } from './components/KPIStats';
import { RevenueTrendsChart } from './components/RevenueTrendsChart';
import { RegistrationTrendsChart } from './components/RegistrationTrendsChart';
import { SalesByTypeChart } from './components/SalesByTypeChart';
import { TopActivitiesTable } from './components/TopActivitiesTable';
import { RecentActivitiesTimeline } from './components/RecentActivitiesTimeline';

export function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState<AdminKPIs | null>(null);
    const [revenueTrendsData, setRevenueTrendsData] = useState<RevenueTrendResponse | null>(null);
    const [activityStatus, setActivityStatus] = useState<ActivityStatus | null>(null);
    const [salesByType, setSalesByType] = useState<SalesByType | null>(null);
    const [topActivities, setTopActivities] = useState<TopActivity[]>([]);
    const [registrationsData, setRegistrationsData] = useState<RegistrationTrendResponse | null>(null);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

    // Filters
    const [revenuePeriod, setRevenuePeriod] = useState<'MONTHLY' | 'WEEKLY'>('MONTHLY');
    const [regType, setRegType] = useState<'USER' | 'VENDOR'>('USER');

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [kpiData, revData, actData, salesData, topData, regData, recentData] = await Promise.all([
                adminDashboardService.getKPIs(),
                adminDashboardService.getRevenueTrends(revenuePeriod),
                adminDashboardService.getActivityStatus(),
                adminDashboardService.getSalesByType(),
                adminDashboardService.getTopActivities('EVENT', 5),
                adminDashboardService.getRegistrations(regType),
                adminDashboardService.getRecentActivities(10)
            ]);

            setKpis(kpiData);
            setRevenueTrendsData(revData);
            setActivityStatus(actData);
            setSalesByType(salesData);
            setTopActivities(topData);
            setRegistrationsData(regData);
            setRecentActivities(recentData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Reload revenue trends when period changes
    useEffect(() => {
        const reloadRevenue = async () => {
            try {
                const data = await adminDashboardService.getRevenueTrends(revenuePeriod);
                setRevenueTrendsData(data);
            } catch (error) {
                console.error('Error reloading revenue:', error);
            }
        };
        if (!loading) reloadRevenue();
    }, [revenuePeriod]);

    // Reload registrations when type changes
    useEffect(() => {
        const reloadReg = async () => {
            try {
                const data = await adminDashboardService.getRegistrations(regType);
                setRegistrationsData(data);
            } catch (error) {
                console.error('Error reloading registrations:', error);
            }
        };
        if (!loading) reloadReg();
    }, [regType]);

    if (loading && !kpis) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="size-16 border-4 border-primary border-t-transparent rounded-full shadow-lg"
                />
            </div>
        );
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0, scale: 0.98 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 max-w-7xl mx-auto p-4 md:p-6"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Management platform for NeoNHS Tourism System</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-xl shadow-sm border border-gray-100">
                    <ClockCircleOutlined className="text-primary" />
                    <span className="text-sm font-semibold text-gray-700">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* KPI Stats Grid */}
            <motion.div variants={itemVariants}>
                <KPIStats kpis={kpis} />
            </motion.div>

            {/* Charts & Analytical Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="h-full flex flex-col">
                    <RevenueTrendsChart
                        revenueTrends={revenueTrendsData?.trends ?? []}
                        summary={revenueTrendsData?.summary}
                        revenuePeriod={revenuePeriod}
                        setRevenuePeriod={setRevenuePeriod}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="h-full flex flex-col">
                    <RegistrationTrendsChart
                        registrations={registrationsData?.trends ?? []}
                        summary={registrationsData?.summary}
                        regType={regType}
                        setRegType={setRegType}
                    />
                </motion.div>
            </div>

            {/* Workshop & Event Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <SalesByTypeChart
                        salesByType={salesByType}
                        activityStatus={activityStatus}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <TopActivitiesTable
                        topActivities={topActivities}
                    />
                </motion.div>
            </div>

            {/* Recent Activities Section */}
            <div className="pb-10">
                <motion.div variants={itemVariants}>
                    <RecentActivitiesTimeline activities={recentActivities} />
                </motion.div>
            </div>
        </motion.div>
    );
}

export default AdminDashboardPage;
