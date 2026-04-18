/**
 * Blog Category Constants
 */
import type { BlogCategoryStatus } from "@/types/blog";

export const BLOG_CATEGORY_PAGE_SIZE = 10;

export const BLOG_CATEGORY_STATUS_OPTIONS: { label: string; value: BlogCategoryStatus | "" }[] = [
  { label: "Tất cả", value: "" },
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đã lưu trữ", value: "ARCHIVED" },
];

export const BLOG_CATEGORY_SORT_OPTIONS: {
  label: string;
  sortBy: string;
  sortDir: "asc" | "desc";
}[] = [
  { label: "Mới nhất", sortBy: "createdAt", sortDir: "desc" },
  { label: "Cũ nhất", sortBy: "createdAt", sortDir: "asc" },
  { label: "Tên A-Z", sortBy: "name", sortDir: "asc" },
  { label: "Tên Z-A", sortBy: "name", sortDir: "desc" },
];
