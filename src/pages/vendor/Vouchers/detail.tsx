import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Pencil, Trash2, Loader2, RotateCcw, Tag, Clock, BarChart2 } from 'lucide-react';
import { useState } from 'react';
import { useVoucher } from '@/hooks/voucher';
import { vendorVoucherService } from '@/services/api/voucherService';
import { message } from 'antd';
import {
    voucherStatusBadgeStyles, voucherStatusLabels,
    voucherTypeBadgeStyles, voucherTypeLabels,
    applicableProductLabels, discountTypeLabels,
} from '@/pages/admin/vouchers/constants';
import { StatsCard } from '@/components/dashboard/StatsCard';

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

export default function VendorVoucherDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { voucher, loading, refetch } = useVoucher(id, 'VENDOR');
    const [showDelete, setShowDelete] = useState(false);
    const [showPermanentDelete, setShowPermanentDelete] = useState(false);
    const [showRestore, setShowRestore] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [restoring, setRestoring] = useState(false);

    const isDeleted = !!voucher?.deletedAt;

    const handleDelete = async () => {
        if (!id) return;
        setDeleting(true);
        try {
            const response = await vendorVoucherService.delete(id);
            if (response.success) {
                message.success('Đã xóa voucher thành công');
                navigate('/vendor/vouchers');
            } else {
                message.error(response.message || 'Xóa voucher thất bại');
            }
        } catch (error: unknown) {
            message.error('Xóa voucher thất bại');
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    };

    const handlePermanentDelete = async () => {
        if (!id) return;
        setDeleting(true);
        try {
            const response = await vendorVoucherService.permanentDelete(id);
            if (response.success) {
                message.success('Đã xóa vĩnh viễn voucher');
                navigate('/vendor/vouchers');
            } else {
                message.error(response.message || 'Xóa vĩnh viễn voucher thất bại');
            }
        } catch (error: unknown) {
            const err = error as any;
            message.error(err?.response?.data?.message || 'Xóa vĩnh viễn voucher thất bại');
        } finally {
            setDeleting(false);
            setShowPermanentDelete(false);
        }
    };

    const handleRestore = async () => {
        if (!id) return;
        setRestoring(true);
        try {
            const response = await vendorVoucherService.restore(id);
            if (response.success) {
                message.success('Khôi phục voucher thành công');
                refetch();
            } else {
                message.error(response.message || 'Khôi phục voucher thất bại');
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Khôi phục voucher thất bại');
        } finally {
            setRestoring(false);
            setShowRestore(false);
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
                <p className="text-muted-foreground">Không tìm thấy voucher.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/vendor/vouchers')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/vendor/vouchers')} className="h-9 w-9">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold font-mono truncate">{voucher.code}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Chi tiết chương trình khuyến mãi của bạn</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isDeleted ? (
                        <>
                            <Button variant="outline" onClick={() => setShowRestore(true)}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Khôi phục
                            </Button>
                            <Button variant="destructive" onClick={() => setShowPermanentDelete(true)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => navigate(`/vendor/vouchers/${id}/edit`)}>
                                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </Button>
                            <Button variant="destructive" onClick={() => setShowDelete(true)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {isDeleted && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
                    <Trash2 className="h-4 w-4 shrink-0" />
                    Voucher này đã bị tạm xóa vào lúc {formatDateTime(voucher.deletedAt)}. Bạn có thể khôi phục hoặc xóa vĩnh viễn.
                </div>
            )}

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Tổng số lượt"
                    value={voucher.usageLimit || '—'}
                    icon={<Tag className="h-6 w-6 text-white" />}
                    iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
                <StatsCard
                    title="Đã sử dụng"
                    value={voucher.usageCount || 0}
                    icon={<Clock className="h-6 w-6 text-white" />}
                    iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <StatsCard
                    title="Còn lại"
                    value={voucher.usageLimit ? (voucher.usageLimit - (voucher.usageCount || 0)) : '—'}
                    icon={<BarChart2 className="h-6 w-6 text-white" />}
                    iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
                />
            </div>

            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                        <InfoItem label="Trạng thái">
                            <Badge variant="outline" className={voucherStatusBadgeStyles[voucher.status]}>
                                {voucherStatusLabels[voucher.status]}
                            </Badge>
                        </InfoItem>
                        <InfoItem label="Loại Voucher">
                            <Badge variant="outline" className={voucherTypeBadgeStyles[voucher.voucherType]}>
                                {voucherTypeLabels[voucher.voucherType]}
                            </Badge>
                        </InfoItem>
                        <InfoItem label="Sản phẩm áp dụng">{applicableProductLabels[voucher.applicableProduct]}</InfoItem>
                        <InfoItem label="Mô tả">
                            <p className="font-normal text-muted-foreground line-clamp-2" title={voucher.description || '—'}>
                                {voucher.description || '—'}
                            </p>
                        </InfoItem>
                    </div>
                </CardContent>
            </Card>

            {/* Type-specific */}
            {voucher.voucherType === 'DISCOUNT' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Chi tiết chiết khấu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                            <InfoItem label="Loại chiết khấu">{voucher.discountType ? discountTypeLabels[voucher.discountType] : '—'}</InfoItem>
                            <InfoItem label="Giá trị chiết khấu">
                                {voucher.discountType === 'PERCENT' ? `${voucher.discountValue}%` : formatCurrency(voucher.discountValue)}
                            </InfoItem>
                            <InfoItem label="Giảm tối đa">{formatCurrency(voucher.maxDiscountValue)}</InfoItem>
                            <InfoItem label="Đơn hàng tối thiểu">{formatCurrency(voucher.minOrderValue)}</InfoItem>
                        </div>
                    </CardContent>
                </Card>
            )}

            {voucher.voucherType === 'GIFT_PRODUCT' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Chi tiết quà tặng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <span className="text-sm text-muted-foreground">Mô tả quà tặng</span>
                            <p className="mt-0.5 font-medium whitespace-pre-wrap break-words">{voucher.giftDescription || '—'}</p>
                        </div>
                        {voucher.giftImageUrl && (
                            <div>
                                <span className="text-sm text-muted-foreground">Hình ảnh quà tặng</span>
                                <img src={voucher.giftImageUrl} alt="Gift" className="mt-1 max-w-xs rounded-lg border" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Time & Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thời gian & Giới hạn sử dụng</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                        <InfoItem label="Ngày bắt đầu">{formatDateTime(voucher.startDate)}</InfoItem>
                        <InfoItem label="Ngày kết thúc">{formatDateTime(voucher.endDate)}</InfoItem>
                        <InfoItem label="Dự kiến phát hành">{voucher.usageLimit}</InfoItem>
                        <InfoItem label="Đã thu thập">{voucher.usageCount}</InfoItem>
                        <InfoItem label="Ngày tạo">{formatDateTime(voucher.createdAt)}</InfoItem>
                        <InfoItem label="Cập nhật lần cuối">{formatDateTime(voucher.updatedAt)}</InfoItem>
                    </div>
                </CardContent>
            </Card>

            {/* Soft Delete Dialog */}
            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa voucher "{voucher.code}"? Voucher sẽ được chuyển vào thùng rác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Permanent Delete Dialog */}
            <AlertDialog open={showPermanentDelete} onOpenChange={setShowPermanentDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa vĩnh viễn Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa <strong>vĩnh viễn</strong> voucher "<strong className="font-mono">{voucher.code}</strong>". 
                            Backend sẽ chặn xóa nếu voucher đã có khách hàng sử dụng.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePermanentDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Xóa vĩnh viễn
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Restore Dialog */}
            <AlertDialog open={showRestore} onOpenChange={setShowRestore}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Khôi phục Voucher</AlertDialogTitle>
                        <AlertDialogDescription>
                            Khôi phục voucher "<strong className="font-mono">{voucher.code}</strong>" về trạng thái hoạt động?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestore} disabled={restoring}>
                            {restoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
                            Khôi phục
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
