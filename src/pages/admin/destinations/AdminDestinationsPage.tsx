import { useAdminDestinations } from './hooks/useAdminDestinations';
import { DestinationTable } from './components/DestinationTable';
import { DestinationMap } from './components/DestinationMap';
import { DestinationFormModal } from './components/DestinationFormModal';
import { PointFormModal } from './components/PointFormModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { PointDetailModal } from './components/PointDetailModal';
import { MapPickerModal } from './components/MapPickerModal';
import { PointManagement } from './components/PointManagement';
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

export default function AdminDestinationsPage() {
    const {
        // State
        filteredDestinations,
        loading,
        pointsLoading,
        searchText,
        setSearchText,
        mapCenter,
        mapZoom,
        uploading,
        currentPointDestination,
        setCurrentPointDestination,
        editingDestination,
        setEditingDestination,
        editingPoint,
        setEditingPoint,
        viewingDestination,
        setViewingDestination,
        viewingPoint,
        setViewingPoint,
        isModalVisible,
        setIsModalVisible,
        isPointModalVisible,
        setIsPointModalVisible,
        isDetailVisible,
        setIsDetailVisible,
        isPointDetailVisible,
        setIsPointDetailVisible,
        isMapPickerVisible,
        setIsMapPickerVisible,
        setMapPickerTarget,
        pickerCoord,
        setPickerCoord,
        previewPos,
        setPreviewPos,

        // Actions
        handleFileUpload,
        handleFocus,
        handleSaveDestination,
        handleDeleteDestination,
        handleSavePoint,
        handleDeletePoint,
        handleImportPoints,
        handleImportDestinations,
    } = useAdminDestinations();

    const mapSectionRef = useRef<HTMLDivElement>(null);

    const handleFocusWithScroll = (lat: number, lng: number) => {
        handleFocus(lat, lng);
        if (mapSectionRef.current) {
            mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Delete Confirmation State
    const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: 'destination' | 'point' } | null>(null);

    const onMapClick = (lat: number, lng: number) => {
        setPickerCoord([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
    };

    const onConfirmCoord = () => {
        setPreviewPos(pickerCoord);
        setIsMapPickerVisible(false);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === 'destination') {
            handleDeleteDestination(deleteTarget.id);
        } else {
            handleDeletePoint(deleteTarget.id);
        }
        setDeleteTarget(null);
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6 bg-gray-50/50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: List */}
                <div className="lg:col-span-2 space-y-6">
                    <DestinationTable
                        destinations={filteredDestinations}
                        loading={loading}
                        searchText={searchText}
                        onSearchChange={setSearchText}
                        onAddDestination={() => {
                            setEditingDestination(null);
                            setPreviewPos(null);
                            setIsModalVisible(true);
                        }}
                        onEditDestination={(dest) => {
                            setEditingDestination(dest);
                            setPreviewPos(null);
                            setIsModalVisible(true);
                        }}
                        onDeleteDestination={(id) => setDeleteTarget({ id, type: 'destination' })}
                        onViewDetails={(dest) => {
                            setViewingDestination(dest);
                            setIsDetailVisible(true);
                        }}
                        onFocus={handleFocusWithScroll}
                        onManagePoints={setCurrentPointDestination}
                        onImportExcel={handleImportDestinations}
                    />
                </div>

                {/* Right Column: Map & POI */}
                <div className="space-y-6" ref={mapSectionRef}>
                    <DestinationMap
                        destinations={filteredDestinations}
                        currentPointDestination={currentPointDestination}
                        mapCenter={mapCenter}
                        mapZoom={mapZoom}
                        previewPos={previewPos}
                        onMapClick={(lat, lng) => {
                            if (isModalVisible || isPointModalVisible) {
                                const roundedLat = Number(lat.toFixed(6));
                                const roundedLng = Number(lng.toFixed(6));
                                setPickerCoord([roundedLat, roundedLng]);
                                setPreviewPos([roundedLat, roundedLng]);
                            }
                        }}
                        onViewDestination={(dest) => {
                            setViewingDestination(dest);
                            setIsDetailVisible(true);
                        }}
                        onViewPoint={(point) => {
                            setViewingPoint(point);
                            setIsPointDetailVisible(true);
                        }}
                    />

                    <PointManagement
                        currentDestination={currentPointDestination}
                        loading={pointsLoading}
                        onAddPoint={() => {
                            setEditingPoint(null);
                            setPreviewPos(null);
                            setIsPointModalVisible(true);
                        }}
                        onEditPoint={(point) => {
                            setEditingPoint(point);
                            setPreviewPos(null);
                            setIsPointModalVisible(true);
                        }}
                        onDeletePoint={(id) => setDeleteTarget({ id, type: 'point' })}
                        onFocus={handleFocusWithScroll}
                        onViewPoint={(point) => {
                            setViewingPoint(point);
                            setIsPointDetailVisible(true);
                        }}
                        onImportPoints={handleImportPoints}
                    />
                </div>
            </div>

            {/* Modals */}
            <DestinationFormModal
                open={isModalVisible}
                onOpenChange={setIsModalVisible}
                editingDestination={editingDestination}
                onSave={handleSaveDestination}
                onOpenMapPicker={() => {
                    setMapPickerTarget('destination');
                    setPickerCoord(editingDestination ? [editingDestination.latitude, editingDestination.longitude] : mapCenter);
                    setIsMapPickerVisible(true);
                }}
                previewPos={previewPos}
                onFileUpload={handleFileUpload}
                uploading={uploading}
            />

            <PointFormModal
                open={isPointModalVisible}
                onOpenChange={setIsPointModalVisible}
                editingPoint={editingPoint}
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

            <MapPickerModal
                open={isMapPickerVisible}
                onOpenChange={setIsMapPickerVisible}
                pickerCoord={pickerCoord}
                onMapClick={onMapClick}
                onConfirm={onConfirmCoord}
            />

            <DestinationDetailModal
                open={isDetailVisible}
                onOpenChange={setIsDetailVisible}
                destination={viewingDestination}
            />

            <PointDetailModal
                open={isPointDetailVisible}
                onOpenChange={setIsPointDetailVisible}
                point={viewingPoint}
            />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {deleteTarget?.type} from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
