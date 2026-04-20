/**
 * Custom Hook: useCreateVoucher
 * Handles creating a new voucher (admin)
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { adminVoucherService, vendorVoucherService } from '@/services/api/voucherService';
import type { CreateVoucherRequest, VoucherResponse, VoucherScope } from '@/types/voucher';

interface UseCreateVoucherReturn {
    createVoucher: (data: CreateVoucherRequest) => Promise<VoucherResponse | null>;
    loading: boolean;
}

export function useCreateVoucher(scope: VoucherScope = 'PLATFORM'): UseCreateVoucherReturn {
    const [loading, setLoading] = useState(false);
    const service = scope === 'PLATFORM' ? adminVoucherService : vendorVoucherService;

    const createVoucher = useCallback(async (data: CreateVoucherRequest): Promise<VoucherResponse | null> => {
        setLoading(true);
        try {
            const response = await service.create(data);
            if (response.success) {
                message.success('Voucher created successfully');
                return response.data;
            } else {
                message.error(response.message || 'Failed to create voucher');
                return null;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to create voucher: ' + (err.message || 'Unknown error'));
            return null;
        } finally {
            setLoading(false);
        }
    }, [service]);

    return { createVoucher, loading };
}
