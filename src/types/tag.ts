/**
 * Tag Type Definitions
 */

export interface TagResponse {
    id: string;
    name: string;
    description: string;
    tagColor: string;    // hex color e.g. "#FF5733"
    iconUrl: string;
}

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

export interface PagedTagResponse {
    content: TagResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
