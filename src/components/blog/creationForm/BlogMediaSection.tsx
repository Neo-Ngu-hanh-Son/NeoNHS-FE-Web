import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary";
import { message } from "antd";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function BlogMediaSection({ form }: { form: UseFormReturn<z.infer<typeof formSchema>> }) {
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        message.error(error);
        return;
      }
      try {
        const url = await uploadImageToCloudinary(file);
        if (url) {
          onChange(url);
        } else {
          message.error("Error uploading image, please try again");
        }
      } catch (error) {
        message.error("Error uploading image, please try again");
      }
    } else {
      message.error("No file selected");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Thumbnail URL */}
        <FieldGroup>
          <Controller
            name="thumbnailUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="thumbnail">Thumbnail URL</FieldLabel>
                <Input
                  id="thumbnail"
                  type="file"
                  onChange={(e) => handleUploadImage(e, field.onChange)}
                  className={fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}
                  accept="image/*"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                {field.value && !fieldState.invalid && (
                  <div className="mt-2 rounded-md overflow-hidden aspect-video border bg-muted relative group">
                    <img
                      src={field.value}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        form.setError("thumbnailUrl", { message: "Invalid image URL" });
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = "block";
                        form.clearErrors("thumbnailUrl");
                      }}
                    />
                  </div>
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Banner URL */}
        <FieldGroup>
          <Controller
            name="bannerUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="banner">Banner URL</FieldLabel>
                <Input
                  id="banner"
                  type="file"
                  onChange={(e) => handleUploadImage(e, field.onChange)}
                  className={fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}
                  accept="image/*"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                {field.value && !fieldState.invalid && (
                  <div className="mt-2 rounded-md overflow-hidden aspect-[21/9] border bg-muted relative group">
                    <img
                      src={field.value}
                      alt="Banner preview"
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        form.setError("bannerUrl", { message: "Invalid image URL" });
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = "block";
                        form.clearErrors("bannerUrl");
                      }}
                    />
                  </div>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
