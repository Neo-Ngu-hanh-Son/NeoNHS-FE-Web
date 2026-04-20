/**
 * BlogCategoryForm
 * Shared form content for Create and Edit modes.
 * Uses shadcn/ui Input, Textarea, Label, Select.
 * In "create" mode the status field is hidden (defaults to ACTIVE).
 * In "edit" mode all fields are shown and pre-filled.
 *
 * This is a controlled component — the parent owns the form state.
 * Pass in the independent prop to let this component manage its own state and validation (for use outside of BlogCategorySection).
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
import { Button } from '../ui';

export interface BlogCategoryFormErrors {
  name?: string;
  description?: string;
}

interface BlogCategoryFormProps {
  mode: 'create' | 'edit';
  values: BlogCategoryRequest;
  errors: BlogCategoryFormErrors;
  onChange: (field: keyof BlogCategoryRequest, value: string) => void;
  isIndependent?: boolean; // if true, form manages its own state and validation (for use outside of BlogCategorySection)
  onSubmit?: () => void; // only needed if isIndependent is true
}

export default function BlogCategoryForm({
  mode,
  values,
  errors,
  onChange,
  isIndependent = false,
  onSubmit,
}: BlogCategoryFormProps) {
  return (
    <div className="space-y-5 pt-2">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="category-name" className="text-sm font-medium text-gray-700">
          Tên danh mục <span className="text-red-500">*</span>
        </Label>
        <Input
          id="category-name"
          placeholder="Ví dụ: Mẹo du lịch, Ẩm thực & Văn hóa…"
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
          Mô tả
        </Label>
        <Textarea
          id="category-desc"
          placeholder="Mô tả ngắn gọn nội dung danh mục…"
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
            Trạng thái
          </Label>
          <Select
            value={values.status || 'ACTIVE'}
            onValueChange={(val) => onChange('status', val as BlogCategoryStatus)}
          >
            <SelectTrigger id="category-status">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
              <SelectItem value="ARCHIVED">Đã lưu trữ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {
        isIndependent && (
          <div className="pt-4">
            <Button
              variant={mode === 'create' ? 'default' : 'outline'}
              onClick={onSubmit}
            >
              {mode === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
            </Button>
          </div>
        )
      }
    </div>
  );
}
