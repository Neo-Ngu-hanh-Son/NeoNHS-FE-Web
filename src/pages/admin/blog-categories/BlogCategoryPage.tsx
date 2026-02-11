/**
 * BlogCategoryList Page
 * Lean page component that composes the toolbar, table,
 * and delegates data logic to the useBlogCategories hook.
 */

import { useBlogCategories } from '@/hooks/useBlogCategories';
import { formatShortDate, exportToCsv } from '@/utils/helpers';
import { BlogCategoryToolbar, BlogCategoryTable } from '@/components';

export function BlogCategoryPage() {
  const {
    categories,
    loading,
    error,
    currentPage,
    totalElements,
    totalPages,
    pageSize,
    goToPage,
    searchQuery,
    setSearchQuery,
    applySearch,
    statusFilter,
    setStatusFilter,
    sortIndex,
    setSortIndex,
    refresh,
  } = useBlogCategories();

  const handleExport = () => {
    const header = 'Category Name,Status,Number of Posts,Created Date\n';
    const rows = categories.map(
      (c) =>
        `"${c.name}","${c.status}",${c.postCount},"${formatShortDate(c.createdAt)}"`
    );
    exportToCsv('blog-categories.csv', header, rows);
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 bg-white rounded-2xl shadow-lg border border-gray-100 
    overflow-hidden px-6 py-4">
      <BlogCategoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchApply={applySearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortIndex={sortIndex}
        onSortChange={setSortIndex}
        onRefresh={refresh}
        onExport={handleExport}
      />

      <BlogCategoryTable
        categories={categories}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={goToPage}
        onRetry={refresh}
      />
    </div>
  );
}

export default BlogCategoryPage;
