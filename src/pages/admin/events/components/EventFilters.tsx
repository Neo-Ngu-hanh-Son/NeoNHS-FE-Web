import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter, RotateCw, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { EventStatus } from '@/types/event';
import { EVENT_STATUS_OPTIONS } from '../constants';

export interface EventFiltersState {
    searchName: string;
    filterStatus: EventStatus | undefined;
    deleteFilter: 'active' | 'deleted' | 'all';
    startDate: string;
    endDate: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    tagIds: string[];
}

interface EventFiltersProps {
    filters: EventFiltersState;
    onFiltersChange: (filters: EventFiltersState) => void;
    onRefresh: () => void;
    onClearFilters: () => void;
    loading: boolean;
    tagCombobox?: React.ReactNode;
}

export function EventFilters({
    filters,
    onFiltersChange,
    onRefresh,
    onClearFilters,
    loading,
    tagCombobox,
}: EventFiltersProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    // Local draft state — changes are only applied on "Search" click
    const [draft, setDraft] = useState<EventFiltersState>(filters);

    // Sync draft when filters are cleared externally
    useEffect(() => {
        setDraft(filters);
    }, [filters]);

    const hasActiveFilters =
        filters.searchName ||
        filters.filterStatus ||
        filters.deleteFilter !== 'active' ||
        filters.startDate ||
        filters.endDate ||
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined ||
        filters.tagIds.length > 0;

    const handleDraftChange = (field: keyof EventFiltersState, value: unknown) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        onFiltersChange(draft);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="mb-6 rounded-lg border bg-muted/30 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Bộ lọc</span>
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="text-xs">Đang áp dụng</Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs"
                >
                    Bộ lọc nâng cao
                    {showAdvanced ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                </Button>
            </div>

            {/* Row 1: Search, Status, Delete filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                    placeholder="Tìm kiếm theo tên..."
                    icon={<Search className="h-4 w-4" />}
                    value={draft.searchName}
                    onChange={(e) => handleDraftChange('searchName', e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <Select
                    value={draft.filterStatus || '__all__'}
                    onValueChange={(v) => handleDraftChange('filterStatus', v === '__all__' ? undefined : v)}
                >
                    <SelectTrigger><SelectValue placeholder="Tất cả trạng thái" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
                        {EVENT_STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={draft.deleteFilter}
                    onValueChange={(v) => handleDraftChange('deleteFilter', v)}
                >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="deleted">Đã ẩn</SelectItem>
                        <SelectItem value="all">Tất cả</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Row 2: Advanced filters (collapsible) */}
            {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t">
                    {/* Date range */}
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            placeholder="Ngày bắt đầu"
                            value={draft.startDate}
                            onChange={(e) => handleDraftChange('startDate', e.target.value)}
                            className="w-full"
                        />
                        <span className="text-muted-foreground text-xs shrink-0">đến</span>
                        <Input
                            type="date"
                            placeholder="Ngày kết thúc"
                            value={draft.endDate}
                            onChange={(e) => handleDraftChange('endDate', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Price range */}
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Giá tối thiểu"
                            value={draft.minPrice ?? ''}
                            onChange={(e) => handleDraftChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                            min={0}
                            className="w-full"
                        />
                        <span className="text-muted-foreground text-xs shrink-0">-</span>
                        <Input
                            type="number"
                            placeholder="Giá tối đa"
                            value={draft.maxPrice ?? ''}
                            onChange={(e) => handleDraftChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                            min={0}
                            className="w-full"
                        />
                    </div>

                    {/* Tag combobox */}
                    <div className="min-h-[40px]">{tagCombobox}</div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={handleSearch} disabled={loading}>
                    <Search className={`h-4 w-4 mr-1`} />
                    Tìm kiếm
                </Button>
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                    <RotateCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Làm mới
                </Button>
                <Button variant="ghost" size="sm" onClick={onClearFilters} disabled={!hasActiveFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Xóa bộ lọc
                </Button>
            </div>
        </div>
    );
}
