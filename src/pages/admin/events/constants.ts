/**
 * Event module constants
 */

import type { EventStatus } from '@/types/event';
import type { TicketCatalogStatus } from '@/types/ticketCatalog';

export const statusBadgeStyles: Record<EventStatus, string> = {
    UPCOMING: 'bg-blue-100 text-blue-800 border-blue-200',
    ONGOING: 'bg-green-100 text-green-800 border-green-200',
    COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

export const statusLabels: Record<EventStatus, string> = {
    UPCOMING: 'Sắp diễn ra',
    ONGOING: 'Đang diễn ra',
    COMPLETED: 'Đã hoàn thành',
    CANCELLED: 'Đã hủy',
};

export const EVENT_STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
    { value: 'UPCOMING', label: 'Sắp diễn ra' },
    { value: 'ONGOING', label: 'Đang diễn ra' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
];

export const ticketStatusBadgeStyles: Record<TicketCatalogStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-gray-100 text-gray-700 border-gray-200',
    SOLD_OUT: 'bg-red-100 text-red-800 border-red-200',
};

export const TICKET_STATUS_OPTIONS: { value: TicketCatalogStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Không hoạt động' },
    { value: 'SOLD_OUT', label: 'Đã bán hết' },
];

export const WEEKDAY_OPTIONS = [
    { value: 'MON', label: 'T2' },
    { value: 'TUE', label: 'T3' },
    { value: 'WED', label: 'T4' },
    { value: 'THU', label: 'T5' },
    { value: 'FRI', label: 'T6' },
    { value: 'SAT', label: 'T7' },
    { value: 'SUN', label: 'CN' },
];
