/**
 * BlogCategoryToolbar
 * Filter & search bar for the blog category list.
 * Uses Ant Design Input, Select, and Button components.
 */

import { Input, Select, Button, Space } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import type { BlogCategoryStatus } from '@/types/blog';
import {
  BLOG_CATEGORY_STATUS_OPTIONS,
  BLOG_CATEGORY_SORT_OPTIONS,
} from '@/constants/blogCategory';

interface BlogCategoryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchApply: () => void;
  statusFilter: BlogCategoryStatus | '';
  onStatusChange: (value: BlogCategoryStatus | '') => void;
  sortIndex: number;
  onSortChange: (index: number) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export function BlogCategoryToolbar({
  searchQuery,
  onSearchChange,
  onSearchApply,
  statusFilter,
  onStatusChange,
  sortIndex,
  onSortChange,
  onRefresh,
  onExport,
}: BlogCategoryToolbarProps) {
  return (
    <div className="space-y-4">
      <Space className="flex items-center gap-3">
        <Input
          id="search-input"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onPressEnter={onSearchApply}
          allowClear
          className="flex-1"
          size="middle"
        />

        <Select
          id="status-filter"
          value={statusFilter}
          onChange={onStatusChange}
          options={BLOG_CATEGORY_STATUS_OPTIONS.map((o) => ({
            label: `Status: ${o.label}`,
            value: o.value,
          }))}
          className="w-[170px]"
          size="middle"
        />

        <Select
          id="sort-filter"
          value={sortIndex}
          onChange={onSortChange}
          options={BLOG_CATEGORY_SORT_OPTIONS.map((o, i) => ({
            label: `Sort: ${o.label}`,
            value: i,
          }))}
          className="w-[170px]"
          size="middle"
        />

        <Button
          id="refresh-btn"
          type="primary"
          icon={<SearchOutlined />}
          onClick={onRefresh}
          size="middle"
          className="!bg-emerald-700 hover:!bg-emerald-800"
        >
          Search
        </Button>
        <Button
          id="export-btn"
          icon={<ExportOutlined />}
          onClick={onExport}
          className="!border-emerald-200 !text-emerald-700 hover:!bg-emerald-50 !font-semibold"
          size='middle'
        >
          Export
        </Button>
      </Space>
    </div>
  );
}
