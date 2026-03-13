import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Tag, Clock, BarChart2 } from 'lucide-react';
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
import type { VoucherResponse, VoucherScope } from '@/types/voucher';

const initialFilters: VoucherFiltersState = {
    searchCode: '',
    filterType: undefined,
    filterStatus: undefined,
    filterScope: undefined,
    filterProduct: undefined,
    startDate: '',
    endDate: '',
};

interface AdminVouchersPageProps {
    scope?: VoucherScope;
}

export default function AdminVouchersPage({ scope }: AdminVouchersPageProps) {
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
        
        // Scope priority: Prop scope > Filter scope
        const finalScope = scope || appliedFilters.filterScope;
        if (finalScope) params.scope = finalScope;
        
        if (appliedFilters.filterProduct) params.applicableProduct = appliedFilters.filterProduct;
        if (appliedFilters.startDate) params.startDate = appliedFilters.startDate;
        if (appliedFilters.endDate) params.endDate = appliedFilters.endDate;
        params.deleted = false;

        return params;
    }, [currentPage, pageSize, sortBy, sortDir, appliedFilters, scope]);

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

    // Calculate quick stats (simplified)
    const stats = useMemo(() => {
        return {
            total: totalElements,
            active: vouchers.filter(v => v.status === 'ACTIVE').length,
            used: vouchers.reduce((acc, v) => acc + (v.usageCount || 0), 0)
        };
    }, [vouchers, totalElements]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`border-l-4 ${scope === 'PLATFORM' ? 'border-l-accent-gold' : 'border-l-primary'}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Vouchers</p>
                                <h3 className="text-2xl font-bold">{stats.total}</h3>
                            </div>
                            <Tag className={`h-8 w-8 ${scope === 'PLATFORM' ? 'text-accent-gold' : 'text-primary'} opacity-20`} />
                        </div>
                    </CardContent>
                </Card>
                <Card className={`border-l-4 ${scope === 'PLATFORM' ? 'border-l-accent-gold' : 'border-l-primary'}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Usage</p>
                                <h3 className="text-2xl font-bold">{stats.used}</h3>
                            </div>
                            <Clock className={`h-8 w-8 ${scope === 'PLATFORM' ? 'text-accent-gold' : 'text-primary'} opacity-20`} />
                        </div>
                    </CardContent>
                </Card>
                <Card className={`border-l-4 ${scope === 'PLATFORM' ? 'border-l-accent-gold' : 'border-l-primary'}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                                <h3 className="text-2xl font-bold">
                                    {stats.total > 0 ? Math.round((stats.used / stats.total) * 100) : 0}%
                                </h3>
                            </div>
                            <BarChart2 className={`h-8 w-8 ${scope === 'PLATFORM' ? 'text-accent-gold' : 'text-primary'} opacity-20`} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className={`overflow-hidden border-t-4 ${scope === 'PLATFORM' ? 'border-t-accent-gold' : 'border-t-primary'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-xl">
                            {scope === 'PLATFORM' ? 'Platform Voucher Management' : 
                             scope === 'VENDOR' ? 'Vendor Voucher Management' : 
                             'Voucher Management'}
                        </CardTitle>
                        <CardDescription>
                            {scope === 'PLATFORM' ? 'Manage official vouchers from Ngũ Hành Sơn' : 
                             scope === 'VENDOR' ? 'Manage vouchers from partners and vendors' : 
                             'Manage all vouchers in the system'}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => navigate('/admin/vouchers/deleted')}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deleted Vouchers
                        </Button>
                        <Button onClick={() => navigate('/admin/vouchers/create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Voucher
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
                        hideScope={!!scope}
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
                        scope={scope}
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
