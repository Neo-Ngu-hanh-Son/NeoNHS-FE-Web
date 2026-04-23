import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { BlogFormSchema } from '@/components/blog/type';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

export default function BlogTagsSection({ form }: { form: UseFormReturn<z.infer<typeof BlogFormSchema>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thẻ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tags">Thẻ</FieldLabel>
                <Input
                  {...field}
                  id="tags"
                  placeholder="Du lịch, Hướng dẫn, Mẹo hay"
                  aria-invalid={fieldState.invalid}
                  className={fieldState.invalid ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground mt-2">Các thẻ cách nhau bằng dấu phẩy.</p>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
