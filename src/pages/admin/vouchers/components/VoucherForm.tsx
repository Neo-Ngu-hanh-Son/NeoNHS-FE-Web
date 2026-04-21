import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import DragImageUploader from '@/components/common/DragImageUploader';
import type {
    VoucherType, DiscountType, ApplicableProduct,
    CreateVoucherRequest, UpdateVoucherRequest, VoucherResponse,
} from '@/types/voucher';
import {
    VOUCHER_TYPE_OPTIONS, DISCOUNT_TYPE_OPTIONS, APPLICABLE_PRODUCT_OPTIONS,
} from '../constants';

const VOUCHER_CODE_REGEX = /^[A-Za-z0-9_-]+$/;
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

interface VoucherFormProps {
    mode: 'create' | 'edit';
    initialData?: VoucherResponse;
    onSubmit: (data: CreateVoucherRequest | UpdateVoucherRequest) => Promise<void>;
    loading: boolean;
}

export function VoucherForm({ mode, initialData, onSubmit, loading }: VoucherFormProps) {
    const navigate = useNavigate();
    const isEdit = mode === 'edit';

    // Form state
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [voucherType, setVoucherType] = useState<VoucherType>('DISCOUNT');
    const [applicableProduct, setApplicableProduct] = useState<ApplicableProduct>('ALL');

    // DISCOUNT fields
    const [discountType, setDiscountType] = useState<DiscountType>('PERCENT');
    const [discountValue, setDiscountValue] = useState<string>('');
    const [maxDiscountValue, setMaxDiscountValue] = useState<string>('');
    const [minOrderValue, setMinOrderValue] = useState<string>('');

    // GIFT_PRODUCT fields
    const [giftDescription, setGiftDescription] = useState('');
    const [giftImageUrl, setGiftImageUrl] = useState('');

    // Time & Usage
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [usageLimit, setUsageLimit] = useState<string>('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!isEdit) {
            if (!code.trim()) e.code = 'Vui lòng nhập mã voucher';
            else if (code.length > 50) e.code = 'Tối đa 50 ký tự';
            else if (!VOUCHER_CODE_REGEX.test(code)) e.code = 'Chỉ cho phép chữ cái, số, _ và -';
        }

        if (description.length > 1000) e.description = 'Tối đa 1000 ký tự';

        if (voucherType === 'DISCOUNT') {
            if (!discountValue || Number(discountValue) <= 0) e.discountValue = 'Giá trị phải lớn hơn 0';
            else if (discountType === 'PERCENT' && Number(discountValue) > 100) e.discountValue = 'Phần trăm phải ≤ 100';
            if (maxDiscountValue && Number(maxDiscountValue) <= 0) e.maxDiscountValue = 'Giá trị phải lớn hơn 0';
            if (minOrderValue && Number(minOrderValue) < 0) e.minOrderValue = 'Giá trị phải ≥ 0';
        } else if (voucherType === 'GIFT_PRODUCT') {
            if (!isEdit && !giftDescription.trim()) e.giftDescription = 'Vui lòng nhập mô tả quà tặng';
            if (giftDescription.length > 255) e.giftDescription = 'Tối đa 255 ký tự';
        }

        if (!isEdit) {
            if (!startDate) e.startDate = 'Vui lòng chọn ngày bắt đầu';
            else if (new Date(startDate) < new Date()) e.startDate = 'Phải ở hiện tại hoặc tương lai';
            if (!endDate) e.endDate = 'Vui lòng chọn ngày kết thúc';
            else if (new Date(endDate) <= new Date()) e.endDate = 'Phải ở trong tương lai';
        }
        if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            e.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
        }

        if (usageLimit && (Number(usageLimit) <= 0 || !Number.isInteger(Number(usageLimit)))) {
            e.usageLimit = 'Phải là số nguyên dương';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Populate form when editing
    useEffect(() => {
        if (initialData) {
            setCode(initialData.code);
            setDescription(initialData.description || '');
            setVoucherType(initialData.voucherType);
            setApplicableProduct(initialData.applicableProduct);

            if (initialData.discountType) setDiscountType(initialData.discountType);
            if (initialData.discountValue != null) setDiscountValue(String(initialData.discountValue));
            if (initialData.maxDiscountValue != null) setMaxDiscountValue(String(initialData.maxDiscountValue));
            if (initialData.minOrderValue != null) setMinOrderValue(String(initialData.minOrderValue));

            setGiftDescription(initialData.giftDescription || '');
            setGiftImageUrl(initialData.giftImageUrl || '');

            if (initialData.startDate) setStartDate(initialData.startDate.slice(0, 16));
            if (initialData.endDate) setEndDate(initialData.endDate.slice(0, 16));
            if (initialData.usageLimit != null) setUsageLimit(String(initialData.usageLimit));
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEdit) {
            const data: UpdateVoucherRequest = {
                description: description || undefined,
                applicableProduct,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                usageLimit: usageLimit ? Number(usageLimit) : undefined,
            };
            // Add type-specific fields
            if (voucherType === 'DISCOUNT') {
                data.discountType = discountType;
                data.discountValue = discountValue ? Number(discountValue) : undefined;
                data.maxDiscountValue = maxDiscountValue ? Number(maxDiscountValue) : null;
                data.minOrderValue = minOrderValue ? Number(minOrderValue) : undefined;
            } else if (voucherType === 'GIFT_PRODUCT') {
                data.giftDescription = giftDescription || undefined;
                data.giftImageUrl = giftImageUrl || undefined;
            }
            await onSubmit(data);
        } else {
            const data: CreateVoucherRequest = {
                code,
                description: description || undefined,
                voucherType,
                applicableProduct,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                usageLimit: usageLimit ? Number(usageLimit) : undefined,
            };
            if (voucherType === 'DISCOUNT') {
                data.discountType = discountType;
                data.discountValue = discountValue ? Number(discountValue) : undefined;
                data.maxDiscountValue = maxDiscountValue ? Number(maxDiscountValue) : undefined;
                data.minOrderValue = minOrderValue ? Number(minOrderValue) : undefined;
            } else if (voucherType === 'GIFT_PRODUCT') {
                data.giftDescription = giftDescription || undefined;
                data.giftImageUrl = giftImageUrl || undefined;
            }
            await onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Mã Voucher *</Label>
                        <Input
                            id="code"
                            value={code}
                            onChange={(e) => { setCode(e.target.value.toUpperCase()); if (errors.code) setErrors(prev => ({ ...prev, code: '' })); }}
                            placeholder="VÍ DỤ: KM-SUMMER2026"
                            maxLength={50}
                            disabled={isEdit}
                        />
                        {errors.code && <p className="text-xs text-destructive mt-1">{errors.code}</p>}
                        {isEdit && <p className="text-xs text-muted-foreground">Không thể thay đổi mã voucher sau khi đã tạo</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="voucherType">Loại Voucher *</Label>
                        <Select
                            value={voucherType}
                            onValueChange={(val) => {
                                const type = val as VoucherType;
                                setVoucherType(type);
                                if (type === 'GIFT_PRODUCT') {
                                    setApplicableProduct('ALL');
                                }
                            }}
                            disabled={isEdit}
                        >
                            <SelectTrigger id="voucherType">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {VOUCHER_TYPE_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isEdit && <p className="text-xs text-muted-foreground">Không thể thay đổi loại voucher sau khi đã tạo</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applicableProduct">Sản phẩm áp dụng *</Label>
                        <Select 
                            value={applicableProduct} 
                            onValueChange={(val) => setApplicableProduct(val as ApplicableProduct)}
                            disabled={voucherType === 'GIFT_PRODUCT'}
                        >
                            <SelectTrigger id="applicableProduct">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {APPLICABLE_PRODUCT_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {voucherType === 'GIFT_PRODUCT' && (
                            <p className="text-[10px] text-amber-600 font-medium italic">Voucher quà tặng mặc định áp dụng cho tất cả dịch vụ</p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Mô tả <span className="text-muted-foreground font-normal">({description.length}/1000)</span></Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả về voucher này..."
                            rows={3}
                            maxLength={1000}
                        />
                        {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Type-specific fields */}
            {voucherType === 'DISCOUNT' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Chi tiết chiết khấu</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="discountType">Loại chiết khấu</Label>
                            <Select value={discountType} onValueChange={(val) => setDiscountType(val as DiscountType)}>
                                <SelectTrigger id="discountType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DISCOUNT_TYPE_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discountValue">Giá trị chiết khấu *</Label>
                            <Input
                                id="discountValue"
                                type="number"
                                value={discountValue}
                                onChange={(e) => { setDiscountValue(e.target.value); if (errors.discountValue) setErrors(prev => ({ ...prev, discountValue: '' })); }}
                                placeholder={discountType === 'PERCENT' ? 'Từ 1-100%' : 'Số tiền (₫)'}
                                min={0}
                            />
                            {errors.discountValue && <p className="text-xs text-destructive mt-1">{errors.discountValue}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxDiscountValue">Giá trị chiết khấu tối đa</Label>
                            <Input
                                id="maxDiscountValue"
                                type="number"
                                value={maxDiscountValue}
                                onChange={(e) => setMaxDiscountValue(e.target.value)}
                                placeholder="Mức giảm tối đa (₫)"
                                min={0}
                            />
                            {errors.maxDiscountValue && <p className="text-xs text-destructive mt-1">{errors.maxDiscountValue}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minOrderValue">Giá trị đơn hàng tối thiểu</Label>
                            <Input
                                id="minOrderValue"
                                type="number"
                                value={minOrderValue}
                                onChange={(e) => setMinOrderValue(e.target.value)}
                                placeholder="Yêu cầu đơn hàng từ (₫)"
                                min={0}
                            />
                            {errors.minOrderValue && <p className="text-xs text-destructive mt-1">{errors.minOrderValue}</p>}
                        </div>
                    </CardContent>
                </Card>
            )}

            {voucherType === 'GIFT_PRODUCT' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Chi tiết quà tặng</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="giftDescription">Mô tả quà tặng {!isEdit && '*'} <span className="text-muted-foreground font-normal">({giftDescription.length}/255)</span></Label>
                            <Textarea
                                id="giftDescription"
                                value={giftDescription}
                                onChange={(e) => { setGiftDescription(e.target.value); if (errors.giftDescription) setErrors(prev => ({ ...prev, giftDescription: '' })); }}
                                placeholder="Mô tả về sản phẩm quà tặng..."
                                rows={3}
                                maxLength={255}
                            />
                            {errors.giftDescription && <p className="text-xs text-destructive mt-1">{errors.giftDescription}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Hình ảnh quà tặng</Label>
                            <DragImageUploader
                                value={giftImageUrl}
                                onUpload={(url) => setGiftImageUrl(url)}
                                placeholder="Kéo thả hình ảnh vào đây, hoặc click để chọn"
                                minHeight={150}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Time & Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thời gian & Giới hạn sử dụng</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Ngày bắt đầu {!isEdit && '*'}</Label>
                        <Input
                            id="startDate"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' })); }}
                        />
                        {errors.startDate && <p className="text-xs text-destructive mt-1">{errors.startDate}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">Ngày kết thúc {!isEdit && '*'}</Label>
                        <Input
                            id="endDate"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors(prev => ({ ...prev, endDate: '' })); }}
                        />
                        {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                        <Input
                            id="usageLimit"
                            type="number"
                            value={usageLimit}
                            onChange={(e) => setUsageLimit(e.target.value)}
                            placeholder="Tổng số lượt sử dụng tối đa"
                            min={1}
                        />
                        {errors.usageLimit && <p className="text-xs text-destructive mt-1">{errors.usageLimit}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Cập nhật Voucher' : 'Tạo Voucher'}
                </Button>
            </div>
        </form>
    );
}
