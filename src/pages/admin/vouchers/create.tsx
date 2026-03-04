import { useNavigate } from 'react-router-dom';
import { VoucherForm } from './components/VoucherForm';
import { useCreateVoucher } from '@/hooks/voucher';
import type { CreateVoucherRequest } from '@/types/voucher';

export default function VoucherCreatePage() {
    const navigate = useNavigate();
    const { createVoucher, loading } = useCreateVoucher();

    const handleSubmit = async (data: CreateVoucherRequest) => {
        const result = await createVoucher(data as CreateVoucherRequest);
        if (result) {
            navigate('/admin/vouchers');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create Voucher</h1>
                <p className="text-muted-foreground text-sm mt-1">Create a new voucher by filling in the details below.</p>
            </div>
            <VoucherForm mode="create" onSubmit={handleSubmit as any} loading={loading} />
        </div>
    );
}
