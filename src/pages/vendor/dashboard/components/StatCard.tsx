import type { ElementType } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string;
    icon: ElementType;
    trend?: { value: number; isPositive: boolean };
    iconBg: string;
}

export function StatCard({ title, value, icon: Icon, trend, iconBg }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden">
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold tracking-tight">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-1 text-xs">
                                {trend.isPositive ? (
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span className={trend.isPositive ? 'text-emerald-500' : 'text-red-500'}>
                                    {trend.isPositive ? '+' : ''}
                                    {trend.value}%
                                </span>
                                <span className="text-muted-foreground">vs last period</span>
                            </div>
                        )}
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
