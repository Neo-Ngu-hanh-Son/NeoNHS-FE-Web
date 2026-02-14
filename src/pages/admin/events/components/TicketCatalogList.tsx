import { useState } from 'react';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus, Pencil, RotateCcw, EyeOff, Trash2, MoreHorizontal,
    Ticket as TicketIcon, CalendarDays,
} from 'lucide-react';
import { useTicketCatalogs } from '@/hooks/event';
import { ticketCatalogService } from '@/services/api/ticketCatalogService';
import { TicketCatalogFormDialog } from './TicketCatalogFormDialog';
import type { TicketCatalogResponse, CreateTicketCatalogRequest, UpdateTicketCatalogRequest } from '@/types/ticketCatalog';
import dayjs from 'dayjs';

// ── Helpers ──────────────────────────────────────────

const DAY_LABELS: Record<string, string> = {
    MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu',
    FRI: 'Fri', SAT: 'Sat', SUN: 'Sun',
};

function formatDays(applyOnDays: string | null | undefined): string {
    if (!applyOnDays) return 'Every day';
    const days = applyOnDays.split(',').map((d) => d.trim());
    if (days.length === 7) return 'Every day';
    return days.map((d) => DAY_LABELS[d] || d).join(', ');
}

function formatPrice(price: number | null | undefined): string {
    if (!price || price === 0) return 'Free';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return dayjs(date).format('DD/MM/YYYY');
}

function statusStyle(status: string) {
    switch (status) {
        case 'ACTIVE': return 'bg-green-50 text-green-700 border-green-200';
        case 'INACTIVE': return 'bg-gray-50 text-gray-600 border-gray-200';
        case 'SOLD_OUT': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        default: return '';
    }
}

function quotaBar(sold: number, total: number) {
    const pct = total > 0 ? Math.min((sold / total) * 100, 100) : 0;
    const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-green-500';
    return { pct, color };
}

// ── Component ────────────────────────────────────────

interface TicketCatalogListProps {
    eventId: string;
}

