import { Users, Store, Ticket, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AdminKPIs } from '@/types/adminDashboard';
import { formatCurrency, formatCompactNumber } from '@/utils/helpers';

interface KPIStatsProps {
    kpis: AdminKPIs | null;
}

export function KPIStats({ kpis }: KPIStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Tổng người dùng"
                value={kpis?.totalUsers?.toLocaleString('vi-VN') ?? '0'}
                icon={<Users className="h-6 w-6 text-white" />}
                iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <StatsCard
                title="Đối tác hoạt động"
                value={kpis?.activeVendors?.toLocaleString('vi-VN') ?? '0'}
                icon={<Store className="h-6 w-6 text-white" />}
                iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
            />
            <StatsCard
                title="Vé đã bán"
                value={kpis?.ticketsSold?.toLocaleString('vi-VN') ?? '0'}
                icon={<Ticket className="h-6 w-6 text-white" />}
                iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
            />
            <StatsCard
                title="Tổng doanh thu"
                value={kpis?.revenue ? formatCompactNumber(kpis.revenue) : '0'}
                icon={<DollarSign className="h-6 w-6 text-white" />}
                iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
                subtitle={kpis?.revenue ? formatCurrency(kpis.revenue) : undefined}
            />
        </div>
    );
}
