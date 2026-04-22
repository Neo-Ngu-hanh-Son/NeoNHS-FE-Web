import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Ban, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useVouchers } from '@/hooks/voucher';
import { vendorVoucherService } from '@/services/api/voucherService';
import type { AdminVoucherQueryParams } from '@/services/api/voucherService';
import type { VoucherResponse } from '@/types/voucher';
import { message } from 'antd';
import {
    voucherStatusBadgeStyles, voucherStatusLabels,
    voucherTypeBadgeStyles, voucherTypeLabels,
} from '@/pages/admin/vouchers/constants';

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
        return dateStr;
    }
}

function formatDateTime(dateStr: string | null | undefined) {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleString('vi-VN');
    } catch {
        return dateStr;
    }
}

export default function DeletedVouchersPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [restoreTarget, setRestoreTarget] = useState<VoucherResponse | null>(null);
    const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<VoucherResponse | null>(null);
    const [processing, setProcessing] = useState(false);

    const queryParams = useMemo<AdminVoucherQueryParams>(() => ({
        page: currentPage - 1,
        size: pageSize,
        deleted: true,
    }), [currentPage, pageSize]);

    const { vouchers, loading, totalElements, fetchVouchers } = useVouchers(queryParams, 'VENDOR');
    const totalPages = Math.ceil(totalElements / pageSize) || 1;

    const handleRestore = async () => {
        if (!restoreTarget) return;
        setProcessing(true);
        try {
            const response = await vendorVoucherService.restore(restoreTarget.id);
            if (response.success) {
                message.success('Khôi phục voucher thành công');
                fetchVouchers();
            } else {
                message.error(response.message || 'Khôi phục voucher thất bại');
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Khôi phục voucher thất bại');
        } finally {
            setProcessing(false);
            setRestoreTarget(null);
        }
    };

    const handlePermanentDelete = async () => {
        if (!permanentDeleteTarget) return;
        setProcessing(true);
        try {
            const response = await vendorVoucherService.permanentDelete(permanentDeleteTarget.id);
            if (response.success) {
                message.success('Đã xóa vĩnh viễn voucher');
                fetchVouchers();
            } else {
                message.error(response.message || 'Xóa vĩnh viễn voucher thất bại');
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Xóa vĩnh viễn voucher thất bại');
        } finally {
            setProcessing(false);
            setPermanentDeleteTarget(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate('/vendor/vouchers')} className="h-9 w-9">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Voucher đã xóa</h1>
                    <p className="text-muted-foreground font-mono">Thùng rác</p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-xl">Danh sách tạm xóa</CardTitle>
                        <CardDescription>Quản lý các voucher đã tạm xóa — khôi phục hoặc loại bỏ vĩnh viễn</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-lg font-medium">Thùng rác trống</p>
                            <p className="text-sm mt-1">Tất cả voucher của bạn đều đang ở trạng thái hoạt động.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mã</TableHead>
                                            <TableHead>Loại</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Thời hạn</TableHead>
                                            <TableHead>Đã xóa lúc</TableHead>
                                            <TableHead className="text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vouchers.map((v) => (
                                            <TableRow key={v.id}>
                                                <TableCell>
                                                    <span className="font-mono font-semibold">{v.code}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={voucherTypeBadgeStyles[v.voucherType]}>
                                                        {voucherTypeLabels[v.voucherType]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={voucherStatusBadgeStyles[v.status]}>
                                                        {voucherStatusLabels[v.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                    <div>{formatDate(v.startDate)}</div>
                                                    <div>{formatDate(v.endDate)}</div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {formatDateTime(v.deletedAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" title="Khôi phục" onClick={() => setRestoreTarget(v)}>
                                                            <RotateCcw className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Xóa vĩnh viễn" onClick={() => setPermanentDeleteTarget(v)}>
                                                            <Ban className="h-4 w-4" />
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
                                    <span>Hiển thị</span>
                                    <Select value={String(pageSize)} onValueChange={(val) => { setPageSize(Number(val)); setCurrentPage(1); }}>
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[5, 10, 20, 50].map(s => (
                                                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span>Tổng số: {totalElements}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                                        Trước
                                    </Button>
                                    <span className="text-sm">Trang {currentPage} / {totalPages}</span>
                                    <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                        Sau
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Restore Dialog */}
            <AlertDialog open={!!restoreTarget} onOpenChange={(open) => !open && setRestoreTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Khôi phục Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn khôi phục voucher "<strong className="font-mono">{restoreTarget?.code}</strong>"? Nó sẽ quay lại trạng thái ĐANG HOẠT ĐỘNG.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestore} disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
                            Khôi phục
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Permanent Delete Dialog */}
            <AlertDialog open={!!permanentDeleteTarget} onOpenChange={(open) => !open && setPermanentDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa vĩnh viễn Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa <strong>vĩnh viễn</strong> voucher "<strong className="font-mono">{permanentDeleteTarget?.code}</strong>". Không thể khôi phục thao tác này.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePermanentDelete}
                            disabled={processing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Xóa vĩnh viễn
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
