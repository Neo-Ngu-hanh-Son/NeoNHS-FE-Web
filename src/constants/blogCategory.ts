/**
 * Blog Category Constants
 */
import type { BlogCategoryStatus } from "@/types/blog";

export const BLOG_CATEGORY_PAGE_SIZE = 10;

export const BLOG_CATEGORY_STATUS_OPTIONS: { label: string; value: BlogCategoryStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

export const BLOG_CATEGORY_SORT_OPTIONS: {
  label: string;
  sortBy: string;
  sortDir: "asc" | "desc";
}[] = [
  { label: "Latest", sortBy: "createdAt", sortDir: "desc" },
  { label: "Oldest", sortBy: "createdAt", sortDir: "asc" },
  { label: "Name A-Z", sortBy: "name", sortDir: "asc" },
  { label: "Name Z-A", sortBy: "name", sortDir: "desc" },
];
