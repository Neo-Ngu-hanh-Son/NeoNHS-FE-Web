/**
 * Voucher Type Definitions
 */

// --- Enums ---

export type VoucherType = 'DISCOUNT' | 'GIFT_PRODUCT';
export type VoucherScope = 'PLATFORM' | 'VENDOR';
export type VoucherStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
export type DiscountType = 'PERCENT' | 'FIXED_AMOUNT';
export type ApplicableProduct = 'ALL' | 'TICKET' | 'WORKSHOP' | 'EVENT_TICKET';

// --- Response Types ---

export interface VoucherResponse {
    id: string;
    code: string;
    description: string;
    voucherType: VoucherType;
    scope: VoucherScope;
    applicableProduct: ApplicableProduct;

    // DISCOUNT fields
    discountType: DiscountType | null;
    discountValue: number | null;
    maxDiscountValue: number | null;
    minOrderValue: number | null;

    // GIFT_PRODUCT fields
    giftDescription: string | null;
    giftImageUrl: string | null;

    // Time & Usage
    startDate: string;
    endDate: string;
    usageLimit: number;
    usageCount: number;

    // Status & Meta
    status: VoucherStatus;
    createdByUserId: string;
    createdByUserName: string;
    vendorId: string | null;
    vendorName: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface UserVoucherResponse {
    userVoucherId: string;
    isUsed: boolean;
    obtainedDate: string;
    usedDate: string | null;
    voucherId: string;
    code: string;
    description: string;
    voucherType: VoucherType;
    scope: VoucherScope;
    applicableProduct: ApplicableProduct;
    discountType: DiscountType | null;
    discountValue: number | null;
    maxDiscountValue: number | null;
    minOrderValue: number | null;
    giftDescription: string | null;
    giftImageUrl: string | null;
    startDate: string;
    endDate: string;
    status: VoucherStatus;
    vendorId: string | null;
    vendorName: string | null;
}

// --- Request Types ---

export interface CreateVoucherRequest {
    code: string;
    description?: string;
    voucherType: VoucherType;
    applicableProduct: ApplicableProduct;

    // DISCOUNT
    discountType?: DiscountType;
    discountValue?: number;
    maxDiscountValue?: number;
    minOrderValue?: number;

    // GIFT_PRODUCT
    giftDescription?: string;
    giftImageUrl?: string;

    // Time & Usage
    startDate?: string;
    endDate?: string;
    usageLimit?: number;
}

export interface UpdateVoucherRequest {
    description?: string;
    applicableProduct?: ApplicableProduct;
    discountType?: DiscountType;
    discountValue?: number;
    maxDiscountValue?: number | null;
    minOrderValue?: number;
    giftDescription?: string;
    giftImageUrl?: string;
    startDate?: string;
    endDate?: string;
    usageLimit?: number;
    status?: VoucherStatus;
}

// --- Pagination ---

export interface PagedVoucherResponse {
    content: VoucherResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface PagedUserVoucherResponse {
    content: UserVoucherResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
