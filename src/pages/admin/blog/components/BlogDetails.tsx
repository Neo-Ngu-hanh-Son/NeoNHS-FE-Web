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
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        {/* <div className="space-y-2">
          <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
            Title
          </Label>
          <Input
            id="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div> */}

        {/* Slug */}
        {/* <div className="space-y-2">
          <Label htmlFor="slug" className={errors.slug ? "text-destructive" : ""}>
            Slug
          </Label>
          <Input
            id="slug"
            placeholder="blog-slug-url"
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            className={errors.slug ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
          <p className="text-xs text-muted-foreground">
            The "slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
          </p>
        </div> */}

        {/* Summary */}
        <div className="space-y-2">
          <Label htmlFor="summary" className={errors.summary ? "text-destructive" : ""}>
            Summary
          </Label>
          <Textarea
            id="summary"
            placeholder="Enter a brief summary..."
            className={`min-h-[100px] ${errors.summary ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
          />
          {errors.summary && <p className="text-xs text-destructive">{errors.summary}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
