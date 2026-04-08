import { motion } from 'framer-motion';
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
        <Card className="shadow-sm border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-slate-50/60 to-white dark:from-white/5 dark:to-transparent border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <LineChartOutlined className="text-xl" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Revenue Trends</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-wider font-semibold opacity-60 text-slate-500 dark:text-slate-400">Financial Performance Analytics</CardDescription>
                    </div>
                </div>
                <Select value={revenuePeriod} onValueChange={(v: any) => setRevenuePeriod(v)}>
                    <SelectTrigger className="w-40 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm hover:border-primary transition-colors">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MONTHLY">Monthly View</SelectItem>
                        <SelectItem value="WEEKLY">Weekly View</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-8 flex-grow pb-10">
                {summary && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <DollarOutlined className="text-lg" />
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-70">Current Total</p>
                            </div>
                            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white mb-1 truncate px-1" title={summary.currentTotal.toLocaleString()}>
                                {formatCompactNumber(summary.currentTotal)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <RiseOutlined className="text-lg" />
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-70">Growth Rate</p>
                            </div>
                            <p className="mt-1 text-lg font-black tabular-nums text-emerald-600 leading-none">+{summary.growthRate}%</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <TransactionOutlined className="text-lg" />
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-70">Peak Revenue</p>
                            </div>
                            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white leading-none truncate px-1" title={summary.peakValue.toLocaleString()}>
                                {formatCompactNumber(summary.peakValue)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <LineChartOutlined className="text-lg" />
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-70">Average</p>
                            </div>
                            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white leading-none truncate px-1" title={Math.round(summary.averageValue).toLocaleString()}>
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
                            <span className="absolute -left-22 -top-2 w-20 text-[10px] font-bold text-gray-400 text-right tabular-nums truncate">{l.label}</span>
                            <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200/50" />
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

                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, ease: "linear" }}
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
                                            <foreignObject x={cx - 90} y={tooltipY} width="180" height="115" className="opacity-0 group-hover/point:opacity-100 transition-all duration-200 pointer-events-none">
                                                <div className="bg-gray-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-1.5 translate-y-2 group-hover/point:translate-y-0 transition-transform">
                                                    <div className="text-[10px] font-black uppercase tracking-tighter opacity-60 text-blue-400 text-center">{p.period}</div>
                                                    <div className="flex flex-col border-b border-white/10 pb-1 mb-1">
                                                        <span className="text-[9px] opacity-70 leading-none uppercase tracking-widest font-bold">Revenue</span>
                                                        <span className="text-sm font-black tabular-nums">{p.revenue.toLocaleString()} VND</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="opacity-70">Transactions:</span>
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
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter tabular-nums group-hover/label:text-blue-600 transition-colors text-center truncate px-1">{p.period}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/label:bg-blue-300 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
