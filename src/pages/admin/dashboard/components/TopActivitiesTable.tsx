import { ThunderboltOutlined } from '@ant-design/icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TopActivity } from '@/types/adminDashboard';

interface TopActivitiesTableProps {
    topActivities: TopActivity[];
}

export function TopActivitiesTable({ topActivities }: TopActivitiesTableProps) {
    return (
        <Card className="shadow-lg border-gray-100 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <CardTitle className="text-lg font-bold">Top Activities</CardTitle>
                    <CardDescription>Most successful items by tickets sold</CardDescription>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold">
                    Top 5
                </Badge>
            </CardHeader>
            <CardContent className="pt-4">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-gray-100">
                            <TableHead className="font-bold text-gray-400 uppercase text-[10px]">Activity</TableHead>
                            <TableHead className="font-bold text-gray-400 uppercase text-[10px] text-right">Tickets Sold</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(topActivities) && topActivities.length > 0 ? topActivities.map((record) => (
                            <TableRow key={record.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                            <ThunderboltOutlined />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm">{record.name}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="font-medium text-gray-600">{record.ticketsSold?.toLocaleString() || "0"}</span>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-10 text-gray-400 font-medium">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
