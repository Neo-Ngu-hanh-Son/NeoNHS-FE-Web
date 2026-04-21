/**
 * Voucher module constants
 */

import type { VoucherType, VoucherStatus, VoucherScope, DiscountType, ApplicableProduct } from '@/types/voucher';

// --- Status ---

export const voucherStatusBadgeStyles: Record<VoucherStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-gray-100 text-gray-700 border-gray-200',
    EXPIRED: 'bg-red-100 text-red-800 border-red-200',
};

export const voucherStatusLabels: Record<VoucherStatus, string> = {
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Ngưng hoạt động',
    EXPIRED: 'Hết hạn',
};

export const VOUCHER_STATUS_OPTIONS: { value: VoucherStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Đang hoạt động' },
    { value: 'INACTIVE', label: 'Ngưng hoạt động' },
    { value: 'EXPIRED', label: 'Hết hạn' },
];

// --- Voucher Type ---

export const voucherTypeBadgeStyles: Record<VoucherType, string> = {
    DISCOUNT: 'bg-blue-100 text-blue-800 border-blue-200',
    GIFT_PRODUCT: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const voucherTypeLabels: Record<VoucherType, string> = {
    DISCOUNT: 'Giảm giá',
    GIFT_PRODUCT: 'Quà tặng sản phẩm',
};

export const VOUCHER_TYPE_OPTIONS: { value: VoucherType; label: string }[] = [
    { value: 'DISCOUNT', label: 'Giảm giá' },
    { value: 'GIFT_PRODUCT', label: 'Quà tặng sản phẩm' },
];

// Vendor can only create DISCOUNT and GIFT_PRODUCT
export const VENDOR_VOUCHER_TYPE_OPTIONS: { value: VoucherType; label: string }[] = [
    { value: 'DISCOUNT', label: 'Giảm giá' },
    { value: 'GIFT_PRODUCT', label: 'Quà tặng sản phẩm' },
];

// --- Scope ---

export const voucherScopeLabels: Record<VoucherScope, string> = {
    PLATFORM: 'Hệ thống',
    VENDOR: 'Đối tác',
};

export const VOUCHER_SCOPE_OPTIONS: { value: VoucherScope; label: string }[] = [
    { value: 'PLATFORM', label: 'Hệ thống' },
    { value: 'VENDOR', label: 'Đối tác' },
];

// --- Discount Type ---

export const discountTypeLabels: Record<DiscountType, string> = {
    PERCENT: 'Phần trăm',
    FIXED_AMOUNT: 'Số tiền cố định',
};

export const DISCOUNT_TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
    { value: 'PERCENT', label: 'Phần trăm (%)' },
    { value: 'FIXED_AMOUNT', label: 'Số tiền cố định (₫)' },
];

// --- Applicable Product ---

export const applicableProductLabels: Record<ApplicableProduct, string> = {
    ALL: 'Tất cả',
    TICKET: 'Vé tham quan',
    WORKSHOP: 'Workshop',
    EVENT_TICKET: 'Vé sự kiện',
};

export const APPLICABLE_PRODUCT_OPTIONS: { value: ApplicableProduct; label: string }[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'TICKET', label: 'Vé tham quan' },
    { value: 'WORKSHOP', label: 'Workshop' },
    { value: 'EVENT_TICKET', label: 'Vé sự kiện' },
];
