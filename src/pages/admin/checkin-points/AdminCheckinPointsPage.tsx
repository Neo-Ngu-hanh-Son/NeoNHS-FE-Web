import { useMemo, useState } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminCheckinPoints } from '@/hooks/checkinPoint/useAdminCheckinPoints';
import type { CheckinPointRequest, PointCheckinResponse } from '@/types/checkinPoint';
import CheckinPointFilters from './components/CheckinPointFilters';
import CheckinPointFormDialog from './components/CheckinPointFormDialog';
import CheckinPointTable from './components/CheckinPointTable';
import { message } from 'antd';

export default function AdminCheckinPointsPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [selectedParentPointId, setSelectedParentPointId] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeCheckinPoint, setActiveCheckinPoint] = useState<PointCheckinResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PointCheckinResponse | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const filters = useMemo(
    () => ({
      page,
      size,
      sortBy: 'createdAt',
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
    restoreCheckinPoint,
  } = useAdminCheckinPoints(filters);

  const openCreate = () => {
    if (!selectedParentPointId) return;
    setModalMode('create');
    setActiveCheckinPoint(null);
    setModalOpen(true);
  };

  const openEdit = async (item: PointCheckinResponse) => {
    setModalMode('edit');

    const detail = await getCheckinPointById(item.id);
    setActiveCheckinPoint(detail || item);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: CheckinPointRequest) => {
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
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

  const handleRestoreCheckinPoint = async (id: string) => {
    messageApi.loading('Đang khôi phục điểm check-in...');
    const success = await restoreCheckinPoint(id);
    if (success) {
      // Handle successful restore (e.g., refresh the list)
      messageApi.success('Đã khôi phục điểm check-in thành công.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:p-8 space-y-4">
      {contextHolder}

      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-white/5 dark:to-transparent p-6 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Quản lý điểm Check-in
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Quản lý các điểm để người dùng check-in. Vui lòng chọn một địa điểm chính trước khi tạo mới điểm check-in.
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
        <CardContent className="space-y-6 pt-6">
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
            onRestore={handleRestoreCheckinPoint}
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
        <AlertDialogContent className="bg-white dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Xóa điểm Check-in
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Bạn sắp xóa mềm điểm "{deleteTarget?.name}". Dữ liệu này vẫn có thể tìm thấy khi bật bộ lọc bao gồm các mục đã xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 transition-colors"
            >
              Xóa (Soft Delete)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
