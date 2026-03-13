/**
 * Tag Type Definitions
 */

export interface TagResponse {
    id: string;
    name: string;
    description?: string;
    tagColor?: string;
    iconUrl?: string;
    deletedAt?: string | null;
}

export type WorkshopTagResponse = TagResponse;

export interface CreateTagRequest {
    name: string;
    description?: string;
    tagColor?: string;
    iconUrl?: string;
}

export interface UpdateTagRequest {
    name?: string;
    description?: string;
    tagColor?: string;
    iconUrl?: string;
}

export interface PagedTagResponse<T = TagResponse> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
