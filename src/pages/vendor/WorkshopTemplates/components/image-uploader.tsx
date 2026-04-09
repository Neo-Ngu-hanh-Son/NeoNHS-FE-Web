import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CloseOutlined, PictureOutlined, StarOutlined, StarFilled, UploadOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card } from "@/components/ui/card"
import { Upload, message } from "antd"
import type { RcFile } from "antd/es/upload"
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary"
import { useState, useRef } from "react"

interface ImageUploaderProps {
  imageUrls: (string | File)[]
  thumbnailIndex: number
  onChange: (imageUrls: (string | File)[], thumbnailIndex: number) => void
  error?: string
  disabled?: boolean
}

export function ImageUploader({
  imageUrls,
  thumbnailIndex,
  onChange,
  error,
  disabled,
}: ImageUploaderProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const batchFilesRef = useRef<File[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRemoveImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    let newThumbnailIndex = thumbnailIndex

    // If we're removing the thumbnail, set the first image as thumbnail
    if (index === thumbnailIndex) {
      newThumbnailIndex = 0
    } else if (index < thumbnailIndex) {
      // If we're removing an image before the thumbnail, adjust the index
      newThumbnailIndex = thumbnailIndex - 1
    }

    onChange(newUrls, newUrls.length > 0 ? newThumbnailIndex : 0)
  }

  const handleSetThumbnail = (index: number) => {
    onChange(imageUrls, index)
  }

  const handleBeforeUpload = async (file: RcFile) => {
    batchFilesRef.current.push(file as unknown as File);

    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(() => {
      const newFiles = batchFilesRef.current;
      batchFilesRef.current = [];

      const validFiles: File[] = [];
      let hasError = false;

      for (const f of newFiles) {
        // Validate image file
        const validationError = validateImageFile(f as RcFile, 5);
        if (validationError) {
          messageApi.error(validationError);
          hasError = true;
          continue;
        }

        // Check for duplicates
        const isDuplicate = imageUrls.some(item => {
          if (item instanceof File) {
            return item.name === f.name && item.size === f.size;
          }
          return false;
        });

        if (isDuplicate) {
          messageApi.warning({
            content: `Image ${f.name} has already been added!`,
            key: 'upload',
          });
          continue;
        }

        // Check if duplicate within current batch
        const isDuplicateInBatch = validFiles.some(item => item.name === f.name && item.size === f.size);
        if (!isDuplicateInBatch) {
          validFiles.push(f);
        }
      }

      if (validFiles.length > 0) {
        onChange([...imageUrls, ...validFiles], thumbnailIndex);
      } else if (!hasError && newFiles.length > 0) {
        // All were duplicates
      }
    }, 50);

    // Prevent default upload behavior
    return false
  }

  return (
    <>
      {contextHolder}
      <div className="space-y-4">
        <div>
          <Label>Workshop Images *</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Add at least 1 image. Click the star to set as thumbnail.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex gap-2">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            disabled={disabled}
            multiple={true}
          >
            <Button type="button" variant="outline" disabled={disabled}>
              <>
                <UploadOutlined className="mr-2" />
                Select Images
              </>
            </Button>
          </Upload>
        </div>

        {/* Image Grid */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((item, index) => {
              const url = item instanceof File ? URL.createObjectURL(item) : item;
              return (
                <Card key={index} className="relative group overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={url}
                      alt={`Workshop image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=Invalid+Image"
                      }}
                    />

                    {/* Thumbnail Badge */}
                    {index === thumbnailIndex && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                        <StarFilled />
                        Thumbnail
                      </div>
                    )}

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetThumbnail(index)}
                        disabled={disabled || index === thumbnailIndex}
                        className="text-xs"
                      >
                        {index === thumbnailIndex ? <StarFilled className="mr-1" /> : <StarOutlined className="mr-1" />}
                        Set Thumbnail
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(index)}
                        disabled={disabled}
                      >
                        <CloseOutlined />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {imageUrls.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
            <PictureOutlined className="text-4xl text-gray-400 mb-3" />
            <p className="text-sm text-muted-foreground">
              No images added yet. Upload an image above.
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    </>
  )
}
