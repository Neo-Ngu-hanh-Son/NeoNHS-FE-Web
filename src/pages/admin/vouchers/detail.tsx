import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useVoucher } from '@/hooks/voucher';
import { adminVoucherService } from '@/services/api/voucherService';
import { message } from 'antd';
import {
    voucherStatusBadgeStyles, voucherStatusLabels,
    voucherTypeBadgeStyles, voucherTypeLabels,
    voucherScopeLabels, applicableProductLabels, discountTypeLabels,
} from './constants';

function formatDateTime(dateStr: string | null | undefined) {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleString('vi-VN');
    } catch {
        return dateStr;
    }
}

function formatCurrency(value: number | null | undefined) {
    if (value == null) return '—';
    return value.toLocaleString('vi-VN') + '₫';
}

export default function VoucherDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { voucher, loading } = useVoucher(id);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!id) return;
        setDeleting(true);
        try {
            const response = await adminVoucherService.delete(id);
            if (response.success) {
                message.success('Voucher deleted successfully');
                navigate('/admin/vouchers');
            } else {
                message.error(response.message || 'Failed to delete voucher');
            }
        } catch (error: unknown) {
            message.error('Failed to delete voucher');
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!voucher) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <p className="text-muted-foreground">Voucher not found.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/vouchers')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vouchers')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold font-mono">{voucher.code}</h1>
                        <p className="text-muted-foreground text-sm">{voucher.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/vouchers/${id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setShowDelete(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                        <InfoItem label="Status">
                            <Badge variant="outline" className={voucherStatusBadgeStyles[voucher.status]}>
                                {voucherStatusLabels[voucher.status]}
                            </Badge>
                        </InfoItem>
                        <InfoItem label="Type">
                            <Badge variant="outline" className={voucherTypeBadgeStyles[voucher.voucherType]}>
                                {voucherTypeLabels[voucher.voucherType]}
                            </Badge>
                        </InfoItem>
                        <InfoItem label="Scope">{voucherScopeLabels[voucher.scope]}</InfoItem>
                        <InfoItem label="Applicable Product">{applicableProductLabels[voucher.applicableProduct]}</InfoItem>
                        <InfoItem label="Created By">{voucher.createdByUserName}</InfoItem>
                        {voucher.vendorName && <InfoItem label="Vendor">{voucher.vendorName}</InfoItem>}
                    </div>
                </CardContent>
            </Card>

            {/* Type-specific */}
            {voucher.voucherType === 'DISCOUNT' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Discount Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                            <InfoItem label="Discount Type">{voucher.discountType ? discountTypeLabels[voucher.discountType] : '—'}</InfoItem>
                            <InfoItem label="Discount Value">
                                {voucher.discountType === 'PERCENT' ? `${voucher.discountValue}%` : formatCurrency(voucher.discountValue)}
                            </InfoItem>
                            <InfoItem label="Max Discount">{formatCurrency(voucher.maxDiscountValue)}</InfoItem>
                            <InfoItem label="Min Order">{formatCurrency(voucher.minOrderValue)}</InfoItem>
                        </div>
                    </CardContent>
                </Card>
            )}

            {voucher.voucherType === 'GIFT_PRODUCT' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Gift Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <span className="text-sm text-muted-foreground">Gift Description</span>
                            <p className="mt-0.5 font-medium whitespace-pre-wrap break-words">{voucher.giftDescription || '—'}</p>
                        </div>
                        {voucher.giftImageUrl && (
                            <div>
                                <span className="text-sm text-muted-foreground">Gift Image</span>
                                <img src={voucher.giftImageUrl} alt="Gift" className="mt-1 max-w-xs rounded-lg border" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {voucher.voucherType === 'BONUS_POINTS' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Bonus Points Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InfoItem label="Points">{voucher.bonusPointsValue ?? '—'}</InfoItem>
                    </CardContent>
                </Card>
            )}

            {voucher.voucherType === 'FREE_SERVICE' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Free Service Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Ticket Catalog">{voucher.freeTicketCatalogName || '—'}</InfoItem>
                            <InfoItem label="Ticket Catalog ID">{voucher.freeTicketCatalogId || '—'}</InfoItem>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Time & Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Time & Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                        <InfoItem label="Start Date">{formatDateTime(voucher.startDate)}</InfoItem>
                        <InfoItem label="End Date">{formatDateTime(voucher.endDate)}</InfoItem>
                        <InfoItem label="Usage">{voucher.usageCount} / {voucher.usageLimit}</InfoItem>
                        <InfoItem label="Max Per User">{voucher.maxUsagePerUser}</InfoItem>
                        <InfoItem label="Created At">{formatDateTime(voucher.createdAt)}</InfoItem>
                        <InfoItem label="Updated At">{formatDateTime(voucher.updatedAt)}</InfoItem>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete voucher "{voucher.code}"?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="mt-0.5 font-medium">{children}</div>
        </div>
    );
}
