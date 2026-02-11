import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    Tag,
    Card,
    message,
    Divider,
    TimePicker,
    InputNumber,
    Select,
    Typography,
    Upload,
    Alert,
    Tooltip
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    EnvironmentOutlined,
    PushpinOutlined,
    ClockCircleOutlined,
    AudioOutlined,
    UploadOutlined,
    LoadingOutlined,
    EyeOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dayjs from 'dayjs';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '@/utils/cloudinary';
import { attractionService } from '@/services/api/attractionService';
import { pointService } from '@/services/api/pointService';
import { AttractionResponse, AttractionRequest } from '@/types/attraction';
import { PointRequest, PointResponse, PointType } from '@/types/point';

const { Text } = Typography;

const statusColors: { [key: string]: string } = {
    OPEN: 'blue',
    CLOSED: 'red',
    MAINTENANCE: 'orange',
    TEMPORARILY_CLOSED: 'volcano'
};

// Fix for leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Marker icon for preview/picking mode
let PreviewIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: 'preview-marker-hue'
});

// Marker icon for Points of Interest
let PointMarkerIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [22, 36],
    iconAnchor: [11, 36],
    className: 'point-marker-hue'
});

L.Marker.prototype.options.icon = DefaultIcon;

const { Search } = Input;
const { Option } = Select;

interface Point extends PointResponse { }
interface Destination extends AttractionResponse {
    points: Point[];
}

// Map Interaction Component
function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Map Fixer Component (resolves "quarter map" issue in modals)
function FixMapRendering() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map]);
    return null;
}

