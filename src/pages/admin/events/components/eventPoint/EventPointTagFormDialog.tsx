import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DragImageUploader from '@/components/common/DragImageUploader';
import { message } from 'antd';
import type { EventPointTagRequest, EventPointTagResponse } from '@/types/eventTimeline';

interface EventPointTagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: EventPointTagResponse | null;
  onSubmit: (data: EventPointTagRequest) => Promise<boolean>;
}

interface FormData {
  name: string;
  description: string;
  tagColor: string;
  iconUrl: string;
}

const DEFAULT_TAG_COLOR = '#0f766e';

const emptyForm: FormData = {
  name: '',
  description: '',
  tagColor: DEFAULT_TAG_COLOR,
  iconUrl: '',
};

export function EventPointTagFormDialog({ open, onOpenChange, tag, onSubmit }: EventPointTagFormDialogProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!tag;

  useEffect(() => {
    if (tag) {
      setForm({
        name: tag.name || '',
        description: tag.description || '',
        tagColor: tag.tagColor || DEFAULT_TAG_COLOR,
        iconUrl: tag.iconUrl || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [tag, open]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Tag name is required';
    }

    if (form.tagColor && !/^#[0-9A-Fa-f]{6}$/.test(form.tagColor)) {
      nextErrors.tagColor = 'Color must be a valid hex color (e.g. #0f766e)';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const name = form.name.trim();
    const payload: EventPointTagRequest = {
      name,
      description: form.description.trim() || name,
      tagColor: form.tagColor.trim() || DEFAULT_TAG_COLOR,
      iconUrl: form.iconUrl.trim() || undefined,
    };

    const success = await onSubmit(payload);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Point Tag' : 'Add Point Tag'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update visual and descriptive information for this tag.'
              : 'Create a reusable tag for event points.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="event-point-tag-name">Tag Name *</Label>
            <Input
              id="event-point-tag-name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Main Stage"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="event-point-tag-description">Description</Label>
            <Textarea
              id="event-point-tag-description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Optional. If empty, it will default to tag name."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="event-point-tag-color">Tag Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="event-point-tag-color"
                  value={form.tagColor}
                  onChange={(e) => handleChange('tagColor', e.target.value)}
                  placeholder="#0f766e"
                />
                <input
                  aria-label="Tag color picker"
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/.test(form.tagColor) ? form.tagColor : DEFAULT_TAG_COLOR}
                  onChange={(e) => handleChange('tagColor', e.target.value)}
                  className="h-10 w-12 rounded border border-input bg-background p-1"
                />
              </div>
              {errors.tagColor && <p className="text-xs text-destructive mt-1">{errors.tagColor}</p>}
            </div>
          </div>

          <div>
            <Label>Marker/Icon</Label>
            <div className="mt-1">
              <DragImageUploader
                value={form.iconUrl}
                onUpload={(url) => handleChange('iconUrl', url)}
                onError={(errorMessage) => message.error(errorMessage)}
                minHeight={140}
                imageClassName="!w-auto max-w-[220px] mx-auto"
                placeholder="Upload marker icon"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
