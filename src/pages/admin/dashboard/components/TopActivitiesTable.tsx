import { ThunderboltOutlined } from '@ant-design/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TopActivity } from '@/types/adminDashboard';

interface TopActivitiesTableProps {
    topActivities: TopActivity[];
}

export function TopActivitiesTable({ topActivities }: TopActivitiesTableProps) {
    return (
        <Card className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
                <div className="min-w-0">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Hoạt động nổi bật</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                        Mục bán vé thành công nhất
                    </CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0 border-amber-200 bg-amber-50 font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                    Top 5
                </Badge>
            </CardHeader>
            <CardContent className="pb-4 pt-3">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-xs font-medium text-muted-foreground">Hoạt động</TableHead>
                            <TableHead className="text-xs font-medium text-muted-foreground">Loại</TableHead>
                            <TableHead className="text-right text-xs font-medium text-muted-foreground">Vé đã bán</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(topActivities) && topActivities.length > 0 ? (
                            topActivities.map((record) => (
                                <TableRow
                                    key={record.id}
                                    className="border-border transition-colors hover:bg-muted/50"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex rounded-lg p-2 ${
                                                    record.type === 'EVENT'
                                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                                        : 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
                                                }`}
                                            >
                                                <ThunderboltOutlined />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {record.name}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`border-none px-1.5 py-0 text-[9px] font-semibold ${
                                                record.type === 'EVENT'
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                                    : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                                            }`}
                                        >
                                            {record.type === 'EVENT' ? 'Sự kiện' : 'Workshop'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                                            {record.ticketsSold?.toLocaleString('vi-VN') || '0'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="py-10 text-center text-sm font-medium text-muted-foreground">
                                    Chưa có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
