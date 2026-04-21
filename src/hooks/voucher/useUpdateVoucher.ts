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
                message.success('Voucher updated successfully');
                return response.data;
            } else {
                message.error(response.message || 'Failed to update voucher');
                return null;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to update voucher: ' + (err.message || 'Unknown error'));
            return null;
        } finally {
            setLoading(false);
        }
    }, [service]);

    return { updateVoucher, loading };
}
