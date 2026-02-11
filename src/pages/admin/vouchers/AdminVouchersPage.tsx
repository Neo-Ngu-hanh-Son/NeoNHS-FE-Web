import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

export default function AdminVouchersPage() {
    const columns = [
        { title: 'Voucher Code', dataIndex: 'code', key: 'code' },
        { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <Card title={<Title level={4}>Voucher Management</Title>}>
                <Table columns={columns} dataSource={[]} locale={{ emptyText: 'No vouchers found yet.' }} />
            </Card>
        </div>
    );
}
