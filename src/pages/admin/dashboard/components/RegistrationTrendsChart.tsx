import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RegistrationTrendPoint } from '@/types/adminDashboard';
import { UserOutlined, TeamOutlined, BarChartOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

interface RegistrationTrendsChartProps {
    registrations: RegistrationTrendPoint[];
    summary?: {
        totalJoined: number;
        previousTotal: number;
        growthRate: number;
        activePercentage: number;
    };
    regType: 'USER' | 'VENDOR';
    setRegType: (type: 'USER' | 'VENDOR') => void;
}

export function RegistrationTrendsChart({ registrations, summary, regType, setRegType }: RegistrationTrendsChartProps) {
    const max = Math.max(...registrations.map(r => r.count), 1);

    const yAxisLevels = [1, 0.66, 0.33, 0];
    const yAxisLabels = yAxisLevels.map(p => ({
        label: p === 0 ? "0" : `${Math.round(max * p)}`,
        y: 200 - (p * 170)
    }));

    // Use L for 100% dot-to-line accuracy
    const getPathData = (data: number[]) => {
        if (data.length === 0) return "";
        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * 500,
            y: 200 - (val / max) * 170
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
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <BarChartOutlined className="text-xl" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Registration Growth</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-wider font-semibold opacity-60 text-slate-500 dark:text-slate-400">System Growth Metrics</CardDescription>
                    </div>
                </div>
                <Select value={regType} onValueChange={(v: any) => setRegType(v)}>
                    <SelectTrigger className="w-40 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm hover:border-indigo-400 transition-colors">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">User Growth</SelectItem>
                        <SelectItem value="VENDOR">Vendor Growth</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-8 flex-grow pb-10">
                {summary && (
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <UserOutlined className="text-lg" />
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-70">Total Joined</p>
                            </div>
                            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white leading-none truncate">{summary.totalJoined}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <TeamOutlined className="text-lg" />
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-70">Growth</p>
                            </div>
                            <p className="mt-1 text-lg font-black tabular-nums text-emerald-600 leading-none truncate">+{summary.growthRate}%</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                                <SafetyCertificateOutlined className="text-lg" />
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 opacity-70">Active Rate</p>
                            </div>
                            <p className="mt-1 text-lg font-black tabular-nums text-slate-900 dark:text-white leading-none truncate">{summary.activePercentage}%</p>
                        </div>
                    </div>
                )}

                {/* Fixed height box ONLY for the SVG chart area */}
                <div className="h-[320px] relative mt-4 pl-20 pr-8">
                    {/* Y-Axis Labels & Grid Lines */}
                    {yAxisLabels.map((l, i) => (
                        <div key={i} className="absolute inset-x-0" style={{ top: `${(l.y / 200) * 100}%` }}>
                            <span className="absolute -left-18 -top-2 w-16 text-[10px] font-bold text-gray-400 text-right tabular-nums truncate">{l.label}</span>
                            <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200/50" />
                        </div>
                    ))}

                    <svg className="w-full h-full relative z-20 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                        <defs>
                            <linearGradient id="reg-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2"></stop>
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>

                        {registrations.length > 0 && (
                            <>
                                <path
                                    d={getPathData(registrations.map(r => r.count)) + " V 200 H 0 Z"}
                                    fill="url(#reg-gradient)"
                                />

                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, ease: "linear" }}
                                    d={getPathData(registrations.map(r => r.count))}
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />

                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.5 }}
                                    transition={{ duration: 1, ease: "linear", delay: 0.2 }}
                                    d={getPathData(registrations.map(r => r.breakdown.individual))}
                                    fill="none"
                                    stroke="#818cf8"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    strokeLinecap="round"
                                />

                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.5 }}
                                    transition={{ duration: 1, ease: "linear", delay: 0.4 }}
                                    d={getPathData(registrations.map(r => r.breakdown.organization))}
                                    fill="none"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    strokeLinecap="round"
                                />

                                {registrations.map((p, i) => {
                                    const cx = (i / (registrations.length - 1)) * 500;
                                    const cy = 200 - (p.count / max) * 170;

                                    const isTopHalf = cy < 100;
                                    const tooltipY = isTopHalf ? cy + 15 : cy - 140;

                                    return (
                                        <g key={i} className="group/point">
                                            <circle cx={cx} cy={cy} r="6" fill="#6366f1" className="cursor-pointer shadow-lg" />
                                            <circle cx={cx} cy={cy} r="3" fill="white" className="pointer-events-none" />
                                            <foreignObject x={cx - 90} y={tooltipY} width="180" height="130" className="opacity-0 group-hover/point:opacity-100 transition-all duration-200 pointer-events-none backdrop-blur-sm">
                                                <div className="bg-gray-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-1.5 translate-y-2 group-hover/point:translate-y-0 transition-transform">
                                                    <div className="text-[10px] font-black uppercase tracking-tighter opacity-60 text-indigo-400 text-center">{p.period}</div>
                                                    <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                                                        <span className="text-[10px] opacity-70">Total:</span>
                                                        <span className="text-sm font-black text-white tabular-nums">{p.count}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between items-center text-[10px]">
                                                            <span className="opacity-70">Individual:</span>
                                                            <span className="font-bold tabular-nums text-indigo-200">{p.breakdown.individual}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px]">
                                                            <span className="opacity-70">Organization:</span>
                                                            <span className="font-bold tabular-nums text-purple-200">{p.breakdown.organization}</span>
                                                        </div>
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

                {/* MONTHS & LEGEND: Move OUTSIDE fixed box to let Card wrap them */}
                <div className="pl-20 pr-8 mt-6">
                    <div className="flex justify-between">
                        {registrations.map((p, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5 group/label w-[60px]">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter tabular-nums group-hover/label:text-indigo-600 transition-colors text-center truncate px-1">{p.period}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/label:bg-indigo-300 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
