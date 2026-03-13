/**
 * BlogCategoryModal
 * A single unified modal that handles all blog category operations.
 * Uses shadcn/ui Dialog for the shell. Ant Design message for notifications.
 *
 * Switches content based on the `mode` prop:
 *   - "create" : Shows the form for creating a new category
 *   - "edit"   : Shows the form pre-filled with existing data
 *   - "view"   : Shows read-only details
 *   - "delete" : Shows delete confirmation
 */

import { message } from 'antd';
import { Tags, Pencil, Info, Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { blogCategoryService } from '@/services/api/blogCategoryService';
import type { BlogCategoryRequest, BlogCategoryResponse } from '@/types/blog';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import BlogCategoryForm, { type BlogCategoryFormErrors } from './BlogCategoryForm';
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
    maxWidth: string;
  }
> = {
  create: {
    icon: <Tags className="h-4 w-4 text-primary" />,
    iconBg: 'bg-primary/15',
    title: 'Add Blog Category',
    subtitle: 'Create a new category for your blog posts',
    maxWidth: 'max-w-lg',
  },
  edit: {
    icon: <Pencil className="h-4 w-4 text-chart-3" />,
    iconBg: 'bg-chart-3/15',
    title: 'Edit Blog Category',
    subtitle: 'Update the category information below',
    maxWidth: 'max-w-lg',
  },
  view: {
    icon: <Info className="h-4 w-4 text-chart-4" />,
    iconBg: 'bg-chart-4/15',
    title: 'Category Details',
    subtitle: 'Viewing detailed information about this category',
    maxWidth: 'max-w-xl',
  },
  delete: {
    icon: null,
    iconBg: '',
    title: '',
    subtitle: '',
    maxWidth: 'max-w-md',
  },
};

const INITIAL_FORM: BlogCategoryRequest = {
  name: '',
  description: '',
  status: 'ACTIVE',
};

export default function BlogCategoryModal({
  mode,
  category,
  onCancel,
  onSuccess,
}: BlogCategoryModalProps) {
  const [formValues, setFormValues] = useState<BlogCategoryRequest>({ ...INITIAL_FORM });
  const [formErrors, setFormErrors] = useState<BlogCategoryFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchedCategory, setFetchedCategory] = useState<BlogCategoryResponse | null>(null);

  const isOpen = mode !== null;
  const config = mode ? MODAL_CONFIG[mode] : null;

  /* ── Form field handler ── */
  const handleFieldChange = useCallback(
    (field: keyof BlogCategoryRequest, value: string) => {
      setFormValues((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  /* ── Validation ── */
  const validate = useCallback((): boolean => {
    const errors: BlogCategoryFormErrors = {};
    const name = formValues.name.trim();

    if (!name) {
      errors.name = 'Please enter a category name';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (name.length > 100) {
      errors.name = 'Name must be at most 100 characters';
    }

    if (formValues.description && formValues.description.length > 500) {
      errors.description = 'Description must be at most 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  /* ── Fetch data for view/edit ── */
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
          message.error(getApiErrorMessage(err, 'Failed to load category details.')),
        )
        .finally(() => setFetching(false));
    }

    if (mode === 'edit') {
      setFetching(true);
      blogCategoryService
        .getCategoryById(category.id)
        .then((res) => {
          setFetchedCategory(res.data);
          setFormValues({
            name: res.data.name,
            description: res.data.description || '',
            status: res.data.status,
          });
        })
        .catch((err: unknown) =>
          message.error(getApiErrorMessage(err, 'Failed to load category data.')),
        )
        .finally(() => setFetching(false));
    }

    if (mode === 'delete') {
      setFetchedCategory(category);
    }
  }, [isOpen, mode, category]);

  /* ── Reset on close ── */
  useEffect(() => {
    if (!isOpen) {
      setFormValues({ ...INITIAL_FORM });
      setFormErrors({});
      setFetchedCategory(null);
      setSubmitting(false);
      setFetching(false);
    }
  }, [isOpen]);

  /* ── Handlers ── */
  const handleCreateOrEdit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload: BlogCategoryRequest = {
        name: formValues.name.trim(),
        description: formValues.description?.trim() || undefined,
        status: mode === 'edit' ? formValues.status : 'ACTIVE',
      };

      if (mode === 'create') {
        await blogCategoryService.createCategory(payload);
        message.success('Blog category created successfully!');
      } else if (mode === 'edit' && category) {
        await blogCategoryService.updateCategory(category.id, payload);
        message.success('Blog category updated successfully!');
      }

      onSuccess();
    } catch (error: unknown) {
      message.error(
        getApiErrorMessage(
          error,
          mode === 'create'
            ? 'Failed to create blog category. Please try again.'
            : 'Failed to update blog category. Please try again.',
        ),
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
        getApiErrorMessage(error, 'Failed to delete blog category. Please try again.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Title ── */
  const renderTitle = () => {
    if (mode === 'delete' || !config) return null;
    return (
      <DialogHeader>
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.iconBg}`}
          >
            {config.icon}
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 leading-tight">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {config.subtitle}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
    );
  };

  /* ── Body ── */
  const renderContent = () => {
    if ((mode === 'view' || mode === 'edit') && fetching) {
      return (
        <div className="space-y-4 py-6">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      );
    }

    switch (mode) {
      case 'create':
        return (
          <BlogCategoryForm
            mode="create"
            values={formValues}
            errors={formErrors}
            onChange={handleFieldChange}
          />
        );
      case 'edit':
        return (
          <BlogCategoryForm
            mode="edit"
            values={formValues}
            errors={formErrors}
            onChange={handleFieldChange}
          />
        );
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

  /* ── Footer ── */
  const renderFooter = () => {
    if (mode === 'view') {
      return (
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </DialogFooter>
      );
    }

    if (mode === 'create' || mode === 'edit') {
      return (
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrEdit}
            disabled={submitting || fetching}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create Category' : 'Save Changes'}
          </Button>
        </DialogFooter>
      );
    }

    if (mode === 'delete') {
      return (
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className={config?.maxWidth ?? 'max-w-lg'}>
        {renderTitle()}

        {/* Hidden title for modal when in delete mode */}
        {mode === 'delete' && (
          <>
            <DialogTitle className="sr-only">Delete Category</DialogTitle>
            <DialogDescription className="sr-only">
              Confirm category deletion
            </DialogDescription>
          </>
        )}

        {renderContent()}
        {renderFooter()}
      </DialogContent>
    </Dialog>
  );
}
