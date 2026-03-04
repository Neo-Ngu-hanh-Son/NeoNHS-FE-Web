/**
 * Custom Hook: useVouchers
 * Manages admin voucher list fetching, pagination, and delete
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { adminVoucherService, AdminVoucherQueryParams } from '@/services/api/voucherService';
import type { VoucherResponse } from '@/types/voucher';

interface UseVouchersReturn {
    vouchers: VoucherResponse[];
    loading: boolean;
    totalElements: number;
    totalPages: number;
    fetchVouchers: () => Promise<void>;
    deleteVoucher: (id: string) => Promise<boolean>;
}

export function useVouchers(params: AdminVoucherQueryParams): UseVouchersReturn {
    const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const paramsRef = useRef<string>('');
    const paramsKey = JSON.stringify(params);

    const fetchVouchers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminVoucherService.getAll(params);
            if (response.success) {
                setVouchers(response.data.content);
                setTotalElements(response.data.totalElements);
                setTotalPages(response.data.totalPages);
            } else {
                message.error(response.message || 'Failed to fetch vouchers');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to fetch vouchers: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);

    useEffect(() => {
        if (paramsRef.current !== paramsKey) {
            paramsRef.current = paramsKey;
            fetchVouchers();
        }
    }, [paramsKey, fetchVouchers]);

    const deleteVoucher = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await adminVoucherService.delete(id);
            if (response.success) {
                message.success('Voucher deleted successfully');
                await fetchVouchers();
                return true;
            } else {
                message.error(response.message || 'Failed to delete voucher');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Failed to delete voucher: ' + (err.message || 'Unknown error'));
            return false;
        }
    }, [fetchVouchers]);

    return { vouchers, loading, totalElements, totalPages, fetchVouchers, deleteVoucher };
}
