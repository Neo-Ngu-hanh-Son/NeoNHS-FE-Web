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

    // Transform data for grouped bar chart
    const transformedData = revenueData.map((point) => ({
        name: point.name,
        revenue: point.revenue,
        netAmount: point.netAmount,
    }));

    const config = {
        data: transformedData,
        xField: 'name',
        yField: 'revenue',
        columnStyle: {
            radius: [4, 4, 0, 0],
        },
        meta: {
            revenue: {
                alias: 'Doanh thu (VNĐ)',
            },
        },
        style: { maxWidth: isMonth ? 120 : 80 },
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
                (d: any) => ({
                    name: 'Doanh thu',
                    value: new Intl.NumberFormat('vi-VN').format(d.revenue) + ' VNĐ',
                }),
                (d: any) => ({
                    name: 'Tiền nhận',
                    value: new Intl.NumberFormat('vi-VN').format(d.netAmount) + ' VNĐ',
                }),
            ],
        },
        color: '#3b82f6',
        label: {
            position: 'top' as const,
            style: {
                fill: '#000000a6',
                fontSize: 11,
                fontWeight: 600,
            },
            formatter: (datum: any) => {
                const val = datum.netAmount;
                if (val == null) {
                    return '';
                }
                if (val >= 1_000_000) {
                    return `Tiền nhận: ${(val / 1_000_000).toFixed(1)}M`;
                }
                if (val >= 1_000) {
                    return `Tiền nhận: ${(val / 1_000).toFixed(0)}K`;
                }
                return `Tiền nhận: ${val}`;
            },
        },
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base">Tổng quan doanh thu</CardTitle>
                    <CardDescription>Doanh thu vs tiền vendor nhận</CardDescription>
                </div>
                <Select value={revenueFilter} onValueChange={(v) => onRevenueFilterChange(v as RevenueFilter)}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Chọn kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">Tuần này</SelectItem>
                        <SelectItem value="month">Tháng này</SelectItem>
                        <SelectItem value="year">Năm nay</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <div className="h-full w-full min-h-[250px] flex items-center justify-center">
                    {revenueError ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm py-8">
                            <AlertCircle className="w-8 h-8 text-destructive/60" />
                            <p className="font-medium">Không tải được dữ liệu doanh thu</p>
                            <p className="text-xs text-center max-w-[240px]">{revenueError}</p>
                        </div>
                    ) : hasData ? (
                        <div className="h-full w-full">
                            <Column {...config} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm py-8">
                            <BarChart2 className="w-8 h-8 opacity-30" />
                            <p>Chưa có dữ liệu doanh thu trong kỳ này</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
