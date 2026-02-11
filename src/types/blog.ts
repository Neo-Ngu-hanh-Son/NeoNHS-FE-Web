/**
 * Blog-related Type Definitions
 */

export type BlogCategoryStatus = "ACTIVE" | "ARCHIVED";

export interface BlogCategoryResponse {
  id: string;
  name: string;
  description?: string;
  status: BlogCategoryStatus;
  postCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogCategoryPageResponse {
  content: BlogCategoryResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface BlogCategoryListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: BlogCategoryStatus | "";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface BlogCategoryRequest {
  name: string;
  description?: string;
  status?: BlogCategoryStatus;
}
