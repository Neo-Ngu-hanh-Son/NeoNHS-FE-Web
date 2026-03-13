/**
 * Custom Hook: useBlogs
 * Encapsulates data fetching, filtering, sorting, pagination,
 * and delete confirmation state for the admin blog list.
 */

import { useEffect, useState, useCallback } from "react";
import { blogService } from "@/services/api/blogService";
import type { BlogResponse, BlogStatus, BlogListParams } from "@/types/blog";
import { BLOG_PAGE_SIZE, BLOG_SORT_OPTIONS } from "@/constants/blog";

export interface UseBlogsReturn {
  /** Blog data */
  blogs: BlogResponse[];
  loading: boolean;
  error: string | null;

  /** Pagination */
  currentPage: number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
  goToPage: (page: number) => void;

  /** Search */
  applySearch: (query: string) => void;

  /** Filters */
  statusFilter: BlogStatus | "";
  setStatusFilter: (status: BlogStatus | "") => void;

  /** Sort */
  sortIndex: number;
  setSortIndex: (index: number) => void;

  /** Delete dialog */
  deleteTarget: BlogResponse | null;
  openDeleteDialog: (blog: BlogResponse) => void;
  closeDeleteDialog: () => void;

  /** Refetch */
  refetch: () => void;
  retryLastSearch: () => void;
}

export function useBlogs(): UseBlogsReturn {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [statusFilter, setStatusFilterRaw] = useState<BlogStatus | "">("");
  const [sortIndex, setSortIndexRaw] = useState(0);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<BlogResponse | null>(null);

  /* ── Data fetching ── */
  const fetchBlogs = useCallback(
    async (query?: string) => {
      try {
        setLoading(true);
        setError(null);

        const sort = BLOG_SORT_OPTIONS[sortIndex];
        const params: BlogListParams = {
          page: currentPage,
          size: BLOG_PAGE_SIZE,
          search: query || undefined,
          status: statusFilter || undefined,
          sortBy: sort.sortBy,
          sortDir: sort.sortDir,
        };

        const response = await blogService.getBlogs(params);
        const page = response.data;

        setBlogs(page.content);
        setTotalElements(page.totalElements);
        setTotalPages(page.totalPages);
      } catch {
        setError("Unable to load blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, statusFilter, sortIndex],
  );

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* ── Search / Filter / Sort / Pagination ── */
  const applySearch = useCallback(
    (query: string) => {
      setCurrentPage(0);
      fetchBlogs(query);
      setLastSearchQuery(query);
    },
    [fetchBlogs],
  );

  const retryLastSearch = useCallback(() => {
    fetchBlogs(lastSearchQuery);
  }, [fetchBlogs, lastSearchQuery]);

  const setStatusFilter = useCallback((status: BlogStatus | "") => {
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

  /* ── Delete dialog ── */
  const openDeleteDialog = useCallback((blog: BlogResponse) => {
    setDeleteTarget(blog);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  return {
    blogs,
    loading,
    error,
    currentPage,
    totalElements,
    totalPages,
    pageSize: BLOG_PAGE_SIZE,
    goToPage,
    applySearch,
    statusFilter,
    setStatusFilter,
    sortIndex,
    setSortIndex,
    deleteTarget,
    openDeleteDialog,
    closeDeleteDialog,
    refetch: fetchBlogs,
    retryLastSearch,
  };
}
