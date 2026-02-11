import { useState, useEffect, useRef } from 'react';
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
    filterLocation: string;
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
    const [searchInput, setSearchInput] = useState(filters.searchName);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    // Debounce search input
    useEffect(() => {
        debounceRef.current = setTimeout(() => {
            if (searchInput !== filters.searchName) {
                onFiltersChange({ ...filters, searchName: searchInput });
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    // Sync external changes
    useEffect(() => {
        setSearchInput(filters.searchName);
    }, [filters.searchName]);

    const hasActiveFilters =
        filters.searchName ||
        filters.filterStatus ||
        filters.deleteFilter !== 'active' ||
        filters.filterLocation ||
        filters.startDate ||
        filters.endDate ||
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined ||
        filters.tagIds.length > 0;

    const handleChange = (field: keyof EventFiltersState, value: unknown) => {
        onFiltersChange({ ...filters, [field]: value });
    };

    return (
        <div className="mb-6 rounded-lg border bg-muted/30 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Filters</span>
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs"
                >
                    Advanced Filters
                    {showAdvanced ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                </Button>
            </div>

            {/* Row 1: Search, Status, Delete filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                    placeholder="Search by name..."
                    icon={<Search className="h-4 w-4" />}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />

                <Select
                    value={filters.filterStatus || '__all__'}
                    onValueChange={(v) => handleChange('filterStatus', v === '__all__' ? undefined : v)}
                >
                    <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">All Statuses</SelectItem>
                        {EVENT_STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.deleteFilter}
                    onValueChange={(v) => handleChange('deleteFilter', v)}
                >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="deleted">Hidden</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Row 2: Advanced filters (collapsible) */}
            {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t">
                    <Input
                        placeholder="Filter by location..."
                        value={filters.filterLocation}
                        onChange={(e) => handleChange('filterLocation', e.target.value)}
                    />

                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            placeholder="Start date"
                            value={filters.startDate}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                            className="w-full"
                        />
                        <span className="text-muted-foreground text-xs shrink-0">to</span>
                        <Input
                            type="date"
                            placeholder="End date"
                            value={filters.endDate}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min price"
                            value={filters.minPrice ?? ''}
                            onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                            min={0}
                            className="w-full"
                        />
                        <span className="text-muted-foreground text-xs">-</span>
                        <Input
                            type="number"
                            placeholder="Max price"
                            value={filters.maxPrice ?? ''}
                            onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                            min={0}
                            className="w-full"
                        />
                    </div>

                    {/* Tag combobox slot */}
                    <div>{tagCombobox}</div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                    <RotateCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
                <Button variant="ghost" size="sm" onClick={onClearFilters} disabled={!hasActiveFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                </Button>
            </div>
        </div>
    );
}
