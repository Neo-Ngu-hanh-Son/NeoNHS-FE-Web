/**
 * Event-specific formatting utilities
 */

import dayjs from 'dayjs';

export function formatEventDate(dateString: string): string {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
}

export function formatEventPrice(price: number | null | undefined): string {
    if (!price || price === 0) return 'Free';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

/**
 * Smart format for event time range:
 * Same day: "15/03/2026 08:00 - 17:00"
 * Different days: "15/03/2026 08:00" + "16/03/2026 17:00"
 */
export function formatEventTimeRange(startTime: string, endTime: string): { singleLine: boolean; start: string; end: string } {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const sameDay = start.format('DD/MM/YYYY') === end.format('DD/MM/YYYY');

    if (sameDay) {
        return {
            singleLine: true,
            start: start.format('DD/MM/YYYY HH:mm'),
            end: end.format('HH:mm'),
        };
    }
    return {
        singleLine: false,
        start: start.format('DD/MM/YYYY HH:mm'),
        end: end.format('DD/MM/YYYY HH:mm'),
    };
}
