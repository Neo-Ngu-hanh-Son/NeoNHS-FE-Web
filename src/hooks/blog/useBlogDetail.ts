import { useEffect, useState } from "react";
import { publicBlogService } from "@/services/api/publicBlogService";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import type { BlogResponse } from "@/types/blog";

interface UseBlogDetailReturn {
  blog: BlogResponse | null;
  loading: boolean;
  error: string | null;
  incrementBlogView: (id: string) => void;
}

export function useBlogDetail(id: string | undefined): UseBlogDetailReturn {
  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Blog ID is missing.");
      return;
    }

    let cancelled = false;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicBlogService.getBlogById(id);
        if (!cancelled) {
          if (res.data) {
            setBlog(res.data);
          } else {
            setError(res.message || "Blog not found.");
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Failed to load blog post."));
        }
        if (err.status === 403) {
          setError("You do not have permission to view this blog post.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchBlog();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const incrementBlogView = async (id: string) => {
    try {
      await publicBlogService.incrementBlogView(id);
    } catch (error) {
      //console.error("Failed to track view", error);
    }
  };

  return { blog, loading, error, incrementBlogView };
}
