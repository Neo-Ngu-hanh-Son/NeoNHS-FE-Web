/**
 * Public Blog Service
 * Handles public-facing (visitor) blog API calls — no auth required.
 */

import apiClient from "./apiClient";
import type { BlogResponse, BlogPageResponse, BlogListParams } from "@/types/blog";
import type { ApiResponse } from "@/types";

const BASE = "/blogs";

export const publicBlogService = {
  /**
   * Get a single published blog by ID (public endpoint)
   */
  async getBlogById(id: string): Promise<ApiResponse<BlogResponse>> {
    return await apiClient.get<ApiResponse<BlogResponse>>(`${BASE}/${id}`);
  },

  /**
   * Get paginated list of published blogs (public endpoint)
   */
  async getBlogs(params: BlogListParams = {}): Promise<ApiResponse<BlogPageResponse>> {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.search) query.set("search", params.search);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach((tag) => query.append("tags", tag));
    }

    const queryString = query.toString();
    const url = queryString ? `${BASE}?${queryString}` : BASE;
    return await apiClient.get<ApiResponse<BlogPageResponse>>(url);
  },

  async incrementBlogView(id: string): Promise<void> {
    try {
      await apiClient.post<null>(`${BASE}/${id}/view`, {});
    } catch (error) {
      //console.error("Failed to track blog view", error);
    }
  },
}

export default publicBlogService;
