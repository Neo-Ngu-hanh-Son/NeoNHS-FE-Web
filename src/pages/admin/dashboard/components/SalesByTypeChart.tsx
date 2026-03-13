import { ThunderboltOutlined, BarChartOutlined, RiseOutlined } from '@ant-design/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SalesByType, ActivityStatus } from '@/types/adminDashboard';
import { formatCurrency } from '@/utils/helpers';

interface SalesByTypeChartProps {
    salesByType: SalesByType | null;
    activityStatus: ActivityStatus | null;
}

export function SalesByTypeChart({ salesByType, activityStatus }: SalesByTypeChartProps) {
    const totalRev = (salesByType?.workshop?.revenue || 0) + (salesByType?.event?.revenue || 0);
    const workshopPercent = totalRev > 0 ? ((salesByType?.workshop?.revenue || 0) / totalRev * 100).toFixed(0) : 0;
    const eventPercent = totalRev > 0 ? ((salesByType?.event?.revenue || 0) / totalRev * 100).toFixed(0) : 0;

    return (
        <Card className="h-full shadow-lg border-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                <CardTitle className="text-lg font-bold">Sales Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 pt-6">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-700 font-bold flex items-center gap-2">
                            <ThunderboltOutlined /> Workshop
                        </span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {workshopPercent}%
                        </Badge>
                    </div>
                    <div className="text-2xl font-black text-blue-900">
                        {salesByType?.workshop?.revenue ? formatCurrency(salesByType.workshop.revenue) : "0 ₫"}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                        {salesByType?.workshop?.ticketsSold?.toLocaleString() || "0"} tickets sold
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-700 font-bold flex items-center gap-2">
                            <BarChartOutlined /> Event
                        </span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                            {eventPercent}%
                        </Badge>
                    </div>
                    <div className="text-2xl font-black text-purple-900">
                        {salesByType?.event?.revenue ? formatCurrency(salesByType.event.revenue) : "0 ₫"}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                        {salesByType?.event?.ticketsSold?.toLocaleString() || "0"} tickets sold
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-gray-100">
                            <RiseOutlined />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Overall Status</div>
                            <div className="text-sm font-bold text-gray-800">
                                {activityStatus?.workshop?.TOTAL?.toLocaleString() || "0"} Workshops / {activityStatus?.event?.TOTAL?.toLocaleString() || "0"} Events
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
