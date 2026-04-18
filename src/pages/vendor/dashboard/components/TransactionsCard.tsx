import { ArrowUpRight } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Transaction } from '../types';

const STATUS_LABEL_VI: Record<Transaction['status'], string> = {
    completed: 'Hoàn thành',
    pending: 'Đang xử lý',
    refunded: 'Đã hoàn tiền',
};

const statusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
        case 'completed':
            return 'success' as const;
        case 'pending':
            return 'warning' as const;
        case 'refunded':
            return 'destructive' as const;
        default:
            return 'secondary' as const;
    }
};

interface TransactionsCardProps {
    transactions: Transaction[];
}

export function TransactionsCard({ transactions }: TransactionsCardProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Giao dịch gần đây</CardTitle>
                        <CardDescription>Thanh toán đặt chỗ mới nhất</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                        Xem tất cả <ArrowUpRight className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pb-4">
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[30%] min-w-0 px-2 py-2.5 text-xs font-semibold">
                                Tên workshop
                            </TableHead>
                            <TableHead className="w-[22%] min-w-0 px-2 py-2.5 text-xs font-semibold">
                                Khách
                            </TableHead>
                            <TableHead className="w-[17%] whitespace-nowrap px-2 py-2.5 text-right text-xs font-semibold">
                                Số tiền
                            </TableHead>
                            <TableHead className="w-[11%] max-w-[5.5rem] px-1.5 py-2.5 text-xs font-semibold">
                                Mã vé
                            </TableHead>
                            <TableHead className="w-[20%] min-w-[8.75rem] px-2 py-2.5 text-xs font-semibold">
                                Trạng thái
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => {
                            const ticketText = tx.ticketCodes?.filter(Boolean).join(', ') || '—';
                            return (
                                <TableRow key={tx.id}>
                                    <TableCell className="min-w-0 px-2 py-2.5 text-xs font-medium">
                                        <span className="line-clamp-2 break-words" title={tx.workshop}>
                                            {tx.workshop}
                                        </span>
                                    </TableCell>
                                    <TableCell className="min-w-0 px-2 py-2.5 text-xs">
                                        <span className="block truncate" title={tx.customer}>
                                            {tx.customer}
                                        </span>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap px-2 py-2.5 text-right text-xs font-semibold tabular-nums">
                                        {new Intl.NumberFormat('vi-VN').format(tx.amount)} VNĐ
                                    </TableCell>
                                    <TableCell className="w-[11%] max-w-[5.5rem] px-1.5 py-2.5 align-middle">
                                        <span
                                            className="block truncate font-mono text-[11px] leading-tight text-muted-foreground"
                                            title={ticketText !== '—' ? ticketText : undefined}
                                        >
                                            {ticketText}
                                        </span>
                                    </TableCell>
                                    <TableCell className="min-w-[8.75rem] px-2 py-2.5 align-middle">
                                        <Badge
                                            variant={statusBadgeVariant(tx.status)}
                                            className="whitespace-nowrap px-2.5 py-1 text-xs font-medium"
                                        >
                                            {STATUS_LABEL_VI[tx.status]}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
