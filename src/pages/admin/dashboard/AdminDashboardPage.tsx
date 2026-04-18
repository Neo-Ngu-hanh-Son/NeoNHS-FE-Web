import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
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

    const [revenuePeriod, setRevenuePeriod] = useState<'MONTHLY' | 'WEEKLY'>('MONTHLY');
    const [regType, setRegType] = useState<'USER' | 'VENDOR'>('USER');

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [kpiData, revData, actData, salesData, topEvents, topWorkshops, regData, recentData] = await Promise.all([
                adminDashboardService.getKPIs(),
                adminDashboardService.getRevenueTrends(revenuePeriod),
                adminDashboardService.getActivityStatus(),
                adminDashboardService.getSalesByType(),
                adminDashboardService.getTopActivities('EVENT', 5),
                adminDashboardService.getTopActivities('WORKSHOP', 5),
                adminDashboardService.getRegistrations(regType),
                adminDashboardService.getRecentActivities(10)
            ]);

            const combinedTop = [
                ...topEvents.map(e => ({ ...e, type: 'EVENT' as const })),
                ...topWorkshops.map(w => ({ ...w, type: 'WORKSHOP' as const }))
            ]
                .sort((a, b) => b.ticketsSold - a.ticketsSold)
                .slice(0, 5);

            setKpis(kpiData);
            setRevenueTrendsData(revData);
            setActivityStatus(actData);
            setSalesByType(salesData);
            setTopActivities(combinedTop);
            setRegistrationsData(regData);
            setRecentActivities(recentData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

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
            <div className="flex min-h-[50vh] items-center justify-center p-12">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl p-4">
            <Row gutter={[16, 16]} align="stretch">
                <Col span={24} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-transparent">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Bảng điều khiển quản trị
                                </h1>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    Nền tảng quản lý hệ thống du lịch NeoNHS
                                </p>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-2.5 px-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                                <ClockCircleOutlined className="text-primary" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {new Date().toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <KPIStats kpis={kpis} />
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} lg={12} style={{ display: 'flex', minHeight: 360 }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <RevenueTrendsChart
                                    revenueTrends={revenueTrendsData?.trends ?? []}
                                    summary={revenueTrendsData?.summary}
                                    revenuePeriod={revenuePeriod}
                                    setRevenuePeriod={setRevenuePeriod}
                                />
                            </div>
                        </Col>
                        <Col xs={24} lg={12} style={{ display: 'flex', minHeight: 360 }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <RegistrationTrendsChart
                                    registrations={registrationsData?.trends ?? []}
                                    summary={registrationsData?.summary}
                                    regType={regType}
                                    setRegType={setRegType}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 16, flex: 1 }}>
                        <Col xs={24} lg={9} style={{ display: 'flex' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <SalesByTypeChart
                                    salesByType={salesByType}
                                    activityStatus={activityStatus}
                                />
                            </div>
                        </Col>
                        <Col xs={24} lg={15} style={{ display: 'flex' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <TopActivitiesTable topActivities={topActivities} />
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col span={24} style={{ marginTop: 16 }}>
                    <RecentActivitiesTimeline activities={recentActivities} />
                </Col>
            </Row>
        </div>
    );
}

export default AdminDashboardPage;
