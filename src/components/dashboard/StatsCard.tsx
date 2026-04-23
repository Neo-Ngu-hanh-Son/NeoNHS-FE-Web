import type { ReactNode } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    iconBg: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
}

export function StatsCard({
    title,
    value,
    icon,
    iconBg,
    trend,
    subtitle,
}: StatsCardProps) {
    return (
        <Card className="relative h-full overflow-hidden border border-slate-100 bg-card shadow-sm transition-shadow hover:shadow-md dark:border-slate-700">
            <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground">{value}</p>
                        {subtitle ? (
                            <p className="truncate text-xs text-muted-foreground" title={subtitle}>
                                {subtitle}
                            </p>
                        ) : null}
                        {trend ? (
                            <div className="flex items-center gap-1 pt-1 text-xs">
                                {trend.isPositive ? (
                                    <TrendingUp className="h-3 w-3 shrink-0 text-emerald-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 shrink-0 text-red-500" />
                                )}
                                <span className={trend.isPositive ? 'font-medium text-emerald-600' : 'font-medium text-red-500'}>
                                    {trend.isPositive ? '+' : ''}
                                    {trend.value}%
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
