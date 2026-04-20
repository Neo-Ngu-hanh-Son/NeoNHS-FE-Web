/**
 * BlogDeleteDialog
 * Confirmation dialog for deleting a blog post.
 * Uses shadcn/ui AlertDialog + antd message for notifications.
 */

import { useState } from "react";
import { message } from "antd";
import { TriangleAlert, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { blogService } from "@/services/api/blogService";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { truncateText } from "@/utils/helpers";
import type { BlogResponse, BlogStatus } from "@/types/blog";

function blogStatusLabelVi(status: BlogStatus | string): string {
  switch (status) {
    case "DRAFT":
      return "Bản nháp";
    case "PUBLISHED":
      return "Công khai";
    case "ARCHIVED":
      return "Lưu trữ";
    default:
      return status;
  }
}

interface BlogDeleteDialogProps {
  blog: BlogResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BlogDeleteDialog({ blog, onClose, onSuccess }: BlogDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const isOpen = blog !== null;

  const handleDelete = async () => {
    if (!blog) return;
    try {
      setDeleting(true);
      const res = await blogService.deleteBlog(blog.id);
      if (res.success) {
        message.success(res.message || "Đã lưu trữ bài viết thành công");
        onSuccess();
      } else {
        message.error(res.message || "Không thể lưu trữ bài viết");
      }
    } catch (err: unknown) {
      message.error(getApiErrorMessage(err, "Failed to archive blog"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center pt-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <TriangleAlert className="h-7 w-7 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">Lưu trữ bài viết</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
              Bạn có chắc muốn lưu trữ bài viết này không?
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {blog && (
          <div className="w-full flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/15">
            {blog.thumbnailUrl ? (
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="h-10 w-14 rounded-md object-cover shrink-0"
              />
            ) : (
              <div className="h-10 w-14 rounded-md bg-destructive/10 shrink-0" />
            )}
            <div className="text-left min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {truncateText(blog.title, 40)}
              </p>
              <p className="text-xs text-muted-foreground">
                {blog.blogCategory?.name ?? "Chưa có danh mục"} · {blogStatusLabelVi(blog.status)}
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-destructive text-center">
          Bạn có thể khôi phục bài đã lưu trữ từ trang quản trị.
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Đang lưu trữ...
              </>
            ) : (
              "Lưu trữ"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
