/**
 * Custom Hook: useBlogCategories
 * Encapsulates all data fetching, filtering, sorting, and pagination logic
 * for the blog category list.
 */

import { useEffect, useState, useCallback } from "react";
import { blogCategoryService } from "@/services/api/blogCategoryService";
import type {
  BlogCategoryResponse,
  BlogCategoryStatus,
  BlogCategoryListParams,
} from "@/types/blog";
import { BLOG_CATEGORY_PAGE_SIZE, BLOG_CATEGORY_SORT_OPTIONS } from "@/constants/blogCategory";

export interface UseBlogCategoriesReturn {
  /** Category data */
  categories: BlogCategoryResponse[];
  loading: boolean;
  error: string | null;

  /** Pagination */
  currentPage: number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
  goToPage: (page: number) => void;

  /** Search */
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  applySearch: () => void;

  /** Filters */
  statusFilter: BlogCategoryStatus | "";
  setStatusFilter: (status: BlogCategoryStatus | "") => void;

  /** Sort */
  sortIndex: number;
  setSortIndex: (index: number) => void;

  /** Actions */
  refresh: () => void;
}

export function useBlogCategories(): UseBlogCategoriesReturn {
  const [categories, setCategories] = useState<BlogCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilterRaw] = useState<BlogCategoryStatus | "">("");
  const [sortIndex, setSortIndexRaw] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const sort = BLOG_CATEGORY_SORT_OPTIONS[sortIndex];
      const params: BlogCategoryListParams = {
        page: currentPage,
        size: BLOG_CATEGORY_PAGE_SIZE,
        search: appliedSearch || undefined,
        status: statusFilter || undefined,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir,
      };

      const response = await blogCategoryService.getCategories(params);
      const page = response.data;

      setCategories(page.content);
      setTotalElements(page.totalElements);
      setTotalPages(page.totalPages);
    } catch {
      setError("Unable to load blog categories. Please try again later.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, appliedSearch, statusFilter, sortIndex]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const applySearch = useCallback(() => {
    setCurrentPage(0);
    setAppliedSearch(searchQuery);
  }, [searchQuery]);

  const setStatusFilter = useCallback((status: BlogCategoryStatus | "") => {
    setStatusFilterRaw(status);
    setCurrentPage(0);
  }, []);

  const setSortIndex = useCallback((index: number) => {
    setSortIndexRaw(index);
    setCurrentPage(0);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) setCurrentPage(page);
    },
    [totalPages],
  );

  return {
    categories,
    loading,
    error,
    currentPage,
    totalElements,
    totalPages,
    pageSize: BLOG_CATEGORY_PAGE_SIZE,
    goToPage,
    searchQuery,
    setSearchQuery,
    applySearch,
    statusFilter,
    setStatusFilter,
    sortIndex,
    setSortIndex,
    refresh: fetchCategories,
  };
}
