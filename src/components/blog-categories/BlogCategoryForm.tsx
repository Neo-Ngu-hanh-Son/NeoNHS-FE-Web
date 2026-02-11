/**
 * BlogCategoryForm
 * Shared form content for Create and Edit modes.
 * In "create" mode the status field is hidden (defaults to ACTIVE).
 * In "edit" mode all fields are shown and pre-filled.
 */

import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';
import type { BlogCategoryRequest, BlogCategoryStatus } from '@/types/blog';

const { TextArea } = Input;

const STATUS_OPTIONS: { label: string; value: BlogCategoryStatus }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Archived', value: 'ARCHIVED' },
];

interface BlogCategoryFormProps {
  form: FormInstance<BlogCategoryRequest>;
  mode: 'create' | 'edit';
}

export default function BlogCategoryForm({ form, mode }: BlogCategoryFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      initialValues={{ status: 'ACTIVE' }}
      className="pt-3"
    >
      {/* Category Name */}
      <Form.Item
        name="name"
        label={
          <span className="text-sm font-medium text-gray-700">
            Category Name
          </span>
        }
        rules={[
          { required: true, message: 'Please enter a category name' },
          { min: 2, message: 'Name must be at least 2 characters' },
          { max: 100, message: 'Name must be at most 100 characters' },
        ]}
      >
        <Input
          placeholder="e.g. Travel Tips, Food & Culture..."
          size="large"
          maxLength={100}
          showCount
          className="!rounded-lg"
        />
      </Form.Item>

      {/* Description */}
      <Form.Item
        name="description"
        label={
          <span className="text-sm font-medium text-gray-700">
            Description
          </span>
        }
        rules={[
          { max: 500, message: 'Description must be at most 500 characters' },
        ]}
      >
        <TextArea
          placeholder="Briefly describe what this category is about..."
          rows={3}
          maxLength={500}
          showCount
          className="!rounded-lg"
        />
      </Form.Item>

      {/* Status — only visible in edit mode */}
      {mode === 'edit' && (
        <Form.Item
          name="status"
          label={
            <span className="text-sm font-medium text-gray-700">Status</span>
          }
        >
          <Select
            options={STATUS_OPTIONS}
            size="large"
            className="!rounded-lg"
          />
        </Form.Item>
      )}
    </Form>
  );
}
