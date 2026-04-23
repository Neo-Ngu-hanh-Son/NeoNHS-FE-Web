import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from '@ant-design/charts';
import { LineChartOutlined, DollarOutlined, RiseOutlined, TransactionOutlined } from '@ant-design/icons';
import { BarChart2 } from 'lucide-react';
import type { RevenueTrendPoint } from '@/types/adminDashboard';
import { formatCurrency } from '@/utils/helpers';

function formatCompactNumber(value: number) {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
    return value.toString();
}

interface RevenueTrendsCardProps {
    points: RevenueTrendPoint[];
}

export function RevenueTrendsCard({ points }: RevenueTrendsCardProps) {
    const hasData = points.length > 0;
    const crowdedX = points.length > 10;

    const totalRevenue = points.reduce((acc, p) => acc + p.revenue, 0);
    const totalTransactions = points.reduce((acc, p) => acc + (p.transactionCount || 0), 0);
    const averageRevenue = points.length > 0 ? totalRevenue / points.length : 0;
    const peak = points.reduce(
        (best, p) => (p.revenue > best.revenue ? p : best),
        points[0] ?? ({ period: '', revenue: 0, transactionCount: 0 } as RevenueTrendPoint),
    );

    const chartData = points.map((r) => ({
        period: r.period,
        revenue: r.revenue,
        transactionCount: r.transactionCount,
    }));

    const config = {
        data: chartData,
        xField: 'period',
        yField: 'revenue',
        smooth: true,
        color: '#3b82f6',
        axis: {
            x: crowdedX
                ? {
                      labelAutoRotate: true,
                      labelAutoHide: false,
                      style: { labelTransform: 'rotate(-20)' },
                  }
                : undefined,
            y: {
                labelFormatter: (v: number) => {
                    const n = Number(v);
                    if (!Number.isFinite(n)) return '';
                    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
                    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
                    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
                    return String(Math.round(n));
                },
                nice: true,
            },
        },
        tooltip: {
            items: [
                (d: (typeof chartData)[number]) => ({
                    name: 'Doanh thu',
                    value: new Intl.NumberFormat('vi-VN').format(d.revenue) + ' VNĐ',
                }),
                (d: (typeof chartData)[number]) => ({
                    name: 'Giao dịch',
                    value: String(d.transactionCount),
                }),
            ],
        },
    };

    return (
        <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <LineChartOutlined className="text-lg" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Xu hướng doanh thu</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Theo khoảng thời gian báo cáo đã chọn</CardDescription>
                    </div>
                </div>
                {hasData && (
                    <div className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground dark:border-slate-600 sm:flex">
                        <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-200">{formatCompactNumber(totalRevenue)}</span>
                        <span className="opacity-70">VNĐ (tổng kỳ)</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="flex flex-1 flex-col pb-6 pt-4">
                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                        <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                            <DollarOutlined className="text-lg" />
                            <p className="text-[10px] font-semibold uppercase tracking-wide">Tổng kỳ</p>
                        </div>
                        <p className="truncate text-lg font-bold tabular-nums text-slate-900 dark:text-white" title={formatCurrency(totalRevenue)}>
                            {formatCompactNumber(totalRevenue)}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                        <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                            <RiseOutlined className="text-lg" />
                            <p className="text-[10px] font-semibold uppercase tracking-wide">Trung bình</p>
                        </div>
                        <p className="truncate text-lg font-bold tabular-nums text-slate-900 dark:text-white" title={formatCurrency(averageRevenue)}>
                            {formatCompactNumber(Math.round(averageRevenue))}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                        <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                            <LineChartOutlined className="text-lg" />
                            <p className="text-[10px] font-semibold uppercase tracking-wide">Đỉnh</p>
                        </div>
                        <p className="truncate text-lg font-bold tabular-nums text-slate-900 dark:text-white" title={formatCurrency(peak?.revenue || 0)}>
                            {formatCompactNumber(peak?.revenue || 0)}
                        </p>
                        {peak?.period ? (
                            <p className="mt-1 truncate text-[10px] text-muted-foreground" title={peak.period}>
                                {peak.period}
                            </p>
                        ) : null}
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                        <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                            <TransactionOutlined className="text-lg" />
                            <p className="text-[10px] font-semibold uppercase tracking-wide">Giao dịch</p>
                        </div>
                        <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{totalTransactions.toLocaleString('vi-VN')}</p>
                    </div>
                </div>

                <div className="min-h-[240px] flex-1">
                    {hasData ? (
                        <div className="h-[280px] w-full">
                            <Line {...config} />
                        </div>
                    ) : (
                        <div className="flex h-[240px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-muted/20 text-sm text-muted-foreground dark:border-slate-700">
                            <BarChart2 className="h-8 w-8 opacity-30" />
                            <p>Chưa có dữ liệu xu hướng trong khoảng thời gian này</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
