import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentActivity } from '@/types/adminDashboard';
import { ShopOutlined, HistoryOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Badge } from '@/components/ui/badge';

interface RecentActivitiesTimelineProps {
    activities: RecentActivity[];
}

/** Hiển thị nhãn hành động tiếng Việt khi khớp mã từ API */
function formatActionLabel(action: string): string {
    const normalized = action.trim().toUpperCase();
    const map: Record<string, string> = {
        TICKET_SELL: 'Bán vé',
        WORKSHOP_APPROVE: 'Duyệt workshop',
        WORKSHOP_CREATE: 'Tạo workshop',
        EVENT_CREATE: 'Tạo sự kiện',
        EVENT_APPROVE: 'Duyệt sự kiện',
        VENDOR_APPROVE: 'Duyệt nhà cung cấp',
        USER_REGISTER: 'Đăng ký người dùng',
    };
    if (map[normalized]) return map[normalized];
    return action.replace(/_/g, ' ');
}

export function RecentActivitiesTimeline({ activities }: RecentActivitiesTimelineProps) {
    const getActionIcon = (vendorId: string | null, vendorName: string) => {
        if (vendorId === null && vendorName === 'Hệ thống') {
            return <AppstoreOutlined className="text-primary" />;
        }
        return <ShopOutlined className="text-emerald-600 dark:text-emerald-400" />;
    };

    const getActionColor = (action: string) => {
        if (action.includes('SELL')) return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800';
        if (action.includes('APPROVE')) return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-800';
        if (action.includes('CREATE')) return 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800';
        return 'bg-muted text-foreground border-border';
    };

    return (
        <Card className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
            <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <HistoryOutlined className="text-lg" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Hoạt động gần đây</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Sự kiện mới nhất trên toàn hệ thống</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="relative space-y-5 before:absolute before:inset-0 before:ml-5 before:h-full before:w-px before:-translate-x-px before:bg-border">
                    {Array.isArray(activities) && activities.length > 0 ? (
                        activities.map((activity, idx) => (
                            <div key={idx} className="relative flex items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                    <div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-card shadow-sm dark:border-slate-700">
                                        {getActionIcon(activity.vendorId, activity.vendorName)}
                                    </div>
                                    <div className="min-w-0 pt-0.5">
                                        <div className="text-sm leading-snug text-slate-700 dark:text-slate-300">
                                            <span className="font-semibold text-slate-900 dark:text-white">{activity.vendorName}</span>
                                            <span className="mx-1 text-muted-foreground">đã thực hiện</span>
                                            <Badge
                                                variant="outline"
                                                className={`h-5 py-0 text-[10px] font-semibold ${getActionColor(activity.action)}`}
                                            >
                                                {formatActionLabel(activity.action)}
                                            </Badge>
                                            <span className="mx-1 text-muted-foreground">trên</span>
                                            <span className="font-medium text-slate-800 underline decoration-dotted underline-offset-4 dark:text-slate-200">
                                                {activity.targetName}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                            {activity.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-sm font-medium text-muted-foreground">Chưa có hoạt động gần đây</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
