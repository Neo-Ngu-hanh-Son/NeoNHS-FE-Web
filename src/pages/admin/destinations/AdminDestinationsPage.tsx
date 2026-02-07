import { useState, useEffect } from 'react';
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
    Switch,
    Typography,
    Upload,
    Alert
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
    InfoCircleOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dayjs from 'dayjs';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '@/utils/cloudinary';

const { Text } = Typography;

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

L.Marker.prototype.options.icon = DefaultIcon;

const { Search } = Input;
const { Option } = Select;

interface Point {
    id: string;
    name: string;
    description: string;
    thumbnailUrl?: string;
    history?: string;
    historyAudioUrl?: string;
    latitude: number;
    longitude: number;
    orderIndex?: number;
    estTimeSpent?: number; // in minutes
}

interface Destination {
    id: string;
    name: string;
    description: string;
    mapImageUrl?: string;
    address?: string;
    latitude: number;
    longitude: number;
    status: string;
    thumbnailUrl?: string;
    openHour?: string; // HH:mm
    closeHour?: string; // HH:mm
    isActive: boolean;
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

// Map Updater Component
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
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
    const [form] = Form.useForm();
    const [pointForm] = Form.useForm();

    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [previewPos, setPreviewPos] = useState<[number, number] | null>(null);

    const handleMapClick = (lat: number, lng: number) => {
        if (isModalVisible) {
            form.setFieldsValue({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });
            setPreviewPos([lat, lng]);
            message.info('Coordinates updated from map');
        } else if (isPointModalVisible) {
            pointForm.setFieldsValue({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });
            setPreviewPos([lat, lng]);
            message.info('Coordinates updated from map');
        }
    };

