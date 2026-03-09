import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CloseOutlined, PictureOutlined, StarOutlined, StarFilled, UploadOutlined, LoadingOutlined } from "@ant-design/icons"
import { Card } from "@/components/ui/card"
import { Upload, message } from "antd"
import type { RcFile } from "antd/es/upload"
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary"
import { useState } from "react"

interface ImageUploaderProps {
  imageUrls: string[]
  thumbnailIndex: number
  onChange: (imageUrls: string[], thumbnailIndex: number) => void
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
  const [uploading, setUploading] = useState(false);

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
    // 1. Validate image file
    const validationError = validateImageFile(file, 5) // Max 5MB
    if (validationError) {
      messageApi.error(validationError)
      return Upload.LIST_IGNORE
    }

    // 2. Upload to Cloudinary
    setUploading(true)
    messageApi.loading({
      content: 'Uploading image to Cloudinary...',
      key: 'upload',
      duration: 0, // Keep showing until we dismiss it
    })

    try {
      const cloudinaryUrl = await uploadImageToCloudinary(file)
      
      if (!cloudinaryUrl) {
        throw new Error('Failed to get Cloudinary URL')
      }

      // 3. Check for duplicates
      if (imageUrls.includes(cloudinaryUrl)) {
        messageApi.warning({
          content: 'This image has already been added!',
          key: 'upload',
        })
        return Upload.LIST_IGNORE
      }

      // 4. Add Cloudinary URL to the list
      onChange([...imageUrls, cloudinaryUrl], thumbnailIndex)

      // 5. Show success message
      messageApi.success({
        content: 'Image uploaded successfully!',
        key: 'upload',
      })
    } catch (error: any) {
      console.error('Upload failed:', error)
      messageApi.error({
        content: error.message || 'Failed to upload image. Please try again.',
        key: 'upload',
      })
    } finally {
      setUploading(false)
    }

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
            disabled={disabled || uploading}
          >
            <Button type="button" variant="outline" disabled={disabled || uploading}>
              {uploading ? (
                <>
                  <LoadingOutlined className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadOutlined className="mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </Upload>
        </div>

        {/* Upload Info */}
        {uploading && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ⏳ Uploading image... Please wait.
            </p>
          </div>
        )}

        {/* Image Grid */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
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
            ))}
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
