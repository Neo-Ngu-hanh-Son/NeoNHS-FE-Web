/**
 * BlogTable
 * Data table for the admin blog list with loading, error, and empty states.
 * Uses shadcn/ui Table, Badge, Button, Tooltip, Skeleton + Lucide icons.
 */

import { Eye, Pencil, Trash2, FileText, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { BlogResponse, BlogStatus } from "@/types/blog";
import { truncateText, formatShortDate } from "@/utils/helpers";
import BlogTableSkeleton from "./BlogTableSkeleton";

interface BlogTableProps {
  blogs: BlogResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (blog: BlogResponse) => void;
  currentStatusFilter?: BlogStatus | "";
}

const STATUS_STYLES: Record<BlogStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 rounded-full",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-primary/15 text-primary hover:bg-primary/15 border-primary/20 rounded-full",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-secondary text-muted-foreground hover:bg-secondary border-border rounded-full",
  },
};

export function BlogTable({
  blogs,
  loading,
  error,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onRetry,
  onView,
  onEdit,
  onDelete,
  currentStatusFilter,
}: BlogTableProps) {
  const totalPages = Math.ceil(totalElements / pageSize);
  const rangeStart = currentPage * pageSize + 1;
  const rangeEnd = Math.min((currentPage + 1) * pageSize, totalElements);

  // Error state
  if (!loading && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-4">{error}</p>
        <Button
          size="sm"
          onClick={onRetry}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!loading && !error && blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
          <FileText className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No blogs found.</h3>
        <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return <BlogTableSkeleton />;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">Blog</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[120px]">Category</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[100px]">Status</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[80px] text-center">
                Views
              </TableHead>
              <TableHead className="font-semibold text-gray-600 w-[130px]">Created</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[120px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => {
              const statusStyle = STATUS_STYLES[blog.status] ?? STATUS_STYLES.DRAFT;
              return (
                <TableRow key={blog.id} className="hover:bg-primary/5">
                  {/* Blog title + thumbnail */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {blog.thumbnailUrl ? (
                        <img
                          src={blog.thumbnailUrl}
                          alt={blog.title}
                          className="h-10 w-16 rounded-md object-cover shrink-0 border bg-muted"
                        />
                      ) : (
                        <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-gray-800 truncate max-w-[280px]">
                            {blog.title}
                          </span>
                          {blog.isFeatured && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                        </div>
                        {blog.summary && (
                          <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {truncateText(blog.summary, 60)}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    {blog.blogCategory ? (
                      <Badge variant="outline" className="text-xs font-medium rounded-full">
                        {blog.blogCategory.name}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="default" className={statusStyle.className}>
                      {statusStyle.label}
                    </Badge>
                  </TableCell>

                  {/* Views */}
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-gray-600">{blog.viewCount}</span>
                  </TableCell>

                  {/* Created date */}
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {blog.createdAt ? formatShortDate(blog.createdAt) : "—"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <TooltipProvider delayDuration={200}>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => onView(blog.id)}
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View blog</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => onEdit(blog.id)}
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit blog</TooltipContent>
                        </Tooltip>

                        {blog.status !== "ARCHIVED" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onDelete(blog)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Archive blog</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalElements > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-500">
            Showing {rangeStart} to {rangeEnd} of {totalElements} results
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 px-3 text-xs"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={i === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(i)}
                className="h-8 w-8 p-0 text-xs"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 px-3 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
