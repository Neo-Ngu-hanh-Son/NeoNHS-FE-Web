/**
 * Blog Category Service
 * Handles admin blog category API calls
 */

import apiClient from "./apiClient";
import type {
  BlogCategoryListParams,
  BlogCategoryPageResponse,
  BlogCategoryResponse,
  BlogCategoryRequest,
} from "@/types/blog";
import type { ApiResponse } from "@/types";

const BASE = "/admin/blog-categories";

export const blogCategoryService = {
  /**
   * Get paginated list of blog categories with optional search, filter, and sort
   */
  async getCategories(
    params: BlogCategoryListParams = {},
  ): Promise<ApiResponse<BlogCategoryPageResponse>> {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);

    const queryString = query.toString();
    const url = queryString ? `${BASE}?${queryString}` : BASE;

    return await apiClient.get<ApiResponse<BlogCategoryPageResponse>>(url);
  },

  async createCategory(data: BlogCategoryRequest): Promise<ApiResponse<BlogCategoryResponse>> {
    return await apiClient.post<ApiResponse<BlogCategoryResponse>>(BASE, data);
  },

  async updateCategory(
    id: string,
    data: BlogCategoryRequest,
  ): Promise<ApiResponse<BlogCategoryResponse>> {
    return await apiClient.put<ApiResponse<BlogCategoryResponse>>(`${BASE}/${id}`, data);
  },

  async deleteCategory(id: string): Promise<ApiResponse<BlogCategoryResponse>> {
    return await apiClient.delete<ApiResponse<BlogCategoryResponse>>(`${BASE}/${id}`);
  },

  async getCategoryById(id: string): Promise<ApiResponse<BlogCategoryResponse>> {
    return await apiClient.get<ApiResponse<BlogCategoryResponse>>(`${BASE}/${id}`);
  },
};

export default blogCategoryService;
