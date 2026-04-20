import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EventFilters, type EventFiltersState } from './components/EventFilters';
import { EventCardGrid } from './components/EventCardGrid';
import { TagCombobox } from './components/TagCombobox';
import { useEvents } from '@/hooks/event';
import type { EventQueryParams } from '@/services/api/eventService';
import type { EventResponse } from '@/types/event';

const initialFilters: EventFiltersState = {
    searchName: '',
    filterStatus: undefined,
    deleteFilter: 'active',
    startDate: '',
    endDate: '',
    minPrice: undefined,
    maxPrice: undefined,
    tagIds: [],
};

export default function AdminEventsPage() {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDir, setSortDir] = useState<'asc' | 'desc' | undefined>(undefined);
    const [filters, setFilters] = useState<EventFiltersState>(initialFilters);

    const [deleteTarget, setDeleteTarget] = useState<EventResponse | null>(null);
    const [restoreTarget, setRestoreTarget] = useState<EventResponse | null>(null);

    const queryParams = useMemo<EventQueryParams>(() => {
        const params: EventQueryParams = { page: currentPage - 1, size: pageSize };
        if (sortBy) params.sortBy = sortBy;
        if (sortDir) params.sortDir = sortDir;
        if (filters.searchName.trim()) params.name = filters.searchName.trim();
        if (filters.filterStatus) params.status = filters.filterStatus;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
        if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
        if (filters.tagIds.length > 0) params.tagIds = filters.tagIds;

        // Delete filter
        if (filters.deleteFilter === 'active') {
            params.deleted = false;
        } else if (filters.deleteFilter === 'deleted') {
            params.deleted = true;
        } else {
            params.includeDeleted = true;
        }

        return params;
    }, [currentPage, pageSize, sortBy, sortDir, filters]);

    const { events, loading, totalElements, fetchEvents, deleteEvent, restoreEvent } = useEvents(queryParams);

    const handleSort = (field: string) => {
        if (sortBy === field) {
            if (sortDir === 'asc') setSortDir('desc');
            else { setSortBy(undefined); setSortDir(undefined); }
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
        setCurrentPage(1);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        await deleteEvent(deleteTarget.id);
        setDeleteTarget(null);
    };

    const handleRestoreConfirm = async () => {
        if (!restoreTarget) return;
        await restoreEvent(restoreTarget.id);
        setRestoreTarget(null);
    };

    const hasActiveFilters =
        filters.searchName || filters.filterStatus || filters.deleteFilter !== 'active' ||
        filters.startDate || filters.endDate ||
        filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.tagIds.length > 0;

    return (
        <div className="max-w-7xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-xl">Quản lý sự kiện</CardTitle>
                        <CardDescription>Quản lý tất cả sự kiện trong hệ thống</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/admin/events/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo sự kiện
                    </Button>
                </CardHeader>
                <CardContent>
                    <EventFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        onRefresh={fetchEvents}
                        onClearFilters={handleClearFilters}
                        loading={loading}
                        tagCombobox={
                            <TagCombobox
                                selectedTagIds={filters.tagIds}
                                onChange={(tagIds) => setFilters({ ...filters, tagIds })}
                            />
                        }
                    />

                    <EventCardGrid
                        events={events}
                        loading={loading}
                        pagination={{ current: currentPage, pageSize, total: totalElements }}
                        sortBy={sortBy}
                        sortDir={sortDir}
                        deleteFilter={filters.deleteFilter}
                        onSort={handleSort}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                        onDelete={(e) => setDeleteTarget(e)}
                        onRestore={(e) => setRestoreTarget(e)}
                        hasActiveFilters={!!hasActiveFilters}
                        onClearFilters={handleClearFilters}
                    />
                </CardContent>
            </Card>

            {/* Hide (soft-delete) confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ẩn sự kiện</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn ẩn "{deleteTarget?.name}"? Sự kiện sẽ bị ẩn và có thể khôi phục sau.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Ẩn sự kiện
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Restore confirmation */}
            <AlertDialog open={!!restoreTarget} onOpenChange={(open) => !open && setRestoreTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Khôi phục sự kiện</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn khôi phục "{restoreTarget?.name}"? Sự kiện sẽ hoạt động trở lại.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestoreConfirm}>Khôi phục</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
