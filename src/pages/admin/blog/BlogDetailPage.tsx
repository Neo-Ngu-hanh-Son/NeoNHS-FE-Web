/**
 * BlogDetailPage
 * Shows a read-only view of a single blog post for admin.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { ArrowLeft, Pencil, Calendar, Eye, Star, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { blogService } from "@/services/api/blogService";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { formatShortDate } from "@/utils/helpers";
import type { BlogResponse, BlogStatus } from "@/types/blog";

const STATUS_CONFIG: Record<BlogStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-primary/15 text-primary border-primary/20",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-secondary text-muted-foreground border-border",
  },
};

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await blogService.getBlogById(id);
        if (res.data) {
          setBlog(res.data);
        } else {
          message.error(res.message || "Blog not found");
          navigate("/admin/blog");
        }
      } catch (err: unknown) {
        message.error(getApiErrorMessage(err, "Failed to load blog"));
        navigate("/admin/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!blog) return null;

  const statusCfg = STATUS_CONFIG[blog.status];
  const tags = blog.tags
    ? blog.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/blog")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{blog.title}</h1>
            <p className="text-sm text-muted-foreground">{blog.slug}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/admin/blog/${blog.id}/edit`)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Blog
        </Button>
      </div>

      {/* Meta info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Views</p>
              <p className="text-lg font-bold">{blog.viewCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Badge variant="secondary" className={`${statusCfg.className} rounded-full px-3 py-1`}>
              {statusCfg.label}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {blog.createdAt ? formatShortDate(blog.createdAt) : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Author</p>
              <p className="text-sm font-medium">{blog.user?.fullname ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          {blog.bannerUrl && (
            <Card className="overflow-hidden">
              <img
                src={blog.bannerUrl}
                alt="Banner"
                className="w-full aspect-[21/9] object-cover"
              />
            </Card>
          )}

          {/* Summary */}
          {blog.summary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{blog.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent>
              {blog.contentHTML ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.contentHTML }}
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">No content available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category</CardTitle>
            </CardHeader>
            <CardContent>
              {blog.blogCategory ? (
                <Badge variant="outline" className="rounded-full">
                  {blog.blogCategory.name}
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">No category</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Featured */}
          {blog.isFeatured && (
            <Card>
              <CardContent className="p-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">Featured Post</span>
              </CardContent>
            </Card>
          )}

          {/* Published date */}
          {blog.publishedAt && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{formatShortDate(blog.publishedAt)}</p>
              </CardContent>
            </Card>
          )}

          {/* Thumbnail */}
          {blog.thumbnailUrl && (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={blog.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full rounded-md aspect-video object-cover"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
