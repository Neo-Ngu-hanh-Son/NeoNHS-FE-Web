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
        <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                        <BarChartOutlined className="text-lg" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Tăng trưởng đăng ký</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Tài khoản mới theo thời gian</CardDescription>
                    </div>
                </div>
                <Select value={regType} onValueChange={(v: any) => setRegType(v)}>
                    <SelectTrigger className="h-8 w-[140px] shrink-0 bg-background text-xs transition-colors hover:border-primary">
                        <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">Người dùng</SelectItem>
                        <SelectItem value="VENDOR">Nhà cung cấp</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-grow pb-6 pt-4">
                {summary && (
                    <div className="mb-8 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                            <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                                <UserOutlined className="text-lg" />
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Tổng tham gia</p>
                            </div>
                            <p className="truncate text-lg font-bold tabular-nums leading-none text-slate-900 dark:text-white">{summary.totalJoined}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                            <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                                <TeamOutlined className="text-lg" />
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Tăng trưởng</p>
                            </div>
                            <p className="truncate text-lg font-bold tabular-nums leading-none text-emerald-600">+{summary.growthRate}%</p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-muted/30 p-4 text-center dark:border-slate-700 dark:bg-muted/20">
                            <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                                <SafetyCertificateOutlined className="text-lg" />
                                <p className="text-[10px] font-semibold uppercase tracking-wide">Tỷ lệ hoạt động</p>
                            </div>
                            <p className="truncate text-lg font-bold tabular-nums leading-none text-slate-900 dark:text-white">{summary.activePercentage}%</p>
                        </div>
                    </div>
                )}

                {/* Fixed height box ONLY for the SVG chart area */}
                <div className="h-[320px] relative mt-4 pl-20 pr-8">
                    {/* Y-Axis Labels & Grid Lines */}
                    {yAxisLabels.map((l, i) => (
                        <div key={i} className="absolute inset-x-0" style={{ top: `${(l.y / 200) * 100}%` }}>
                            <span className="absolute -left-18 -top-2 w-16 text-right text-[10px] font-medium tabular-nums text-muted-foreground truncate">{l.label}</span>
                            <div className="h-px w-full border-t border-dashed border-border bg-muted/30" />
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

                                <path
                                    d={getPathData(registrations.map(r => r.count))}
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />

                                <path
                                    d={getPathData(registrations.map(r => r.breakdown.individual))}
                                    fill="none"
                                    stroke="#818cf8"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    strokeLinecap="round"
                                    opacity={0.5}
                                />

                                <path
                                    d={getPathData(registrations.map(r => r.breakdown.organization))}
                                    fill="none"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    strokeLinecap="round"
                                    opacity={0.5}
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
                                            <foreignObject x={cx - 90} y={tooltipY} width="180" height="130" className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover/point:opacity-100">
                                                <div className="flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-slate-900/95 p-3.5 text-white shadow-lg">
                                                    <div className="text-[10px] font-black uppercase tracking-tighter opacity-60 text-indigo-400 text-center">{p.period}</div>
                                                    <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                                                        <span className="text-[10px] opacity-70">Tổng:</span>
                                                        <span className="text-sm font-bold tabular-nums text-white">{p.count}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between items-center text-[10px]">
                                                            <span className="opacity-70">Cá nhân:</span>
                                                            <span className="font-bold tabular-nums text-indigo-200">{p.breakdown.individual}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px]">
                                                            <span className="opacity-70">Tổ chức:</span>
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
                                <span className="truncate px-1 text-center text-[9px] font-semibold uppercase tracking-tight text-muted-foreground tabular-nums transition-colors group-hover/label:text-indigo-600">{p.period}</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-muted transition-colors group-hover/label:bg-indigo-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
