import { Card, Table, Tag, Typography } from 'antd';

const { Title } = Typography;

export default function AdminVendorsPage() {
    const columns = [
        { title: 'Vendor Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
            )
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <Card title={<Title level={4}>Vendor Management</Title>}>
                <Table columns={columns} dataSource={[]} locale={{ emptyText: 'No vendors found yet.' }} />
            </Card>
        </div>
    );
}
