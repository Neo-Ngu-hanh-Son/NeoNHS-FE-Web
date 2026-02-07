import { Button, Table, Tag, Space, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export default function WorkshopTemplatesPage() {
    const dataSource = [
        {
            key: '1',
            name: 'Traditional Pottery Workshop',
            category: 'Arts & Crafts',
            duration: '3 hours',
            status: 'Approved',
            price: '$45',
        },
        {
            key: '2',
            name: 'Local Street Food Tour',
            category: 'Culinary',
            duration: '4 hours',
            status: 'Pending',
            price: '$30',
        }
    ];

    const columns = [
        { title: 'Template Name', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Duration', dataIndex: 'duration', key: 'duration' },
        { title: 'Base Price', dataIndex: 'price', key: 'price' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Approved' ? 'green' : 'orange'}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <Button type="text" icon={<EyeOutlined />} className="text-gray-400 hover:text-primary" />
                    <Button type="text" icon={<EditOutlined />} className="text-gray-400 hover:text-blue-500" />
                    <Button type="text" icon={<DeleteOutlined />} className="text-gray-400 hover:text-red-500" />
                </Space>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Workshop Templates</h1>
                    <p className="text-[#588d70]">Create and manage your workshop definitions</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    className="bg-primary border-0 h-11 px-6 font-medium"
                >
                    New Template
                </Button>
            </div>

            <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
}
