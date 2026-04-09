import { ReactNode } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    gradientFrom?: string;
    gradientTo?: string;
    subtitle?: string;
}

export function StatsCard({
    title,
    value,
    icon,
    trend,
    gradientFrom = 'border-primary text-primary',
    subtitle,
}: StatsCardProps) {
    return (
        <div className={`bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-2xl border-l-4 ${gradientFrom.split(' ')[0]} shadow-sm h-full hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-black/5 dark:bg-white/10 rounded-lg flex items-center justify-center w-10 h-10 ${gradientFrom.split(' ')[1] || 'text-primary'}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold flex items-center gap-1 ${trend.isPositive ? 'text-primary' : 'text-red-500'}`}>
                        {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white tabular-nums">
                    {value}
                </h3>
            </div>
            {subtitle && (
                <p className="text-[11px] text-gray-500 font-medium mt-1 truncate" title={subtitle}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
