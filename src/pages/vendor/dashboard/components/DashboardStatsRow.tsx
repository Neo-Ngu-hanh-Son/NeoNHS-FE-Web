import { Col } from 'antd'; // Import Col từ antd
import { Briefcase, CalendarCheck, DollarSign, Ticket } from 'lucide-react';
import { StatCard } from './StatCard';

export function DashboardStatsRow() {
    return (
        <>
            {/* Mỗi thẻ chiếm 6/24 (tương đương 1/4 chiều rộng) trên màn hình lớn */}
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Revenue"
                    value="$45,280"
                    icon={DollarSign}
                    trend={{ value: 12.5, isPositive: true }}
                    iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Workshops"
                    value="28"
                    icon={Briefcase}
                    trend={{ value: 4.2, isPositive: true }}
                    iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Bookings"
                    value="156"
                    icon={CalendarCheck}
                    trend={{ value: 8.1, isPositive: true }}
                    iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="Vouchers"
                    value="42"
                    icon={Ticket}
                    trend={{ value: 2.3, isPositive: false }}
                    iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
                />
            </Col>
        </>
    );
}