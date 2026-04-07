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
    const header = 'Title,Category,Status,Views,Created Date\n';
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
        message.success(res.message || 'Blog permanently deleted');
        setPermanentDeleteTarget(null);
        refetch();
      } else {
        message.error(res.message || 'Failed to delete blog permanently');
      }
    } catch (err: unknown) {
      message.error(getApiErrorMessage(err, 'Failed to delete blog permanently'));
    } finally {
      setProcessing(false);
    }
  };

  const handleEmptyArchived = async () => {
    try {
      setProcessing(true);
      const res = await blogService.emptyAllDeletedBlogs();
      if (res.success) {
        message.success(res.message || 'All archived blogs emptied');
        setShowEmptyArchivedDialog(false);
        refetch();
      } else {
        message.error(res.message || 'Failed to empty archived blogs');
      }
    } catch (err: unknown) {
      message.error(getApiErrorMessage(err, 'Failed to empty archived blogs'));
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
            <AlertDialogTitle>Permanently Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The blog "{permanentDeleteTarget?.title}" will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Delete Permanently
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
            <AlertDialogTitle>Empty All Archived Blogs</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete every archived blog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyArchived}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Empty Archived
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
