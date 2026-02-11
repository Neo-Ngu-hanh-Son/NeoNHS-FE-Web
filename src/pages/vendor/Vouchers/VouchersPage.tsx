import { Button, Table, Tag, Space, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';

export default function VouchersPage() {
    const dataSource = [
        {
            key: '1',
            code: 'HELLO2024',
            discount: '15%',
            usage: '45/100',
            status: 'Active',
            expiry: '2025-12-31',
        }
    ];

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
            )
        },
        { title: 'Discount', dataIndex: 'discount', key: 'discount' },
        { title: 'Usage Limit', dataIndex: 'usage', key: 'usage' },
        { title: 'Expiry Date', dataIndex: 'expiry', key: 'expiry' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color="green">{status.toUpperCase()}</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" icon={<DeleteOutlined />} danger />
                </Space>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Vouchers Management</h1>
                    <p className="text-[#588d70]">Create discount codes to attract more customers</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-primary border-0 h-11 px-6 font-medium"
                >
                    Create Voucher
                </Button>
            </div>

            <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                />
            </Card>
        </div>
    );
}
