import { BlogStatus } from "@/types/blog";
import z from "zod";

// --- Block type options ---
export const BLOCK_TYPES = [
  { value: "paragraph", label: "Đoạn văn" },
  { value: "h1", label: "Tiêu đề 1" },
  { value: "h2", label: "Tiêu đề 2" },
  { value: "h3", label: "Tiêu đề 3" },
  { value: "h4", label: "Tiêu đề 4" },
  { value: "quote", label: "Trích dẫn" },
  { value: "bullet", label: "Danh sách dấu đầu dòng" },
  { value: "number", label: "Danh sách đánh số" },
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number]["value"];

export type EditorSaveResult = {
  lexicalJSON: string;
  html: string;
  charCount: number;
};

export type BlogEditorRef = {
  save: () => void;
  getJSON: () => string;
};

export const formSchema = z.object({
  title: z.string().min(10, "Tiêu đề cần ít nhất 10 ký tự").max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  slug: z.string().optional(),
  summary: z
    .string()
    .min(10, "Tóm tắt cần ít nhất 10 ký tự")
    .max(500, "Tóm tắt không được vượt quá 500 ký tự"),
  contentJSON: z.string().optional(),
  contentHTML: z.string().optional(),
  status: z.enum([BlogStatus.DRAFT, BlogStatus.PUBLISHED, BlogStatus.ARCHIVED]),
  isFeatured: z.boolean(),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  tags: z.string().max(200, "Thẻ không được vượt quá 200 ký tự").optional(),
  thumbnailUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});
