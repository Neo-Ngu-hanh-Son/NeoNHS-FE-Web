import { useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import { attractionService } from '@/services/api/attractionService';
import { adminPointService } from '@/services/api/pointService';
import { uploadImageToBackend, uploadVideoToBackend } from '@/utils/cloudinary';
import { PointRequest } from '@/types/point';
import { Destination, Point, MapPickerTarget } from '../types';

export function useAdminDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPoints, setTotalPoints] = useState(0);

  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0028, 108.2638]);
  const [mapZoom, setMapZoom] = useState(15);

  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  // Selection state
  const [currentPointDestination, setCurrentPointDestination] = useState<Destination | null>(null);
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);
  const [viewingPoint, setViewingPoint] = useState<Point | null>(null);

  // Modal visibility
  const [isPointModalVisible, setIsPointModalVisible] = useState(false);
  const [isPointDetailVisible, setIsPointDetailVisible] = useState(false);
  const [isMapPickerVisible, setIsMapPickerVisible] = useState(false);
  const [isDiscoveryModalVisible, setIsDiscoveryModalVisible] = useState(false);

  // Map Picker Specific
  const [mapPickerTarget, setMapPickerTarget] = useState<MapPickerTarget | null>(null);
  const [pickerCoord, setPickerCoord] = useState<[number, number]>([16.0028, 108.2638]);
  const [previewPos, setPreviewPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!isPointModalVisible) {
      setPreviewPos(null);
    }
  }, [isPointModalVisible]);

  const fetchAttractions = useCallback(async () => {
    try {
      const response = await attractionService.getAllAttractions();
      if (response.success) {
        setDestinations(response.data as Destination[]);
      }
    } catch (error: any) {
      console.error('Failed to fetch attractions:', error);
    }
  }, []);

  const fetchPoints = useCallback(
    async (page = currentPage, size = pageSize, search = searchText, destinationId = currentPointDestination?.id) => {
      setPointsLoading(true);
      try {
        let response;
        if (destinationId && destinationId !== 'all') {
          response = await adminPointService.getPointsWithPaginationAdmin(destinationId, {
            page,
            size,
            search,
            sortBy: 'createdAt',
            sortDir: 'desc',
          });
        } else {
          response = await adminPointService.getAllPointsWithPaginationAdmin({
            page,
            size,
            search,
            sortBy: 'createdAt',
            sortDir: 'desc',
          });
        }

        if (response.success) {
          const content = response.data.content || [];
          // Map destination names from our destinations list
          const enrichedPoints = content.map((p: any) => {
            const dest = destinations.find((d) => d.id === (p.attractionId || p.attraction?.id));
            return {
              ...p,
              destinationName: dest ? dest.name : p.attraction?.name || 'Unassigned',
            };
          });
          setPoints(enrichedPoints);
          setTotalPoints(response.data.totalElements || 0);
        }
      } catch (error: any) {
        message.error('Failed to fetch points: ' + error.message);
      } finally {
        setPointsLoading(false);
      }
    },
    [currentPage, pageSize, searchText, currentPointDestination, destinations],
  );

  useEffect(() => {
    fetchAttractions();
  }, [fetchAttractions]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // Reset page when search or destination changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchText, currentPointDestination]);

  const handleFileUpload = async (
    file: File,
    field: string,
    type: 'image' | 'video',
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const url =
        type === 'image'
          ? await uploadImageToBackend(file)
          : await uploadVideoToBackend(file).then((url) => ({ mediaUrl: url })); // Normalize video response to match image response structure
      if (url) {
        setFieldValue(field, url.mediaUrl ?? '');
        message.success('File uploaded successfully!');
      } else {
        message.error('File upload failed.');
      }
    } catch (error) {
      message.error('File upload error.');
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleFocus = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(18);
  };

  const handleSavePoint = async (values: PointRequest) => {
    setPointsLoading(true);
    setIsSaving(true);
    console.log('--- ATTEMPTING TO SAVE POINT ---');
    console.log('Payload:', values);

    try {
      const sanitizedValues = {
        ...values,
        latitude: Number(values.latitude.toFixed(6)),
        longitude: Number(values.longitude.toFixed(6)),
      };

      let response;
      if (editingPoint && editingPoint.id) {
        console.log('Action: Update - ID:', editingPoint.id);
        response = await adminPointService.updatePoint(editingPoint.id, sanitizedValues);
      } else {
        console.log('Action: Create');
        response = await adminPointService.createPoint(sanitizedValues);
      }

      console.log('Response Status:', response.success);
      console.log('Full Response Data:', response);

      if (response.success) {
        message.success(editingPoint ? 'Point updated successfully' : 'Point added successfully');
        fetchPoints();
        setIsPointModalVisible(false);
        setPreviewPos(null);
      } else {
        // This shouldn't normally happen if errors are caught, but just in case
        message.error('Save failed: ' + (response.message || 'Unknown server error'));
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      if (errorMsg && errorMsg.toLowerCase().includes('already exists')) {
        message.warning('Địa điểm này đã tồn tại trong hệ thống!');
      } else {
        console.error('--- SAVE POINT FAILED ---');
        console.error('Error Object:', error);
        if (error.response) {
          console.error('Server Response Error:', error.response.data);
          console.error('Status Code:', error.response.status);
        }
        message.error('Failed to save point: ' + errorMsg);
      }
    } finally {
      console.log('--- SAVE OPERATION COMPLETE ---');
      setPointsLoading(false);
      setIsSaving(false);
    }
  };

  const handleDeletePoint = async (pointId: string) => {
    try {
      const response = await adminPointService.deletePoint(pointId);
      if (response.success) {
        message.success('Point deleted successfully');
        fetchPoints();
      }
    } catch (error: any) {
      message.error('Failed to delete point: ' + error.message);
    }
  };

  const handleRestorePoint = async (pointId: string) => {
    try {
      const response = await adminPointService.restorePoint(pointId);
      if (response.success) {
        message.success('Point restored successfully');
        fetchPoints();
      }
    } catch (error: any) {
      message.error('Failed to restore point: ' + error.message);
    }
  };

  const handleImportPoints = async (file: File) => {
    if (!currentPointDestination) {
      message.warning('Please select a destination to import points into.');
      return;
    }
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
              // history: row.history || row.History || '',
              latitude: Number(Number(row.latitude || row.Latitude).toFixed(6)),
              longitude: Number(Number(row.longitude || row.Longitude).toFixed(6)),
              orderIndex: Number(row.orderIndex || row.OrderIndex || row.order || 1),
              estTimeSpent: Number(row.estTimeSpent || row.EstTimeSpent || 30),
              type: row.type || row.Type || 'GENERAL',
              attractionId: currentPointDestination.id,
            };

            if (!pointData.name || isNaN(pointData.latitude) || isNaN(pointData.longitude)) {
              failCount++;
              continue;
            }

            const response = await adminPointService.createPoint(pointData);
            if (response.success) successCount++;
            else failCount++;
          } catch {
            failCount++;
          }
        }

        message.success(`Import completed: ${successCount} successful, ${failCount} failed.`);
        fetchPoints();
      } catch (error) {
        message.error('Failed to parse Excel file.');
      } finally {
        setPointsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredDestinations = useMemo(
    () =>
      destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (d.description && d.description.toLowerCase().includes(searchText.toLowerCase())) ||
          (d.address && d.address.toLowerCase().includes(searchText.toLowerCase())),
      ),
    [destinations, searchText],
  );

  const handleSelectDiscovery = (place: any) => {
    const lat = Number(place.latitude.toFixed(6));
    const lng = Number(place.longitude.toFixed(6));

    setEditingPoint({
      name: place.name,
      description: place.address,
      latitude: lat,
      longitude: lng,
      googlePlaceId: place.googlePlaceId,
      thumbnailUrl: place.photoUrl || '',
      attractionId: currentPointDestination?.id || '',
    } as Point);

    setPreviewPos([lat, lng]);
    setMapCenter([lat, lng]);
    setMapZoom(17);

    setIsDiscoveryModalVisible(false);
    setIsPointModalVisible(true);
  };

  return {
    // State
    destinations,
    filteredDestinations,
    allPoints: points,
    pointsLoading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPoints,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    uploading,
    currentPointDestination,
    setCurrentPointDestination,
    editingPoint,
    setEditingPoint,
    viewingPoint,
    setViewingPoint,
    isPointModalVisible,
    setIsPointModalVisible,
    isPointDetailVisible,
    setIsPointDetailVisible,
    isMapPickerVisible,
    setIsMapPickerVisible,
    isDiscoveryModalVisible,
    setIsDiscoveryModalVisible,
    mapPickerTarget,
    setMapPickerTarget,
    pickerCoord,
    setPickerCoord,
    previewPos,
    setPreviewPos,
    isSaving,

    // Actions
    fetchAttractions,
    fetchPoints,
    handleFileUpload,
    handleFocus,
    handleSavePoint,
    handleDeletePoint,
    handleRestorePoint,
    handleImportPoints,
    handleSelectDiscovery,
  };
}
