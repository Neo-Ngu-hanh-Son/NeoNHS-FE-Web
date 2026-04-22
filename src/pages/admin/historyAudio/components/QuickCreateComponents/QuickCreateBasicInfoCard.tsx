import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DragImageUploader,
  Input,
} from '@/components';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { quickCreateFormSchema } from './schemas/QuickCreateFormSchema';
import z from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';

type QuickCreateFormValues = z.infer<typeof quickCreateFormSchema>;

interface QuickCreateBasicInfoCardProps {
  form: UseFormReturn<QuickCreateFormValues>;
}

/**
 * Base information input form for quick create flow. This includes title, artist, cover image and script content. The data collected from this form will be used as the basis for AI to generate translations and audio.
 **/
export default function QuickCreateBasicInfoCard({ form }: QuickCreateBasicInfoCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>1. Nhập thông tin cơ bản</CardTitle>
        <CardDescription>
          Thông tin này sẽ được dùng làm nền tảng để tạo âm thanh lịch sử tự động bằng AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="mb-3 flex flex-row justify-between">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">Tiêu đề</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Nhập tiêu đề"
                  autoComplete="on"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="artist"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="artist">Tác giả</FieldLabel>
                <Input
                  {...field}
                  id="artist"
                  aria-invalid={fieldState.invalid}
                  placeholder="Nhập tên tác giả"
                  autoComplete="on"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="flex flex-row justify-between">
          <Controller
            control={form.control}
            name="script"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="script">Kịch bản</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="script"
                    placeholder="Nhập kịch bản"
                    rows={8}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums text-sm">{field.value.length}/2000 kí tự</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="coverImage"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="coverImage">Ảnh bìa</FieldLabel>
                <DragImageUploader
                  className="h-full"
                  onUpload={(url: string) => {
                    form.setValue('coverImage', url, { shouldDirty: true, shouldValidate: true });
                  }}
                  value={field.value}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
