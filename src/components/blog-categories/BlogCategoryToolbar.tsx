/**
 * BlogCategoryToolbar
 * Filter & search bar for the blog category list.
 * Uses Ant Design Input, Select, and Button components.
 */

import { Input, Select, Button, Space, Tooltip } from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  PlusOutlined,
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
  onExport: () => void;
  onAdd: () => void;
}

export function BlogCategoryToolbar({
  searchQuery,
  onSearchChange,
  onSearchApply,
  statusFilter,
  onStatusChange,
  sortIndex,
  onSortChange,
  onExport,
  onAdd
}: BlogCategoryToolbarProps) {
  return (
    <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Space.Compact block orientation='horizontal'>
        <Input
          id="search-input"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onPressEnter={onSearchApply}
          allowClear
          className="max-w-[250px]"
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
          className="max-w-[170px] w-full"
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
          className="max-w-[170px] w-full"
          size="middle"
        />

        <Button
          id="refresh-btn"
          type="primary"
          icon={<SearchOutlined />}
          onClick={onSearchApply}
          size="middle"
          className="!bg-emerald-700 hover:!bg-emerald-800"
        >
          Search
        </Button>
      </Space.Compact>

      <Space.Compact>
        <Button
          id="add-btn"
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          size="middle"
          className="!bg-emerald-700 hover:!bg-emerald-800"
        >
          Add Category
        </Button>
        <Tooltip title="Export categories to CSV">
          <Button
            id="export-btn"
            icon={<ExportOutlined />}
            onClick={onExport}
            className="!border-emerald-200 !text-emerald-700 hover:!bg-emerald-50 !font-semibold"
            size="middle"
          />
        </Tooltip>
      </Space.Compact>
    </div>
  );
}
