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
    UPCOMING: 'Upcoming',
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

export const EVENT_STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

export const ticketStatusBadgeStyles: Record<TicketCatalogStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-gray-100 text-gray-700 border-gray-200',
    SOLD_OUT: 'bg-red-100 text-red-800 border-red-200',
};

export const TICKET_STATUS_OPTIONS: { value: TicketCatalogStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'SOLD_OUT', label: 'Sold Out' },
];

export const WEEKDAY_OPTIONS = [
    { value: 'MON', label: 'Mon' },
    { value: 'TUE', label: 'Tue' },
    { value: 'WED', label: 'Wed' },
    { value: 'THU', label: 'Thu' },
    { value: 'FRI', label: 'Fri' },
    { value: 'SAT', label: 'Sat' },
    { value: 'SUN', label: 'Sun' },
];
