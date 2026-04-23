/**
 * Custom Hook: useUpdateVoucher
 * Handles updating an existing voucher (admin)
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { adminVoucherService, vendorVoucherService } from '@/services/api/voucherService';
import type { UpdateVoucherRequest, VoucherResponse, VoucherScope } from '@/types/voucher';

interface UseUpdateVoucherReturn {
    updateVoucher: (id: string, data: UpdateVoucherRequest) => Promise<VoucherResponse | null>;
    loading: boolean;
}

export function useUpdateVoucher(scope: VoucherScope = 'PLATFORM'): UseUpdateVoucherReturn {
    const [loading, setLoading] = useState(false);
    const service = scope === 'PLATFORM' ? adminVoucherService : vendorVoucherService;

    const updateVoucher = useCallback(async (id: string, data: UpdateVoucherRequest): Promise<VoucherResponse | null> => {
        setLoading(true);
        try {
            const response = await service.update(id, data);
            if (response.success) {
                message.success('Cập nhật voucher thành công');
                return response.data;
            } else {
                message.error(response.message || 'Cập nhật voucher thất bại');
                return null;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Cập nhật voucher thất bại: ' + (err.message || 'Lỗi không xác định'));
            return null;
        } finally {
            setLoading(false);
        }
    }, [service]);

    return { updateVoucher, loading };
}