// Map Updater Component
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export function AdminDestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
    const [currentPointDestination, setCurrentPointDestination] = useState<Destination | null>(null);
    const [isPointModalVisible, setIsPointModalVisible] = useState(false);
    const [editingPoint, setEditingPoint] = useState<Point | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([16.0028, 108.2638]);
    const [mapZoom, setMapZoom] = useState(15);
    const [form] = Form.useForm();
    const [pointForm] = Form.useForm();
    const mapRef = useRef<HTMLDivElement>(null);

    const handleFocus = (lat: number, lng: number) => {
        setMapCenter([lat, lng]);
        setMapZoom(18); // Zoom in closer for detail
        if (mapRef.current) {
            mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [previewPos, setPreviewPos] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(false);
    const [pointsLoading, setPointsLoading] = useState(false);

    // Detail States
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [viewingDestination, setViewingDestination] = useState<Destination | null>(null);
    const [isPointDetailVisible, setIsPointDetailVisible] = useState(false);
    const [viewingPoint, setViewingPoint] = useState<Point | null>(null);

    // Map Picker States
    const [isMapPickerVisible, setIsMapPickerVisible] = useState(false);
    const [mapPickerTarget, setMapPickerTarget] = useState<'destination' | 'point' | null>(null);
    const [pickerCoord, setPickerCoord] = useState<[number, number]>([16.0028, 108.2638]);

    const fetchAttractions = async () => {
        setLoading(true);
        try {
            const response = await attractionService.getAllAttractions();
            if (response.success) {
                const attractionsData = response.data;
                // Set initial data
                setDestinations(attractionsData.map(d => ({ ...d, points: d.points || [] })));

                // Fetch points for each attraction to ensure accurate count in the table
                const withPoints = await Promise.all(attractionsData.map(async (attr) => {
                    // Optimization: if points are already there, don't re-fetch
                    if (attr.points && attr.points.length > 0) return { ...attr, points: attr.points };
                    try {
                        const pointsResp = await pointService.getPointsByAttraction(attr.id);
                        return { ...attr, points: pointsResp.success ? pointsResp.data : [] };
                    } catch {
                        return { ...attr, points: [] };
                    }
                }));
                setDestinations(withPoints);
            }
        } catch (error: any) {
            message.error('Failed to fetch attractions: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        setPickerCoord([lat, lng]);
    };

    const openMapPicker = (target: 'destination' | 'point') => {
        let current: [number, number] = [16.0028, 108.2638];
        if (target === 'destination') {
            const vals = form.getFieldsValue();
            if (vals.latitude && vals.longitude) current = [vals.latitude, vals.longitude];
        } else {
            const vals = pointForm.getFieldsValue();
            if (vals.latitude && vals.longitude) current = [vals.latitude, vals.longitude];
        }
        setPickerCoord(current);
        setMapPickerTarget(target);
        setIsMapPickerVisible(true);
    };

    const confirmMapPicker = () => {
        if (mapPickerTarget === 'destination') {
            form.setFieldsValue({ latitude: Number(pickerCoord[0].toFixed(6)), longitude: Number(pickerCoord[1].toFixed(6)) });
        } else if (mapPickerTarget === 'point') {
            pointForm.setFieldsValue({ latitude: Number(pickerCoord[0].toFixed(6)), longitude: Number(pickerCoord[1].toFixed(6)) });
        }
        setPreviewPos(pickerCoord);
        setIsMapPickerVisible(false);
        message.success('Coordinates updated');
    };

    // Data initialization
    useEffect(() => {
        fetchAttractions();
    }, []);

    const handleFileUpload = async (file: File, field: string, type: 'image' | 'video', targetForm: any) => {
        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const url = type === 'image'
                ? await uploadImageToCloudinary(file)
                : await uploadVideoToCloudinary(file);

            if (url) {
                targetForm.setFieldsValue({ [field]: url });
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

    const handleAddDestination = () => {
        setEditingDestination(null);
        form.resetFields();
        form.setFieldsValue({ isActive: true, status: 'OPEN' });
        setPreviewPos(null);
        setIsModalVisible(true);
    };

    const handleEditDestination = (record: Destination) => {
        setEditingDestination(record);
        setPreviewPos([record.latitude, record.longitude]);
        form.setFieldsValue({
            ...record,
            hours: record.openHour && record.closeHour ? [dayjs(record.openHour, 'HH:mm'), dayjs(record.closeHour, 'HH:mm')] : null
        });
        setIsModalVisible(true);
    };

    const handleDeleteDestination = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this destination?',
            onOk: async () => {
                try {
                    const response = await attractionService.deleteAttraction(id);
                    if (response.success) {
                        message.success('Destination deleted successfully');
                        fetchAttractions();
                        if (currentPointDestination?.id === id) {
                            setCurrentPointDestination(null);
                        }
                    }
                } catch (error: any) {
                    message.error('Failed to delete destination: ' + error.message);
                }
            }
        });
    };

    const handleSaveDestination = async (values: any) => {
        const { hours, ...rest } = values;
        const processedValues: AttractionRequest = {
            ...rest,
            openHour: hours ? hours[0].format('HH:mm') : null,
            closeHour: hours ? hours[1].format('HH:mm') : null,
            isActive: true // Defaulting to true for new/updated attractions as per user requirement (delete handles false)
        };

        setLoading(true);
        try {
            if (editingDestination) {
                const response = await attractionService.updateAttraction(editingDestination.id, processedValues);
                if (response.success) {
                    message.success('Destination updated successfully');
                }
            } else {
                const response = await attractionService.createAttraction(processedValues);
                if (response.success) {
                    message.success('Destination added successfully');
                }
            }
            fetchAttractions();
            setIsModalVisible(false);
            setPreviewPos(null);
        } catch (error: any) {
            message.error('Failed to save destination: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Point Handlers
    const handleManagePoints = async (record: Destination) => {
        setCurrentPointDestination(record);
        setPointsLoading(true);
        try {
            const response = await pointService.getPointsByAttraction(record.id);
            if (response.success) {
                const updatedRecord = {
                    ...record,
                    points: response.data
                };
                setCurrentPointDestination(updatedRecord);
                // Also update the main list so the table count is correct
                setDestinations(prev => prev.map(d => d.id === record.id ? updatedRecord : d));
            }
        } catch (error: any) {
            message.error('Failed to fetch points: ' + error.message);
        } finally {
            setPointsLoading(false);
        }
    };

    const handleAddPoint = () => {
        setEditingPoint(null);
        pointForm.resetFields();
        setPreviewPos(null);
        setIsPointModalVisible(true);
    };

    const handleEditPoint = (point: Point) => {
        setEditingPoint(point);
        setPreviewPos([point.latitude, point.longitude]);
        pointForm.setFieldsValue(point);
        setIsPointModalVisible(true);
    };

    const handleSavePoint = async (values: any) => {
        if (!currentPointDestination) return;

        const processedValues: PointRequest = {
            ...values,
            attractionId: currentPointDestination.id
        };

        setPointsLoading(true);
        try {
            if (editingPoint) {
                const response = await pointService.updatePoint(editingPoint.id, processedValues);
                if (response.success) {
                    message.success('Point updated successfully');
                }
            } else {
                const response = await pointService.createPoint(processedValues);
                if (response.success) {
                    message.success('Point added successfully');
                }
            }
            // Refresh current destination points
            const pointsResponse = await pointService.getPointsByAttraction(currentPointDestination.id);
            if (pointsResponse.success) {
                setCurrentPointDestination({
                    ...currentPointDestination,
                    points: pointsResponse.data
                });
                // Also update the attraction in the main list
                setDestinations(destinations.map(d =>
                    d.id === currentPointDestination.id ? { ...d, points: pointsResponse.data } : d
                ));
            }
            setIsPointModalVisible(false);
            setPreviewPos(null);
        } catch (error: any) {
            message.error('Failed to save point: ' + error.message);
        } finally {
            setPointsLoading(false);
        }
    };

    const handleDeletePoint = (pointId: string) => {
        if (!currentPointDestination) return;

        Modal.confirm({
            title: 'Are you sure you want to delete this point?',
            onOk: async () => {
                try {
                    const response = await pointService.deletePoint(pointId);
                    if (response.success) {
                        message.success('Point deleted successfully');
                        // Refresh points
                        const pointsResponse = await pointService.getPointsByAttraction(currentPointDestination.id);
                        if (pointsResponse.success) {
                            setCurrentPointDestination({
                                ...currentPointDestination,
                                points: pointsResponse.data
                            });
                            // Update main list
                            setDestinations(destinations.map(d =>
                                d.id === currentPointDestination.id ? { ...d, points: pointsResponse.data } : d
                            ));
                        }
                    }
                } catch (error: any) {
                    message.error('Failed to delete point: ' + error.message);
                }
            }
        });
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
                            latitude: Number(row.latitude || row.Latitude),
                            longitude: Number(row.longitude || row.Longitude),
                            orderIndex: Number(row.orderIndex || row.OrderIndex || row.order || 1),
                            estTimeSpent: Number(row.estTimeSpent || row.EstTimeSpent || 30),
                            type: (row.type || row.Type || 'GENERAL') as PointType,
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
                // Refresh points
                const pointsResponse = await pointService.getPointsByAttraction(currentPointDestination.id);
                if (pointsResponse.success) {
                    setCurrentPointDestination({
                        ...currentPointDestination,
                        points: pointsResponse.data
                    });
                    setDestinations(destinations.map(d =>
                        d.id === currentPointDestination.id ? { ...d, points: pointsResponse.data } : d
                    ));
                }
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

                for (const row of jsonData as any[]) {
                    try {
                        const destData: AttractionRequest = {
                            name: row.name || row.Name,
                            address: row.address || row.Address || '',
                            description: row.description || row.Description || '',
                            latitude: Number(row.latitude || row.Latitude),
                            longitude: Number(row.longitude || row.Longitude),
                            status: (row.status || row.Status || 'OPEN') as 'OPEN' | 'CLOSED' | 'MAINTENANCE' | 'TEMPORARILY_CLOSED',
                            openHour: row.openHour || row.OpenHour || '08:00',
                            closeHour: row.closeHour || row.CloseHour || '17:00',
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
                fetchAttractions();
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

    const destColumns = [
        {
            title: 'Info',
            key: 'info',
            width: 300,
            render: (record: Destination) => (
                <div className="flex flex-col gap-1">
                    <Text strong className="text-primary truncate block" style={{ maxWidth: 280 }}>{record.name}</Text>
                    <Text type="secondary" className="text-xs truncate block" title={record.address} style={{ maxWidth: 280 }}>
                        <EnvironmentOutlined className="mr-1" />{record.address || 'No address'}
                    </Text>
                </div>
            )
        },
        {
            title: 'Hours',
            key: 'hours',
            width: 120,
            render: (record: Destination) => (
                <div className="flex items-center gap-1 text-xs">
                    <ClockCircleOutlined />
                    <span>{record.openHour || '--:--'} - {record.closeHour || '--:--'}</span>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={status === 'OPEN' ? 'green' : (status === 'CLOSED' || status === 'TEMPORARILY_CLOSED') ? 'red' : 'orange'} className="m-0">
                    {status}
                </Tag>
            )
        },
        {
            title: 'Points',
            key: 'points',
            width: 100,
            render: (record: Destination) => (
                <Tag color="cyan" className="m-0">
                    {(record.points || []).length} POIs
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 250,
            fixed: 'right' as const,
            render: (_: any, record: Destination) => (
                <Space size="small" wrap>
                    <Tooltip title="View Details">
                        <Button type="link" size="small" className="p-0" icon={<EyeOutlined />} onClick={() => { setViewingDestination(record); setIsDetailVisible(true); }} />
                    </Tooltip>
                    <Button size="small" icon={<EnvironmentOutlined />} onClick={() => handleFocus(record.latitude, record.longitude)}>Focus</Button>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEditDestination(record)} />
                    <Button size="small" icon={<PushpinOutlined />} onClick={() => handleManagePoints(record)}>Points</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteDestination(record.id)} />
                </Space>
            )
        }
    ];

    const pointColumns = [
        {
            title: '#',
            dataIndex: 'orderIndex',
            key: 'orderIndex',
            width: '10%',
            render: (val: number) => <Text strong>{val}</Text>
        },
        { title: 'Name', dataIndex: 'name', key: 'name', width: '35%', ellipsis: true },
        {
            title: 'Time',
            dataIndex: 'estTimeSpent',
            key: 'estTimeSpent',
            width: '15%',
            render: (val: number) => val ? `${val}m` : '-'
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '40%',
            render: (_: any, record: Point) => (
                <Space size="small">
                    <Button type="link" size="small" className="p-0" icon={<EyeOutlined />} onClick={() => { setViewingPoint(record); setIsPointDetailVisible(true); }} />
                    <Button type="link" size="small" className="p-0" icon={<EnvironmentOutlined />} onClick={() => handleFocus(record.latitude, record.longitude)}>Focus</Button>
                    <Button type="link" size="small" className="p-0" onClick={() => handleEditPoint(record)}>Edit</Button>
                    <Button type="link" size="small" danger className="p-0" onClick={() => handleDeletePoint(record.id)}>Del</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <style>
                {`
                    .preview-marker-hue {
                        filter: hue-rotate(140deg) brightness(1.2);
                        z-index: 1000 !important;
                    }
                    .point-marker-hue {
                        filter: hue-rotate(280deg) brightness(1.1);
                        z-index: 900 !important;
                    }
                    .attraction-marker-hue {
                        z-index: 800 !important;
                    }
                    .marker-open { filter: hue-rotate(-15deg) brightness(0.8) contrast(1.2); }
                    .marker-closed { filter: hue-rotate(120deg) brightness(0.8); }
                    .marker-maintenance { filter: hue-rotate(40deg) brightness(1.1); }
                    .marker-temp-closed { filter: hue-rotate(180deg) grayscale(0.5); }
                    /* Custom Scrollbar for Map Popups */
                    .popup-poi-scroll::-webkit-scrollbar {
                        width: 4px;
                    }
                    .popup-poi-scroll::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .popup-poi-scroll::-webkit-scrollbar-thumb {
                        background: #10b981;
                        border-radius: 10px;
                    }
                    .popup-poi-scroll::-webkit-scrollbar-thumb:hover {
                        background: #059669;
                    }
                `}
            </style>
            <div className="flex flex-col gap-8">
                {/* Map Section */}
                <div ref={mapRef}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <span>Ngu Hanh Son Destinations Map</span>
                            </div>
                        }
                        className="shadow-sm border-none bg-white/80 backdrop-blur-sm"
                    >
                        <div style={{ height: '400px', width: '100%' }} className="rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                                <ChangeView center={mapCenter} zoom={mapZoom} />
                                <MapEvents onMapClick={handleMapClick} />
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {destinations.map(dest => {
                                    const statusClass = dest.status === 'OPEN' ? 'marker-open' :
                                        dest.status === 'CLOSED' ? 'marker-closed' :
                                            dest.status === 'MAINTENANCE' ? 'marker-maintenance' :
                                                'marker-temp-closed';

                                    const statusIcon = L.icon({
                                        iconUrl: icon,
                                        shadowUrl: iconShadow,
                                        iconSize: [25, 41],
                                        iconAnchor: [12, 41],
                                        className: `attraction-marker-hue ${statusClass}`
                                    });

                                    return (
                                        <Marker key={dest.id} position={[dest.latitude, dest.longitude]} opacity={dest.isActive ? 1 : 0.5} icon={statusIcon}>
                                            <Popup>
                                                <div className="p-2 min-w-[200px]">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-bold text-primary m-0">{dest.name}</h3>
                                                        <Tag color={statusColors[dest.status] || 'blue'}>{dest.status}</Tag>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 mb-2 italic">
                                                        <EnvironmentOutlined className="mr-1" />{dest.address}
                                                    </p>
                                                    <p className="text-[11px] font-semibold text-gray-700 m-0 flex items-center gap-1">
                                                        <ClockCircleOutlined /> {dest.openHour} - {dest.closeHour}
                                                    </p>
                                                    <Divider className="my-2" />
                                                    <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Points of interest ({dest.points.length}):</p>
                                                    <div className="max-h-[120px] overflow-y-auto popup-poi-scroll mb-3 pr-1">
                                                        <ul className="text-xs list-none p-0 m-0">
                                                            {dest.points.map(p => (
                                                                <li key={p.id} className="flex items-center gap-1 py-0.5 border-b border-gray-50 last:border-0">
                                                                    <Text className="text-[10px] font-bold text-gray-400 w-4">{p.orderIndex}.</Text>
                                                                    <span className="text-[11px] truncate">{p.name}</span>
                                                                    <Text type="secondary" className="text-[9px] ml-auto">{p.estTimeSpent}m</Text>
                                                                </li>
                                                            ))}
                                                            {dest.points.length === 0 && <li className="text-gray-400 italic text-[10px]">No points added yet</li>}
                                                        </ul>
                                                    </div>
                                                    <Button size="small" type="primary" ghost block icon={<EyeOutlined />} onClick={() => { setViewingDestination(dest); setIsDetailVisible(true); }}>View Details</Button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}

                                {/* Render Points of the currently selected destination */}
                                {currentPointDestination && currentPointDestination.points.map(p => (
                                    <Marker key={`poi-${p.id}`} position={[p.latitude, p.longitude]} icon={PointMarkerIcon}>
                                        <Popup>
                                            <div className="p-2">
                                                <Tag color="orange" className="mb-1">Point of Interest</Tag>
                                                <h4 className="font-bold m-0">{p.name}</h4>
                                                <Text type="secondary" className="text-[10px]">{currentPointDestination.name}</Text>
                                                <Divider className="my-1" />
                                                <Button size="small" type="primary" ghost block icon={<EyeOutlined />} onClick={() => { setViewingPoint(p); setIsPointDetailVisible(true); }}>View Details</Button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}

                                {/* Preview Marker for Coordinate Picking */}
                                {previewPos && (
                                    <Marker position={previewPos} icon={PreviewIcon}>
                                        <Popup autoPan={false}>
                                            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">
                                                Preview New Position
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Destination Table */}
                    <Card
                        className="xl:col-span-7 shadow-sm border-none border-gray-100"
                        title={
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">Destinations <Tag color="blue">{filteredDestinations.length}</Tag></span>
                                <Space>
                                    <Upload
                                        accept=".xlsx, .xls"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            handleImportDestinations(file);
                                            return false;
                                        }}
                                    >
                                        <Button icon={<UploadOutlined />} className="rounded-lg">Import Excel</Button>
                                    </Upload>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDestination} className="rounded-lg">Add Destination</Button>
                                </Space>
                            </div>
                        }
                    >
                        <Search
                            placeholder="Search name, address or description..."
                            onSearch={value => setSearchText(value)}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ marginBottom: 16 }}
                            className="max-w-md"
                        />
                        <Table
                            columns={destColumns}
                            dataSource={filteredDestinations}
                            rowKey="id"
                            scroll={{ x: true }}
                            pagination={{ pageSize: 5 }}
                            loading={loading}
                            className="custom-table"
                        />
                    </Card>

                    {/* Point Management Area */}
                    <Card
                        className="xl:col-span-5 shadow-sm border-none bg-emerald-50/20"
                        title={
                            <span className="flex items-center gap-2">
                                <PushpinOutlined className="text-emerald-600" />
                                {currentPointDestination ? 'POI Management' : 'Select Destination'}
                            </span>
                        }
                    >
                        {currentPointDestination ? (
                            <div className="flex flex-col h-full">
                                <div className="mb-4 p-3 bg-white rounded-lg border border-emerald-100 border-l-4 border-l-emerald-500">
                                    <h3 className="font-bold text-base text-gray-800 m-0">{currentPointDestination.name}</h3>
                                    <Text type="secondary" className="text-xs block mt-1 line-clamp-1"><EnvironmentOutlined size={10} /> {currentPointDestination.address}</Text>
                                    <Divider className="my-2 opacity-50" />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <Text strong className="text-[11px] text-emerald-700 uppercase tracking-wider">{currentPointDestination.points.length} POIs</Text>
                                            <Space size="small">
                                                <Upload
                                                    accept=".xlsx, .xls"
                                                    showUploadList={false}
                                                    beforeUpload={(file) => {
                                                        handleImportPoints(file);
                                                        return false;
                                                    }}
                                                >
                                                    <Button size="small" icon={<UploadOutlined />} className="text-xs">Import</Button>
                                                </Upload>
                                                <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={handleAddPoint} className="text-xs">Add Point</Button>
                                            </Space>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full overflow-x-auto">
                                    <Table
                                        columns={pointColumns}
                                        dataSource={currentPointDestination.points}
                                        rowKey="id"
                                        size="small"
                                        loading={pointsLoading}
                                        pagination={{ pageSize: 10, hideOnSinglePage: true }}
                                        className="bg-transparent"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-24 text-center text-gray-400 flex flex-col items-center gap-4">
                                <div className="p-4 bg-gray-50 rounded-full">
                                    <PushpinOutlined style={{ fontSize: '32px' }} className="text-gray-300" />
                                </div>
                                <p className="text-sm">Click the <b>Points</b> button on a destination to manage its points of interest</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Destination Modal */}
            <Modal
                title={editingDestination ? "Edit Destination" : "Add New Destination"}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => {
                    setIsModalVisible(false);
                    setPreviewPos(null);
                }}
                destroyOnClose
                width={700}
                className="rounded-xl overflow-hidden"
            >
                <div className="mb-4">
                    <Alert
                        message="Coordinate Selection"
                        description="You can manually enter coordinates or use the map picker below."
                        type="info"
                        showIcon
                        className="bg-primary/5 border-primary/20"
                    />
                </div>
                <Form form={form} layout="vertical" onFinish={handleSaveDestination} onValuesChange={(changed) => {
                    if (changed.latitude || changed.longitude) {
                        const vals = form.getFieldsValue();
                        if (vals.latitude && vals.longitude) {
                            setPreviewPos([vals.latitude, vals.longitude]);
                        }
                    }
                }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="name" label="Destination Name" rules={[{ required: true }]} className="col-span-2">
                            <Input placeholder="Enter destination name" />
                        </Form.Item>
                        <Form.Item name="address" label="Address" className="col-span-2">
                            <Input placeholder="Enter physical address" />
                        </Form.Item>
                        <Form.Item name="description" label="Description" className="col-span-2">
                            <Input.TextArea rows={3} placeholder="Brief overview of this location" />
                        </Form.Item>
                        <Form.Item name="latitude" label="Latitude" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} step="0.000001" placeholder="16.0000" />
                        </Form.Item>
                        <Form.Item name="longitude" label="Longitude" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} step="0.000001" placeholder="108.0000" />
                        </Form.Item>
                        <Form.Item label="Map Selection" className="col-span-2">
                            <Button icon={<EnvironmentOutlined />} onClick={() => openMapPicker('destination')}>
                                Open Map Picker
                            </Button>
                            {previewPos && <Tag color="blue" className="ml-2">Location selected</Tag>}
                        </Form.Item>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select placeholder="Select status">
                                <Option value="OPEN">Open</Option>
                                <Option value="CLOSED">Closed</Option>
                                <Option value="MAINTENANCE">Maintenance</Option>
                                <Option value="TEMPORARILY_CLOSED">Temporarily Closed</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="hours" label="Operating Hours">
                            <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="thumbnailUrl" label="Thumbnail Image">
                            <div className="flex flex-col gap-2">
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    customRequest={({ file }) => handleFileUpload(file as File, 'thumbnailUrl', 'image', form)}
                                >
                                    <Button icon={uploading['thumbnailUrl'] ? <LoadingOutlined /> : <UploadOutlined />}>
                                        {uploading['thumbnailUrl'] ? 'Uploading...' : 'Choose Image'}
                                    </Button>
                                </Upload>
                                <Form.Item name="thumbnailUrl" noStyle>
                                    <Input placeholder="Or enter Image URL" />
                                </Form.Item>
                                {form.getFieldValue('thumbnailUrl') && (
                                    <img src={form.getFieldValue('thumbnailUrl')} alt="Thumbnail" className="w-20 h-20 object-cover rounded-lg border border-gray-200 mt-2" />
                                )}
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            {/* Point Modal */}
            <Modal
                title={editingPoint ? "Edit Point of Interest" : "Add New Point of Interest"}
                open={isPointModalVisible}
                onOk={() => pointForm.submit()}
                onCancel={() => {
                    setIsPointModalVisible(false);
                    setPreviewPos(null);
                }}
                destroyOnClose
                width={600}
            >
                <div className="mb-4">
                    <Alert
                        message="Coordinate Selection"
                        description="Use the map picker button below to select the exact location."
                        type="info"
                        showIcon
                        className="bg-emerald-50 border-emerald-200"
                    />
                </div>
                <Form form={pointForm} layout="vertical" onFinish={handleSavePoint} onValuesChange={(changed) => {
                    if (changed.latitude || changed.longitude) {
                        const vals = pointForm.getFieldsValue();
                        if (vals.latitude && vals.longitude) {
                            setPreviewPos([vals.latitude, vals.longitude]);
                        }
                    }
                }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="name" label="Point Name" rules={[{ required: true }]} className="col-span-2">
                            <Input placeholder="e.g. Linh Ung Pagoda" />
                        </Form.Item>
                        <Form.Item name="description" label="Short Description" className="col-span-2">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                        <Form.Item name="history" label="Historical Context" className="col-span-2">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="historyAudioUrl" label="Audio History">
                            <div className="flex flex-col gap-2">
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    customRequest={({ file }) => handleFileUpload(file as File, 'historyAudioUrl', 'video', pointForm)}
                                >
                                    <Button icon={uploading['historyAudioUrl'] ? <LoadingOutlined /> : <AudioOutlined />}>
                                        {uploading['historyAudioUrl'] ? 'Uploading...' : 'Choose Audio'}
                                    </Button>
                                </Upload>
                                <Form.Item name="historyAudioUrl" noStyle>
                                    <Input placeholder="Or enter Audio URL" />
                                </Form.Item>
                                {pointForm.getFieldValue('historyAudioUrl') && (
                                    <audio controls className="w-full mt-2 h-8">
                                        <source src={pointForm.getFieldValue('historyAudioUrl')} />
                                    </audio>
                                )}
                            </div>
                        </Form.Item>
                        <Form.Item name="latitude" label="Latitude" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} step="0.000001" />
                        </Form.Item>
                        <Form.Item name="longitude" label="Longitude" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} step="0.000001" />
                        </Form.Item>
                        <Form.Item label="Map Selection" className="col-span-2">
                            <Button icon={<EnvironmentOutlined />} onClick={() => openMapPicker('point')}>
                                Open Map Picker
                            </Button>
                        </Form.Item>
                        <Form.Item name="type" label="Point Type" rules={[{ required: true }]}>
                            <Select placeholder="Select point type">
                                {Object.keys(PointType).map(type => (
                                    <Option key={type} value={type}>{type}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="orderIndex" label="Display Order" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} min={1} placeholder="1, 2, 3..." />
                        </Form.Item>
                        <Form.Item name="estTimeSpent" label="Est. Time (Minutes)">
                            <InputNumber style={{ width: '100%' }} min={5} addonAfter="min" />
                        </Form.Item>
                        <Form.Item name="thumbnailUrl" label="Thumbnail Image" className="col-span-2">
                            <div className="flex flex-col gap-2">
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    customRequest={({ file }) => handleFileUpload(file as File, 'thumbnailUrl', 'image', pointForm)}
                                >
                                    <Button icon={uploading['thumbnailUrl'] ? <LoadingOutlined /> : <UploadOutlined />}>
                                        {uploading['thumbnailUrl'] ? 'Uploading...' : 'Choose Image'}
                                    </Button>
                                </Upload>
                                <Form.Item name="thumbnailUrl" noStyle>
                                    <Input placeholder="Or enter Image URL" />
                                </Form.Item>
                                {pointForm.getFieldValue('thumbnailUrl') && (
                                    <img src={pointForm.getFieldValue('thumbnailUrl')} alt="Thumbnail" className="w-20 h-20 object-cover rounded-lg border border-gray-200 mt-2" />
                                )}
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            {/* Map Picker Modal */}
            <Modal
                title="Select Location on Map"
                open={isMapPickerVisible}
                onOk={confirmMapPicker}
                onCancel={() => setIsMapPickerVisible(false)}
                width={800}
                destroyOnClose
            >
                <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden border">
                    <MapContainer center={pickerCoord} zoom={16} style={{ height: '100%', width: '100%' }}>
                        <FixMapRendering />
                        <ChangeView center={pickerCoord} zoom={16} />
                        <MapEvents onMapClick={handleMapClick} />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={pickerCoord} />
                    </MapContainer>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <Text type="secondary">Click anywhere on the map to pick coordinates</Text>
                    <Space>
                        <Tag color="blue">Lat: {pickerCoord[0].toFixed(6)}</Tag>
                        <Tag color="blue">Lng: {pickerCoord[1].toFixed(6)}</Tag>
                    </Space>
                </div>
            </Modal>

            {/* Attraction Detail Modal */}
            <Modal
                title="Destination Details"
                open={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                footer={[<Button key="close" onClick={() => setIsDetailVisible(false)}>Close</Button>]}
                width={700}
                destroyOnClose
            >
                {viewingDestination && (
                    <div className="flex flex-col gap-4">
                        {viewingDestination.thumbnailUrl && (
                            <img src={viewingDestination.thumbnailUrl} alt={viewingDestination.name} className="w-full h-60 object-cover rounded-xl shadow-sm" />
                        )}
                        <div className="flex justify-between items-start">
                            <div>
                                <Typography.Title level={3} style={{ margin: 0 }}>{viewingDestination.name}</Typography.Title>
                                <Text type="secondary" className="text-sm"><EnvironmentOutlined /> {viewingDestination.address || 'No address provided'}</Text>
                            </div>
                            <Tag color={viewingDestination.status === 'OPEN' ? 'green' : 'red'} className="m-0">{viewingDestination.status}</Tag>
                        </div>
                        <Divider className="my-2" />
                        <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                            <div>
                                <div className="text-[11px] font-bold uppercase text-gray-400 mb-1 tracking-wider"><ClockCircleOutlined /> Operating Hours</div>
                                <Text strong className="text-sm">{viewingDestination.openHour} - {viewingDestination.closeHour}</Text>
                            </div>
                            <div>
                                <div className="text-[11px] font-bold uppercase text-gray-400 mb-1 tracking-wider"><PushpinOutlined /> Points of Interest</div>
                                <Text strong className="text-sm">{viewingDestination.points.length} locations</Text>
                            </div>
                        </div>
                        {viewingDestination.description && (
                            <div className="mt-2">
                                <div className="font-bold mb-1 text-gray-700">Description</div>
                                <p className="text-gray-600 text-sm leading-relaxed m-0">{viewingDestination.description}</p>
                            </div>
                        )}
                        <div className="bg-blue-50/50 p-3 rounded-lg flex items-center gap-2 border border-blue-100 mt-2">
                            <EnvironmentOutlined className="text-blue-500" />
                            <Text className="text-blue-700 text-xs font-medium">Coordinates: {viewingDestination.latitude}, {viewingDestination.longitude}</Text>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Point Detail Modal */}
            <Modal
                title="Point of Interest Details"
                open={isPointDetailVisible}
                onCancel={() => setIsPointDetailVisible(false)}
                footer={[<Button key="close" onClick={() => setIsPointDetailVisible(false)}>Close</Button>]}
                width={600}
                destroyOnClose
            >
                {viewingPoint && (
                    <div className="flex flex-col gap-4">
                        {viewingPoint.thumbnailUrl && (
                            <img src={viewingPoint.thumbnailUrl} alt={viewingPoint.name} className="w-full h-60 object-cover rounded-xl shadow-sm" />
                        )}
                        <div className="flex justify-between items-start">
                            <div>
                                <Typography.Title level={3} style={{ margin: 0 }}>{viewingPoint.name}</Typography.Title>
                                <Space split={<Divider type="vertical" />} className="mt-1">
                                    <Tag color="blue" className="m-0">Order: {viewingPoint.orderIndex}</Tag>
                                    <Text type="secondary" className="text-sm"><ClockCircleOutlined /> {viewingPoint.estTimeSpent} mins</Text>
                                </Space>
                            </div>
                        </div>
                        <Divider className="my-2" />
                        {viewingPoint.description && (
                            <div>
                                <div className="font-bold mb-1 text-gray-700">Description</div>
                                <p className="text-gray-600 text-sm leading-relaxed m-0">{viewingPoint.description}</p>
                            </div>
                        )}
                        {viewingPoint.history && (
                            <div>
                                <div className="font-bold mb-1 text-gray-700"><HistoryOutlined /> Historical Context</div>
                                <div className="bg-gray-50 p-4 rounded-lg mt-1 border border-gray-100 shadow-sm">
                                    <p className="text-gray-700 italic text-sm leading-relaxed m-0">{viewingPoint.history}</p>
                                </div>
                            </div>
                        )}
                        {viewingPoint.historyAudioUrl && (
                            <div className="mt-2 text-center p-3 bg-emerald-50/30 rounded-lg border border-emerald-100">
                                <div className="text-[11px] font-bold uppercase text-emerald-600 mb-2 tracking-wider flex items-center justify-center gap-1">
                                    <AudioOutlined /> Audio History Guide
                                </div>
                                <audio key={viewingPoint.id} controls className="w-full h-10">
                                    <source src={viewingPoint.historyAudioUrl} />
                                </audio>
                            </div>
                        )}
                        <div className="bg-blue-50/50 p-3 rounded-lg flex items-center gap-2 border border-blue-100 mt-2">
                            <EnvironmentOutlined className="text-blue-500" />
                            <Text className="text-blue-700 text-xs font-medium">Coordinates: {viewingPoint.latitude}, {viewingPoint.longitude}</Text>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default AdminDestinationsPage;
