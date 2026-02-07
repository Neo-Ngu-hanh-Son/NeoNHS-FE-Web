import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

export default function AdminTicketsPage() {
    const columns = [
        { title: 'Ticket ID', dataIndex: 'id', key: 'id' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <Card title={<Title level={4}>Ticket Management</Title>}>
                <Table columns={columns} dataSource={[]} locale={{ emptyText: 'No tickets found yet.' }} />
            </Card>
        </div>
    );
}
