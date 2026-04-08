import { ThunderboltOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesByType, ActivityStatus } from '@/types/adminDashboard';
import { formatCurrency, formatCompactNumber } from '@/utils/helpers';

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
        <Card className="h-full shadow-sm border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 pb-4 bg-gradient-to-r from-slate-50/60 to-white dark:from-white/5 dark:to-transparent border-b border-slate-100 dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <PieChartOutlined className="text-xl" />
                </div>
                <div>
                    <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Distribution Analysis</CardTitle>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Revenue & Activities</p>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 pt-6 flex-grow">

                {/* Donut 1: Revenue Mix */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Revenue Mix</p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Workshop ({workshopPct.toFixed(0)}%)</p>
                                    <p className="text-[10px] text-slate-500 font-mono">{formatCompactNumber(workshopRev)} VND</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Event ({eventPct.toFixed(0)}%)</p>
                                    <p className="text-[10px] text-slate-500 font-mono">{formatCompactNumber(eventRev)} VND</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-28 h-28 relative shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-md">
                            <circle cx="50" cy="50" r="30" fill="transparent" stroke="rgba(150,150,150,0.1)" strokeWidth="15" />
                            {totalRev > 1 && (
                                <>
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#3b82f6" strokeWidth="15" strokeDasharray={`${workshopDash} ${circum}`} strokeDashoffset="0" className="transition-all duration-1000 ease-out" />
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#a855f7" strokeWidth="15" strokeDasharray={`${eventDash} ${circum}`} strokeDashoffset={-workshopDash} className="transition-all duration-1000 ease-out" />
                                </>
                            )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none">Mix</span>
                        </div>
                    </div>
                </div>

                {/* Donut 2: Activity Count Mix */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Volume Mix</p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Workshop ({actWpct.toFixed(0)}%)</p>
                                    <p className="text-[10px] text-slate-500 font-mono">{countW} Total</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Event ({actEpct.toFixed(0)}%)</p>
                                    <p className="text-[10px] text-slate-500 font-mono">{countE} Total</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-28 h-28 relative shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-md">
                            <circle cx="50" cy="50" r="30" fill="transparent" stroke="rgba(150,150,150,0.1)" strokeWidth="15" />
                            {totalAct > 1 && (
                                <>
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#10b981" strokeWidth="15" strokeDasharray={`${actWdash} ${circum}`} strokeDashoffset="0" className="transition-all duration-1000 ease-out" />
                                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#f43f5e" strokeWidth="15" strokeDasharray={`${actEdash} ${circum}`} strokeDashoffset={-actWdash} className="transition-all duration-1000 ease-out" />
                                </>
                            )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</span>
                            <span className="text-lg font-black text-slate-800 dark:text-white leading-none">{totalAct > 1 ? totalAct : 0}</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
