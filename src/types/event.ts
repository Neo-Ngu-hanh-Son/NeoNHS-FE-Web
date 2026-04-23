/**
 * Event Type Definitions
 */

import type { TagResponse } from './tag';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface EventImageResponse {
    id: string;
    imageUrl: string;
    isThumbnail: boolean;
    createdAt: string;
}

export interface EventResponse {
    id: string;
    name: string;
    shortDescription: string;
    fullDescription: string;
    locationName: string;
    latitude: string;
    longitude: string;
    startTime: string;       // ISO DateTime
    endTime: string;         // ISO DateTime
    lunarStartDate?: string;
    lunarEndDate?: string;
    isTicketRequired: boolean;
    price: number;
    maxParticipants: number;
    currentEnrolled: number;
    status: EventStatus;
    thumbnailUrl: string;
    createdAt: string;
    updatedAt: string;
    tags: TagResponse[];
    images?: EventImageResponse[];  // only present in GET /{id} detail view
    deletedAt?: string | null;
}

export interface CreateEventRequest {
    name: string;
    shortDescription?: string;
    fullDescription?: string;
    locationName?: string;
    latitude?: string;
    longitude?: string;
    startTime: string;
    endTime: string;
    isTicketRequired?: boolean;
    price?: number;
    maxParticipants?: number;
    thumbnailUrl?: string;
    tagIds?: string[];
}

export interface UpdateEventRequest {
    name?: string;
    shortDescription?: string;
    fullDescription?: string;
    locationName?: string;
    latitude?: string;
    longitude?: string;
    startTime?: string;
    endTime?: string;
    isTicketRequired?: boolean;
    price?: number;
    maxParticipants?: number;
    thumbnailUrl?: string;
    tagIds?: string[];
    status?: EventStatus;
}

export interface EventFilterRequest {
    status?: EventStatus;
    name?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    tagIds?: string[];
    deleted?: boolean;
    includeDeleted?: boolean;
}

export interface PagedEventResponse {
    content: EventResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
