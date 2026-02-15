import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogForm } from "@/contexts/Blog/BlogFormContext";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function BlogCategory({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  const { categories, loadingCategories } = useBlogForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Blog Category</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="category"
                    aria-invalid={fieldState.invalid}
                    className={
                      fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCategories ? (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        Loading...
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        No categories found
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
