import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogForm } from "@/contexts/Blog/BlogFormContext";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function BlogDetails({ form }: { form: UseFormReturn<z.infer<typeof formSchema>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Controller
            name={"title"}
            control={form.control}
            render={({ field, fieldState, formState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter blog title"
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
            render={({ field, fieldState, formState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="summary">Summary</FieldLabel>
                  <Textarea
                    {...field}
                    id="summary"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter a brief summary..."
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