    // Mock data initialization
    useEffect(() => {
        const mockDestinations: Destination[] = [
            {
                id: '1',
                name: 'Thuy Son (Water Mountain)',
                description: 'The largest and most beautiful mountain in Marble Mountains.',
                address: 'Hoa Hai, Ngu Hanh Son, Da Nang, Vietnam',
                latitude: 16.0035,
                longitude: 108.2645,
                status: 'OPEN',
                openHour: '07:00',
                closeHour: '17:30',
                isActive: true,
                points: [
                    {
                        id: '101',
                        name: 'Linh Ung Pagoda',
                        description: 'Ancient pagoda on Thuy Son',
                        latitude: 16.0038,
                        longitude: 108.2642,
                        orderIndex: 1,
                        estTimeSpent: 30,
                        history: 'Built in the 19th century under Minh Mang King...'
                    },
                    {
                        id: '102',
                        name: 'Huyen Khong Cave',
                        description: 'Large magnificent cave',
                        latitude: 16.0032,
                        longitude: 108.2648,
                        orderIndex: 2,
                        estTimeSpent: 45
                    }
                ]
            },
            {
                id: '2',
                name: 'Kim Son (Metal Mountain)',
                description: 'Located in the southeast, near the Co Co river.',
                address: 'Hoa Hai, Ngu Hanh Son, Da Nang',
                latitude: 16.0015,
                longitude: 108.2620,
                status: 'CONSTRUCTION',
                openHour: '00:00',
                closeHour: '00:00',
                isActive: false,
                points: []
            }
        ];
        setDestinations(mockDestinations);
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
            onOk() {
                setDestinations(destinations.filter(d => d.id !== id));
                message.success('Destination deleted successfully');
            }
        });
    };

    const handleSaveDestination = (values: any) => {
        const { hours, ...rest } = values;
        const processedValues = {
            ...rest,
            openHour: hours ? hours[0].format('HH:mm') : null,
            closeHour: hours ? hours[1].format('HH:mm') : null,
        };

        if (editingDestination) {
            setDestinations(destinations.map(d =>
                d.id === editingDestination.id ? { ...d, ...processedValues } : d
            ));
            message.success('Destination updated successfully');
        } else {
            const newDest: Destination = {
                id: crypto.randomUUID(),
                ...processedValues,
                points: []
            };
            setDestinations([...destinations, newDest]);
            message.success('Destination added successfully');
        }
        setIsModalVisible(false);
        setPreviewPos(null);
    };

    // Point Handlers
    const handleManagePoints = (record: Destination) => {
        setCurrentPointDestination(record);
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

    const handleSavePoint = (values: any) => {
        if (!currentPointDestination) return;

        let updatedDestinations = [...destinations];
        const destIndex = updatedDestinations.findIndex(d => d.id === currentPointDestination.id);

        if (editingPoint) {
            updatedDestinations[destIndex].points = updatedDestinations[destIndex].points.map(p =>
                p.id === editingPoint.id ? { ...p, ...values } : p
            ).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            message.success('Point updated successfully');
        } else {
            const newPoint: Point = {
                id: crypto.randomUUID(),
                ...values
            };
            updatedDestinations[destIndex].points.push(newPoint);
            updatedDestinations[destIndex].points.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            message.success('Point added successfully');
        }

        setDestinations(updatedDestinations);
        setCurrentPointDestination({ ...updatedDestinations[destIndex] });
        setIsPointModalVisible(false);
        setPreviewPos(null);
    };

    const handleDeletePoint = (pointId: string) => {
        if (!currentPointDestination) return;

        Modal.confirm({
            title: 'Are you sure you want to delete this point?',
            onOk() {
                let updatedDestinations = [...destinations];
                const destIndex = updatedDestinations.findIndex(d => d.id === currentPointDestination.id);
                updatedDestinations[destIndex].points = updatedDestinations[destIndex].points.filter(p => p.id !== pointId);

                setDestinations(updatedDestinations);
                setCurrentPointDestination({ ...updatedDestinations[destIndex] });
                message.success('Point deleted successfully');
            }
        });
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
            width: '30%',
            render: (record: Destination) => (
                <div className="flex flex-col gap-1">
                    <Text strong className="text-primary">{record.name}</Text>
                    <Text type="secondary" className="text-xs line-clamp-1">
                        <EnvironmentOutlined className="mr-1" />{record.address || 'No address'}
                    </Text>
                </div>
            )
        },
        {
            title: 'Hours',
            key: 'hours',
            width: '15%',
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
            width: '15%',
            render: (status: string, record: Destination) => (
                <Space direction="vertical" size={0}>
                    <Tag color={status === 'OPEN' ? 'green' : status === 'CLOSED' ? 'red' : 'orange'}>
                        {status}
                    </Tag>
                    {!record.isActive && <Tag color="default">Inactive</Tag>}
                </Space>
            )
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
            width: '10%',
            render: (points: Point[]) => <Tag color="green">{points.length} points</Tag>
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '30%',
            render: (_: any, record: Destination) => (
                <Space>
                    <Button size="small" icon={<EnvironmentOutlined />} onClick={() => setMapCenter([record.latitude, record.longitude])}>Focus</Button>
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
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Time',
            dataIndex: 'estTimeSpent',
            key: 'estTimeSpent',
            render: (val: number) => val ? `${val}m` : '-'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Point) => (
                <Space>
                    <Button type="link" size="small" onClick={() => handleEditPoint(record)}>Edit</Button>
                    <Button type="link" size="small" danger onClick={() => handleDeletePoint(record.id)}>Delete</Button>
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
                `}
            </style>
            <div className="flex flex-col gap-8">
                {/* Map Section */}
                <Card
                    title={
                        <div className="flex items-center gap-2">
                            <span>Ngu Hanh Son Destinations Map</span>
                            {(isModalVisible || isPointModalVisible) && (
                                <Tag color="orange" icon={<InfoCircleOutlined />} className="animate-pulse">
                                    Click on map to pick location
                                </Tag>
                            )}
                        </div>
                    }
                    className="shadow-sm border-none bg-white/80 backdrop-blur-sm"
                >
                    <div style={{ height: '400px', width: '100%' }} className="rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                        <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                            <ChangeView center={mapCenter} zoom={15} />
                            <MapEvents onMapClick={handleMapClick} />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {destinations.map(dest => (
                                <Marker key={dest.id} position={[dest.latitude, dest.longitude]} opacity={dest.isActive ? 1 : 0.5}>
                                    <Popup>
                                        <div className="p-2 min-w-[200px]">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-primary m-0">{dest.name}</h3>
                                                <Tag color={dest.status === 'OPEN' ? 'green' : 'red'}>{dest.status}</Tag>
                                            </div>
                                            <p className="text-[11px] text-gray-500 mb-2 italic">
                                                <EnvironmentOutlined className="mr-1" />{dest.address}
                                            </p>
                                            <p className="text-[11px] font-semibold text-gray-700 m-0 flex items-center gap-1">
                                                <ClockCircleOutlined /> {dest.openHour} - {dest.closeHour}
                                            </p>
                                            <Divider className="my-2" />
                                            <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Points of interest ({dest.points.length}):</p>
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

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Destination Table */}
                    <Card
                        className="lg:col-span-8 shadow-sm border-none border-gray-100"
                        title={
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">Destinations <Tag color="blue">{filteredDestinations.length}</Tag></span>
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDestination} className="rounded-lg">Add Destination</Button>
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
                            className="custom-table"
                        />
                    </Card>

                    {/* Point Management Area */}
                    <Card
                        className="lg:col-span-4 shadow-sm border-none bg-emerald-50/20"
                        title={
                            <span className="flex items-center gap-2">
                                <PushpinOutlined className="text-emerald-600" />
                                {currentPointDestination ? 'Points' : 'Select Destination'}
                            </span>
                        }
                    >
                        {currentPointDestination ? (
                            <div className="flex flex-col h-full">
                                <div className="mb-4 p-3 bg-white rounded-lg border border-emerald-100 border-l-4 border-l-emerald-500">
                                    <h3 className="font-bold text-base text-gray-800 m-0">{currentPointDestination.name}</h3>
                                    <Text type="secondary" className="text-xs block mt-1"><EnvironmentOutlined size={10} /> {currentPointDestination.address}</Text>
                                    <Divider className="my-3 opacity-50" />
                                    <div className="flex justify-between items-center">
                                        <Text strong className="text-[11px] text-emerald-700 uppercase tracking-wider">{currentPointDestination.points.length} POIs</Text>
                                        <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={handleAddPoint} className="text-xs px-2">Add</Button>
                                    </div>
                                </div>
                                <Table
                                    columns={pointColumns}
                                    dataSource={currentPointDestination.points}
                                    rowKey="id"
                                    size="small"
                                    pagination={{ pageSize: 10, hideOnSinglePage: true }}
                                    className="bg-transparent"
                                />
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
                        description="You can manually enter coordinates below or click directly on the map above to pick a location."
                        type="info"
                        showIcon
                        className="bg-primary/5 border-primary/20"
                    />
                </div>
                <Form form={form} layout="vertical" onFinish={handleSaveDestination} initialValues={{ isActive: true }} onValuesChange={(changed) => {
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
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select placeholder="Select status">
                                <Option value="OPEN">Open</Option>
                                <Option value="CLOSED">Closed</Option>
                                <Option value="CONSTRUCTION">Construction</Option>
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
                        <Form.Item name="isActive" label="Is Active?" valuePropName="checked">
                            <Switch />
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
                        description="Click on the map above to pick the exact location for this point."
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
        </div>
    );
}

export default AdminDestinationsPage;
