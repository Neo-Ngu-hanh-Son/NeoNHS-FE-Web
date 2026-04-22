import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { TICKET_STATUS_OPTIONS, WEEKDAY_OPTIONS } from '../constants';
import type {
    TicketCatalogResponse,
    CreateTicketCatalogRequest,
    UpdateTicketCatalogRequest,
} from '@/types/ticketCatalog';

interface TicketCatalogFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalog?: TicketCatalogResponse | null;
    onSubmit: (data: CreateTicketCatalogRequest | UpdateTicketCatalogRequest) => Promise<boolean>;
}

interface FormData {
    name: string;
    description: string;
    customerType: string;
    price: string;
    originalPrice: string;
    applyOnDays: string[];
    validFromDate: string;
    validToDate: string;
    totalQuota: string;
    status: string;
}

const emptyForm: FormData = {
    name: '',
    description: '',
    customerType: '',
    price: '',
    originalPrice: '',
    applyOnDays: [],
    validFromDate: '',
    validToDate: '',
    totalQuota: '',
    status: 'ACTIVE',
};

function toLocalDateTimeString(isoString: string): string {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch {
        return '';
    }
}

export function TicketCatalogFormDialog({ open, onOpenChange, catalog, onSubmit }: TicketCatalogFormDialogProps) {
    const [form, setForm] = useState<FormData>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const isEdit = !!catalog;

    useEffect(() => {
        if (catalog) {
            setForm({
                name: catalog.name || '',
                description: catalog.description || '',
                customerType: catalog.customerType || '',
                price: catalog.price != null ? String(catalog.price) : '',
                originalPrice: catalog.originalPrice != null ? String(catalog.originalPrice) : '',
                applyOnDays: catalog.applyOnDays ? catalog.applyOnDays.split(',').map((d) => d.trim()) : [],
                validFromDate: toLocalDateTimeString(catalog.validFromDate),
                validToDate: toLocalDateTimeString(catalog.validToDate),
                totalQuota: catalog.totalQuota != null ? String(catalog.totalQuota) : '',
                status: catalog.status || 'ACTIVE',
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [catalog, open]);

    const handleChange = (field: keyof FormData, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const toggleDay = (day: string) => {
        const current = form.applyOnDays;
        if (current.includes(day)) {
            handleChange('applyOnDays', current.filter((d) => d !== day));
        } else {
            handleChange('applyOnDays', [...current, day]);
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!form.name.trim()) newErrors.name = 'Tên là bắt buộc';
        if (!form.price || Number(form.price) <= 0) newErrors.price = 'Giá phải > 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        const data: CreateTicketCatalogRequest = {
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            customerType: form.customerType.trim() || undefined,
            price: Number(form.price),
            originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
            applyOnDays: form.applyOnDays.length > 0 ? form.applyOnDays.join(',') : undefined,
            validFromDate: form.validFromDate ? new Date(form.validFromDate).toISOString() : undefined,
            validToDate: form.validToDate ? new Date(form.validToDate).toISOString() : undefined,
            totalQuota: form.totalQuota ? Number(form.totalQuota) : undefined,
            status: form.status as any,
        };

        const success = await onSubmit(data);
        setLoading(false);
        if (success) onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Chỉnh sửa loại vé' : 'Thêm loại vé'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Cập nhật thông tin chi tiết của loại vé.' : 'Tạo một loại vé mới cho sự kiện này.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <Label htmlFor="tc-name">Tên *</Label>
                        <Input id="tc-name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="VD: Vé thông thường" />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="tc-desc">Mô tả</Label>
                        <Textarea id="tc-desc" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Mô tả vé..." />
                    </div>

                    <div>
                        <Label htmlFor="tc-customerType">Đối tượng khách hàng</Label>
                        <Input id="tc-customerType" value={form.customerType} onChange={(e) => handleChange('customerType', e.target.value)} placeholder="VD: Người lớn, Trẻ em, Sinh viên" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="tc-price">Giá (VND) *</Label>
                            <Input id="tc-price" type="number" min={0} value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="50000" />
                            {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <Label htmlFor="tc-originalPrice">Giá gốc</Label>
                            <Input id="tc-originalPrice" type="number" min={0} value={form.originalPrice} onChange={(e) => handleChange('originalPrice', e.target.value)} placeholder="80000" />
                        </div>
                    </div>

                    <div>
                        <Label>Áp dụng vào các ngày</Label>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {WEEKDAY_OPTIONS.map((day) => (
                                <Badge
                                    key={day.value}
                                    variant={form.applyOnDays.includes(day.value) ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() => toggleDay(day.value)}
                                >
                                    {day.label}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="tc-validFrom">Hợp lệ từ</Label>
                            <Input id="tc-validFrom" type="datetime-local" value={form.validFromDate} onChange={(e) => handleChange('validFromDate', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="tc-validTo">Hợp lệ đến</Label>
                            <Input id="tc-validTo" type="datetime-local" value={form.validToDate} onChange={(e) => handleChange('validToDate', e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="tc-totalQuota">Tổng số lượng</Label>
                            <Input id="tc-totalQuota" type="number" min={0} value={form.totalQuota} onChange={(e) => handleChange('totalQuota', e.target.value)} placeholder="100" />
                        </div>
                        <div>
                            <Label htmlFor="tc-status">Trạng thái</Label>
                            <Select value={form.status} onValueChange={(v) => handleChange('status', v)} disabled={catalog?.status === 'SOLD_OUT'}>
                                <SelectTrigger id="tc-status"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TICKET_STATUS_OPTIONS.filter((opt) => opt.value !== 'SOLD_OUT' || catalog?.status === 'SOLD_OUT').map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? 'Cập nhật' : 'Tạo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
