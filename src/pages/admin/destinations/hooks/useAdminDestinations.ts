import { useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
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
    setIsSaving(true);
    try {
      const sanitizedValues = {
        ...values,
        latitude: Number(values.latitude.toFixed(6)),
        longitude: Number(values.longitude.toFixed(6)),
      };

      let response;
      if (editingPoint && editingPoint.id) {
        response = await adminPointService.updatePoint(editingPoint.id, sanitizedValues);
      } else {
        response = await adminPointService.createPoint(sanitizedValues);
      }

      if (response.success) {
        message.success(editingPoint ? 'Point updated successfully' : 'Point added successfully');
        fetchPoints();
        setIsPointModalVisible(false);
        setPreviewPos(null);
      } else {
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

  const handleHardDeletePoint = async (pointId: string) => {
    try {
      const response = await adminPointService.hardDeletePoint(pointId);
      if (response.success) {
        message.success('Point permanently deleted');
        fetchPoints();
      }
    } catch (error: any) {
      message.error('Failed to permanently delete point: ' + error.message);
    }
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
    handleHardDeletePoint,
    handleSelectDiscovery,
  };
}
