/**
 * Blog Service
 * Handles admin blog API calls
 */

import apiClient from "./apiClient";
import type { BlogListParams, BlogPageResponse, BlogResponse, BlogRequest } from "@/types/blog";
import type { ApiResponse } from "@/types";

const BASE = "/admin/blogs";

export const blogService = {
  /**
   * Get paginated list of blogs with optional search, filter, and sort
   */
  async getBlogs(params: BlogListParams = {}): Promise<ApiResponse<BlogPageResponse>> {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.isFeatured !== undefined) query.set("isFeatured", String(params.isFeatured));
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach((tag) => query.append("tags", tag));
    }

    const queryString = query.toString();
    const url = queryString ? `${BASE}?${queryString}` : BASE;
    return await apiClient.get<ApiResponse<BlogPageResponse>>(url);
  },

  async createBlog(data: BlogRequest): Promise<ApiResponse<BlogResponse>> {
    return await apiClient.post<ApiResponse<BlogResponse>>(BASE, data);
  },

  async updateBlog(id: string, data: BlogRequest): Promise<ApiResponse<BlogResponse>> {
    return await apiClient.put<ApiResponse<BlogResponse>>(`${BASE}/${id}`, data);
  },

  async deleteBlog(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`${BASE}/${id}`);
  },

  async deleteBlogHard(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`${BASE}/${id}/hard`);
  },

  async emptyAllDeletedBlogs(): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`${BASE}/empty-deleted`);
  },

  async getBlogById(id: string): Promise<ApiResponse<BlogResponse>> {
    return await apiClient.get<ApiResponse<BlogResponse>>(`${BASE}/${id}`);
  },
};

export default blogService;
