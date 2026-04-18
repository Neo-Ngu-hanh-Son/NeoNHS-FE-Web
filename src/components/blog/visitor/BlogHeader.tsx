/**
 * BlogHeader
 * Displays blog title, author, published date, category, and read-time meta.
 */

import { Calendar, Clock, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatShortDate } from "@/utils/helpers";
import type { BlogResponse } from "@/types/blog";

/** Estimate reading time from HTML content (avg 200 wpm) */
function estimateReadTime(html: string | undefined): string {
  if (!html) return "1 phút đọc";
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} phút đọc`;
}

interface BlogHeaderProps {
  blog: BlogResponse;
}

export default function BlogHeader({ blog }: BlogHeaderProps) {
  const readTime = estimateReadTime(blog.contentHTML);
  const tags = blog.tags
    ? blog.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <header className="space-y-4">
      {/* Category */}
      {blog.blogCategory && (
        <Badge variant="secondary" className="rounded-full text-xs">
          {blog.blogCategory.name}
        </Badge>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">{blog.title}</h1>

      {/* Summary */}
      {blog.summary && (
        <p className="text-lg text-muted-foreground leading-relaxed">{blog.summary}</p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {/* Author */}
        <div className="flex items-center gap-1.5">
          {blog.user?.avatarUrl ? (
            <img
              src={blog.user.avatarUrl}
              alt={blog.user.fullname}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span>{blog.user?.fullname ?? "Chưa rõ"}</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Published date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{blog.publishedAt ? formatShortDate(blog.publishedAt) : "Chưa xuất bản"}</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Read time */}
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{readTime}</span>
        </div>

        {/* View count */}
        {blog.viewCount > 0 && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{blog.viewCount.toLocaleString()} lượt xem</span>
            </div>
          </>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </header>
  );
}
