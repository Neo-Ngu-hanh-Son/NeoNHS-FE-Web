import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Eye, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import type { VoucherResponse } from '@/types/voucher';
import {
    voucherStatusBadgeStyles, voucherStatusLabels,
    voucherTypeBadgeStyles, voucherTypeLabels,
    voucherScopeLabels, discountTypeLabels,
} from '../constants';

interface VoucherTableProps {
    vouchers: VoucherResponse[];
    loading: boolean;
    pagination: { current: number; pageSize: number; total: number };
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    onSort: (field: string) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onDelete: (voucher: VoucherResponse) => void;
    scope?: string;
}

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
        return dateStr;
    }
}

function getDiscountDisplay(v: VoucherResponse): string {
    if (v.voucherType === 'DISCOUNT' && v.discountType && v.discountValue != null) {
        if (v.discountType === 'PERCENT') return `${v.discountValue}%`;
        return `${v.discountValue.toLocaleString('vi-VN')}₫`;
    }
    if (v.voucherType === 'BONUS_POINTS' && v.bonusPointsValue != null) {
        return `${v.bonusPointsValue} pts`;
    }
    if (v.voucherType === 'GIFT_PRODUCT') return v.giftDescription || 'Gift';
    if (v.voucherType === 'FREE_SERVICE') return v.freeTicketCatalogName || 'Free Service';
    return '—';
}

function SortHeader({ field, label, sortBy, sortDir, onSort }: {
    field: string; label: string; sortBy?: string; sortDir?: 'asc' | 'desc'; onSort: (f: string) => void;
}) {
    const isActive = sortBy === field;
    return (
        <TableHead className="cursor-pointer select-none" onClick={() => onSort(field)}>
            <div className="flex items-center gap-1">
                {label}
                <ArrowUpDown className={`h-3.5 w-3.5 ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`} />
                {isActive && <span className="text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>}
            </div>
        </TableHead>
    );
}

export function VoucherTable({
    vouchers, loading, pagination, sortBy, sortDir,
    onSort, onPageChange, onPageSizeChange, onDelete, scope,
}: VoucherTableProps) {
    const navigate = useNavigate();
    const totalPages = Math.ceil(pagination.total / pagination.pageSize) || 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (vouchers.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No vouchers found</p>
                <p className="text-sm mt-1">Try adjusting your filters or create a new voucher.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortHeader field="code" label="Code" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Usage</TableHead>
                            <SortHeader field="startDate" label="Period" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
                            <TableHead>Status</TableHead>
                            {scope !== 'PLATFORM' && <TableHead>Vendor</TableHead>}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vouchers.map((v) => (
                            <TableRow key={v.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/vouchers/${v.id}`)}>
                                <TableCell>
                                    <div className="font-mono font-semibold">{v.code}</div>
                                    <span className="text-xs text-muted-foreground">{voucherScopeLabels[v.scope]}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={voucherTypeBadgeStyles[v.voucherType]}>
                                        {voucherTypeLabels[v.voucherType]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm max-w-[160px]">
                                    <div className="truncate" title={getDiscountDisplay(v)}>{getDiscountDisplay(v)}</div>
                                    {v.voucherType === 'DISCOUNT' && v.discountType && (
                                        <span className="text-muted-foreground text-xs">{discountTypeLabels[v.discountType]}</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm">
                                    <span>{v.usageCount}</span>
                                    <span className="text-muted-foreground">/{v.usageLimit}</span>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                    <div>{formatDate(v.startDate)}</div>
                                    <div>{formatDate(v.endDate)}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={voucherStatusBadgeStyles[v.status]}>
                                        {voucherStatusLabels[v.status]}
                                    </Badge>
                                </TableCell>
                                    {scope !== 'PLATFORM' && (
                                        <TableCell className="font-medium text-primary">
                                            {v.vendorName || 'N/A'}
                                        </TableCell>
                                    )}
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View" onClick={() => navigate(`/admin/vouchers/${v.id}`)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => navigate(`/admin/vouchers/${v.id}/edit`)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Delete" onClick={() => onDelete(v)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Show</span>
                    <Select value={String(pagination.pageSize)} onValueChange={(val) => onPageSizeChange(Number(val))}>
                        <SelectTrigger className="w-[70px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 50].map(s => (
                                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>of {pagination.total} vouchers</span>
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => pagination.current > 1 && onPageChange(pagination.current - 1)}
                                className={pagination.current <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="px-3 text-sm">
                                Page {pagination.current} of {totalPages}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => pagination.current < totalPages && onPageChange(pagination.current + 1)}
                                className={pagination.current >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
