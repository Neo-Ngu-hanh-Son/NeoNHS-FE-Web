import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Column } from '@ant-design/charts';
import { BarChart2, AlertCircle } from 'lucide-react';
import type { RevenueFilter, RevenuePoint } from '../types';

interface RevenueOverviewCardProps {
    revenueFilter: RevenueFilter;
    onRevenueFilterChange: (value: RevenueFilter) => void;
    revenueData: RevenuePoint[];
    revenueError?: string | null;
}

export function RevenueOverviewCard({
    revenueFilter,
    onRevenueFilterChange,
    revenueData,
    revenueError,
}: RevenueOverviewCardProps) {
    const hasData = revenueData.length > 0;

    const isMonth = revenueFilter === 'month';

    const config = {
        data: revenueData,
        xField: 'name',
        yField: 'revenue',
        style: { maxWidth: isMonth ? 80 : 50 },
        axis: {
            x: isMonth
                ? {
                      labelAutoRotate: true,
                      labelAutoHide: false,
                      style: { labelTransform: 'rotate(-20)' },
                  }
                : undefined,
            y: {
                labelFormatter: (v: number) =>
                    v >= 1_000_000
                        ? `${(v / 1_000_000).toFixed(1)}M`
                        : v >= 1_000
                        ? `${(v / 1_000).toFixed(0)}K`
                        : String(v),
            },
        },
        tooltip: {
            items: [
                (d: RevenuePoint) => ({
                    name: 'Revenue',
                    value: new Intl.NumberFormat('vi-VN').format(d.revenue) + ' VNĐ',
                }),
            ],
        },
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base">Revenue Overview</CardTitle>
                    <CardDescription>Track your earnings over time</CardDescription>
                </div>
                <Select value={revenueFilter} onValueChange={(v) => onRevenueFilterChange(v as RevenueFilter)}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <div className="h-full w-full min-h-[200px] flex items-center justify-center">
                    {revenueError ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm py-8">
                            <AlertCircle className="w-8 h-8 text-destructive/60" />
                            <p className="font-medium">Revenue data unavailable</p>
                            <p className="text-xs text-center max-w-[240px]">{revenueError}</p>
                        </div>
                    ) : hasData ? (
                        <div className="h-full w-full">
                            <Column {...config} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm py-8">
                            <BarChart2 className="w-8 h-8 opacity-30" />
                            <p>No revenue data for this period</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
