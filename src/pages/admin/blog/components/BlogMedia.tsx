import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlogForm } from "@/contexts/Blog/BlogFormContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary";
import { useState } from "react";
import { message } from "antd";

export default function BlogMedia() {
  const { formData, handleInputChange, errors, setErrors } = useBlogForm();

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
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
          handleInputChange(type as keyof typeof formData, url);
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
        <div className="space-y-2">
          <Label htmlFor="thumbnail" className={errors.thumbnailUrl ? "text-destructive" : ""}>
            Thumbnail URL
          </Label>
          <Input
            id="thumbnail"
            type="file"
            placeholder="https://example.com/image.jpg"
            onChange={(e) => handleUploadImage(e, "thumbnailUrl")}
            className={errors.thumbnailUrl ? "border-destructive focus-visible:ring-destructive" : ""}
            accept="image/*"
          />
          {errors.thumbnailUrl && <p className="text-xs text-destructive">{errors.thumbnailUrl}</p>}
          {formData.thumbnailUrl && !errors.thumbnailUrl && (
            <div className="mt-2 rounded-md overflow-hidden aspect-video border bg-muted relative group">
              <img
                src={formData.thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  setErrors((prev) => ({ ...prev, thumbnailUrl: "Invalid image URL" }));
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.thumbnailUrl;
                    return newErrors;
                  });
                }}
              />
            </div>
          )}
        </div>

        {/* Banner URL */}
        <div className="space-y-2">
          <Label htmlFor="banner" className={errors.bannerUrl ? "text-destructive" : ""}>
            Banner URL
          </Label>
          <Input
            id="banner"
            type="file"
            placeholder="https://example.com/banner.jpg"
            onChange={(e) => handleUploadImage(e, "bannerUrl")}
            className={errors.bannerUrl ? "border-destructive focus-visible:ring-destructive" : ""}
            accept="image/*"
          />
          {errors.bannerUrl && <p className="text-xs text-destructive">{errors.bannerUrl}</p>}
          {formData.bannerUrl && !errors.bannerUrl && (
            <div className="mt-2 rounded-md overflow-hidden aspect-[21/9] border bg-muted relative group">
              <img
                src={formData.bannerUrl}
                alt="Banner preview"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  setErrors((prev) => ({ ...prev, bannerUrl: "Invalid image URL" }));
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.bannerUrl;
                    return newErrors;
                  });
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
