import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

export default function AdminEventsPage() {
    const columns = [
        { title: 'Event Name', dataIndex: 'name', key: 'name' },
        { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    ];

    return (
        <div className="p-8">
            <Card title={<Title level={4}>Event Management</Title>}>
                <Table columns={columns} dataSource={[]} locale={{ emptyText: 'No events found yet.' }} />
            </Card>
        </div>
    );
}
