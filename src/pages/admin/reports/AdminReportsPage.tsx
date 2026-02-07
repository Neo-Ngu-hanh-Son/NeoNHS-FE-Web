import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

export default function AdminReportsPage() {
    const columns = [
        { title: 'Report Name', dataIndex: 'name', key: 'name' },
        { title: 'Date Generated', dataIndex: 'date', key: 'date' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <Card title={<Title level={4}>System Reports</Title>}>
                <Table columns={columns} dataSource={[]} locale={{ emptyText: 'No reports found yet.' }} />
            </Card>
        </div>
    );
}
