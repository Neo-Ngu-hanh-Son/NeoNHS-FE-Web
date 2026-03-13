import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheckinPoints } from "@/hooks/checkinPoint/useAdminCheckinPoints";
import type { CheckinPointRequest, PointCheckinResponse } from "@/types/checkinPoint";
import CheckinPointFilters from "./components/CheckinPointFilters";
import CheckinPointFormDialog from "./components/CheckinPointFormDialog";
import CheckinPointTable from "./components/CheckinPointTable";

export default function AdminCheckinPointsPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [selectedParentPointId, setSelectedParentPointId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeCheckinPoint, setActiveCheckinPoint] = useState<PointCheckinResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PointCheckinResponse | null>(null);

  const filters = useMemo(
    () => ({
      page,
      size,
      sortBy: "createdAt",
      sortDir,
      search,
      includeDeleted,
    }),
    [page, size, sortDir, search, includeDeleted],
  );

  const {
    checkinPoints,
    parentPoints,
    loading,
    parentPointsLoading,
    totalElements,
    createCheckinPoint,
    updateCheckinPoint,
    deleteCheckinPoint,
    getCheckinPointById,
  } = useAdminCheckinPoints(filters);

  const openCreate = () => {
    if (!selectedParentPointId) return;
    setModalMode("create");
    setActiveCheckinPoint(null);
    setModalOpen(true);
  };

  const openEdit = async (item: PointCheckinResponse) => {
    setModalMode("edit");

    const detail = await getCheckinPointById(item.id);
    setActiveCheckinPoint(detail || item);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: CheckinPointRequest) => {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        const created = await createCheckinPoint(payload);
        if (created) {
          setModalOpen(false);
        }
        return;
      }

      if (!activeCheckinPoint?.id) return;
      const updated = await updateCheckinPoint(activeCheckinPoint.id, payload);
      if (updated) {
        setModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const success = await deleteCheckinPoint(deleteTarget.id);
    if (success) {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Checkin Point Management</CardTitle>
          <CardDescription>
            Manage point check-in records. Select a parent point before creating a new checkin
            point.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <CheckinPointFilters
            search={search}
            onSearchChange={(value) => {
              setPage(0);
              setSearch(value);
            }}
            includeDeleted={includeDeleted}
            onIncludeDeletedChange={(value) => {
              setPage(0);
              setIncludeDeleted(value);
            }}
            sortDir={sortDir}
            onSortDirChange={(value) => {
              setPage(0);
              setSortDir(value);
            }}
            selectedParentPointId={selectedParentPointId}
            onSelectedParentPointIdChange={setSelectedParentPointId}
            parentPoints={parentPoints}
            parentPointsLoading={parentPointsLoading}
            onCreate={openCreate}
            createDisabled={!selectedParentPointId}
          />

          <CheckinPointTable
            loading={loading}
            data={checkinPoints}
            parentPoints={parentPoints}
            currentPage={page}
            pageSize={size}
            totalElements={totalElements}
            onPageChange={setPage}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </CardContent>
      </Card>

      <CheckinPointFormDialog
        open={modalOpen}
        mode={modalMode}
        initialData={activeCheckinPoint}
        parentPoints={parentPoints}
        defaultParentPointId={selectedParentPointId}
        loading={submitting}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Soft Delete Checkin Point</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete "{deleteTarget?.name}". The record can still be listed when
              include deleted is enabled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Soft Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
