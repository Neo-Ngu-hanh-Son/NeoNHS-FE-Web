/**
 * BlogCategoryModal
 * A single unified modal that handles all blog category operations.
 * Switches content based on the `mode` prop:
 *   - "create" : Shows the form for creating a new category
 *   - "edit"   : Shows the form pre-filled with existing data
 *   - "view"   : Shows read-only details
 *   - "delete" : Shows delete confirmation
 */

import { Modal, Form, Spin, Button, message } from 'antd';
import {
  TagsOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { blogCategoryService } from '@/services/api/blogCategoryService';
import type { BlogCategoryRequest, BlogCategoryResponse } from '@/types/blog';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import BlogCategoryForm from './BlogCategoryForm';
import BlogCategoryViewContent from './BlogCategoryViewContent';
import BlogCategoryDeleteContent from './BlogCategoryDeleteContent';

export type BlogCategoryModalMode = 'create' | 'edit' | 'view' | 'delete' | null;

interface BlogCategoryModalProps {
  mode: BlogCategoryModalMode;
  /** Required for edit/view/delete — ignored for create */
  category: BlogCategoryResponse | null;
  onCancel: () => void;
  onSuccess: () => void;
}

/* ── Per-mode configuration ── */
const MODAL_CONFIG: Record<
  NonNullable<BlogCategoryModalMode>,
  {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
    width: number;
  }
> = {
  create: {
    icon: <TagsOutlined className="text-emerald-700 text-base" />,
    iconBg: 'bg-emerald-100',
    title: 'Add Blog Category',
    subtitle: 'Create a new category for your blog posts',
    width: 520,
  },
  edit: {
    icon: <EditOutlined className="text-amber-700 text-base" />,
    iconBg: 'bg-amber-100',
    title: 'Edit Blog Category',
    subtitle: 'Update the category information below',
    width: 520,
  },
  view: {
    icon: <InfoCircleOutlined className="text-blue-600 text-base" />,
    iconBg: 'bg-blue-100',
    title: 'Category Details',
    subtitle: 'Viewing detailed information about this category',
    width: 560,
  },
  delete: {
    icon: null,
    iconBg: '',
    title: '',
    subtitle: '',
    width: 440,
  },
};

export default function BlogCategoryModal({
  mode,
  category,
  onCancel,
  onSuccess,
}: BlogCategoryModalProps) {
  const [form] = Form.useForm<BlogCategoryRequest>();
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchedCategory, setFetchedCategory] = useState<BlogCategoryResponse | null>(null);

  const isOpen = mode !== null;
  const config = mode ? MODAL_CONFIG[mode] : null;

  // Fetch full category data for view/edit modes (if only ID was passed via the row)
  useEffect(() => {
    if (!isOpen || !category) {
      setFetchedCategory(null);
      return;
    }

    if (mode === 'view') {
      setFetching(true);
      blogCategoryService
        .getCategoryById(category.id)
        .then((res) => setFetchedCategory(res.data))
        .catch((err: unknown) =>
          message.error(getApiErrorMessage(err, 'Failed to load category details.'))
        )
        .finally(() => setFetching(false));
    }

    if (mode === 'edit') {
      setFetching(true);
      blogCategoryService
        .getCategoryById(category.id)
        .then((res) => {
          setFetchedCategory(res.data);
          form.setFieldsValue({
            name: res.data.name,
            description: res.data.description || '',
            status: res.data.status,
          });
        })
        .catch((err: unknown) =>
          message.error(getApiErrorMessage(err, 'Failed to load category data.'))
        )
        .finally(() => setFetching(false));
    }

    if (mode === 'delete') {
      setFetchedCategory(category);
    }
  }, [isOpen, mode, category, form]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setFetchedCategory(null);
      setSubmitting(false);
      setFetching(false);
    }
  }, [isOpen, form]);

  /* ── Handlers ── */
  const handleCreateOrEdit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: BlogCategoryRequest = {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        status: mode === 'edit' ? values.status : 'ACTIVE',
      };

      if (mode === 'create') {
        await blogCategoryService.createCategory(payload);
        message.success('Blog category created successfully!');
      } else if (mode === 'edit' && category) {
        await blogCategoryService.updateCategory(category.id, payload);
        message.success('Blog category updated successfully!');
      }

      form.resetFields();
      onSuccess();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errorFields' in error) return;
      message.error(
        getApiErrorMessage(
          error,
          mode === 'create'
            ? 'Failed to create blog category. Please try again.'
            : 'Failed to update blog category. Please try again.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    try {
      setSubmitting(true);
      await blogCategoryService.deleteCategory(category.id);
      message.success(`Category "${category.name}" has been deleted.`);
      onSuccess();
    } catch (error: unknown) {
      message.error(
        getApiErrorMessage(error, 'Failed to delete blog category. Please try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Footer config per mode ── */
  const getFooter = () => {
    if (mode === 'view') {
      return <Button onClick={onCancel}>Close</Button>;
    }
    if (mode === 'delete') {
      return undefined; // use default OK/Cancel
    }
    return undefined; // use default OK/Cancel for create/edit
  };

  const getOkHandler = () => {
    if (mode === 'create' || mode === 'edit') return handleCreateOrEdit;
    if (mode === 'delete') return handleDelete;
    return undefined;
  };

  const getOkText = () => {
    if (mode === 'create') return 'Create Category';
    if (mode === 'edit') return 'Save Changes';
    if (mode === 'delete') return 'Delete';
    return undefined;
  };

  /* ── Title (not for delete — it handles its own header) ── */
  const renderTitle = () => {
    if (mode === 'delete' || !config) return null;
    return (
      <div className="flex items-center gap-2.5 pb-1">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.iconBg}`}>
          {config.icon}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {config.title}
          </h3>
          <p className="text-xs text-gray-500 font-normal">
            {config.subtitle}
          </p>
        </div>
      </div>
    );
  };

  /* ── Body content ── */
  const renderContent = () => {
    // Loading spinner for view/edit
    if ((mode === 'view' || mode === 'edit') && fetching) {
      return (
        <div className="flex items-center justify-center py-12">
          <Spin size="large" />
        </div>
      );
    }

    switch (mode) {
      case 'create':
        return <BlogCategoryForm form={form} mode="create" />;

      case 'edit':
        return <BlogCategoryForm form={form} mode="edit" />;

      case 'view':
        return fetchedCategory ? (
          <BlogCategoryViewContent category={fetchedCategory} />
        ) : null;

      case 'delete':
        return fetchedCategory ? (
          <BlogCategoryDeleteContent category={fetchedCategory} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Modal
      open={isOpen}
      title={renderTitle()}
      onCancel={onCancel}
      onOk={getOkHandler()}
      okText={getOkText()}
      cancelText="Cancel"
      confirmLoading={submitting}
      okButtonProps={
        mode === 'delete'
          ? { danger: true, className: '!font-semibold' }
          : {
            className:
              '!bg-emerald-700 hover:!bg-emerald-800 !border-emerald-700 !font-semibold',
            disabled: fetching,
          }
      }
      footer={getFooter()}
      width={config?.width ?? 520}
      centered
    >
      {renderContent()}
    </Modal>
  );
}
