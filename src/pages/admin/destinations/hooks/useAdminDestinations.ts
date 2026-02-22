import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import { attractionService } from '@/services/api/attractionService';
import { pointService } from '@/services/api/pointService';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '@/utils/cloudinary';
import { AttractionRequest } from '@/types/attraction';
import { PointRequest } from '@/types/point';
import { Destination, Point, MapPickerTarget } from '../types';

export function useAdminDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const [pointsLoading, setPointsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [mapCenter, setMapCenter] = useState<[number, number]>([16.0028, 108.2638]);
    const [mapZoom, setMapZoom] = useState(15);

    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

    // Selection state
    const [currentPointDestination, setCurrentPointDestination] = useState<Destination | null>(null);
    const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
    const [editingPoint, setEditingPoint] = useState<Point | null>(null);
    const [viewingDestination, setViewingDestination] = useState<Destination | null>(null);
    const [viewingPoint, setViewingPoint] = useState<Point | null>(null);

    // Modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPointModalVisible, setIsPointModalVisible] = useState(false);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [isPointDetailVisible, setIsPointDetailVisible] = useState(false);
    const [isMapPickerVisible, setIsMapPickerVisible] = useState(false);

    // Map Picker Specific
    const [mapPickerTarget, setMapPickerTarget] = useState<MapPickerTarget | null>(null);
    const [pickerCoord, setPickerCoord] = useState<[number, number]>([16.0028, 108.2638]);
    const [previewPos, setPreviewPos] = useState<[number, number] | null>(null);

    const fetchAttractions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await attractionService.getAllAttractions();
            if (response.success) {
                const attractionsData = response.data;
                const withPoints = await Promise.all(attractionsData.map(async (attr) => {
                    if (attr.points && attr.points.length > 0) return { ...attr, points: attr.points };
                    try {
                        const pointsResp = await pointService.getPointsByAttraction(attr.id);
                        return { ...attr, points: pointsResp.success ? pointsResp.data : [] };
                    } catch {
                        return { ...attr, points: [] };
                    }
                }));
                const sorted = withPoints.map(d => ({ ...d, points: d.points || [] }));
                setDestinations(sorted);

                // Refresh current selected destination if it exists
                if (currentPointDestination) {
                    const updated = sorted.find(d => d.id === currentPointDestination.id);
                    if (updated) setCurrentPointDestination(updated);
                }
            }
        } catch (error: any) {
            message.error('Failed to fetch attractions: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [currentPointDestination]);

    useEffect(() => {
        fetchAttractions();
    }, []);

    const handleFileUpload = async (file: File, field: string, type: 'image' | 'video', setFieldValue: (field: string, value: string) => void) => {
        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const url = type === 'image'
                ? await uploadImageToCloudinary(file)
                : await uploadVideoToCloudinary(file);

            if (url) {
                setFieldValue(field, url);
                message.success('File uploaded successfully!');
            } else {
                message.error('File upload failed.');
            }
        } catch (error) {
            message.error('File upload error.');
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleFocus = (lat: number, lng: number) => {
        setMapCenter([lat, lng]);
        setMapZoom(18);
    };

    const handleSaveDestination = async (values: AttractionRequest) => {
        setLoading(true);
        try {
            // Function to ensure time is in HH:mm format
            const sanitizeTime = (time?: string) => {
                if (!time) return time;
                return time.split(':').slice(0, 2).join(':');
            };

            // Round coordinates to 6 decimal places and sanitize time format
            const sanitizedValues = {
                ...values,
                latitude: Number(values.latitude.toFixed(6)),
                longitude: Number(values.longitude.toFixed(6)),
                openHour: sanitizeTime(values.openHour),
                closeHour: sanitizeTime(values.closeHour),
            };

            if (editingDestination) {
                const response = await attractionService.updateAttraction(editingDestination.id, sanitizedValues);
                if (response.success) message.success('Destination updated successfully');
            } else {
                const response = await attractionService.createAttraction(sanitizedValues);
                if (response.success) message.success('Destination added successfully');
            }
            await fetchAttractions();
            setIsModalVisible(false);
            setPreviewPos(null);
        } catch (error: any) {
            message.error('Failed to save destination: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDestination = async (id: string) => {
        try {
            const response = await attractionService.deleteAttraction(id);
            if (response.success) {
                message.success('Destination deleted successfully');
                await fetchAttractions();
                if (currentPointDestination?.id === id) {
                    setCurrentPointDestination(null);
                }
            }
        } catch (error: any) {
            message.error('Failed to delete destination: ' + error.message);
        }
    };

    const handleSavePoint = async (values: PointRequest) => {
        if (!currentPointDestination) return;
        setPointsLoading(true);
        try {
            // Round coordinates to 6 decimal places to avoid "invalid format" errors
            const sanitizedValues = {
                ...values,
                attractionId: currentPointDestination.id,
                latitude: Number(values.latitude.toFixed(6)),
                longitude: Number(values.longitude.toFixed(6)),
            };

            if (editingPoint) {
                const response = await pointService.updatePoint(editingPoint.id, sanitizedValues);
                if (response.success) message.success('Point updated successfully');
            } else {
                const response = await pointService.createPoint(sanitizedValues);
                if (response.success) message.success('Point added successfully');
            }
            await fetchAttractions();
            setIsPointModalVisible(false);
            setPreviewPos(null);
        } catch (error: any) {
            message.error('Failed to save point: ' + error.message);
        } finally {
            setPointsLoading(false);
        }
    };

    const handleDeletePoint = async (pointId: string) => {
        if (!currentPointDestination) return;
        try {
            const response = await pointService.deletePoint(pointId);
            if (response.success) {
                message.success('Point deleted successfully');
                await fetchAttractions();
            }
        } catch (error: any) {
            message.error('Failed to delete point: ' + error.message);
        }
    };

    const handleImportPoints = async (file: File) => {
        if (!currentPointDestination) return;
        setPointsLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                let successCount = 0;
                let failCount = 0;

                for (const row of jsonData as any[]) {
                    try {
                        const pointData: PointRequest = {
                            name: row.name || row.Name,
                            description: row.description || row.Description,
                            history: row.history || row.History || '',
                            latitude: Number(Number(row.latitude || row.Latitude).toFixed(6)),
                            longitude: Number(Number(row.longitude || row.Longitude).toFixed(6)),
                            orderIndex: Number(row.orderIndex || row.OrderIndex || row.order || 1),
                            estTimeSpent: Number(row.estTimeSpent || row.EstTimeSpent || 30),
                            type: (row.type || row.Type || 'GENERAL'),
                            attractionId: currentPointDestination.id
                        };

                        if (!pointData.name || isNaN(pointData.latitude) || isNaN(pointData.longitude)) {
                            failCount++;
                            continue;
                        }

                        const response = await pointService.createPoint(pointData);
                        if (response.success) successCount++;
                        else failCount++;
                    } catch {
                        failCount++;
                    }
                }

                message.success(`Import completed: ${successCount} successful, ${failCount} failed.`);
                await fetchAttractions();
            } catch (error) {
                message.error('Failed to parse Excel file.');
            } finally {
                setPointsLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImportDestinations = async (file: File) => {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                let successCount = 0;
                let failCount = 0;

                const sanitizeTime = (time?: string) => {
                    if (!time) return time;
                    return String(time).split(':').slice(0, 2).join(':');
                };

                for (const row of jsonData as any[]) {
                    try {
                        const destData: AttractionRequest = {
                            name: row.name || row.Name,
                            address: row.address || row.Address || '',
                            description: row.description || row.Description || '',
                            latitude: Number(Number(row.latitude || row.Latitude).toFixed(6)),
                            longitude: Number(Number(row.longitude || row.Longitude).toFixed(6)),
                            status: (row.status || row.Status || 'OPEN') as any,
                            openHour: sanitizeTime(row.openHour || row.OpenHour || '08:00'),
                            closeHour: sanitizeTime(row.closeHour || row.CloseHour || '17:00'),
                            isActive: true
                        };

                        if (!destData.name || isNaN(destData.latitude) || isNaN(destData.longitude)) {
                            failCount++;
                            continue;
                        }

                        const response = await attractionService.createAttraction(destData);
                        if (response.success) successCount++;
                        else failCount++;
                    } catch {
                        failCount++;
                    }
                }

                message.success(`Import completed: ${successCount} successful, ${failCount} failed.`);
                await fetchAttractions();
            } catch (error) {
                message.error('Failed to parse Excel file.');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const filteredDestinations = destinations.filter(d =>
        d.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchText.toLowerCase())) ||
        (d.address && d.address.toLowerCase().includes(searchText.toLowerCase()))
    );

    return {
        // State
        destinations,
        filteredDestinations,
        loading,
        pointsLoading,
        searchText,
        setSearchText,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
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
        mapPickerTarget,
        setMapPickerTarget,
        pickerCoord,
        setPickerCoord,
        previewPos,
        setPreviewPos,

        // Actions
        fetchAttractions,
        handleFileUpload,
        handleFocus,
        handleSaveDestination,
        handleDeleteDestination,
        handleSavePoint,
        handleDeletePoint,
        handleImportPoints,
        handleImportDestinations,
    };
}