export function TicketCatalogList({ eventId }: TicketCatalogListProps) {
    const { catalogs, loading, fetchCatalogs, createCatalog, updateCatalog, deleteCatalog, restoreCatalog } = useTicketCatalogs(eventId);

    const [formOpen, setFormOpen] = useState(false);
    const [editingCatalog, setEditingCatalog] = useState<TicketCatalogResponse | null>(null);
    const [hideTarget, setHideTarget] = useState<TicketCatalogResponse | null>(null);
    const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<TicketCatalogResponse | null>(null);

    const handleCreate = () => {
        setEditingCatalog(null);
        setFormOpen(true);
    };

    const handleEdit = (catalog: TicketCatalogResponse) => {
        setEditingCatalog(catalog);
        setFormOpen(true);
    };

    const handleSubmit = async (data: CreateTicketCatalogRequest | UpdateTicketCatalogRequest) => {
        if (editingCatalog) {
            return updateCatalog(editingCatalog.id, data as UpdateTicketCatalogRequest);
        }
        return createCatalog(data as CreateTicketCatalogRequest);
    };

    const handleHideConfirm = async () => {
        if (!hideTarget) return;
        await deleteCatalog(hideTarget.id);
        setHideTarget(null);
    };

    const handlePermanentDeleteConfirm = async () => {
        if (!permanentDeleteTarget) return;
        try {
            const res = await ticketCatalogService.permanentDelete(eventId, permanentDeleteTarget.id);
            if (res.success) {
                message.success('Ticket type permanently deleted');
                await fetchCatalogs();
            } else {
                message.error(res.message || 'Failed to permanently delete');
            }
        } catch (err: unknown) {
            message.error('Failed to permanently delete ticket type');
        }
        setPermanentDeleteTarget(null);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                    {catalogs.length} ticket type{catalogs.length !== 1 ? 's' : ''}
                </span>
                <Button size="sm" onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-1" />Add Ticket Type
                </Button>
            </div>

            {catalogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <TicketIcon className="h-10 w-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No ticket types yet</p>
                    <p className="text-xs mt-1">Create one to get started</p>
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[160px]">Name</TableHead>
                                <TableHead className="min-w-[90px]">Status</TableHead>
                                <TableHead className="min-w-[100px]">Customer</TableHead>
                                <TableHead className="min-w-[120px] text-right">Price</TableHead>
                                <TableHead className="min-w-[100px]">Apply On</TableHead>
                                <TableHead className="min-w-[170px]">Valid Period</TableHead>
                                <TableHead className="min-w-[150px]">Quota</TableHead>
                                <TableHead className="min-w-[100px]">Updated</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {catalogs.map((catalog) => {
                                const isHidden = !!catalog.deletedAt;
                                const { pct, color } = quotaBar(catalog.soldQuantity ?? 0, catalog.totalQuota ?? 0);
                                const remaining = catalog.remainingQuantity ?? (catalog.totalQuota ? catalog.totalQuota - (catalog.soldQuantity ?? 0) : null);

                                return (
                                    <TableRow
                                        key={catalog.id}
                                        className={isHidden ? 'opacity-50 bg-muted/30' : ''}
                                    >
                                        {/* Name + Description */}
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-medium text-sm">{catalog.name}</span>
                                                {isHidden && (
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-50 text-red-600 border-red-200">
                                                        Hidden
                                                    </Badge>
                                                )}
                                            </div>
                                            {catalog.description && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] cursor-help">
                                                                {catalog.description}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" className="max-w-xs">
                                                            <p className="text-xs">{catalog.description}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[11px] ${statusStyle(catalog.status)}`}>
                                                {catalog.status}
                                            </Badge>
                                        </TableCell>

                                        {/* Customer Type */}
                                        <TableCell>
                                            <span className="text-sm">{catalog.customerType || '—'}</span>
                                        </TableCell>

                                        {/* Price */}
                                        <TableCell className="text-right">
                                            <div>
                                                <span className="text-sm font-medium">{formatPrice(catalog.price)}</span>
                                                {catalog.originalPrice != null && catalog.originalPrice > catalog.price && (
                                                    <span className="block text-xs text-muted-foreground line-through">
                                                        {formatPrice(catalog.originalPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Apply On Days */}
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">{formatDays(catalog.applyOnDays)}</span>
                                        </TableCell>

                                        {/* Valid Period */}
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <CalendarDays className="h-3 w-3 shrink-0" />
                                                <span>
                                                    {formatDate(catalog.validFromDate)} — {formatDate(catalog.validToDate)}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Quota (progress bar) */}
                                        <TableCell>
                                            {catalog.totalQuota ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                            {catalog.soldQuantity ?? 0} / {catalog.totalQuota}
                                                        </span>
                                                        {remaining !== null && (
                                                            <span className="text-muted-foreground font-medium">
                                                                {remaining} left
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${color}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Unlimited</span>
                                            )}
                                        </TableCell>

                                        {/* Updated */}
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">{formatDate(catalog.updatedAt)}</span>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(catalog)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {isHidden ? (
                                                        <>
                                                            <DropdownMenuItem onClick={() => restoreCatalog(catalog.id)}>
                                                                <RotateCcw className="mr-2 h-4 w-4" /> Restore
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setPermanentDeleteTarget(catalog)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Forever
                                                            </DropdownMenuItem>
                                                        </>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            className="text-orange-600 focus:text-orange-700"
                                                            onClick={() => setHideTarget(catalog)}
                                                        >
                                                            <EyeOff className="mr-2 h-4 w-4" /> Hide
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Form Dialog */}
            <TicketCatalogFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                catalog={editingCatalog}
                onSubmit={handleSubmit}
            />

            {/* Hide confirmation */}
            <AlertDialog open={!!hideTarget} onOpenChange={(open) => !open && setHideTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hide Ticket Type</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to hide "{hideTarget?.name}"? It can be restored later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleHideConfirm} className="bg-orange-600 text-white hover:bg-orange-700">
                            <EyeOff className="mr-2 h-4 w-4" />Hide
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Permanent delete confirmation */}
            <AlertDialog open={!!permanentDeleteTarget} onOpenChange={(open) => !open && setPermanentDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Permanently Delete Ticket Type</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <span className="block">
                                Are you sure you want to <strong>permanently delete</strong> "{permanentDeleteTarget?.name}"?
                            </span>
                            <span className="block text-destructive font-medium">
                                ⚠️ This action cannot be undone.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePermanentDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            <Trash2 className="mr-2 h-4 w-4" />Delete Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
