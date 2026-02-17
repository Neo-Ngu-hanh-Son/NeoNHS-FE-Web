/**
 * Blog-related Type Definitions
 */

export type BlogCategoryStatus = "ACTIVE" | "ARCHIVED";

export interface BlogCategoryResponse {
  id: string;
  name: string;
  slug: string;
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

export const BlogStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type BlogStatus = (typeof BlogStatus)[keyof typeof BlogStatus];

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  contentJSON?: string;
  contentHTML?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  isFeatured: boolean;
  status: BlogStatus;
  publishedAt?: string;
  tags?: string;
  viewCount: number;
  blogCategory?: BlogCategoryResponse;
  user?: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogRequest {
  title: string;
  summary?: string;
  contentJSON?: string;
  contentHTML?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  isFeatured?: boolean;
  status?: BlogStatus;
  tags?: string;
  blogCategoryId?: string;
}

export interface BlogListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: BlogStatus | "";
  tags?: string[];
  categoryId?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface BlogPageResponse {
  content: BlogResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
