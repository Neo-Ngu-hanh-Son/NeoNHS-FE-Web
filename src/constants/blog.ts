/**
 * Blog Constants
 */
import type { BlogStatus } from "@/types/blog";

export const BLOG_PAGE_SIZE = 6;

export const BLOG_STATUS_OPTIONS: { label: string; value: BlogStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

export const BLOG_SORT_OPTIONS: {
  label: string;
  sortBy: string;
  sortDir: "asc" | "desc";
}[] = [
    { label: "Latest", sortBy: "createdAt", sortDir: "desc" },
    { label: "Oldest", sortBy: "createdAt", sortDir: "asc" },
    { label: "Title A-Z", sortBy: "title", sortDir: "asc" },
    { label: "Title Z-A", sortBy: "title", sortDir: "desc" },
  ];
