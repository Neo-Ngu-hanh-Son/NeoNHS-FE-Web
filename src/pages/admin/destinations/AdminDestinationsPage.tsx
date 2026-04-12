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
        // State
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

        // Actions
        fetchPoints,
        handleFileUpload,
        handleFocus,
        handleSavePoint,
        handleDeletePoint,
        handleRestorePoint,
        handleImportPoints,
        handleSelectDiscovery,
    } = useAdminDestinations();

    const mapSectionRef = useRef<HTMLDivElement>(null);

    const handleFocusWithScroll = (lat: number, lng: number) => {
        handleFocus(lat, lng);
        if (mapSectionRef.current) {
            mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Delete Confirmation State
    const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: 'point' } | null>(null);


    const onConfirmCoord = (geocodedData?: { name?: string; address?: string; googlePlaceId?: string; photoUrl?: string }) => {
        setPreviewPos(pickerCoord);

        if (geocodedData) {
            setEditingPoint(prev => ({
                ...(prev || {
                    name: '',
                    description: '',
                    orderIndex: allPoints.length + 1,
                    type: 'GENERAL',
                    attractionId: currentPointDestination?.id || ''
                }),
                latitude: pickerCoord[0],
                longitude: pickerCoord[1],
                // Only overwrite name/description if they are empty or if we explicitly want to (here we overwrite to be helpful)
                name: geocodedData.name || prev?.name || '',
                description: geocodedData.address || prev?.description || '',
                googlePlaceId: geocodedData.googlePlaceId || prev?.googlePlaceId || '',
                thumbnailUrl: geocodedData.photoUrl || prev?.thumbnailUrl || '',
            } as any));
        }

        setIsMapPickerVisible(false);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        handleDeletePoint(deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200/60 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
                            Point Management Hub
                        </h1>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                            Geo-Location & Global POI Control
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-8 max-w-[1800px] mx-auto">
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Operational Panel - Map Visualizer */}
                    <div className="col-span-12 xl:col-span-5 sticky top-6 self-start">
                        <div className="w-full h-[700px] shadow-2xl rounded-3xl border border-white/50 overflow-hidden relative group" ref={mapSectionRef}>
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
                            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-white/20 flex items-center gap-3">
                                    <div className="p-1.5 bg-primary/10 rounded-lg">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Live Spatial Distribution</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Table Panel */}
                    <div className="col-span-12 xl:col-span-7">
                        <div className="min-h-[700px]">
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
                                onRestorePoint={handleRestorePoint}
                                onFocus={handleFocusWithScroll}
                                onImportPoints={handleImportPoints}
                                onRefresh={() => fetchPoints()}
                                pagination={{
                                    currentPage,
                                    pageSize,
                                    totalElements: totalPoints,
                                    onPageChange: setCurrentPage,
                                    onPageSizeChange: setPageSize
                                }}
                                searchText={searchText}
                                onSearchChange={setSearchText}
                                destinations={filteredDestinations}
                                onDestinationChange={setCurrentPointDestination}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals Orchestration */}
            <PointFormModal
                open={isPointModalVisible}
                onOpenChange={setIsPointModalVisible}
                editingPoint={editingPoint}
                destinations={filteredDestinations}
                initialDestinationId={currentPointDestination?.id}
                onSave={handleSavePoint}
                onOpenMapPicker={() => {
                    setMapPickerTarget('point');
                    setPickerCoord(editingPoint ? [editingPoint.latitude, editingPoint.longitude] : (currentPointDestination ? [currentPointDestination.latitude, currentPointDestination.longitude] : mapCenter));
                    setIsMapPickerVisible(true);
                }}
                previewPos={previewPos}
                onFileUpload={handleFileUpload}
                uploading={uploading}
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
                            photoUrl: result.photoUrl
                        });
                    } else {
                        handleSelectDiscovery(result);
                    }
                }}
            />

            {/* Verification Dialogs */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl overflow-hidden">
                    <AlertDialogHeader className="p-2 pt-4">
                        <AlertDialogTitle className="text-2xl font-bold text-slate-800">Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-medium text-base">
                            Are you sure you want to hide this destination from the public?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="p-4 bg-slate-50/50 flex gap-3">
                        <AlertDialogCancel className="rounded-xl border-slate-200 font-bold hover:bg-white">Abort Operation</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold shadow-lg shadow-destructive/20 px-8">
                            Confirm Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
