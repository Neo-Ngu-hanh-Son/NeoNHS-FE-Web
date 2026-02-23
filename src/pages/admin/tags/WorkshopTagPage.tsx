import TagModal from '@/components/tags/TagModal';
import TagTable from '@/components/tags/TagTable';
import TagToolbar from '@/components/tags/TagToolbar';
import { useAdminTags } from '@/hooks/tag/useAdminTags';

export function WorkshopTagPage() {
  const {
    tags,
    loading,
    error,
    currentPage,
    totalElements,
    pageSize,
    sortIndex,
    setSortIndex,
    goToPage,
    retryFetch,
    modalMode,
    modalTag,
    openModal,
    closeModal,
    handleModalSuccess,
  } = useAdminTags({ kind: 'workshop' });

  return (
    <div
      className="mx-auto max-w-[1100px] space-y-5 bg-card rounded-2xl shadow-lg border border-border
    overflow-hidden px-6 py-4"
    >
      <TagToolbar
        title="Workshop Tags"
        sortIndex={sortIndex}
        onSortChange={setSortIndex}
        onAdd={() => openModal('create')}
      />

      <TagTable
        kind="workshop"
        tags={tags}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={goToPage}
        onRetry={retryFetch}
        onEdit={(tag) => openModal('edit', tag)}
        onDelete={(tag) => openModal('delete', tag)}
      />

      <TagModal
        kind="workshop"
        mode={modalMode}
        tag={modalTag}
        onCancel={closeModal}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

export default WorkshopTagPage;
