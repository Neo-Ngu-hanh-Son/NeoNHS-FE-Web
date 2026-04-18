import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RevenueTrendPoint } from '@/types/adminDashboard';
import { DollarOutlined, RiseOutlined, LineChartOutlined, TransactionOutlined } from '@ant-design/icons';

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
    const maxRevenue = Math.max(...revenueTrends.map(x => x.revenue), 1);

    const formatCompactNumber = (number: number) => {
        if (number >= 1000000000) return `${(number / 1000000000).toFixed(1)}B`;
        if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
        if (number >= 1000) return `${(number / 1000).toFixed(1)}k`;
        return number.toString();
    };

    const yAxisLevels = [1, 0.66, 0.33, 0];
    const yAxisLabels = yAxisLevels.map(p => ({
        label: p === 0 ? "0" : formatCompactNumber(maxRevenue * p),
        y: 200 - (p * 170)
    }));

    // Use L for 100% dot-to-line accuracy
    const getPathData = (data: number[]) => {
        if (data.length === 0) return "";
        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * 500,
            y: 200 - (val / maxRevenue) * 170
        }));

        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            d += ` L ${points[i].x},${points[i].y}`;
        }
        return d;
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

                {/* Fixed height box ONLY for the SVG chart area */}
                <div className="h-[300px] relative mt-4 pl-24 pr-8">
                    {/* Y-Axis Labels & Grid Lines */}
                    {yAxisLabels.map((l, i) => (
                        <div key={i} className="absolute inset-x-0" style={{ top: `${(l.y / 200) * 100}%` }}>
                            <span className="absolute -left-22 -top-2 w-20 text-right text-[10px] font-medium tabular-nums text-muted-foreground truncate">{l.label}</span>
                            <div className="h-px w-full border-t border-dashed border-border bg-muted/30" />
                        </div>
                    ))}

                    <svg className="w-full h-full relative z-20 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                        <defs>
                            <linearGradient id="gradient-revenue" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"></stop>
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        {revenueTrends.length > 0 && (
                            <>
                                <path
                                    d={getPathData(revenueTrends.map(r => r.revenue)) + " V 200 H 0 Z"}
                                    fill="url(#gradient-revenue)"
                                />

                                <path
                                    d={getPathData(revenueTrends.map(r => r.revenue))}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />

                                {revenueTrends.map((p, i) => {
                                    const cx = (i / (revenueTrends.length - 1)) * 500;
                                    const cy = 200 - (p.revenue / maxRevenue) * 170;

                                    const isTopHalf = cy < 100;
                                    const tooltipY = isTopHalf ? cy + 15 : cy - 125;

                                    return (
                                        <g key={i} className="group/point">
                                            <circle cx={cx} cy={cy} r="6" fill="#3b82f6" className="shadow-lg cursor-pointer" />
                                            <circle cx={cx} cy={cy} r="3" fill="white" className="pointer-events-none" />
                                            <foreignObject x={cx - 90} y={tooltipY} width="180" height="115" className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover/point:opacity-100">
                                                <div className="flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-slate-900/95 p-3.5 text-white shadow-lg">
                                                    <div className="text-[10px] font-black uppercase tracking-tighter opacity-60 text-blue-400 text-center">{p.period}</div>
                                                    <div className="flex flex-col border-b border-white/10 pb-1 mb-1">
                                                        <span className="text-[9px] font-bold uppercase leading-none tracking-widest opacity-70">Doanh thu</span>
                                                        <span className="text-sm font-bold tabular-nums">{p.revenue.toLocaleString('vi-VN')} VNĐ</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="opacity-70">Giao dịch:</span>
                                                        <span className="font-bold text-blue-200">{p.transactionCount}</span>
                                                    </div>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                })}
                            </>
                        )}
                    </svg>
                </div>

                {/* MONTHS: Move OUTSIDE fixed box to let Card wrap them */}
                <div className="pl-24 pr-8 mt-6">
                    <div className="flex justify-between">
                        {revenueTrends.map((p, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5 group/label w-[60px]">
                                <span className="truncate px-1 text-center text-[9px] font-semibold uppercase tracking-tight text-muted-foreground tabular-nums transition-colors group-hover/label:text-blue-600">{p.period}</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-muted transition-colors group-hover/label:bg-blue-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
