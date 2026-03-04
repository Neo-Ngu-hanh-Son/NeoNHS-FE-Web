import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { VoucherForm } from './components/VoucherForm';
import { useVoucher, useUpdateVoucher } from '@/hooks/voucher';
import type { UpdateVoucherRequest } from '@/types/voucher';

export default function VoucherEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { voucher, loading: fetchLoading } = useVoucher(id);
    const { updateVoucher, loading: updateLoading } = useUpdateVoucher();

    const handleSubmit = async (data: UpdateVoucherRequest) => {
        if (!id) return;
        const result = await updateVoucher(id, data as UpdateVoucherRequest);
        if (result) {
            navigate(`/admin/vouchers/${id}`);
        }
    };

    if (fetchLoading) {
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
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Voucher</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Update voucher <span className="font-mono font-semibold">{voucher.code}</span>
                </p>
            </div>
            <VoucherForm
                mode="edit"
                initialData={voucher}
                onSubmit={handleSubmit as any}
                loading={updateLoading}
            />
        </div>
    );
}
