import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { VoucherFilters, type VoucherFiltersState } from './components/VoucherFilters';
import { VoucherTable } from './components/VoucherTable';
import { useVouchers } from '@/hooks/voucher';
import type { AdminVoucherQueryParams } from '@/services/api/voucherService';
import type { VoucherResponse } from '@/types/voucher';

const initialFilters: VoucherFiltersState = {
    searchCode: '',
    filterType: undefined,
    filterStatus: undefined,
    filterScope: undefined,
    filterProduct: undefined,
    deleteFilter: 'active',
    startDate: '',
    endDate: '',
};

export default function AdminVouchersPage() {
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
        if (appliedFilters.filterScope) params.scope = appliedFilters.filterScope;
        if (appliedFilters.filterProduct) params.applicableProduct = appliedFilters.filterProduct;
        if (appliedFilters.startDate) params.startDate = appliedFilters.startDate;
        if (appliedFilters.endDate) params.endDate = appliedFilters.endDate;

        if (appliedFilters.deleteFilter === 'active') {
            params.deleted = false;
        } else if (appliedFilters.deleteFilter === 'deleted') {
            params.deleted = true;
        } else {
            params.includeDeleted = true;
        }

        return params;
    }, [currentPage, pageSize, sortBy, sortDir, appliedFilters]);

    const { vouchers, loading, totalElements, fetchVouchers, deleteVoucher } = useVouchers(queryParams);

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

    return (
        <div className="max-w-7xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-xl">Voucher Management</CardTitle>
                        <CardDescription>Manage all vouchers in the system</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/admin/vouchers/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Voucher
                    </Button>
                </CardHeader>
                <CardContent>
                    <VoucherFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        onSearch={handleSearch}
                        onRefresh={fetchVouchers}
                        onClearFilters={handleClearFilters}
                        loading={loading}
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
                    />
                </CardContent>
            </Card>

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete voucher "{deleteTarget?.code}"? This action can be undone later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
