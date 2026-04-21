import { useAdminDestinations } from './hooks/useAdminDestinations';
import { DestinationMap } from './components/DestinationMap';
import { PointFormModal } from './components/PointFormModal';
import { PointManagement } from './components/PointManagement';
import { GoogleMapPickerModal } from './components/GoogleMapPickerModal';
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
import { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';

export default function AdminDestinationsPage() {
  const {
    filteredDestinations,
    allPoints,
    pointsLoading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPoints,
    mapCenter,
    mapZoom,
    uploading,
    currentPointDestination,
    setCurrentPointDestination,
    editingPoint,
    setEditingPoint,
    isPointModalVisible,
    setIsPointModalVisible,
    isMapPickerVisible,
    setIsMapPickerVisible,
    isDiscoveryModalVisible,
    setIsDiscoveryModalVisible,
    setMapPickerTarget,
    pickerCoord,
    setPickerCoord,
    previewPos,
    setPreviewPos,
    handleFileUpload,
    handleFocus,
    handleSavePoint,
    handleDeletePoint,
    handleRestorePoint,
    handleImportPoints,
    handleSelectDiscovery,
    isSaving,
  } = useAdminDestinations();

  const mapSectionRef = useRef<HTMLDivElement>(null);

  const handleFocusWithScroll = (lat: number, lng: number) => {
    handleFocus(lat, lng);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'point' } | null>(null);

  const onConfirmCoord = (geocodedData?: {
    name?: string;
    address?: string;
    googlePlaceId?: string;
    photoUrl?: string;
  }) => {
    setPreviewPos(pickerCoord);

    if (geocodedData) {
      setEditingPoint(
        (prev) =>
          ({
            ...(prev || {
              name: '',
              description: '',
              orderIndex: allPoints.length + 1,
              type: 'GENERAL',
              attractionId: currentPointDestination?.id || '',
            }),
            latitude: pickerCoord[0],
            longitude: pickerCoord[1],
            name: geocodedData.name || prev?.name || '',
            description: geocodedData.address || prev?.description || '',
            googlePlaceId: geocodedData.googlePlaceId || prev?.googlePlaceId || '',
            thumbnailUrl: geocodedData.photoUrl || prev?.thumbnailUrl || '',
          }) as any,
      );
    }

    setIsMapPickerVisible(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    handleDeletePoint(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-transparent">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Quản lý điểm đến</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Bản đồ và các điểm quan tâm (POI) gắn với điểm đến trên hệ thống
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/20">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span>Xem và chỉnh sửa trực tiếp trên bản đồ</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 lg:sticky lg:top-6 lg:self-start" ref={mapSectionRef}>
          <div className="relative h-[min(640px,75vh)] w-full overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
            <DestinationMap
              destinations={filteredDestinations}
              allPoints={allPoints}
              currentPointDestination={currentPointDestination}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              previewPos={previewPos}
              onMapClick={(lat, lng) => {
                if (isPointModalVisible) {
                  const roundedLat = Number(lat.toFixed(6));
                  const roundedLng = Number(lng.toFixed(6));
                  setPickerCoord([roundedLat, roundedLng]);
                  setPreviewPos([roundedLat, roundedLng]);
                }
              }}
              onViewPoint={(p) => {
                setEditingPoint(p);
                setIsPointModalVisible(true);
              }}
              onPointClick={(lat, lng) => {
                handleFocus(lat, lng);
              }}
            />
            <div className="pointer-events-none absolute left-4 top-4 z-10">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/20">
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Phân bố trên bản đồ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="min-h-[min(640px,75vh)]">
            <PointManagement
              currentDestination={currentPointDestination}
              allPoints={allPoints}
              loading={pointsLoading}
              onAddPoint={() => {
                setEditingPoint(null);
                setPreviewPos(null);
                setIsDiscoveryModalVisible(true);
              }}
              onEditPoint={(point) => {
                setEditingPoint(point);
                setPreviewPos(null);
                setIsPointModalVisible(true);
              }}
              onDeletePoint={(id) => setDeleteTarget({ id, type: 'point' })}
              onFocus={handleFocusWithScroll}
              onImportPoints={handleImportPoints}
              pagination={{
                currentPage,
                pageSize,
                totalElements: totalPoints,
                onPageChange: setCurrentPage,
                onPageSizeChange: setPageSize,
              }}
              searchText={searchText}
              onSearchChange={setSearchText}
              destinations={filteredDestinations}
              onDestinationChange={setCurrentPointDestination}
            />
          </div>
        </div>
      </div>

      <PointFormModal
        open={isPointModalVisible}
        onOpenChange={setIsPointModalVisible}
        editingPoint={editingPoint}
        destinations={filteredDestinations}
        initialDestinationId={currentPointDestination?.id}
        onSave={handleSavePoint}
        onOpenMapPicker={() => {
          setMapPickerTarget('point');
          setPickerCoord(
            editingPoint
              ? [editingPoint.latitude, editingPoint.longitude]
              : currentPointDestination
                ? [currentPointDestination.latitude, currentPointDestination.longitude]
                : mapCenter,
          );
          setIsMapPickerVisible(true);
        }}
        previewPos={previewPos}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        isSaving={isSaving}
      />

      <GoogleMapPickerModal
        open={isMapPickerVisible || isDiscoveryModalVisible}
        onOpenChange={(open) => {
          setIsMapPickerVisible(open);
          setIsDiscoveryModalVisible(open);
        }}
        initialCoord={isMapPickerVisible ? pickerCoord : undefined}
        onSelect={(result) => {
          if (isMapPickerVisible) {
            onConfirmCoord({
              name: result.name,
              address: result.address,
              googlePlaceId: result.googlePlaceId,
              photoUrl: result.photoUrl,
            });
          } else {
            handleSelectDiscovery(result);
          }
        }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl border border-slate-200 bg-card shadow-sm dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Xác nhận xóa điểm
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Thao tác này sẽ <span className="font-semibold text-destructive">xóa vĩnh viễn</span> điểm khỏi cơ sở dữ
              liệu. Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="transition-colors">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
