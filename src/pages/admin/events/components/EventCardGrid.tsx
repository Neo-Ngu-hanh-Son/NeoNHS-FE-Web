import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    MoreHorizontal, Eye, Pencil, Trash2, RotateCcw,
    CalendarDays, Users, Tag, ImageIcon, ChevronLeft, ChevronRight, EyeOff,
} from 'lucide-react';
import type { EventResponse } from '@/types/event';
import { statusBadgeStyles, statusLabels } from '../constants';
import { formatEventPrice, formatEventTimeRange } from '../utils';

type SortDirection = 'asc' | 'desc' | undefined;

interface EventCardGridProps {
    events: EventResponse[];
    loading: boolean;
    pagination: { current: number; pageSize: number; total: number };
    sortBy?: string;
    sortDir?: SortDirection;
    deleteFilter?: 'active' | 'deleted' | 'all';
    onSort: (field: string) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onDelete: (event: EventResponse) => void;
    onRestore: (event: EventResponse) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

function CardSkeleton() {
    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}

export function EventCardGrid({
    events, loading, pagination, sortBy, sortDir, deleteFilter, onSort,
    onPageChange, onPageSizeChange, onDelete, onRestore, hasActiveFilters, onClearFilters,
}: EventCardGridProps) {
    const navigate = useNavigate();
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    // Derive current sort label
    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'startTime', label: 'Start Time' },
        { value: 'price', label: 'Price' },
        { value: 'createdAt', label: 'Created' },
    ];
    const currentSortValue = sortBy ? `${sortBy}_${sortDir || 'asc'}` : 'createdAt_desc';

    const handleSortChange = (value: string) => {
        const [field] = value.split('_');
        onSort(field);
    };

    // Loading state
    if (loading) {
        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No events found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    {hasActiveFilters
                        ? 'Try adjusting your filters to find what you\'re looking for.'
                        : 'Get started by creating your first event.'}
                </p>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                        Clear Filters
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div>
            {/* Sort controls & pagination info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {pagination.total} event{pagination.total !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort by:</span>
                    <Select value={currentSortValue} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((opt) => (
                                <SelectItem key={`${opt.value}_asc`} value={`${opt.value}_asc`}>
                                    {opt.label} ↑
                                </SelectItem>
                            ))}
                            {sortOptions.map((opt) => (
                                <SelectItem key={`${opt.value}_desc`} value={`${opt.value}_desc`}>
                                    {opt.label} ↓
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {events.map((event) => {
                    // Determine if event is hidden:
                    // - If deleteFilter is 'deleted', all shown events are hidden
                    // - If deleteFilter is 'active', all shown events are active
                    // - Otherwise, check deletedAt field
                    const isDeleted = deleteFilter === 'deleted'
                        ? true
                        : deleteFilter === 'active'
                            ? false
                            : !!event.deletedAt;
                    const badgeClass = statusBadgeStyles[event.status] || '';

                    return (
                        <div
                            key={event.id}
                            className={`group rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${isDeleted ? 'opacity-60' : ''}`}
                            onClick={() => navigate(`/admin/events/${event.id}`)}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-muted overflow-hidden">
                                {event.thumbnailUrl ? (
                                    <img
                                        src={event.thumbnailUrl}
                                        alt={event.name}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                                    </div>
                                )}

                                {/* Status badge overlay */}
                                <div className="absolute top-2 left-2 flex items-center gap-1">
                                    <Badge
                                        className={`text-[10px] font-semibold px-2 py-0.5 shadow-sm ${badgeClass}`}
                                    >
                                        {statusLabels[event.status] || event.status}
                                    </Badge>
                                    {isDeleted && (
                                        <Badge variant="destructive" className="text-[10px] px-2 py-0.5 shadow-sm">
                                            <EyeOff className="h-3 w-3 mr-0.5" />
                                            Hidden
                                        </Badge>
                                    )}
                                </div>

                                {/* Action menu overlay */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuItem onClick={() => navigate(`/admin/events/${event.id}`)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate(`/admin/events/${event.id}/edit`)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {isDeleted ? (
                                                <DropdownMenuItem onClick={() => onRestore(event)}>
                                                    <RotateCcw className="mr-2 h-4 w-4" /> Restore
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(event)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <EyeOff className="mr-2 h-4 w-4" /> Hide
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold text-sm leading-tight line-clamp-1">{event.name}</h3>

                                {event.shortDescription && (
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {event.shortDescription}
                                    </p>
                                )}

                                {/* Meta row */}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        {(() => {
                                            const range = formatEventTimeRange(event.startTime, event.endTime);
                                            return range.singleLine
                                                ? `${range.start} - ${range.end}`
                                                : `${range.start} → ${range.end}`;
                                        })()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-primary">
                                        {formatEventPrice(event.price)}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        {event.currentEnrolled}/{event.maxParticipants || '∞'}
                                    </span>
                                </div>

                                {/* Tags */}
                                {event.tags && event.tags.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                                        {event.tags.slice(0, 3).map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant="secondary"
                                                className="text-[10px] px-1.5 py-0"
                                                style={tag.tagColor ? {
                                                    backgroundColor: tag.tagColor + '20',
                                                    color: tag.tagColor,
                                                } : undefined}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                        {event.tags.length > 3 && (
                                            <span className="text-[10px] text-muted-foreground">
                                                +{event.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Rows per page:</span>
                        <Select
                            value={pagination.pageSize.toString()}
                            onValueChange={(v) => onPageSizeChange(Number(v))}
                        >
                            <SelectTrigger className="w-[60px] h-7 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[6, 9, 12, 18].map((s) => (
                                    <SelectItem key={s} value={s.toString()}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground ml-2">
                            {pagination.total} total
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground mr-2">
                            Page {pagination.current} of {totalPages || 1}
                        </span>
                        <Button
                            variant="outline" size="icon" className="h-7 w-7"
                            disabled={pagination.current <= 1}
                            onClick={() => onPageChange(pagination.current - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline" size="icon" className="h-7 w-7"
                            disabled={pagination.current >= totalPages}
                            onClick={() => onPageChange(pagination.current + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
