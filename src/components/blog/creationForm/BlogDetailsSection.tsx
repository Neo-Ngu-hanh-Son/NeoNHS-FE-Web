import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function BlogDetailsSection({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết bài viết</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Controller
            name={"title"}
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Tiêu đề</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập tiêu đề bài viết"
                    autoComplete="off"
                    className={`${fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        {/* Summary */}
        <FieldGroup>
          <Controller
            name={"summary"}
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="summary">Tóm tắt</FieldLabel>
                  <Textarea
                    {...field}
                    id="summary"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập tóm tắt ngắn..."
                    className={`min-h-[100px] ${fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
