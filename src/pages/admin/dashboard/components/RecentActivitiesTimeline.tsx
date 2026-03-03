import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RecentActivity } from '@/types/adminDashboard';
import { ShopOutlined, HistoryOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Badge } from '@/components/ui/badge';

interface RecentActivitiesTimelineProps {
    activities: RecentActivity[];
}

export function RecentActivitiesTimeline({ activities }: RecentActivitiesTimelineProps) {
    const getActionIcon = (vendorId: string | null, vendorName: string) => {
        if (vendorId === null && vendorName === "Hệ thống") {
            return <AppstoreOutlined className="text-primary" />;
        }
        return <ShopOutlined className="text-emerald-500" />;
    };

    const getActionColor = (action: string) => {
        if (action.includes('SELL')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        if (action.includes('APPROVE')) return 'bg-blue-50 text-blue-700 border-blue-100';
        if (action.includes('CREATE')) return 'bg-amber-50 text-amber-700 border-amber-100';
        return 'bg-gray-50 text-gray-700 border-gray-100';
    };

    return (
        <Card className="shadow-lg border-gray-100 overflow-hidden h-full">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                <div className="flex items-center gap-2">
                    <HistoryOutlined className="text-gray-400" />
                    <div>
                        <CardTitle className="text-lg font-bold">Recent Activities</CardTitle>
                        <CardDescription>Latest system-wide events</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 before:to-transparent">
                    {Array.isArray(activities) && activities.length > 0 ? activities.map((activity, idx) => (
                        <div key={idx} className="relative flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center z-10 shrink-0">
                                    {getActionIcon(activity.vendorId, activity.vendorName)}
                                </div>
                                <div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900">{activity.vendorName}</span>
                                        <span className="text-gray-500 mx-1">has performed</span>
                                        <Badge variant="outline" className={`text-[10px] font-bold py-0 h-5 lowercase ${getActionColor(activity.action)}`}>
                                            {activity.action.replace('_', ' ')}
                                        </Badge>
                                        <span className="text-gray-500 mx-1">on</span>
                                        <span className="font-medium text-gray-800 underline decoration-dotted underline-offset-4">{activity.targetName}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                                        {activity.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-10 text-center text-gray-400 font-medium italic">
                            No recent activities tracked
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
