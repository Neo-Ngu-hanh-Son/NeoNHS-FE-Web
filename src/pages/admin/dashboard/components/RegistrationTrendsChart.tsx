import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RegistrationTrendPoint } from '@/types/adminDashboard';
import { UserOutlined, TeamOutlined, BarChartOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { BarChart2 } from 'lucide-react';

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

type RegSeries = 'Tổng' | 'Khách Du lịch' | 'Đối tác Kinh Doanh';

function toGroupedColumnData(points: RegistrationTrendPoint[]) {
    const rows: { period: string; loai: RegSeries; value: number }[] = [];
    for (const r of points) {
        rows.push(
            { period: r.period, loai: 'Tổng', value: r.count },
            { period: r.period, loai: 'Khách Du lịch', value: r.breakdown.individual },
            { period: r.period, loai: 'Đối tác Kinh Doanh', value: r.breakdown.organization },
        );
    }
    return rows;
}

export function RegistrationTrendsChart({ registrations, summary, regType, setRegType }: RegistrationTrendsChartProps) {
    const hasData = registrations.length > 0;
    const crowdedX = registrations.length > 10;
    const chartData = toGroupedColumnData(registrations);
    const config = {
        data: chartData,
        xField: 'period',
        yField: 'value',
        seriesField: 'loai',
        colorField: 'loai',
        group: true,
        style: { maxWidth: crowdedX ? 28 : 40 },
        scale: {
            color: {
                domain: ['Tổng', 'Khách Du lịch', 'Đối tác Kinh Doanh'] as RegSeries[],
                range: ['#6366f1', '#818cf8', '#a855f7'],
            },
        },
        axis: {
            x: crowdedX
                ? {
                      labelAutoRotate: true,
                      labelAutoHide: false,
                      style: { labelTransform: 'rotate(-20)' },
                  }
                : undefined,
            y: {
                labelFormatter: (v: number) => String(Math.round(Number(v))),
                nice: true,
            },
        },
        legend: {
            color: {
                title: false,
                position: 'bottom' as const,
                rowPadding: 5,
                layout: { justifyContent: 'center' as const },
            },
        },
        tooltip: {
            items: [
                (d: { loai: RegSeries; value: number }) => ({
                    name: d.loai,
                    value: new Intl.NumberFormat('vi-VN').format(d.value),
                }),
            ],
        },
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
                        <SelectItem value="USER">Khách Du lịch</SelectItem>
                        <SelectItem value="VENDOR">Đối tác Kinh Doanh</SelectItem>
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

                <div className="mt-4 h-[320px] w-full min-h-[200px]">
                    {hasData ? (
                        <div className="h-full w-full">
                            <Column {...config} />
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                            <BarChart2 className="h-8 w-8 opacity-30" />
                            <p>Chưa có dữ liệu đăng ký trong kỳ này</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
