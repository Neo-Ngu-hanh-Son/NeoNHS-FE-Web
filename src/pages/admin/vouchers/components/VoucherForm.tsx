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

    // BONUS_POINTS fields
    const [bonusPointsValue, setBonusPointsValue] = useState<string>('');

    // FREE_SERVICE fields
    const [freeTicketCatalogId, setFreeTicketCatalogId] = useState('');

    // Time & Usage
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [usageLimit, setUsageLimit] = useState<string>('');
    const [maxUsagePerUser, setMaxUsagePerUser] = useState<string>('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!isEdit) {
            if (!code.trim()) e.code = 'Voucher code is required';
            else if (code.length > 50) e.code = 'Max 50 characters';
            else if (!VOUCHER_CODE_REGEX.test(code)) e.code = 'Only letters, numbers, _ and - allowed';
        }

        if (description.length > 1000) e.description = 'Max 1000 characters';

        if (voucherType === 'DISCOUNT') {
            if (!discountValue || Number(discountValue) <= 0) e.discountValue = 'Must be greater than 0';
            else if (discountType === 'PERCENT' && Number(discountValue) > 100) e.discountValue = 'Percentage must be ≤ 100';
            if (maxDiscountValue && Number(maxDiscountValue) <= 0) e.maxDiscountValue = 'Must be greater than 0';
            if (minOrderValue && Number(minOrderValue) < 0) e.minOrderValue = 'Must be ≥ 0';
        } else if (voucherType === 'GIFT_PRODUCT') {
            if (!isEdit && !giftDescription.trim()) e.giftDescription = 'Gift description is required';
            if (giftDescription.length > 255) e.giftDescription = 'Max 255 characters';
        } else if (voucherType === 'BONUS_POINTS') {
            if (!bonusPointsValue || Number(bonusPointsValue) <= 0) e.bonusPointsValue = 'Must be a positive integer';
            else if (!Number.isInteger(Number(bonusPointsValue))) e.bonusPointsValue = 'Must be an integer';
        } else if (voucherType === 'FREE_SERVICE') {
            if (!freeTicketCatalogId.trim()) e.freeTicketCatalogId = 'Ticket catalog ID is required';
            else if (!UUID_REGEX.test(freeTicketCatalogId.trim())) e.freeTicketCatalogId = 'Must be a valid UUID';
        }

        if (!isEdit) {
            if (!startDate) e.startDate = 'Start date is required';
            else if (new Date(startDate) < new Date()) e.startDate = 'Must be present or future';
            if (!endDate) e.endDate = 'End date is required';
            else if (new Date(endDate) <= new Date()) e.endDate = 'Must be in the future';
        }
        if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            e.endDate = 'End date must be after start date';
        }

        if (usageLimit && (Number(usageLimit) <= 0 || !Number.isInteger(Number(usageLimit)))) {
            e.usageLimit = 'Must be a positive integer';
        }
        if (maxUsagePerUser && (Number(maxUsagePerUser) <= 0 || !Number.isInteger(Number(maxUsagePerUser)))) {
            e.maxUsagePerUser = 'Must be a positive integer';
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

            if (initialData.bonusPointsValue != null) setBonusPointsValue(String(initialData.bonusPointsValue));
            setFreeTicketCatalogId(initialData.freeTicketCatalogId || '');

            if (initialData.startDate) setStartDate(initialData.startDate.slice(0, 16));
            if (initialData.endDate) setEndDate(initialData.endDate.slice(0, 16));
            if (initialData.usageLimit != null) setUsageLimit(String(initialData.usageLimit));
            if (initialData.maxUsagePerUser != null) setMaxUsagePerUser(String(initialData.maxUsagePerUser));
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
                maxUsagePerUser: maxUsagePerUser ? Number(maxUsagePerUser) : undefined,
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
            } else if (voucherType === 'BONUS_POINTS') {
                data.bonusPointsValue = bonusPointsValue ? Number(bonusPointsValue) : undefined;
            } else if (voucherType === 'FREE_SERVICE') {
                data.freeTicketCatalogId = freeTicketCatalogId || undefined;
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
                maxUsagePerUser: maxUsagePerUser ? Number(maxUsagePerUser) : undefined,
            };
            if (voucherType === 'DISCOUNT') {
                data.discountType = discountType;
                data.discountValue = discountValue ? Number(discountValue) : undefined;
                data.maxDiscountValue = maxDiscountValue ? Number(maxDiscountValue) : undefined;
                data.minOrderValue = minOrderValue ? Number(minOrderValue) : undefined;
            } else if (voucherType === 'GIFT_PRODUCT') {
                data.giftDescription = giftDescription || undefined;
                data.giftImageUrl = giftImageUrl || undefined;
            } else if (voucherType === 'BONUS_POINTS') {
                data.bonusPointsValue = bonusPointsValue ? Number(bonusPointsValue) : undefined;
            } else if (voucherType === 'FREE_SERVICE') {
                data.freeTicketCatalogId = freeTicketCatalogId || undefined;
            }
            await onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Voucher Code *</Label>
                        <Input
                            id="code"
                            value={code}
                            onChange={(e) => { setCode(e.target.value.toUpperCase()); if (errors.code) setErrors(prev => ({ ...prev, code: '' })); }}
                            placeholder="e.g. SUMMER2026"
                            maxLength={50}
                            disabled={isEdit}
                        />
                        {errors.code && <p className="text-xs text-destructive mt-1">{errors.code}</p>}
                        {isEdit && <p className="text-xs text-muted-foreground">Code cannot be changed after creation</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="voucherType">Voucher Type *</Label>
                        <Select
                            value={voucherType}
                            onValueChange={(val) => setVoucherType(val as VoucherType)}
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
                        {isEdit && <p className="text-xs text-muted-foreground">Type cannot be changed after creation</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applicableProduct">Applicable Product *</Label>
                        <Select value={applicableProduct} onValueChange={(val) => setApplicableProduct(val as ApplicableProduct)}>
                            <SelectTrigger id="applicableProduct">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {APPLICABLE_PRODUCT_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">({description.length}/1000)</span></Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe this voucher..."
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
                        <CardTitle className="text-lg">Discount Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="discountType">Discount Type</Label>
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
                            <Label htmlFor="discountValue">Discount Value *</Label>
                            <Input
                                id="discountValue"
                                type="number"
                                value={discountValue}
                                onChange={(e) => { setDiscountValue(e.target.value); if (errors.discountValue) setErrors(prev => ({ ...prev, discountValue: '' })); }}
                                placeholder={discountType === 'PERCENT' ? '1-100' : 'Amount in ₫'}
                                min={0}
                            />
                            {errors.discountValue && <p className="text-xs text-destructive mt-1">{errors.discountValue}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxDiscountValue">Max Discount Value</Label>
                            <Input
                                id="maxDiscountValue"
                                type="number"
                                value={maxDiscountValue}
                                onChange={(e) => setMaxDiscountValue(e.target.value)}
                                placeholder="Maximum discount amount"
                                min={0}
                            />
                            {errors.maxDiscountValue && <p className="text-xs text-destructive mt-1">{errors.maxDiscountValue}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minOrderValue">Min Order Value</Label>
                            <Input
                                id="minOrderValue"
                                type="number"
                                value={minOrderValue}
                                onChange={(e) => setMinOrderValue(e.target.value)}
                                placeholder="Minimum order value required"
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
                        <CardTitle className="text-lg">Gift Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="giftDescription">Gift Description {!isEdit && '*'} <span className="text-muted-foreground font-normal">({giftDescription.length}/255)</span></Label>
                            <Textarea
                                id="giftDescription"
                                value={giftDescription}
                                onChange={(e) => { setGiftDescription(e.target.value); if (errors.giftDescription) setErrors(prev => ({ ...prev, giftDescription: '' })); }}
                                placeholder="Describe the gift product..."
                                rows={3}
                                maxLength={255}
                            />
                            {errors.giftDescription && <p className="text-xs text-destructive mt-1">{errors.giftDescription}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Gift Image</Label>
                            <DragImageUploader
                                value={giftImageUrl}
                                onUpload={(url) => setGiftImageUrl(url)}
                                placeholder="Drag & drop gift image here, or click to browse"
                                minHeight={150}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {voucherType === 'BONUS_POINTS' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Bonus Points Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-w-sm">
                            <Label htmlFor="bonusPointsValue">Bonus Points *</Label>
                            <Input
                                id="bonusPointsValue"
                                type="number"
                                value={bonusPointsValue}
                                onChange={(e) => { setBonusPointsValue(e.target.value); if (errors.bonusPointsValue) setErrors(prev => ({ ...prev, bonusPointsValue: '' })); }}
                                placeholder="Number of points"
                                min={1}
                            />
                            {errors.bonusPointsValue && <p className="text-xs text-destructive mt-1">{errors.bonusPointsValue}</p>}
                        </div>
                    </CardContent>
                </Card>
            )}

            {voucherType === 'FREE_SERVICE' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Free Service Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-w-sm">
                            <Label htmlFor="freeTicketCatalogId">Ticket Catalog ID *</Label>
                            <Input
                                id="freeTicketCatalogId"
                                value={freeTicketCatalogId}
                                onChange={(e) => { setFreeTicketCatalogId(e.target.value); if (errors.freeTicketCatalogId) setErrors(prev => ({ ...prev, freeTicketCatalogId: '' })); }}
                                placeholder="UUID of the ticket catalog"
                            />
                            {errors.freeTicketCatalogId && <p className="text-xs text-destructive mt-1">{errors.freeTicketCatalogId}</p>}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Time & Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Time & Usage Limits</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date {!isEdit && '*'}</Label>
                        <Input
                            id="startDate"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' })); }}
                        />
                        {errors.startDate && <p className="text-xs text-destructive mt-1">{errors.startDate}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date {!isEdit && '*'}</Label>
                        <Input
                            id="endDate"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors(prev => ({ ...prev, endDate: '' })); }}
                        />
                        {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="usageLimit">Usage Limit</Label>
                        <Input
                            id="usageLimit"
                            type="number"
                            value={usageLimit}
                            onChange={(e) => setUsageLimit(e.target.value)}
                            placeholder="Total usage limit"
                            min={1}
                        />
                        {errors.usageLimit && <p className="text-xs text-destructive mt-1">{errors.usageLimit}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxUsagePerUser">Max Usage Per User</Label>
                        <Input
                            id="maxUsagePerUser"
                            type="number"
                            value={maxUsagePerUser}
                            onChange={(e) => setMaxUsagePerUser(e.target.value)}
                            placeholder="Per user limit"
                            min={1}
                        />
                        {errors.maxUsagePerUser && <p className="text-xs text-destructive mt-1">{errors.maxUsagePerUser}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Update Voucher' : 'Create Voucher'}
                </Button>
            </div>
        </form>
    );
}
