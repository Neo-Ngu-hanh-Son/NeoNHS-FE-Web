import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CloseOutlined, PictureOutlined, StarOutlined, StarFilled, UploadOutlined } from "@ant-design/icons"
import { Card } from "@/components/ui/card"
import { Upload, message } from "antd"
import type { RcFile } from "antd/es/upload"

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

  const handleBeforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
      return Upload.LIST_IGNORE
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const url = reader.result as string
      if (imageUrls.includes(url)) {
        message.warning("This image has already been added")
        return
      }
      onChange([...imageUrls, url], thumbnailIndex)
    }

    // Prevent auto upload since we handle it locally
    return false
  }

  return (
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
        >
          <Button type="button" variant="outline" disabled={disabled}>
            <UploadOutlined className="mr-2" />
            Upload Image
          </Button>
        </Upload>
      </div>

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
  )
}
