import { message } from 'antd';
import { Loader2, Pencil, Tag, TriangleAlert } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { tagService } from '@/services/api/tagService';
import { workshopTagService } from '@/services/api/workshopTagService';
import type { TagResponse, CreateTagRequest, UpdateTagRequest } from '@/types/tag';
import type { AdminTagKind, AdminTagModalMode } from '@/hooks/tag/useAdminTags';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

interface TagModalProps {
  kind: AdminTagKind;
  mode: AdminTagModalMode;
  tag: TagResponse | null;
  onCancel: () => void;
  onSuccess: () => void;
}

interface TagFormValues {
  name: string;
  description: string;
  tagColor: string;
  iconUrl: string;
}

interface TagFormErrors {
  name?: string;
  description?: string;
  tagColor?: string;
  iconUrl?: string;
}

const INITIAL_FORM: TagFormValues = {
  name: '',
  description: '',
  tagColor: '#4caf50',
  iconUrl: '',
};

function isValidUrl(value: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function toFormValues(tag: TagResponse | null): TagFormValues {
  return {
    name: tag?.name ?? '',
    description: tag?.description ?? '',
    tagColor: tag?.tagColor ?? '#4caf50',
    iconUrl: tag?.iconUrl ?? '',
  };
}

export function TagModal({ kind, mode, tag, onCancel, onSuccess }: TagModalProps) {
  const [formValues, setFormValues] = useState<TagFormValues>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<TagFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isOpen = mode !== null;
  const isDelete = mode === 'delete';
  const isRestore = mode === 'restore';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const title = useMemo(() => {
    if (mode === 'create') return `Create ${kind === 'event' ? 'Event' : 'Workshop'} Tag`;
    if (mode === 'edit') return `Edit ${kind === 'event' ? 'Event' : 'Workshop'} Tag`;
    if (mode === 'delete') return 'Delete Tag';
    if (mode === 'restore') return 'Restore Tag';
    return '';
  }, [kind, mode]);

  const subtitle = useMemo(() => {
    if (mode === 'create') return 'Fill in the information to create a new tag.';
    if (mode === 'edit') return 'Update only the fields you want to change.';
    if (mode === 'delete') {
      return kind === 'event'
        ? 'This tag will be deactivated and can be restored later.'
        : 'This action permanently deletes the tag and cannot be undone.';
    }
    if (mode === 'restore') return 'This tag will be active again immediately.';
    return '';
  }, [kind, mode]);

  useEffect(() => {
    if (!isOpen) {
      setFormValues(INITIAL_FORM);
      setFormErrors({});
      setSubmitting(false);
      return;
    }

    if (isEdit && tag) {
      setFormValues(toFormValues(tag));
      setFormErrors({});
    }

    if (isCreate) {
      setFormValues(INITIAL_FORM);
      setFormErrors({});
    }
  }, [isCreate, isEdit, isOpen, tag]);

  const handleFieldChange = useCallback((field: keyof TagFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const errors: TagFormErrors = {};
    const trimmedName = formValues.name.trim();

    if (isCreate && !trimmedName) {
      errors.name = 'Tag name is required';
    }

    if (isEdit && tag && formValues.name !== (tag.name ?? '') && !trimmedName) {
      errors.name = 'Name cannot be empty if provided';
    }

    if (kind === 'workshop') {
      if (trimmedName.length > 100) {
        errors.name = 'Tag name must not exceed 100 characters';
      }
      if (formValues.description.length > 255) {
        errors.description = 'Description must not exceed 255 characters';
      }
      if (formValues.tagColor.length > 20) {
        errors.tagColor = 'Tag color must not exceed 20 characters';
      }
    }

    if (formValues.iconUrl && !isValidUrl(formValues.iconUrl)) {
      errors.iconUrl = 'Icon URL must be a valid URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues, isCreate, isEdit, kind, tag]);

  const buildCreatePayload = (): CreateTagRequest => {
    return {
      name: formValues.name.trim(),
      description: formValues.description.trim() || undefined,
      tagColor: formValues.tagColor.trim() || undefined,
      iconUrl: formValues.iconUrl.trim() || undefined,
    };
  };

  const buildUpdatePayload = (): UpdateTagRequest => {
    if (!tag) return {};

    const payload: UpdateTagRequest = {};

    if (formValues.name !== (tag.name ?? '')) {
      payload.name = formValues.name.trim();
    }
    if (formValues.description !== (tag.description ?? '')) {
      payload.description = formValues.description;
    }
    if (formValues.tagColor !== (tag.tagColor ?? '')) {
      payload.tagColor = formValues.tagColor;
    }
    if (formValues.iconUrl !== (tag.iconUrl ?? '')) {
      payload.iconUrl = formValues.iconUrl.trim();
    }

    return payload;
  };

  const handleCreateOrEdit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (isCreate) {
        const payload = buildCreatePayload();

        if (kind === 'event') {
          await tagService.createTag(payload);
        } else {
          await workshopTagService.createWorkshopTag(payload);
        }

        message.success(`${kind === 'event' ? 'Event' : 'Workshop'} tag created successfully.`);
        onSuccess();
        return;
      }

      if (isEdit && tag) {
        const payload = buildUpdatePayload();
        if (Object.keys(payload).length === 0) {
          message.info('No changes detected.');
          onCancel();
          return;
        }

        if (kind === 'event') {
          await tagService.updateTag(tag.id, payload);
        } else {
          await workshopTagService.updateWorkshopTag(tag.id, payload);
        }

        message.success(`${kind === 'event' ? 'Event' : 'Workshop'} tag updated successfully.`);
        onSuccess();
      }
    } catch (error: unknown) {
      message.error(
        getApiErrorMessage(
          error,
          isCreate ? 'Failed to create tag. Please try again.' : 'Failed to update tag. Please try again.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tag) return;

    try {
      setSubmitting(true);
      if (kind === 'event') {
        await tagService.deleteTag(tag.id);
      } else {
        await workshopTagService.deleteWorkshopTag(tag.id);
      }
      message.success(
        kind === 'event' ? 'Tag deleted successfully.' : 'Workshop tag deleted successfully.',
      );
      onSuccess();
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Failed to delete tag. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestore = async () => {
    if (!tag) return;

    try {
      setSubmitting(true);
      await tagService.restoreTag(tag.id);
      message.success('Tag restored successfully.');
      onSuccess();
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Failed to restore tag. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderForm = () => {
    return (
      <div className="space-y-5 pt-2">
        <div className="space-y-2">
          <Label htmlFor="tag-name" className="text-sm font-medium text-gray-700">
            Tag Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tag-name"
            placeholder="e.g. Health, Cooking..."
            value={formValues.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                setFormErrors((prev) => ({ ...prev, name: 'Tag name is required' }));
              }
            }}
            maxLength={100}
            className={formErrors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
          />
          <div className="flex items-center justify-between">
            {formErrors.name ? <p className="text-xs text-red-500">{formErrors.name}</p> : <span />}
            {kind === 'workshop' && <p className="text-xs text-gray-400">{formValues.name.length}/100</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag-description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="tag-description"
            placeholder="Describe this tag..."
            value={formValues.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            maxLength={kind === 'workshop' ? 255 : 500}
            rows={3}
            className={formErrors.description ? 'border-red-400 focus-visible:ring-red-400' : ''}
          />
          <div className="flex items-center justify-between">
            {formErrors.description ? (
              <p className="text-xs text-red-500">{formErrors.description}</p>
            ) : (
              <span />
            )}
            {kind === 'workshop' && <p className="text-xs text-gray-400">{formValues.description.length}/255</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag-color" className="text-sm font-medium text-gray-700">
            Tag Color
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="tag-color-picker"
              type="color"
              value={formValues.tagColor || '#4caf50'}
              onChange={(e) => handleFieldChange('tagColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              id="tag-color"
              placeholder="#4CAF50"
              value={formValues.tagColor}
              onChange={(e) => handleFieldChange('tagColor', e.target.value)}
              maxLength={20}
              className={formErrors.tagColor ? 'border-red-400 focus-visible:ring-red-400' : ''}
            />
          </div>
          <div className="flex items-center justify-between">
            {formErrors.tagColor ? <p className="text-xs text-red-500">{formErrors.tagColor}</p> : <span />}
            {kind === 'workshop' && <p className="text-xs text-gray-400">{formValues.tagColor.length}/20</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag-icon" className="text-sm font-medium text-gray-700">
            Icon URL
          </Label>
          <Input
            id="tag-icon"
            placeholder="https://example.com/icon.png"
            value={formValues.iconUrl}
            onChange={(e) => handleFieldChange('iconUrl', e.target.value)}
            className={formErrors.iconUrl ? 'border-red-400 focus-visible:ring-red-400' : ''}
          />
          {formErrors.iconUrl && <p className="text-xs text-red-500">{formErrors.iconUrl}</p>}

          {isValidUrl(formValues.iconUrl) && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-border p-2 bg-muted/40">
              <img
                src={formValues.iconUrl}
                alt="Tag icon preview"
                className="h-8 w-8 rounded object-cover border border-border"
              />
              <span className="text-xs text-muted-foreground">Icon preview</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!tag) return null;

    return (
      <div className="flex flex-col items-center text-center pt-2 pb-1">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <TriangleAlert className="h-7 w-7 text-destructive" />
        </div>

        <h3 className="text-lg font-bold text-foreground mb-1">
          {isRestore ? 'Restore this tag?' : 'Delete this tag?'}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>

        <div className="w-full flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/15">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-xs font-bold text-destructive">
            {tag.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{tag.name}</p>
            <p className="text-xs text-muted-foreground">{tag.description || 'No description provided.'}</p>
          </div>
        </div>

        {kind === 'workshop' && isDelete && (
          <p className="text-xs text-destructive mt-3">This action CANNOT be undone.</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg border-border rounded-2xl px-6 py-5">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
              {isDelete || isRestore ? (
                <TriangleAlert className="h-4 w-4 text-destructive" />
              ) : isEdit ? (
                <Pencil className="h-4 w-4 text-primary" />
              ) : (
                <Tag className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-gray-900 leading-tight">{title}</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">{subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isDelete || isRestore ? renderConfirmation() : renderForm()}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>

          {isDelete && (
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          )}

          {isRestore && (
            <Button onClick={handleRestore} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Restore
            </Button>
          )}

          {(isCreate || isEdit) && (
            <Button onClick={handleCreateOrEdit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isCreate ? 'Create Tag' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TagModal;
