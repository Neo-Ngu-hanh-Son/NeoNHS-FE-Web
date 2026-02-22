/**
 * BlogCategoryForm
 * Shared form content for Create and Edit modes.
 * Uses shadcn/ui Input, Textarea, Label, Select.
 * In "create" mode the status field is hidden (defaults to ACTIVE).
 * In "edit" mode all fields are shown and pre-filled.
 *
 * This is a controlled component — the parent owns the form state.
 */

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BlogCategoryRequest, BlogCategoryStatus } from '@/types/blog';

export interface BlogCategoryFormErrors {
  name?: string;
  description?: string;
}

interface BlogCategoryFormProps {
  mode: 'create' | 'edit';
  values: BlogCategoryRequest;
  errors: BlogCategoryFormErrors;
  onChange: (field: keyof BlogCategoryRequest, value: string) => void;
}

export default function BlogCategoryForm({
  mode,
  values,
  errors,
  onChange,
}: BlogCategoryFormProps) {
  return (
    <div className="space-y-5 pt-2">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="category-name" className="text-sm font-medium text-gray-700">
          Category Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="category-name"
          placeholder="e.g. Travel Tips, Food & Culture..."
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          maxLength={100}
          className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
        />
        <div className="flex items-center justify-between">
          {errors.name ? (
            <p className="text-xs text-red-500">{errors.name}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-gray-400">{values.name.length}/100</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="category-desc" className="text-sm font-medium text-gray-700">
          Description
        </Label>
        <Textarea
          id="category-desc"
          placeholder="Briefly describe what this category is about..."
          value={values.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          maxLength={500}
          rows={3}
          className={errors.description ? 'border-red-400 focus-visible:ring-red-400' : ''}
        />
        <div className="flex items-center justify-between">
          {errors.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-gray-400">
            {(values.description || '').length}/500
          </p>
        </div>
      </div>

      {/* Status — only visible in edit mode */}
      {mode === 'edit' && (
        <div className="space-y-2">
          <Label htmlFor="category-status" className="text-sm font-medium text-gray-700">
            Status
          </Label>
          <Select
            value={values.status || 'ACTIVE'}
            onValueChange={(val) => onChange('status', val as BlogCategoryStatus)}
          >
            <SelectTrigger id="category-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
