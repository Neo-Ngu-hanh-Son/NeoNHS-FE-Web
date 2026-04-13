import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CloseOutlined, PictureOutlined, StarOutlined, StarFilled, UploadOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card } from "@/components/ui/card"
import { Upload, message, Image as AntImage } from "antd"
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

        {/* Image Previews — 2 per row */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {imageUrls.map((item, index) => {
              const url = item instanceof File ? URL.createObjectURL(item) : item;
              const isThumbnail = index === thumbnailIndex;

              return (
                <Card key={index} className="relative group overflow-hidden">
                  <div className="relative aspect-square">
                    
                    {/* Ant Design Image */}
                    <AntImage
                      src={url}
                      alt={`Workshop image ${index + 1}`}
                      className="object-cover w-full h-full"
                      rootClassName="absolute inset-0 w-full h-full"
                      fallback="https://via.placeholder.com/400x400?text=Invalid"
                      // Tắt mask preview mặc định của Ant để không bị đè với UI hover của bạn
                      preview={{ mask: <div className="hidden"></div> }} 
                    />

                    {/* Thumbnail Badge */}
                    {isThumbnail && (
                      <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-sm z-10">
                        <StarFilled />
                        Thumbnail
                      </div>
                    )}

                    {/* Overlay Controls */}
                    {/* Thêm pointer-events-none và z-10 vào overlay, pointer-events-auto vào buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 pointer-events-none z-10">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="text-[11px] h-7 px-2 pointer-events-auto"
                        onClick={() => handleSetThumbnail(index)}
                        disabled={disabled || isThumbnail}
                      >
                        {isThumbnail ? <StarFilled className="mr-1" /> : <StarOutlined className="mr-1" />}
                        {isThumbnail ? "Thumbnail" : "Set Thumbnail"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="text-[11px] h-7 px-2 pointer-events-auto"
                        onClick={() => handleRemoveImage(index)}
                        disabled={disabled}
                      >
                        <CloseOutlined className="mr-1" />
                        Remove
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