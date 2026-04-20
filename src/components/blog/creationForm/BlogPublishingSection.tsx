import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogStatus } from '@/types/blog';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { BlogFormSchema } from '@/components/blog/type';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

export default function BlogPublishingSection({
  form,
  isCreating,
}: {
  form: UseFormReturn<z.infer<typeof BlogFormSchema>>;
  isCreating: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Công khai</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <FieldGroup>
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="status">Trạng thái</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BlogStatus.DRAFT}>Bản nháp</SelectItem>
                    <SelectItem value={BlogStatus.PUBLISHED}>Công khai</SelectItem>
                    {!isCreating && <SelectItem value={BlogStatus.ARCHIVED}>Lưu trữ</SelectItem>}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Featured Switch */}
        <FieldGroup>
          <Controller
            name="isFeatured"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-base cursor-pointer">
                    Nổi bật
                  </Label>
                  <p className="text-xs text-muted-foreground">Ghim bài viết lên đầu danh sách</p>
                </div>
                <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
