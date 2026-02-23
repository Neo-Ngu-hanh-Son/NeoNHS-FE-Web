import { useNavigate } from "react-router-dom";
import { useBlogs } from "@/hooks/blog/useBlogs";
import { BlogToolbar } from "@/components/blog/BlogToolbar";
import { BlogTable } from "@/components/blog/Table/BlogTable";
import { BlogDeleteDialog } from "@/components/blog/BlogDeleteDialog";
import { formatShortDate, exportToCsv } from "@/utils/helpers";

export default function ManageBlogPage() {
  const navigate = useNavigate();
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
    const header = "Title,Category,Status,Views,Created Date\n";
    const rows = blogs.map(
      (b) =>
        `"${b.title}","${b.blogCategory?.name ?? ""}","${b.status}",${b.viewCount},"${b.createdAt ? formatShortDate(b.createdAt) : ""}"`,
    );
    exportToCsv("blogs.csv", header, rows);
  };

  const handleDeleteSuccess = () => {
    closeDeleteDialog();
    refetch();
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 bg-card rounded-2xl shadow-lg border border-border overflow-hidden px-6 py-4">
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
        currentStatusFilter={statusFilter}
      />

      <BlogDeleteDialog
        blog={deleteTarget}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
