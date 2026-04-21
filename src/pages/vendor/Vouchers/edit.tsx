import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { VoucherForm } from '@/pages/admin/vouchers/components/VoucherForm';
import { useVoucher, useUpdateVoucher } from '@/hooks/voucher';
import type { UpdateVoucherRequest } from '@/types/voucher';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function VendorEditVoucherPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const { voucher, loading: fetching } = useVoucher(id, 'VENDOR');
    const { updateVoucher, loading: updating } = useUpdateVoucher('VENDOR');

    const handleSubmit = async (data: any) => {
        if (!id) return;
        const result = await updateVoucher(id, data as UpdateVoucherRequest);
        if (result) {
            navigate('/vendor/vouchers');
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!voucher) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold">Không tìm thấy voucher</h2>
                <Button variant="link" onClick={() => navigate('/vendor/vouchers')}>
                    Quay lại danh sách
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div className="flex flex-col gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => navigate('/vendor/dashboard')} className="cursor-pointer">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => navigate('/vendor/vouchers')} className="cursor-pointer">
                                Quản lý Voucher
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Chỉnh sửa Voucher</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/vendor/vouchers')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa Voucher</h1>
                        <p className="text-muted-foreground font-mono">{voucher.code}</p>
                    </div>
                </div>
            </div>

            <VoucherForm
                mode="edit"
                initialData={voucher}
                onSubmit={handleSubmit}
                loading={updating}
            />
        </div>
    );
}
