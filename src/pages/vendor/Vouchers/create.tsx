import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VoucherForm } from '@/pages/admin/vouchers/components/VoucherForm';
import { useCreateVoucher } from '@/hooks/voucher';
import type { CreateVoucherRequest } from '@/types/voucher';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function VendorCreateVoucherPage() {
    const navigate = useNavigate();
    const { createVoucher, loading } = useCreateVoucher('VENDOR');

    const handleSubmit = async (data: any) => {
        const result = await createVoucher(data as CreateVoucherRequest);
        if (result) {
            navigate('/vendor/vouchers');
        }
    };

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
                            <BreadcrumbPage>Tạo Voucher mới</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/vendor/vouchers')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tạo Voucher mới</h1>
                        <p className="text-muted-foreground">Thiết lập chương trình khuyến mãi mới cho khách hàng</p>
                    </div>
                </div>
            </div>

            <VoucherForm
                mode="create"
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
