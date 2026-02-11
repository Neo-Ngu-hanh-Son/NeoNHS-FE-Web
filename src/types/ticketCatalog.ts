/**
 * Ticket Catalog Type Definitions
 */

export type TicketCatalogStatus = 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT';

export interface TicketCatalogResponse {
    id: string;
    eventId: string;
    name: string;
    description: string;
    customerType: string;        // e.g. "Adult", "Child", "Student"
    price: number;
    originalPrice: number;
    applyOnDays: string;         // e.g. "MON,TUE,WED"
    validFromDate: string;       // ISO DateTime
    validToDate: string;         // ISO DateTime
    totalQuota: number;
    soldQuantity: number;
    remainingQuantity: number;   // computed = totalQuota - soldQuantity
    status: TicketCatalogStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface CreateTicketCatalogRequest {
    name: string;
    description?: string;
    customerType?: string;
    price: number;
    originalPrice?: number;
    applyOnDays?: string;
    validFromDate?: string;
    validToDate?: string;
    totalQuota?: number;
    status?: TicketCatalogStatus;
}

export interface UpdateTicketCatalogRequest {
    name?: string;
    description?: string;
    customerType?: string;
    price?: number;
    originalPrice?: number;
    applyOnDays?: string;
    validFromDate?: string;
    validToDate?: string;
    totalQuota?: number;
    status?: TicketCatalogStatus;
}

export interface PagedTicketCatalogResponse {
    content: TicketCatalogResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
