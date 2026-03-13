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
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    EXPIRED: 'Expired',
};

export const VOUCHER_STATUS_OPTIONS: { value: VoucherStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'EXPIRED', label: 'Expired' },
];

// --- Voucher Type ---

export const voucherTypeBadgeStyles: Record<VoucherType, string> = {
    DISCOUNT: 'bg-blue-100 text-blue-800 border-blue-200',
    GIFT_PRODUCT: 'bg-purple-100 text-purple-800 border-purple-200',
    BONUS_POINTS: 'bg-amber-100 text-amber-800 border-amber-200',
    FREE_SERVICE: 'bg-teal-100 text-teal-800 border-teal-200',
};

export const voucherTypeLabels: Record<VoucherType, string> = {
    DISCOUNT: 'Discount',
    GIFT_PRODUCT: 'Gift Product',
    BONUS_POINTS: 'Bonus Points',
    FREE_SERVICE: 'Free Service',
};

export const VOUCHER_TYPE_OPTIONS: { value: VoucherType; label: string }[] = [
    { value: 'DISCOUNT', label: 'Discount' },
    { value: 'GIFT_PRODUCT', label: 'Gift Product' },
    { value: 'BONUS_POINTS', label: 'Bonus Points' },
    { value: 'FREE_SERVICE', label: 'Free Service' },
];

// Vendor can only create DISCOUNT and GIFT_PRODUCT
export const VENDOR_VOUCHER_TYPE_OPTIONS: { value: VoucherType; label: string }[] = [
    { value: 'DISCOUNT', label: 'Discount' },
    { value: 'GIFT_PRODUCT', label: 'Gift Product' },
];

// --- Scope ---

export const voucherScopeLabels: Record<VoucherScope, string> = {
    PLATFORM: 'Platform',
    VENDOR: 'Vendor',
};

export const VOUCHER_SCOPE_OPTIONS: { value: VoucherScope; label: string }[] = [
    { value: 'PLATFORM', label: 'Platform' },
    { value: 'VENDOR', label: 'Vendor' },
];

// --- Discount Type ---

export const discountTypeLabels: Record<DiscountType, string> = {
    PERCENT: 'Percentage',
    FIXED: 'Fixed Amount',
};

export const DISCOUNT_TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
    { value: 'PERCENT', label: 'Percentage (%)' },
    { value: 'FIXED', label: 'Fixed Amount (₫)' },
];

// --- Applicable Product ---

export const applicableProductLabels: Record<ApplicableProduct, string> = {
    ALL: 'Universal',
    TICKET: 'Tickets',
    WORKSHOP: 'Workshops',
    EVENT_TICKET: 'Event Tickets',
};

export const APPLICABLE_PRODUCT_OPTIONS: { value: ApplicableProduct; label: string }[] = [
    { value: 'ALL', label: 'Universal' },
    { value: 'TICKET', label: 'Tickets' },
    { value: 'WORKSHOP', label: 'Workshops' },
    { value: 'EVENT_TICKET', label: 'Event Tickets' },
];
