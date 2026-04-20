import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Tag, Clock, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { VoucherFilters, type VoucherFiltersState } from '@/pages/admin/vouchers/components/VoucherFilters';
import { VoucherTable } from '@/pages/admin/vouchers/components/VoucherTable';
import { useVouchers } from '@/hooks/voucher';
import type { AdminVoucherQueryParams } from '@/services/api/voucherService';
import type { VoucherResponse } from '@/types/voucher';

const initialFilters: VoucherFiltersState = {
    searchCode: '',
    filterType: undefined,
    filterStatus: undefined,
    filterScope: undefined,
    filterProduct: undefined,
    startDate: '',
    endDate: '',
};

export default function VendorVouchersPage() {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDir, setSortDir] = useState<'asc' | 'desc' | undefined>(undefined);
    const [filters, setFilters] = useState<VoucherFiltersState>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<VoucherFiltersState>(initialFilters);

    const [deleteTarget, setDeleteTarget] = useState<VoucherResponse | null>(null);

    const queryParams = useMemo<AdminVoucherQueryParams>(() => {
        const params: AdminVoucherQueryParams = { page: currentPage - 1, size: pageSize };
        if (sortBy) params.sortBy = sortBy;
        if (sortDir) params.sortDir = sortDir;
        if (appliedFilters.searchCode.trim()) params.code = appliedFilters.searchCode.trim();
        if (appliedFilters.filterType) params.voucherType = appliedFilters.filterType;
        if (appliedFilters.filterStatus) params.status = appliedFilters.filterStatus;
        if (appliedFilters.filterProduct) params.applicableProduct = appliedFilters.filterProduct;
        if (appliedFilters.startDate) params.startDate = appliedFilters.startDate;
        if (appliedFilters.endDate) params.endDate = appliedFilters.endDate;
        params.deleted = false;

        return params;
    }, [currentPage, pageSize, sortBy, sortDir, appliedFilters]);

    // FETCH WITH VENDOR SCOPE
    const { vouchers, loading, totalElements, fetchVouchers, deleteVoucher } = useVouchers(queryParams, 'VENDOR');

    const handleSort = (field: string) => {
        if (sortBy === field) {
            if (sortDir === 'asc') setSortDir('desc');
            else { setSortBy(undefined); setSortDir(undefined); }
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
    };

    const handleSearch = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
        setCurrentPage(1);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        await deleteVoucher(deleteTarget.id);
        setDeleteTarget(null);
    };

    const stats = useMemo(() => {
        return {
            total: totalElements,
            used: vouchers.reduce((acc, v) => acc + (v.usageCount || 0), 0)
        };
    }, [vouchers, totalElements]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            {/* Quick Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Tổng Voucher của tôi"
                    value={stats.total}
                    icon={<Tag className="h-6 w-6 text-white" />}
                    iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
                <StatsCard
                    title="Tổng lượt sử dụng"
                    value={stats.used}
                    icon={<Clock className="h-6 w-6 text-white" />}
                    iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <StatsCard
                    title="Hiệu suất sử dụng"
                    value={`${stats.total > 0 ? Math.round((stats.used / (vouchers.reduce((acc,v) => acc + (v.usageLimit || 1), 0))) * 100) : 0}%`}
                    icon={<BarChart2 className="h-6 w-6 text-white" />}
                    iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
                />
            </div>

            <Card className="overflow-hidden border-t-4 border-t-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Chương trình khuyến mãi</p>
                        <CardTitle className="text-xl">Quản lý Voucher Đối tác</CardTitle>
                        <CardDescription>
                            Tự thiết lập các mã giảm giá và quà tặng để thu hút khách hàng đến với dịch vụ của bạn
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => navigate('/vendor/vouchers/deleted')}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Thùng rác
                        </Button>
                        <Button onClick={() => navigate('/vendor/vouchers/create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo Voucher Mới
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <VoucherFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        onSearch={handleSearch}
                        onRefresh={fetchVouchers}
                        onClearFilters={handleClearFilters}
                        loading={loading}
                        hideScope={true} // Vendor only sees their own scope
                    />

                    <VoucherTable
                        vouchers={vouchers}
                        loading={loading}
                        pagination={{ current: currentPage, pageSize, total: totalElements }}
                        sortBy={sortBy}
                        sortDir={sortDir}
                        onSort={handleSort}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                        onDelete={(v) => setDeleteTarget(v)}
                        scope="VENDOR"
                    />
                </CardContent>
            </Card>

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa voucher "{deleteTarget?.code}"? 
                            Voucher sẽ được chuyển vào thùng rác và có thể khôi phục sau.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
