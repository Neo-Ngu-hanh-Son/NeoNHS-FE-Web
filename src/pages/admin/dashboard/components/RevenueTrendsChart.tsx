import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RevenueTrendPoint } from '@/types/adminDashboard';
import { DollarOutlined, RiseOutlined, LineChartOutlined, TransactionOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { BarChart2 } from 'lucide-react';

interface RevenueTrendsChartProps {
    revenueTrends: RevenueTrendPoint[];
    summary?: {
        currentTotal: number;
        previousTotal: number;
        growthRate: number;
        averageValue: number;
        peakValue: number;
        peakPeriod: string;
    };
    revenuePeriod: 'MONTHLY' | 'WEEKLY';
    setRevenuePeriod: (period: 'MONTHLY' | 'WEEKLY') => void;
}

export function RevenueTrendsChart({ revenueTrends, summary, revenuePeriod, setRevenuePeriod }: RevenueTrendsChartProps) {
    const hasData = revenueTrends.length > 0;
    const crowdedX = revenueTrends.length > 10;

    const formatCompactNumber = (number: number) => {
        if (number >= 1000000000) return `${(number / 1000000000).toFixed(1)}B`;
        if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
        if (number >= 1000) return `${(number / 1000).toFixed(1)}k`;
        return number.toString();
    };

    const chartData = revenueTrends.map((r) => ({
        period: r.period,
        revenue: r.revenue,
        transactionCount: r.transactionCount,
    }));

    const isMonthly = revenuePeriod === 'MONTHLY';

    const config = {
        data: chartData,
        xField: 'period',
        yField: 'revenue',
        color: '#3b82f6',
        style: { maxWidth: isMonthly ? 80 : 50 },
        axis: {
            x: isMonthly || crowdedX
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
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <LineChartOutlined className="text-lg" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Xu hướng doanh thu</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Hiệu quả tài chính theo thời gian</CardDescription>
                    </div>
                </div>
                <Select value={revenuePeriod} onValueChange={(v: any) => setRevenuePeriod(v)}>
                    <SelectTrigger className="h-8 w-[140px] shrink-0 bg-background text-xs transition-colors hover:border-primary">
                        <SelectValue placeholder="Chọn kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MONTHLY">Theo tháng</SelectItem>
                        <SelectItem value="WEEKLY">Theo tuần</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-grow pb-6 pt-4">
                {summary && (
                    <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                            <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                                <DollarOutlined className="text-lg" />
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Tổng hiện tại</p>
                            </div>
                            <p className="mb-1 truncate px-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white" title={summary.currentTotal.toLocaleString()}>
                                {formatCompactNumber(summary.currentTotal)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                            <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                                <RiseOutlined className="text-lg" />
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Tăng trưởng</p>
                            </div>
                            <p className="text-lg font-bold tabular-nums leading-none text-emerald-600">+{summary.growthRate}%</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                            <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                                <TransactionOutlined className="text-lg" />
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Đỉnh doanh thu</p>
                            </div>
                            <p className="truncate px-1 text-lg font-bold tabular-nums leading-none text-slate-900 dark:text-white" title={summary.peakValue.toLocaleString()}>
                                {formatCompactNumber(summary.peakValue)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                            <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                                <LineChartOutlined className="text-lg" />
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Trung bình</p>
                            </div>
                            <p className="truncate px-1 text-lg font-bold tabular-nums leading-none text-slate-900 dark:text-white" title={Math.round(summary.averageValue).toLocaleString()}>
                                {formatCompactNumber(Math.round(summary.averageValue))}
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-4 h-[300px] w-full min-h-[200px]">
                    {hasData ? (
                        <div className="h-full w-full">
                            <Column {...config} />
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                            <BarChart2 className="h-8 w-8 opacity-30" />
                            <p>Chưa có dữ liệu doanh thu trong kỳ này</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
