import { useState, useMemo } from 'react';
import {
    Button, Table, Tag, Space, Card, Input, Select, Modal, Form,
    InputNumber, DatePicker, message, Upload,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined,
    SearchOutlined, ReloadOutlined, UploadOutlined, LoadingOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { uploadImageToCloudinary, validateImageFile } from '@/utils/cloudinary';
import { useVendorVouchers } from '@/hooks/voucher';
import { vendorVoucherService } from '@/services/api/voucherService';
import type { VendorVoucherQueryParams } from '@/services/api/voucherService';
import type {
    VoucherResponse, VoucherType, VoucherStatus,
    ApplicableProduct, CreateVoucherRequest, UpdateVoucherRequest,
} from '@/types/voucher';

const { Option } = Select;

const VOUCHER_CODE_REGEX = /^[A-Za-z0-9_-]+$/;

const voucherTypeColors: Record<VoucherType, string> = {
    DISCOUNT: 'blue',
    GIFT_PRODUCT: 'purple',
    BONUS_POINTS: 'gold',
    FREE_SERVICE: 'cyan',
};

const voucherTypeLabels: Record<VoucherType, string> = {
    DISCOUNT: 'Discount',
    GIFT_PRODUCT: 'Gift Product',
    BONUS_POINTS: 'Bonus Points',
    FREE_SERVICE: 'Free Service',
};

const statusColors: Record<VoucherStatus, string> = {
    ACTIVE: 'green',
    INACTIVE: 'default',
    EXPIRED: 'red',
};

const applicableProductLabels: Record<ApplicableProduct, string> = {
    ALL: 'All Products',
    TICKET: 'Tickets',
    WORKSHOP: 'Workshops',
    EVENT_TICKET: 'Event Tickets',
};

function getDiscountDisplay(v: VoucherResponse): string {
    if (v.voucherType === 'DISCOUNT' && v.discountValue != null) {
        return v.discountType === 'PERCENT' ? `${v.discountValue}%` : `${v.discountValue.toLocaleString('vi-VN')}₫`;
    }
    if (v.voucherType === 'GIFT_PRODUCT') return v.giftDescription || 'Gift';
    return '—';
}

export default function VouchersPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Draft filter values (what user types)
    const [draftCode, setDraftCode] = useState('');
    const [draftType, setDraftType] = useState<VoucherType | undefined>();
    const [draftStatus, setDraftStatus] = useState<VoucherStatus | undefined>();

    // Applied filter values (used in API query)
    const [appliedCode, setAppliedCode] = useState('');
    const [appliedType, setAppliedType] = useState<VoucherType | undefined>();
    const [appliedStatus, setAppliedStatus] = useState<VoucherStatus | undefined>();

    // Modal states
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<VoucherResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<VoucherResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Image upload states
    const [createGiftImageUrl, setCreateGiftImageUrl] = useState('');
    const [editGiftImageUrl, setEditGiftImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const queryParams = useMemo<VendorVoucherQueryParams>(() => {
        const params: VendorVoucherQueryParams = { page: currentPage - 1, size: pageSize };
        if (appliedCode.trim()) params.code = appliedCode.trim();
        if (appliedType) params.voucherType = appliedType;
        if (appliedStatus) params.status = appliedStatus;
        return params;
    }, [currentPage, pageSize, appliedCode, appliedType, appliedStatus]);

    const handleSearch = () => {
        setAppliedCode(draftCode);
        setAppliedType(draftType);
        setAppliedStatus(draftStatus);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setDraftCode('');
        setDraftType(undefined);
        setDraftStatus(undefined);
        setAppliedCode('');
        setAppliedType(undefined);
        setAppliedStatus(undefined);
        setCurrentPage(1);
    };

    const handleGiftImageUpload = async (file: File, setUrl: (url: string) => void) => {
        const validationError = validateImageFile(file, 5);
        if (validationError) {
            message.error(validationError);
            return false;
        }
        setUploadingImage(true);
        try {
            const url = await uploadImageToCloudinary(file);
            if (url) {
                setUrl(url);
                message.success('Image uploaded successfully');
            } else {
                message.error('Upload failed');
            }
        } catch {
            message.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
        return false;
    };

    const { vouchers, loading, totalElements, fetchVouchers, deleteVoucher } = useVendorVouchers(queryParams);

    // Watch voucher type in forms for conditional fields
    const createVoucherType = Form.useWatch('voucherType', createForm);
    const editVoucherType = editingVoucher?.voucherType;

    // Create
    const handleCreate = async (values: any) => {
        setSubmitting(true);
        try {
            const data: CreateVoucherRequest = {
                code: values.code,
                description: values.description,
                voucherType: values.voucherType,
                applicableProduct: values.applicableProduct,
                startDate: values.startDate?.toISOString(),
                endDate: values.endDate?.toISOString(),
                usageLimit: values.usageLimit,
                maxUsagePerUser: values.maxUsagePerUser,
            };
            if (values.voucherType === 'DISCOUNT') {
                data.discountType = values.discountType;
                data.discountValue = values.discountValue;
                data.maxDiscountValue = values.maxDiscountValue;
                data.minOrderValue = values.minOrderValue;
            } else if (values.voucherType === 'GIFT_PRODUCT') {
                data.giftDescription = values.giftDescription;
                data.giftImageUrl = createGiftImageUrl || undefined;
            }
            const response = await vendorVoucherService.create(data);
            if (response.success) {
                message.success('Voucher created successfully');
                setCreateOpen(false);
                createForm.resetFields();
                setCreateGiftImageUrl('');
                fetchVouchers();
            } else {
                message.error(response.message || 'Failed to create voucher');
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to create voucher');
        } finally {
            setSubmitting(false);
        }
    };

    // Edit
    const openEdit = (voucher: VoucherResponse) => {
        setEditingVoucher(voucher);
        setEditGiftImageUrl(voucher.giftImageUrl || '');
        editForm.setFieldsValue({
            description: voucher.description,
            applicableProduct: voucher.applicableProduct,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            maxDiscountValue: voucher.maxDiscountValue,
            minOrderValue: voucher.minOrderValue,
            giftDescription: voucher.giftDescription,
            startDate: voucher.startDate ? dayjs(voucher.startDate) : null,
            endDate: voucher.endDate ? dayjs(voucher.endDate) : null,
            usageLimit: voucher.usageLimit,
            maxUsagePerUser: voucher.maxUsagePerUser,
            status: voucher.status,
        });
        setEditOpen(true);
    };

    const handleUpdate = async (values: any) => {
        if (!editingVoucher) return;
        setSubmitting(true);
        try {
            const data: UpdateVoucherRequest = {
                description: values.description,
                applicableProduct: values.applicableProduct,
                startDate: values.startDate?.toISOString(),
                endDate: values.endDate?.toISOString(),
                usageLimit: values.usageLimit,
                maxUsagePerUser: values.maxUsagePerUser,
                status: values.status,
            };
            if (editVoucherType === 'DISCOUNT') {
                data.discountType = values.discountType;
                data.discountValue = values.discountValue;
                data.maxDiscountValue = values.maxDiscountValue;
                data.minOrderValue = values.minOrderValue;
            } else if (editVoucherType === 'GIFT_PRODUCT') {
                data.giftDescription = values.giftDescription;
                data.giftImageUrl = editGiftImageUrl || undefined;
            }
            const response = await vendorVoucherService.update(editingVoucher.id, data);
            if (response.success) {
                message.success('Voucher updated successfully');
                setEditOpen(false);
                setEditingVoucher(null);
                setEditGiftImageUrl('');
                fetchVouchers();
            } else {
                message.error(response.message || 'Failed to update voucher');
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to update voucher');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteVoucher(deleteTarget.id);
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const columns = [
        {
            title: 'Voucher Code',
            dataIndex: 'code',
            key: 'code',
            render: (text: string) => (
                <div className="flex items-center gap-2">
                    <GiftOutlined className="text-primary" />
                    <span className="font-mono font-bold text-primary">{text}</span>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'voucherType',
            key: 'voucherType',
            render: (type: VoucherType) => (
                <Tag color={voucherTypeColors[type]}>{voucherTypeLabels[type]}</Tag>
            ),
        },
        {
            title: 'Value',
            key: 'value',
            ellipsis: true,
            width: 160,
            render: (_: any, record: VoucherResponse) => (
                <span title={getDiscountDisplay(record)}>{getDiscountDisplay(record)}</span>
            ),
        },
        {
            title: 'Product',
            dataIndex: 'applicableProduct',
            key: 'applicableProduct',
            render: (product: ApplicableProduct) => applicableProductLabels[product],
        },
        {
            title: 'Usage',
            key: 'usage',
            render: (_: any, record: VoucherResponse) => `${record.usageCount}/${record.usageLimit}`,
        },
        {
            title: 'Period',
            key: 'period',
            render: (_: any, record: VoucherResponse) => (
                <span className="text-xs">
                    {new Date(record.startDate).toLocaleDateString('vi-VN')} — {new Date(record.endDate).toLocaleDateString('vi-VN')}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: VoucherStatus) => (
                <Tag color={statusColors[status]}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: any, record: VoucherResponse) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                    <Button type="text" icon={<DeleteOutlined />} danger onClick={() => setDeleteTarget(record)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Vouchers Management</h1>
                    <p className="text-[#588d70]">Create discount codes to attract more customers</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-primary border-0 h-11 px-6 font-medium"
                    onClick={() => setCreateOpen(true)}
                >
                    Create Voucher
                </Button>
            </div>

            {/* Filters */}
            <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Input
                        placeholder="Search by code..."
                        prefix={<SearchOutlined />}
                        value={draftCode}
                        onChange={(e) => setDraftCode(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Select
                        placeholder="Type"
                        value={draftType}
                        onChange={(val) => setDraftType(val)}
                        style={{ width: 150 }}
                        allowClear
                    >
                        <Option value="DISCOUNT">Discount</Option>
                        <Option value="GIFT_PRODUCT">Gift Product</Option>
                    </Select>
                    <Select
                        placeholder="Status"
                        value={draftStatus}
                        onChange={(val) => setDraftStatus(val)}
                        style={{ width: 130 }}
                        allowClear
                    >
                        <Option value="ACTIVE">Active</Option>
                        <Option value="INACTIVE">Inactive</Option>
                        <Option value="EXPIRED">Expired</Option>
                    </Select>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                        Search
                    </Button>
                    <Button icon={<CloseCircleOutlined />} onClick={handleClearFilters}>
                        Clear
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={fetchVouchers} loading={loading}>
                        Refresh
                    </Button>
                </div>

                <Table
                    dataSource={vouchers}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total: totalElements,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        onChange: (page, size) => { setCurrentPage(page); setPageSize(size); },
                    }}
                    locale={{ emptyText: 'No vouchers found. Create your first voucher!' }}
                />
            </Card>

            {/* Create Modal */}
            <Modal
                title="Create Voucher"
                open={createOpen}
                onCancel={() => { setCreateOpen(false); createForm.resetFields(); setCreateGiftImageUrl(''); }}
                footer={null}
                width={600}
                destroyOnClose
                styles={{ body: { maxHeight: '65vh', overflowY: 'auto', paddingRight: 8 } }}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreate} initialValues={{ voucherType: 'DISCOUNT', applicableProduct: 'ALL', discountType: 'PERCENT' }}>
                    <Form.Item name="code" label="Voucher Code" rules={[
                        { required: true, message: 'Please enter a code' },
                        { max: 50, message: 'Max 50 characters' },
                        { pattern: VOUCHER_CODE_REGEX, message: 'Only letters, numbers, _ and - allowed' },
                    ]}>
                        <Input placeholder="e.g. SUMMER2026" maxLength={50} style={{ textTransform: 'uppercase' }} />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ max: 1000, message: 'Max 1000 characters' }]}>
                        <Input.TextArea rows={2} placeholder="Describe this voucher..." maxLength={1000} showCount />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="voucherType" label="Voucher Type" rules={[{ required: true }]}>
                            <Select>
                                <Option value="DISCOUNT">Discount</Option>
                                <Option value="GIFT_PRODUCT">Gift Product</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="applicableProduct" label="Applicable Product" rules={[{ required: true }]}>
                            <Select>
                                <Option value="ALL">All Products</Option>
                                <Option value="TICKET">Tickets</Option>
                                <Option value="WORKSHOP">Workshops</Option>
                                <Option value="EVENT_TICKET">Event Tickets</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {/* DISCOUNT fields */}
                    {createVoucherType === 'DISCOUNT' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="discountType" label="Discount Type">
                                    <Select>
                                        <Option value="PERCENT">Percentage (%)</Option>
                                        <Option value="FIXED">Fixed Amount (₫)</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="discountValue" label="Discount Value" dependencies={['discountType']} rules={[
                                    { required: true, message: 'Required' },
                                    { type: 'number', min: 0.01, message: 'Must be > 0' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value && getFieldValue('discountType') === 'PERCENT' && value > 100)
                                                return Promise.reject('Percentage must be ≤ 100');
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}>
                                    <InputNumber min={0} className="w-full" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="maxDiscountValue" label="Max Discount" rules={[{ type: 'number', min: 0.01, message: 'Must be > 0' }]}>
                                    <InputNumber min={0} className="w-full" placeholder="Optional" />
                                </Form.Item>
                                <Form.Item name="minOrderValue" label="Min Order Value" rules={[{ type: 'number', min: 0, message: 'Must be ≥ 0' }]}>
                                    <InputNumber min={0} className="w-full" placeholder="Optional" />
                                </Form.Item>
                            </div>
                        </>
                    )}

                    {/* GIFT_PRODUCT fields */}
                    {createVoucherType === 'GIFT_PRODUCT' && (
                        <>
                            <Form.Item name="giftDescription" label="Gift Description" rules={[
                                { required: true, message: 'Gift description is required' },
                                { max: 255, message: 'Max 255 characters' },
                            ]}>
                                <Input.TextArea rows={2} placeholder="Describe the gift..." maxLength={255} showCount />
                            </Form.Item>
                            <Form.Item label="Gift Image">
                                <div className="space-y-2">
                                    {createGiftImageUrl && (
                                        <div className="relative inline-block">
                                            <img src={createGiftImageUrl} alt="Gift" className="max-w-[200px] rounded border" />
                                            <Button
                                                type="text" danger size="small"
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => setCreateGiftImageUrl('')}
                                                style={{ position: 'absolute', top: 4, right: 4 }}
                                            />
                                        </div>
                                    )}
                                    <Upload
                                        showUploadList={false}
                                        accept="image/*"
                                        beforeUpload={(file) => handleGiftImageUpload(file, setCreateGiftImageUrl)}
                                    >
                                        <Button icon={uploadingImage ? <LoadingOutlined /> : <UploadOutlined />} disabled={uploadingImage}>
                                            {createGiftImageUrl ? 'Change Image' : 'Upload Image'}
                                        </Button>
                                    </Upload>
                                </div>
                            </Form.Item>
                        </>
                    )}

                    {/* Time & Usage */}
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="startDate" label="Start Date" rules={[
                            { required: true, message: 'Start date is required' },
                            { validator: (_, value) => value && value.isBefore(dayjs()) ? Promise.reject('Must be present or future') : Promise.resolve() },
                        ]}>
                            <DatePicker showTime className="w-full" disabledDate={(d) => d && d.isBefore(dayjs().startOf('day'))} />
                        </Form.Item>
                        <Form.Item name="endDate" label="End Date" dependencies={['startDate']} rules={[
                            { required: true, message: 'End date is required' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value) return Promise.resolve();
                                    if (value.isBefore(dayjs())) return Promise.reject('Must be in the future');
                                    const start = getFieldValue('startDate');
                                    if (start && !value.isAfter(start)) return Promise.reject('Must be after start date');
                                    return Promise.resolve();
                                },
                            }),
                        ]}>
                            <DatePicker showTime className="w-full" disabledDate={(d) => d && d.isBefore(dayjs().startOf('day'))} />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="usageLimit" label="Usage Limit" rules={[{ type: 'number', min: 1, message: 'Must be ≥ 1' }]}>
                            <InputNumber min={1} className="w-full" placeholder="Total limit" />
                        </Form.Item>
                        <Form.Item name="maxUsagePerUser" label="Max Per User" rules={[{ type: 'number', min: 1, message: 'Must be ≥ 1' }]}>
                            <InputNumber min={1} className="w-full" placeholder="Per user limit" />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => { setCreateOpen(false); createForm.resetFields(); setCreateGiftImageUrl(''); }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Create Voucher</Button>
                    </div>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete Voucher"
                open={!!deleteTarget}
                onCancel={() => setDeleteTarget(null)}
                okText="Delete"
                okType="danger"
                okButtonProps={{ loading: deleting }}
                onOk={handleDeleteConfirm}
                cancelText="Cancel"
                centered
                width={420}
            >
                <p>Are you sure you want to delete voucher "<strong className="font-mono">{deleteTarget?.code}</strong>"? This action can be undone later.</p>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title={`Edit Voucher: ${editingVoucher?.code || ''}`}
                open={editOpen}
                onCancel={() => { setEditOpen(false); setEditingVoucher(null); setEditGiftImageUrl(''); }}
                footer={null}
                width={600}
                destroyOnClose
                styles={{ body: { maxHeight: '65vh', overflowY: 'auto', paddingRight: 8 } }}
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item label="Voucher Code">
                        <Input value={editingVoucher?.code} disabled />
                    </Form.Item>
                    <Form.Item label="Voucher Type">
                        <Input value={editVoucherType ? voucherTypeLabels[editVoucherType] : ''} disabled />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ max: 1000, message: 'Max 1000 characters' }]}>
                        <Input.TextArea rows={2} maxLength={1000} showCount />
                    </Form.Item>
                    <Form.Item name="applicableProduct" label="Applicable Product">
                        <Select>
                            <Option value="ALL">All Products</Option>
                            <Option value="TICKET">Tickets</Option>
                            <Option value="WORKSHOP">Workshops</Option>
                            <Option value="EVENT_TICKET">Event Tickets</Option>
                        </Select>
                    </Form.Item>

                    {editVoucherType === 'DISCOUNT' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="discountType" label="Discount Type">
                                    <Select>
                                        <Option value="PERCENT">Percentage (%)</Option>
                                        <Option value="FIXED">Fixed Amount (₫)</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="discountValue" label="Discount Value" dependencies={['discountType']} rules={[
                                    { type: 'number', min: 0.01, message: 'Must be > 0' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value && getFieldValue('discountType') === 'PERCENT' && value > 100)
                                                return Promise.reject('Percentage must be ≤ 100');
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}>
                                    <InputNumber min={0} className="w-full" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="maxDiscountValue" label="Max Discount" rules={[{ type: 'number', min: 0.01, message: 'Must be > 0' }]}>
                                    <InputNumber min={0} className="w-full" />
                                </Form.Item>
                                <Form.Item name="minOrderValue" label="Min Order Value" rules={[{ type: 'number', min: 0, message: 'Must be ≥ 0' }]}>
                                    <InputNumber min={0} className="w-full" />
                                </Form.Item>
                            </div>
                        </>
                    )}

                    {editVoucherType === 'GIFT_PRODUCT' && (
                        <>
                            <Form.Item name="giftDescription" label="Gift Description" rules={[{ max: 255, message: 'Max 255 characters' }]}>
                                <Input.TextArea rows={2} maxLength={255} showCount />
                            </Form.Item>
                            <Form.Item label="Gift Image">
                                <div className="space-y-2">
                                    {editGiftImageUrl && (
                                        <div className="relative inline-block">
                                            <img src={editGiftImageUrl} alt="Gift" className="max-w-[200px] rounded border" />
                                            <Button
                                                type="text" danger size="small"
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => setEditGiftImageUrl('')}
                                                style={{ position: 'absolute', top: 4, right: 4 }}
                                            />
                                        </div>
                                    )}
                                    <Upload
                                        showUploadList={false}
                                        accept="image/*"
                                        beforeUpload={(file) => handleGiftImageUpload(file, setEditGiftImageUrl)}
                                    >
                                        <Button icon={uploadingImage ? <LoadingOutlined /> : <UploadOutlined />} disabled={uploadingImage}>
                                            {editGiftImageUrl ? 'Change Image' : 'Upload Image'}
                                        </Button>
                                    </Upload>
                                </div>
                            </Form.Item>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="startDate" label="Start Date">
                            <DatePicker showTime className="w-full" />
                        </Form.Item>
                        <Form.Item name="endDate" label="End Date" dependencies={['startDate']} rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value) return Promise.resolve();
                                    const start = getFieldValue('startDate');
                                    if (start && !value.isAfter(start)) return Promise.reject('Must be after start date');
                                    return Promise.resolve();
                                },
                            }),
                        ]}>
                            <DatePicker showTime className="w-full" />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="usageLimit" label="Usage Limit" rules={[{ type: 'number', min: 1, message: 'Must be ≥ 1' }]}>
                            <InputNumber min={1} className="w-full" />
                        </Form.Item>
                        <Form.Item name="maxUsagePerUser" label="Max Per User" rules={[{ type: 'number', min: 1, message: 'Must be ≥ 1' }]}>
                            <InputNumber min={1} className="w-full" />
                        </Form.Item>
                    </div>
                    <Form.Item name="status" label="Status">
                        <Select>
                            <Option value="ACTIVE">Active</Option>
                            <Option value="INACTIVE">Inactive</Option>
                        </Select>
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => { setEditOpen(false); setEditingVoucher(null); setEditGiftImageUrl(''); }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Update Voucher</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
