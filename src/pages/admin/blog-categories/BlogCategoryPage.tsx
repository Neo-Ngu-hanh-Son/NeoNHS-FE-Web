import { useBlogCategories } from "@/hooks/useBlogCategories";
import { formatShortDate, exportToCsv } from "@/utils/helpers";
import { BlogCategoryToolbar, BlogCategoryTable } from "@/components";
import BlogCategoryModal from "@/components/blog-categories/BlogCategoryModal";

export function BlogCategoryPage() {
  const {
    categories,
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
    modalMode,
    modalCategory,
    openModal,
    closeModal,
    handleModalSuccess,
    retryLastSearch,
  } = useBlogCategories();

  const handleExport = () => {
    const header = "Category Name,Status,Number of Posts,Created Date\n";
    const rows = categories.map((c) => `"${c.name}","${c.status}",${c.postCount},"${formatShortDate(c.createdAt)}"`);
    exportToCsv("blog-categories.csv", header, rows);
  };

  return (
    <div
      className="mx-auto max-w-[1100px] space-y-5 bg-card rounded-2xl shadow-lg border border-border
    overflow-hidden px-6 py-4"
    >
      <BlogCategoryToolbar
        onSearchApply={applySearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortIndex={sortIndex}
        onSortChange={setSortIndex}
        onExport={handleExport}
        onAdd={() => openModal("create")}
      />

      <BlogCategoryTable
        categories={categories}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={goToPage}
        onRetry={retryLastSearch}
        onView={(id) => {
          const cat = categories.find((c) => c.id === id);
          if (cat) openModal("view", cat);
        }}
        onEdit={(id) => {
          const cat = categories.find((c) => c.id === id);
          if (cat) openModal("edit", cat);
        }}
        onDelete={(cat) => openModal("delete", cat)}
      />

      <BlogCategoryModal
        mode={modalMode}
        category={modalCategory}
        onCancel={closeModal}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

export default BlogCategoryPage;
