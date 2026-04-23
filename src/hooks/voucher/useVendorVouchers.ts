/**
 * Custom Hook: useVendorVouchers
 * Manages vendor's own voucher list fetching, pagination, and delete
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { vendorVoucherService, VendorVoucherQueryParams } from '@/services/api/voucherService';
import type { VoucherResponse } from '@/types/voucher';

interface UseVendorVouchersReturn {
    vouchers: VoucherResponse[];
    loading: boolean;
    totalElements: number;
    totalPages: number;
    fetchVouchers: () => Promise<void>;
    deleteVoucher: (id: string) => Promise<boolean>;
}

export function useVendorVouchers(params: VendorVoucherQueryParams): UseVendorVouchersReturn {
    const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const paramsRef = useRef<string>('');
    const paramsKey = JSON.stringify(params);

    const fetchVouchers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await vendorVoucherService.getAll(params);
            if (response.success) {
                setVouchers(response.data.content);
                setTotalElements(response.data.totalElements);
                setTotalPages(response.data.totalPages);
            } else {
                message.error(response.message || 'Lấy danh sách voucher thất bại');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Lấy danh sách voucher thất bại: ' + (err.message || 'Lỗi không xác định'));
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
            const response = await vendorVoucherService.delete(id);
            if (response.success) {
                message.success('Xóa voucher thành công');
                await fetchVouchers();
                return true;
            } else {
                message.error(response.message || 'Xóa voucher thất bại');
                return false;
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Xóa voucher thất bại: ' + (err.message || 'Lỗi không xác định'));
            return false;
        }
    }, [fetchVouchers]);

    return { vouchers, loading, totalElements, totalPages, fetchVouchers, deleteVoucher };
}
