import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RefreshCw, X, Search } from 'lucide-react';
import type { VoucherType, VoucherStatus, VoucherScope, ApplicableProduct } from '@/types/voucher';
import {
    VOUCHER_TYPE_OPTIONS,
    VOUCHER_STATUS_OPTIONS,
    VOUCHER_SCOPE_OPTIONS,
    APPLICABLE_PRODUCT_OPTIONS,
} from '../constants';

export interface VoucherFiltersState {
    searchCode: string;
    filterType: VoucherType | undefined;
    filterStatus: VoucherStatus | undefined;
    filterScope: VoucherScope | undefined;
    filterProduct: ApplicableProduct | undefined;
    startDate: string;
    endDate: string;
}

interface VoucherFiltersProps {
    filters: VoucherFiltersState;
    onFiltersChange: (filters: VoucherFiltersState) => void;
    onSearch: () => void;
    onRefresh: () => void;
    onClearFilters: () => void;
    loading: boolean;
    hideScope?: boolean;
}

export function VoucherFilters({ filters, onFiltersChange, onSearch, onRefresh, onClearFilters, loading, hideScope }: VoucherFiltersProps) {
    const update = (partial: Partial<VoucherFiltersState>) => {
        onFiltersChange({ ...filters, ...partial });
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Row 1: Search + main filters */}
            <div className="flex flex-wrap items-center gap-3">
                <Input
                    placeholder="Search by code..."
                    value={filters.searchCode}
                    onChange={(e) => update({ searchCode: e.target.value })}
                    className="w-[200px]"
                />

                <Select
                    value={filters.filterType || '_all'}
                    onValueChange={(val) => update({ filterType: val === '_all' ? undefined : val as VoucherType })}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Voucher Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="_all">All Types</SelectItem>
                        {VOUCHER_TYPE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.filterStatus || '_all'}
                    onValueChange={(val) => update({ filterStatus: val === '_all' ? undefined : val as VoucherStatus })}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="_all">All Status</SelectItem>
                        {VOUCHER_STATUS_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {!hideScope && (
                    <Select
                        value={filters.filterScope || '_all'}
                        onValueChange={(val) => update({ filterScope: val === '_all' ? undefined : val as VoucherScope })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Scope" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_all">All Scopes</SelectItem>
                            {VOUCHER_SCOPE_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <Select
                    value={filters.filterProduct || '_all'}
                    onValueChange={(val) => update({ filterProduct: val === '_all' ? undefined : val as ApplicableProduct })}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Product" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="_all">All Products</SelectItem>
                        {APPLICABLE_PRODUCT_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

            </div>

            {/* Row 2: Date range + actions */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">From:</span>
                    <Input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => update({ startDate: e.target.value })}
                        className="w-[160px]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">To:</span>
                    <Input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => update({ endDate: e.target.value })}
                        className="w-[160px]"
                    />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" onClick={onSearch} disabled={loading}>
                        <Search className="mr-1 h-4 w-4" /> Search
                    </Button>
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                        <X className="mr-1 h-4 w-4" /> Clear
                    </Button>
                    <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                        <RefreshCw className={`mr-1 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>
            </div>
        </div>
    );
}
