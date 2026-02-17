import { BlogStatus } from "@/types/blog";
import z from "zod";

// --- Block type options ---
export const BLOCK_TYPES = [
  { value: "paragraph", label: "Normal" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "quote", label: "Quote" },
  { value: "bullet", label: "Bulleted List" },
  { value: "number", label: "Numbered List" },
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
  title: z.string().min(10, "Title need to be at least 10 characters").max(100, "Title must be at most 100 characters"),
  slug: z.string().optional(),
  summary: z
    .string()
    .min(10, "Summary need to be at least 10 characters")
    .max(500, "Summary must be at most 100 characters"),
  contentJSON: z.string().optional(),
  contentHTML: z.string().optional(),
  status: z.enum([BlogStatus.DRAFT, BlogStatus.PUBLISHED, BlogStatus.ARCHIVED]),
  isFeatured: z.boolean(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});
