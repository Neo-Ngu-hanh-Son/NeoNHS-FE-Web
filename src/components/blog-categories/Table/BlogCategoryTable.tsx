import { message } from "antd";
import { Eye, Pencil, Trash2, Tags, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { BlogCategoryResponse } from "@/types/blog";
import { getInitials, formatShortDate } from "@/utils/helpers";
import BlogCategoryTableSkeleton from "./BlogCategoryTableSkeleton";

interface BlogCategoryTableProps {
  categories: BlogCategoryResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (category: BlogCategoryResponse) => void;
}

export function BlogCategoryTable({
  categories,
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
}: BlogCategoryTableProps) {
  const handleDelete = (category: BlogCategoryResponse) => {
    if (category.status === "ARCHIVED") {
      message.error("Category is already archived, please update the status to ACTIVE");
      return;
    }
    onDelete(category);
  };

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
        <Button size="sm" onClick={onRetry} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!loading && !error && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
          <Tags className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No blog categories found.</h3>
        <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return <BlogCategoryTableSkeleton />;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">Category Name</TableHead>
              <TableHead className="font-semibold text-gray-600">Slug</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[100px]">Status</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[120px] text-center">Posts</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[140px]">Created Date</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-primary/5">
                {/* Name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                      {getInitials(cat.name)}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                  </div>
                </TableCell>

                {/* Slug */}
                <TableCell>
                  <span className="text-sm font-medium text-gray-600">{cat.slug}</span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={cat.status === "ACTIVE" ? "default" : "secondary"}
                    className={
                      cat.status === "ACTIVE"
                        ? "bg-primary/15 text-primary hover:bg-primary/15 border-primary/20 rounded-full"
                        : "bg-secondary text-muted-foreground hover:bg-secondary border-border rounded-full"
                    }
                  >
                    {cat.status === "ACTIVE" ? "Active" : "Archived"}
                  </Badge>
                </TableCell>

                {/* Post count */}
                <TableCell className="text-center">
                  <span className="text-sm font-medium text-gray-600">{cat.postCount}</span>
                </TableCell>

                {/* Created date */}
                <TableCell>
                  <span className="text-sm text-gray-500">{formatShortDate(cat.createdAt)}</span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <TooltipProvider delayDuration={200}>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            id={`view-${cat.id}`}
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onView(cat.id)}
                            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View details</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            id={`edit-${cat.id}`}
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEdit(cat.id)}
                            className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit category</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            id={`delete-${cat.id}`}
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(cat)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete category</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
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
                className={i === currentPage ? "h-8 w-8 p-0 text-xs" : "h-8 w-8 p-0 text-xs"}
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
