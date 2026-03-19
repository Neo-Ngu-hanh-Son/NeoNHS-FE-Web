import { Col } from 'antd';
import { Briefcase, CalendarCheck, DollarSign, Ticket } from 'lucide-react';
import { StatCard } from './StatCard';
import type { DashboardStats } from '../types';

interface DashboardStatsRowProps {
    stats: DashboardStats | null;
}

export function DashboardStatsRow({ stats }: DashboardStatsRowProps) {
    const revenue = stats?.revenue;
    const workshops = stats?.workshops;
    const bookings = stats?.bookings;
    const vouchers = stats?.vouchers;

    const formatCurrency = (value?: number, currency?: string) => {
        if (value == null) return '--';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency ?? 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Revenue"
                    value={formatCurrency(revenue?.value, revenue?.currency)}
                    icon={DollarSign}
                    trend={revenue ? { value: revenue.trendPercent, isPositive: revenue.trendDirection === 'up' } : undefined}
                    iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Workshops"
                    value={workshops?.value?.toString() ?? '--'}
                    icon={Briefcase}
                    trend={workshops ? { value: workshops.trendPercent, isPositive: workshops.trendDirection === 'up' } : undefined}
                    iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Bookings"
                    value={bookings?.value?.toString() ?? '--'}
                    icon={CalendarCheck}
                    trend={bookings ? { value: bookings.trendPercent, isPositive: bookings.trendDirection === 'up' } : undefined}
                    iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Vouchers"
                    value={vouchers?.value?.toString() ?? '--'}
                    icon={Ticket}
                    trend={vouchers ? { value: vouchers.trendPercent, isPositive: vouchers.trendDirection === 'up' } : undefined}
                    iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
                />
            </Col>
        </>
    );
}