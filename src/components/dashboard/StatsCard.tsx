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
}

export function StatsCard({
    title,
    value,
    icon,
    trend,
    gradientFrom = 'from-blue-500',
    gradientTo = 'to-purple-600',
}: StatsCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:scale-105 group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3 tabular-nums">
                        {value}
                    </h3>
                    {trend && (
                        <div className="flex items-center gap-1">
                            <span
                                className={`flex items-center gap-1 text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {trend.isPositive ? (
                                    <ArrowUpOutlined className="text-xs" />
                                ) : (
                                    <ArrowDownOutlined className="text-xs" />
                                )}
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-gray-500 text-sm">vs last period</span>
                        </div>
                    )}
                </div>
                <div
                    className={`
                        w-14 h-14 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo}
                        flex items-center justify-center text-white text-2xl
                        shadow-lg group-hover:scale-110 transition-transform duration-300
                    `}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
