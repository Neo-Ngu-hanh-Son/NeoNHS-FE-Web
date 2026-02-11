import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, RotateCcw, Ticket } from 'lucide-react';
import { useTicketCatalogs } from '@/hooks/useTicketCatalogs';
import { ticketStatusBadgeStyles } from '../constants';
import { formatEventPrice, formatEventDate } from '../utils';
import { TicketCatalogFormDialog } from './TicketCatalogFormDialog';
import type { TicketCatalogResponse, CreateTicketCatalogRequest, UpdateTicketCatalogRequest } from '@/types/ticketCatalog';

interface TicketCatalogListProps {
    eventId: string;
}

export function TicketCatalogList({ eventId }: TicketCatalogListProps) {
    const { catalogs, loading, createCatalog, updateCatalog, deleteCatalog, restoreCatalog } = useTicketCatalogs(eventId);

    const [formOpen, setFormOpen] = useState(false);
    const [editingCatalog, setEditingCatalog] = useState<TicketCatalogResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<TicketCatalogResponse | null>(null);

    const handleOpenCreate = () => {
        setEditingCatalog(null);
        setFormOpen(true);
    };

    const handleOpenEdit = (catalog: TicketCatalogResponse) => {
        setEditingCatalog(catalog);
        setFormOpen(true);
    };

    const handleFormSubmit = async (data: CreateTicketCatalogRequest | UpdateTicketCatalogRequest): Promise<boolean> => {
        if (editingCatalog) {
            return updateCatalog(editingCatalog.id, data);
        }
        return createCatalog(data as CreateTicketCatalogRequest);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        await deleteCatalog(deleteTarget.id);
        setDeleteTarget(null);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{catalogs.length} ticket type{catalogs.length !== 1 ? 's' : ''}</p>
                <Button variant="outline" size="sm" onClick={handleOpenCreate}>
                    <Plus className="mr-1 h-4 w-4" />Add
                </Button>
            </div>

            {/* List */}
            {catalogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Ticket className="h-8 w-8 mb-2" />
                    <p className="text-sm">No ticket types yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {catalogs.map((catalog) => {
                        const isDeleted = !!catalog.deletedAt;
                        const quotaPercent = catalog.totalQuota > 0
                            ? Math.round((catalog.soldQuantity / catalog.totalQuota) * 100)
                            : 0;

                        return (
                            <div
                                key={catalog.id}
                                className={`rounded-lg border p-3 ${isDeleted ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-sm">{catalog.name}</span>
                                            <Badge variant="outline" className={ticketStatusBadgeStyles[catalog.status] + ' text-[10px]'}>
                                                {catalog.status}
                                            </Badge>
                                            {isDeleted && (
                                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px]">Hidden</Badge>
                                            )}
                                            {catalog.customerType && (
                                                <Badge variant="secondary" className="text-[10px]">{catalog.customerType}</Badge>
                                            )}
                                        </div>

                                        {/* Price row */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-semibold text-sm text-emerald-600">
                                                {formatEventPrice(catalog.price)}
                                            </span>
                                            {catalog.originalPrice > 0 && catalog.originalPrice !== catalog.price && (
                                                <span className="text-xs text-muted-foreground line-through">
                                                    {formatEventPrice(catalog.originalPrice)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Quota / Progress */}
                                        {catalog.totalQuota > 0 && (
                                            <div className="mt-2">
                                                <div className="flex justify-between text-[11px] text-muted-foreground mb-0.5">
                                                    <span>{catalog.soldQuantity} sold</span>
                                                    <span>{catalog.remainingQuantity} remaining</span>
                                                </div>
                                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${quotaPercent >= 90 ? 'bg-red-500' : quotaPercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Validity */}
                                        {(catalog.validFromDate || catalog.validToDate) && (
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                {catalog.validFromDate && formatEventDate(catalog.validFromDate)}
                                                {catalog.validFromDate && catalog.validToDate && ' — '}
                                                {catalog.validToDate && formatEventDate(catalog.validToDate)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEdit(catalog)}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        {isDeleted ? (
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => restoreCatalog(catalog.id)}>
                                                <RotateCcw className="h-3.5 w-3.5" />
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(catalog)}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create / Edit Dialog */}
            <TicketCatalogFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                catalog={editingCatalog}
                onSubmit={handleFormSubmit}
            />

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Ticket Type</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deleteTarget?.name}"? It can be restored later.
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
