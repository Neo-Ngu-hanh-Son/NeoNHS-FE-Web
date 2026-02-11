import { useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal, Eye, Pencil, Trash2, RotateCcw, MapPin,
    ArrowUpDown, ArrowUp, ArrowDown, CalendarX, ImageIcon,
} from 'lucide-react';
import type { EventResponse } from '@/types/event';
import { statusBadgeStyles, statusLabels } from '../constants';
import { formatEventPrice, formatEventTimeRange } from '../utils';

type SortDirection = 'asc' | 'desc' | undefined;

interface EventsTableProps {
    events: EventResponse[];
    loading: boolean;
    pagination: { current: number; pageSize: number; total: number };
    sortBy?: string;
    sortDir?: SortDirection;
    onSort: (field: string) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onDelete: (event: EventResponse) => void;
    onRestore: (event: EventResponse) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

function SortIcon({ field, sortBy, sortDir }: { field: string; sortBy?: string; sortDir?: SortDirection }) {
    if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground/50" />;
    return sortDir === 'asc'
        ? <ArrowUp className="ml-1 h-3 w-3 text-primary" />
        : <ArrowDown className="ml-1 h-3 w-3 text-primary" />;
}

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

export function EventsTable({
    events, loading, pagination, sortBy, sortDir, onSort,
    onPageChange, onPageSizeChange, onDelete, onRestore, hasActiveFilters, onClearFilters,
}: EventsTableProps) {
    const navigate = useNavigate();
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    return (
        <div>
            {/* Summary row */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                    Showing {events.length} of {pagination.total} events
                </p>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Rows:</span>
                    <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                        value={pagination.pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    >
                        {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-14"></TableHead>
                            <TableHead className="w-[20%]">Event Name</TableHead>
                            <TableHead className="w-[9%]">Status</TableHead>
                            <TableHead className="w-[13%] cursor-pointer select-none" onClick={() => onSort('locationName')}>
                                <span className="flex items-center">Location<SortIcon field="locationName" sortBy={sortBy} sortDir={sortDir} /></span>
                            </TableHead>
                            <TableHead className="w-[16%] cursor-pointer select-none" onClick={() => onSort('startTime')}>
                                <span className="flex items-center">Time<SortIcon field="startTime" sortBy={sortBy} sortDir={sortDir} /></span>
                            </TableHead>
                            <TableHead className="w-[10%] cursor-pointer select-none" onClick={() => onSort('price')}>
                                <span className="flex items-center">Price<SortIcon field="price" sortBy={sortBy} sortDir={sortDir} /></span>
                            </TableHead>
                            <TableHead className="w-[8%]">Enrolled</TableHead>
                            <TableHead className="w-[12%]">Tags</TableHead>
                            <TableHead className="w-10 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton />
                        ) : events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-40 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <CalendarX className="h-10 w-10" />
                                        <p className="text-sm font-medium">No events found</p>
                                        <p className="text-xs">{hasActiveFilters ? 'No events match your current filters.' : 'No events have been created yet.'}</p>
                                        {hasActiveFilters && <Button variant="outline" size="sm" onClick={onClearFilters}>Clear Filters</Button>}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => {
                                const isDeleted = !!event.deletedAt;
                                const timeRange = formatEventTimeRange(event.startTime, event.endTime);
                                return (
                                    <TableRow key={event.id} className={isDeleted ? 'opacity-50' : ''}>
                                        {/* Thumbnail */}
                                        <TableCell>
                                            {event.thumbnailUrl ? (
                                                <img
                                                    src={event.thumbnailUrl}
                                                    alt={event.name}
                                                    className="h-12 w-12 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>

                                        {/* Event Name */}
                                        <TableCell>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className="font-medium text-foreground truncate cursor-pointer hover:underline"
                                                        onClick={() => navigate(`/admin/events/${event.id}`)}
                                                    >
                                                        {event.name}
                                                    </span>
                                                    {isDeleted && (
                                                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px] px-1.5 py-0 shrink-0">
                                                            Hidden
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground line-clamp-1">
                                                    {event.shortDescription || 'No description'}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge variant="outline" className={statusBadgeStyles[event.status]}>
                                                {statusLabels[event.status]}
                                            </Badge>
                                        </TableCell>

                                        {/* Location */}
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                <span className="truncate">{event.locationName || '—'}</span>
                                            </div>
                                        </TableCell>

                                        {/* Time */}
                                        <TableCell>
                                            {timeRange.singleLine ? (
                                                <span className="text-xs">{timeRange.start} - {timeRange.end}</span>
                                            ) : (
                                                <div className="flex flex-col text-xs gap-0.5">
                                                    <span>{timeRange.start}</span>
                                                    <span>{timeRange.end}</span>
                                                </div>
                                            )}
                                        </TableCell>

                                        {/* Price */}
                                        <TableCell>
                                            <span className={event.price ? 'font-semibold text-emerald-600' : 'text-muted-foreground'}>
                                                {formatEventPrice(event.price)}
                                            </span>
                                        </TableCell>

                                        {/* Enrolled */}
                                        <TableCell>
                                            <span className="text-sm">
                                                {event.currentEnrolled ?? 0}
                                                {event.maxParticipants ? ` / ${event.maxParticipants}` : ''}
                                            </span>
                                        </TableCell>

                                        {/* Tags */}
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {event.tags && event.tags.length > 0 ? (
                                                    event.tags.slice(0, 2).map((tag) => (
                                                        <Badge
                                                            key={tag.id}
                                                            variant="secondary"
                                                            className="text-[10px] px-1.5 py-0"
                                                            style={tag.tagColor ? { backgroundColor: tag.tagColor + '20', color: tag.tagColor, borderColor: tag.tagColor + '40' } : undefined}
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                                {event.tags && event.tags.length > 2 && (
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{event.tags.length - 2}</Badge>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(`/admin/events/${event.id}`)}>
                                                        <Eye className="mr-2 h-4 w-4" />View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate(`/admin/events/${event.id}/edit`)}>
                                                        <Pencil className="mr-2 h-4 w-4" />Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {isDeleted ? (
                                                        <DropdownMenuItem onClick={() => onRestore(event)}>
                                                            <RotateCcw className="mr-2 h-4 w-4" />Restore
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => onDelete(event)} className="text-destructive focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">Page {pagination.current} of {totalPages}</p>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" disabled={pagination.current <= 1} onClick={() => onPageChange(pagination.current - 1)}>
                            Previous
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page: number;
                            if (totalPages <= 5) page = i + 1;
                            else if (pagination.current <= 3) page = i + 1;
                            else if (pagination.current >= totalPages - 2) page = totalPages - 4 + i;
                            else page = pagination.current - 2 + i;
                            return (
                                <Button key={page} variant={pagination.current === page ? 'default' : 'outline'} size="sm" className="w-8 h-8 p-0" onClick={() => onPageChange(page)}>
                                    {page}
                                </Button>
                            );
                        })}
                        <Button variant="outline" size="sm" disabled={pagination.current >= totalPages} onClick={() => onPageChange(pagination.current + 1)}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
