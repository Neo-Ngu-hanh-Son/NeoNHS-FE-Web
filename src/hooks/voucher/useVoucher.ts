/**
 * Custom Hook: useVoucher
 * Fetches a single voucher by ID (admin)
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { adminVoucherService, vendorVoucherService } from '@/services/api/voucherService';
import type { VoucherResponse, VoucherScope } from '@/types/voucher';

interface UseVoucherReturn {
    voucher: VoucherResponse | null;
    loading: boolean;
    refetch: () => Promise<void>;
}

export function useVoucher(id: string | undefined, scope: VoucherScope = 'PLATFORM'): UseVoucherReturn {
    const [voucher, setVoucher] = useState<VoucherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const service = scope === 'PLATFORM' ? adminVoucherService : vendorVoucherService;

    const fetchVoucher = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await service.getById(id);
            if (response.success) {
                setVoucher(response.data);
            } else {
                message.error(response.message || 'Lấy voucher thất bại');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Lấy voucher thất bại: ' + (err.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
    }, [id, service]);

    useEffect(() => {
        fetchVoucher();
    }, [fetchVoucher]);

    return { voucher, loading, refetch: fetchVoucher };
}
