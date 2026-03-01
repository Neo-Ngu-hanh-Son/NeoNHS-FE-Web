import { motion } from 'framer-motion';
import { UserOutlined, ShopOutlined, TagOutlined, DollarOutlined } from '@ant-design/icons';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AdminKPIs } from '@/types/adminDashboard';
import { formatCurrency } from '@/utils/helpers';

interface KPIStatsProps {
    kpis: AdminKPIs | null;
}

export function KPIStats({ kpis }: KPIStatsProps) {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants}>
                <StatsCard
                    title="Total Users"
                    value={kpis?.totalUsers?.toLocaleString() || "0"}
                    icon={<UserOutlined />}
                    gradientFrom="from-blue-500"
                    gradientTo="to-indigo-600"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <StatsCard
                    title="Active Vendors"
                    value={kpis?.activeVendors?.toLocaleString() || "0"}
                    icon={<ShopOutlined />}
                    gradientFrom="from-emerald-500"
                    gradientTo="to-teal-600"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <StatsCard
                    title="Tickets Sold"
                    value={kpis?.ticketsSold?.toLocaleString() || "0"}
                    icon={<TagOutlined />}
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-600"
                />
            </motion.div>
            <motion.div variants={itemVariants}>
                <StatsCard
                    title="Total Revenue"
                    value={kpis?.revenue ? formatCurrency(kpis.revenue) : "0 ₫"}
                    icon={<DollarOutlined />}
                    gradientFrom="from-rose-500"
                    gradientTo="to-pink-600"
                />
            </motion.div>
        </div>
    );
}
