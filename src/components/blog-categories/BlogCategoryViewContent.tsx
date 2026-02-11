/**
 * BlogCategoryViewContent
 * Read-only detail content for viewing a blog category.
 */

import { Descriptions, Tag } from 'antd';
import {
  TagsOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { BlogCategoryResponse } from '@/types/blog';
import { formatShortDate, getInitials } from '@/utils/helpers';

interface BlogCategoryViewContentProps {
  category: BlogCategoryResponse;
}

export default function BlogCategoryViewContent({
  category,
}: BlogCategoryViewContentProps) {
  return (
    <div className="pt-3 space-y-5">
      {/* Category name banner */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800">
          {getInitials(category.name)}
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">
            {category.name}
          </h4>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            /{category.slug}
          </p>
          <Tag
            color={category.status === 'ACTIVE' ? 'green' : 'default'}
            className="!mt-1 !rounded-full !text-xs !font-semibold"
          >
            {category.status === 'ACTIVE' ? 'Active' : 'Archived'}
          </Tag>
        </div>
      </div>

      {/* Details */}
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item
          label={
            <span className="flex items-center gap-1.5 text-gray-600">
              <LinkOutlined /> Slug
            </span>
          }
        >
          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
            {category.slug}
          </code>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-1.5 text-gray-600">
              <FileTextOutlined /> Description
            </span>
          }
        >
          <span className="text-gray-700">
            {category.description || (
              <span className="text-gray-400 italic">No description provided</span>
            )}
          </span>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-1.5 text-gray-600">
              <TagsOutlined /> Number of Posts
            </span>
          }
        >
          <span className="font-semibold text-gray-800">
            {category.postCount}
          </span>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span className="flex items-center gap-1.5 text-gray-600">
              <CalendarOutlined /> Created Date
            </span>
          }
        >
          {formatShortDate(category.createdAt)}
        </Descriptions.Item>

        {category.updatedAt && (
          <Descriptions.Item
            label={
              <span className="flex items-center gap-1.5 text-gray-600">
                <CalendarOutlined /> Last Updated
              </span>
            }
          >
            {formatShortDate(category.updatedAt)}
          </Descriptions.Item>
        )}
      </Descriptions>
    </div>
  );
}
