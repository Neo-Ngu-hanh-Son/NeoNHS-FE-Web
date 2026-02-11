/**
 * BlogCategoryTable
 * Data table for blog categories with loading, error, and empty states.
 * Uses Ant Design Table, Tag, Tooltip, Button and the shared EmptyState component.
 */

import { Table, Tag, Tooltip, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, EditOutlined, TagsOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { BlogCategoryResponse } from '@/types/blog';
import { getInitials, formatShortDate } from '@/utils/helpers';
import { EmptyState } from '@/components/dashboard/EmptyState';

interface BlogCategoryTableProps {
  categories: BlogCategoryResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export function BlogCategoryTable({
  categories,
  loading,
  error,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onRetry,
}: BlogCategoryTableProps) {
  const navigate = useNavigate();

  const columns: ColumnsType<BlogCategoryResponse> = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
            {getInitials(name)}
          </div>
          <span className="text-sm font-semibold text-gray-800">{name}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag
          color={status === 'ACTIVE' ? 'green' : 'default'}
          className="!rounded-full !px-2.5 !py-0.5 !text-xs !font-semibold"
        >
          {status === 'ACTIVE' ? 'Active' : 'Archived'}
        </Tag>
      ),
    },
    {
      title: 'Number of Posts',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 150,
      align: 'center',
      render: (count: number) => (
        <span className="text-sm font-medium text-gray-600">{count}</span>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => (
        <span className="text-sm text-gray-500">{formatShortDate(date)}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'right',
      render: (_: unknown, record: BlogCategoryResponse) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip title="View details">
            <Button
              id={`view-${record.id}`}
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/blog-categories/${record.id}`)}
              className="!text-gray-400 hover:!text-emerald-700 hover:!bg-emerald-50"
            />
          </Tooltip>
          <Tooltip title="Edit category">
            <Button
              id={`edit-${record.id}`}
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/blog-categories/${record.id}/edit`)}
              className="!text-gray-400 hover:!text-emerald-700 hover:!bg-emerald-50"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // Error state
  if (!loading && error) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={<span className="text-2xl">⚠</span>}
          title={error}
          action={
            <Button
              type="primary"
              onClick={onRetry}
              className="!bg-emerald-700 hover:!bg-emerald-800"
            >
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  // Empty state (only show when not loading and no error)
  if (!loading && !error && categories.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={<TagsOutlined />}
          title="No blog categories found."
          description="Try adjusting your search or filters."
        />
      </div>
    );
  }

  return (
    <Table<BlogCategoryResponse>
      columns={columns}
      dataSource={categories}
      loading={loading}
      rowKey="id"
      className="blog-category-table"
      rowClassName="hover:bg-emerald-50/30 transition-colors"
      pagination={{
        current: currentPage + 1, // Ant uses 1-indexed, our API is 0-indexed
        pageSize,
        total: totalElements,
        showSizeChanger: false,
        showTotal: (total, range) =>
          `Showing ${range[0]} to ${range[1]} of ${total} results`,
        onChange: (page) => onPageChange(page - 1), // Convert back to 0-indexed
      }}
    />
  );
}
