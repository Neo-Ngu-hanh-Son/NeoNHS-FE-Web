import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Loader2 } from 'lucide-react';
import { useBlogs } from '@/hooks/blog/useBlogs';
import { BlogToolbar } from '@/components/blog/BlogToolbar';
import { BlogTable } from '@/components/blog/Table/BlogTable';
import { BlogDeleteDialog } from '@/components/blog/BlogDeleteDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { blogService } from '@/services/api/blogService';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { formatShortDate, exportToCsv } from '@/utils/helpers';
import type { BlogResponse } from '@/types/blog';

export default function ManageBlogPage() {
  const navigate = useNavigate();
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<BlogResponse | null>(null);
  const [showEmptyArchivedDialog, setShowEmptyArchivedDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  const {
    blogs,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize,
    goToPage,
    applySearch,
    statusFilter,
    setStatusFilter,
    sortIndex,
    setSortIndex,
    deleteTarget,
    openDeleteDialog,
    closeDeleteDialog,
    refetch,
    retryLastSearch,
  } = useBlogs();

  const handleExport = () => {
    const header = 'Tiêu đề,Danh mục,Trạng thái,Lượt xem,Ngày tạo\n';
    const rows = blogs.map(
      (b) =>
        `"${b.title}","${b.blogCategory?.name ?? ''}","${b.status}",${b.viewCount},"${b.createdAt ? formatShortDate(b.createdAt) : ''}"`,
    );
    exportToCsv('blogs.csv', header, rows);
  };

  const handleDeleteSuccess = () => {
    closeDeleteDialog();
    refetch();
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget) return;

    try {
      setProcessing(true);
      const res = await blogService.deleteBlogHard(permanentDeleteTarget.id);
      if (res.success) {
        message.success(res.message || 'Đã xóa vĩnh viễn bài viết');
        setPermanentDeleteTarget(null);
        refetch();
      } else {
        message.error(res.message || 'Không thể xóa vĩnh viễn bài viết');
      }
    } catch (err: unknown) {
      message.error(getApiErrorMessage(err, 'Không thể xóa vĩnh viễn bài viết'));
    } finally {
      setProcessing(false);
    }
  };

  const handleEmptyArchived = async () => {
    try {
      setProcessing(true);
      const res = await blogService.emptyAllDeletedBlogs();
      if (res.success) {
        message.success(res.message || 'Đã xóa vĩnh viễn tất cả bài viết đã lưu trữ');
        setShowEmptyArchivedDialog(false);
        refetch();
      } else {
        message.error(res.message || 'Không thể xóa vĩnh viễn các bài viết đã lưu trữ');
      }
    } catch (err: unknown) {
      message.error(getApiErrorMessage(err, 'Không thể xóa vĩnh viễn các bài viết đã lưu trữ'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 bg-card rounded-md shadow-md overflow-hidden px-6 py-4">
      <BlogToolbar
        onSearchApply={applySearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortIndex={sortIndex}
        onSortChange={setSortIndex}
        onExport={handleExport}
        onSearch={applySearch}
      />

      <BlogTable
        blogs={blogs}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={goToPage}
        onRetry={retryLastSearch}
        onView={(id) => navigate(`/admin/blog/${id}`)}
        onEdit={(id) => navigate(`/admin/blog/${id}/edit`)}
        onDelete={openDeleteDialog}
        onDeletePermanently={(blog) => setPermanentDeleteTarget(blog)}
        onEmptyArchived={() => setShowEmptyArchivedDialog(true)}
        emptyingArchived={processing && showEmptyArchivedDialog}
        currentStatusFilter={statusFilter}
      />

      <BlogDeleteDialog blog={deleteTarget} onClose={closeDeleteDialog} onSuccess={handleDeleteSuccess} />

      <AlertDialog
        open={!!permanentDeleteTarget}
        onOpenChange={(open) => !open && !processing && setPermanentDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài viết "{permanentDeleteTarget?.title}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showEmptyArchivedDialog}
        onOpenChange={(open) => !open && !processing && setShowEmptyArchivedDialog(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn tất cả bài viết đã lưu trữ</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này sẽ xóa vĩnh viễn mọi bài viết đã lưu trữ. Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyArchived}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Xóa hết bài đã lưu trữ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
