/**
 * Blog Constants
 */
import type { BlogStatus } from "@/types/blog";

export const BLOG_PAGE_SIZE = 6;

export const BLOG_STATUS_OPTIONS: { label: string; value: BlogStatus | "" }[] = [
  { label: "Tất cả", value: "" },
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đã xuất bản", value: "PUBLISHED" },
  { label: "Đã lưu trữ", value: "ARCHIVED" },
];

export const BLOG_SORT_OPTIONS: {
  label: string;
  sortBy: string;
  sortDir: "asc" | "desc";
}[] = [
    { label: "Mới nhất", sortBy: "createdAt", sortDir: "desc" },
    { label: "Cũ nhất", sortBy: "createdAt", sortDir: "asc" },
    { label: "Tiêu đề A-Z", sortBy: "title", sortDir: "asc" },
    { label: "Tiêu đề Z-A", sortBy: "title", sortDir: "desc" },
  ];
