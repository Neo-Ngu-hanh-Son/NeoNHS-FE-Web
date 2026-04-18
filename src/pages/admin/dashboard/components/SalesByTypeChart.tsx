import { PieChartOutlined } from '@ant-design/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesByType, ActivityStatus } from '@/types/adminDashboard';
import { formatCompactNumber } from '@/utils/helpers';

interface SalesByTypeChartProps {
    salesByType: SalesByType | null;
    activityStatus: ActivityStatus | null;
}

export function SalesByTypeChart({ salesByType, activityStatus }: SalesByTypeChartProps) {
    // Data processing for Revenue Mix
    const workshopRev = salesByType?.workshop?.revenue || 0;
    const eventRev = salesByType?.event?.revenue || 0;
    const totalRev = Math.max(workshopRev + eventRev, 1);

    const workshopPct = (workshopRev / totalRev) * 100;
    const eventPct = (eventRev / totalRev) * 100;

    // SVG calculations for Revenue Mix Donut (radius 30, circumference ~188.5)
    const circum = 2 * Math.PI * 30;
    const workshopDash = (workshopPct / 100) * circum;
    const eventDash = (eventPct / 100) * circum;

    // Data processing for Activity Setup Mix
    const countW = activityStatus?.workshop?.TOTAL || 0;
    const countE = activityStatus?.event?.TOTAL || 0;
    const totalAct = Math.max(countW + countE, 1);

    const actWpct = (countW / totalAct) * 100;
    const actEpct = (countE / totalAct) * 100;

    const actWdash = (actWpct / 100) * circum;
    const actEdash = (actEpct / 100) * circum;

    return (
        <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    <PieChartOutlined className="text-lg" />
                </div>
                <div className="min-w-0">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Phân bổ</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Tỉ lệ doanh thu và khối lượng hoạt động</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col gap-5 pt-4">

                {/* Donut 1: Revenue Mix */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-muted/30 p-4 dark:border-slate-700 dark:bg-muted/20">
                    <div className="flex-1">
                        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Tỉ lệ doanh thu</p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Workshop ({workshopPct.toFixed(0)}%)</p>
                                    <p className="font-mono text-[10px] text-slate-500">{formatCompactNumber(workshopRev)} VNĐ</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-purple-500" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Sự kiện ({eventPct.toFixed(0)}%)</p>
                                    <p className="font-mono text-[10px] text-slate-500">{formatCompactNumber(eventRev)} VNĐ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-28 h-28 relative shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-md">
                            <circle cx="50" cy="50" r="30" fill="transparent" stroke="rgba(150,150,150,0.1)" strokeWidth="15" />
                            {totalRev > 1 && (
                                <>
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#3b82f6" strokeWidth="15" strokeDasharray={`${workshopDash} ${circum}`} strokeDashoffset="0" />
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#a855f7" strokeWidth="15" strokeDasharray={`${eventDash} ${circum}`} strokeDashoffset={-workshopDash} />
                                </>
                            )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-lg font-bold leading-none text-slate-800 dark:text-white">Tỉ lệ</span>
                        </div>
                    </div>
                </div>

                {/* Donut 2: Activity Count Mix */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-muted/30 p-4 dark:border-slate-700 dark:bg-muted/20">
                    <div className="flex-1">
                        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Tỉ lệ số lượng</p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Workshop ({actWpct.toFixed(0)}%)</p>
                                    <p className="font-mono text-[10px] text-slate-500">{countW} tổng</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Sự kiện ({actEpct.toFixed(0)}%)</p>
                                    <p className="font-mono text-[10px] text-slate-500">{countE} tổng</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-28 h-28 relative shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-md">
                            <circle cx="50" cy="50" r="30" fill="transparent" stroke="rgba(150,150,150,0.1)" strokeWidth="15" />
                            {totalAct > 1 && (
                                <>
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#10b981" strokeWidth="15" strokeDasharray={`${actWdash} ${circum}`} strokeDashoffset="0" />
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#f43f5e" strokeWidth="15" strokeDasharray={`${actEdash} ${circum}`} strokeDashoffset={-actWdash} />
                                </>
                            )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Tổng</span>
                            <span className="text-lg font-bold leading-none text-slate-800 dark:text-white">{totalAct > 1 ? totalAct : 0}</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
