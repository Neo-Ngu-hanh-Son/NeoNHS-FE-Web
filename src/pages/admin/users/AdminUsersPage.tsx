import { useState } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { TeamOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Input, Select, Button, Table, Tag, Space } from 'antd';

const { Option } = Select;

export function AdminUsersPage() {
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Mock data - replace with actual API call
    const users = [
        {
            key: '1',
            fullname: 'John Doe',
            email: 'john@example.com',
            role: 'TOURIST',
            status: 'Active',
            verified: true,
        },
        {
            key: '2',
            fullname: 'Jane Smith',
            email: 'jane@example.com',
            role: 'VENDOR',
            status: 'Active',
            verified: true,
        },
        {
            key: '3',
            fullname: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'TOURIST',
            status: 'Banned',
            verified: false,
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                const colors: Record<string, string> = {
                    ADMIN: 'red',
                    VENDOR: 'purple',
                    TOURIST: 'blue',
                };
                return <Tag color={colors[role]}>{role}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
            ),
        },
        {
            title: 'Verified',
            dataIndex: 'verified',
            key: 'verified',
            render: (verified: boolean) => (
                <Tag color={verified ? 'green' : 'orange'}>
                    {verified ? 'Verified' : 'Unverified'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Button type="link" size="small">View</Button>
                    <Button type="link" size="small">Edit</Button>
                    <Button type="link" danger size="small">Ban</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-8">
            <DashboardCard>
                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <Input
                        placeholder="Search users..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="max-w-xs"
                    />
                    <Select
                        value={roleFilter}
                        onChange={setRoleFilter}
                        className="w-40"
                        suffixIcon={<FilterOutlined />}
                    >
                        <Option value="all">All Roles</Option>
                        <Option value="TOURIST">Tourist</Option>
                        <Option value="VENDOR">Vendor</Option>
                        <Option value="ADMIN">Admin</Option>
                    </Select>
                </div>

                {/* Users Table */}
                {users.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={users}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} users`,
                        }}
                    />
                ) : (
                    <EmptyState
                        icon={<TeamOutlined />}
                        title="No users found"
                        description="No users match your search criteria"
                    />
                )}
            </DashboardCard>
        </div>
    );
}

export default AdminUsersPage;
