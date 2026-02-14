import { useState } from 'react';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Plus, Pencil, RotateCcw, EyeOff, Trash2, DollarSign, Users, Calendar,
    Ticket as TicketIcon,
} from 'lucide-react';
import { useTicketCatalogs } from '@/hooks/event';
import { ticketCatalogService } from '@/services/api/ticketCatalogService';
import { TicketCatalogFormDialog } from './TicketCatalogFormDialog';
import type { TicketCatalogResponse, CreateTicketCatalogRequest, UpdateTicketCatalogRequest } from '@/types/ticketCatalog';

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
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">
                    {catalogs.length} ticket type{catalogs.length !== 1 ? 's' : ''}
                </span>
                <Button size="sm" variant="outline" onClick={handleCreate}>
                    <Plus className="h-3 w-3 mr-1" />Add
                </Button>
            </div>

            {catalogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <TicketIcon className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No ticket types yet</p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {catalogs.map((catalog) => {
                        const isHidden = !!catalog.deletedAt;
                        return (
                            <div
                                key={catalog.id}
                                className={`rounded-lg border p-3 transition-colors ${isHidden ? 'opacity-60 bg-muted/30' : 'hover:bg-muted/20'}`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-semibold truncate">{catalog.name}</p>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] px-1.5 py-0 ${
                                                    catalog.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    catalog.status === 'INACTIVE' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}
                                            >
                                                {catalog.status}
                                            </Badge>
                                            {isHidden && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-50 text-red-600 border-red-200">
                                                    Hidden
                                                </Badge>
                                            )}
                                        </div>
                                        {catalog.customerType && (
                                            <p className="text-[11px] text-muted-foreground mt-0.5">{catalog.customerType}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {catalog.price?.toLocaleString() ?? '—'}₫
                                        {catalog.originalPrice && catalog.originalPrice > catalog.price && (
                                            <span className="line-through text-[10px] ml-1">
                                                {catalog.originalPrice.toLocaleString()}₫
                                            </span>
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {catalog.currentSold ?? 0}/{catalog.totalQuota ?? '∞'}
                                    </span>
                                    {catalog.validFromDate && (
                                        <span className="flex items-center gap-1 col-span-2">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(catalog.validFromDate).toLocaleDateString()} — {catalog.validToDate ? new Date(catalog.validToDate).toLocaleDateString() : 'Ongoing'}
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 mt-2 pt-2 border-t">
                                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => handleEdit(catalog)}>
                                        <Pencil className="h-3 w-3 mr-1" />Edit
                                    </Button>
                                    {isHidden ? (
                                        <>
                                            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => restoreCatalog(catalog.id)}>
                                                <RotateCcw className="h-3 w-3 mr-1" />Restore
                                            </Button>
                                            <Button
                                                variant="ghost" size="sm"
                                                className="h-7 text-xs px-2 text-destructive hover:text-destructive"
                                                onClick={() => setPermanentDeleteTarget(catalog)}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />Delete Forever
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="ghost" size="sm"
                                            className="h-7 text-xs px-2 text-orange-600 hover:text-orange-700"
                                            onClick={() => setHideTarget(catalog)}
                                        >
                                            <EyeOff className="h-3 w-3 mr-1" />Hide
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
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
