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
                        <CardTitle className="text-base">Recent Transactions</CardTitle>
                        <CardDescription>Latest booking payments</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                        View All <ArrowUpRight className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pb-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction</TableHead>
                            <TableHead>Workshop</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell className="font-medium text-xs">{tx.id}</TableCell>
                                <TableCell className="text-xs">{tx.workshop}</TableCell>
                                <TableCell className="text-xs">{tx.customer}</TableCell>
                                <TableCell className="text-right text-xs font-semibold">${tx.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={statusBadgeVariant(tx.status)} className="text-[10px] capitalize">
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
