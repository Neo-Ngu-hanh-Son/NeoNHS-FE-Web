import TagModal from "@/components/tags/TagModal";
import TagTable from "@/components/tags/TagTable";
import TagToolbar from "@/components/tags/TagToolbar";
import { useAdminTags } from "@/hooks/tag/useAdminTags";

export function EventTagPage() {
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
  } = useAdminTags({ kind: "event" });

  return (
    <div
      className="mx-auto max-w-[1100px] space-y-5 bg-card rounded-2xl shadow-lg border border-border
    overflow-hidden px-6 py-4"
    >
      <TagToolbar
        title="Nhãn sự kiện"
        sortIndex={sortIndex}
        onSortChange={setSortIndex}
        onAdd={() => openModal("create")}
      />

      <TagTable
        kind="event"
        tags={tags}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={goToPage}
        onRetry={retryFetch}
        onEdit={(tag) => openModal("edit", tag)}
        onDelete={(tag) => openModal("delete", tag)}
        onRestore={(tag) => openModal("restore", tag)}
      />

      <TagModal
        kind="event"
        mode={modalMode}
        tag={modalTag}
        onCancel={closeModal}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

export default EventTagPage;
