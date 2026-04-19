import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { BlogStatus, BlogCategoryResponse } from "@/types/blog";
import blogCategoryService from "@/services/api/blogCategoryService";
import { BlogEditorRef, EditorSaveResult } from "@/components/blog/type";
import blogService from "@/services/api/blogService";
import { useNavigate } from "react-router-dom";

interface BlogFormState {
  title: string;
  slug: string;
  summary: string;
  contentJSON: string;
  contentHTML: string;
  thumbnailUrl: string;
  bannerUrl: string;
  tags: string;
  isFeatured: boolean;
  categoryId: string;
  status: BlogStatus;
}

interface BlogFormContextType {
  formData: BlogFormState;
  errors: Record<string, string>;
  categories: BlogCategoryResponse[];
  loadingCategories: boolean;
  submitting: boolean;

  setFormData: React.Dispatch<React.SetStateAction<BlogFormState>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSubmitting: (val: boolean) => void;

  validate: () => boolean;

  // Specific setters for common use cases
  updateContent: (json: string, html: string) => void;

  editorRef: React.RefObject<BlogEditorRef | null>;
  triggerSave: () => void;
  submitBlog: (content: EditorSaveResult) => Promise<void>;
}

const BlogFormContext = createContext<BlogFormContextType | undefined>(undefined);

export const useBlogForm = () => {
  const context = useContext(BlogFormContext);
  if (!context) {
    throw new Error("useBlogForm must be used within a BlogFormProvider");
  }
  return context;
};

export const BlogFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<BlogFormState>({
    title: "",
    slug: "",
    summary: "",
    contentJSON: "",
    contentHTML: "",
    thumbnailUrl: "",
    bannerUrl: "",
    tags: "",
    isFeatured: false,
    categoryId: "",
    status: BlogStatus.DRAFT,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<BlogCategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const editorRef = useRef<BlogEditorRef>(null);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await blogCategoryService.getCategories({ size: 100, status: "ACTIVE" });
        if (res.data && res.data.content) {
          setCategories(res.data.content);
        }
      } catch (err) {
        //console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const updateContent = useCallback((json: string, html: string) => {
    setFormData((prev) => ({ ...prev, contentJSON: json, contentHTML: html }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";

    // Thumbnail validation (optional but good)
    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = "Invalid URL format";
    }
    if (formData.bannerUrl && !isValidUrl(formData.bannerUrl)) {
      newErrors.bannerUrl = "Invalid URL format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const triggerSave = () => {
    editorRef.current?.save();
  };

  const submitBlog = useCallback(
    async (content: EditorSaveResult) => {
      if (!validate()) {
        return;
      }

      setSubmitting(true);
      try {
        const blogData = {
          ...formData,
          contentJSON: content.lexicalJSON,
          contentHTML: content.html,
        };

        const payload = {
          title: blogData.title,
          slug: blogData.slug,
          summary: blogData.summary,
          contentJSON: content.lexicalJSON,
          contentHTML: content.html,
          thumbnailUrl: blogData.thumbnailUrl,
          bannerUrl: blogData.bannerUrl,
          isFeatured: blogData.isFeatured,
          status: blogData.status,
          tags: blogData.tags,
          blogCategoryId: blogData.categoryId,
        };

        const res = await blogService.createBlog(payload);
        if (res.success || res.data) {
          navigate("/admin/blog");
        } else {
          // Basic error handling
          //console.error(res.message);
        }
      } catch (error) {
        //console.error("Failed to submit blog", error);
      } finally {
        setSubmitting(false);
      }
    },
    [formData, validate, navigate],
  );

  return (
    <BlogFormContext.Provider
      value={{
        formData,
        errors,
        categories,
        loadingCategories,
        submitting,
        setFormData,
        setErrors,
        setSubmitting,
        validate,
        updateContent,
        editorRef,
        triggerSave,
        submitBlog,
      }}
    >
      {children}
    </BlogFormContext.Provider>
  );
};


