import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Image as ImageIcon, Star } from "lucide-react"
import { Card } from "@/components/ui/card"

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
  const [newImageUrl, setNewImageUrl] = useState("")
  const [urlError, setUrlError] = useState("")

  const handleAddImage = () => {
    const url = newImageUrl.trim()
    
    if (!url) {
      setUrlError("Please enter an image URL")
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setUrlError("Please enter a valid URL")
      return
    }

    if (imageUrls.includes(url)) {
      setUrlError("This image URL has already been added")
      return
    }

    onChange([...imageUrls, url], thumbnailIndex)
    setNewImageUrl("")
    setUrlError("")
  }

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddImage()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Workshop Images *</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Add at least 1 image. Click the star to set as thumbnail.
        </p>
      </div>

      {/* Add Image Input */}
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={newImageUrl}
          onChange={(e) => {
            setNewImageUrl(e.target.value)
            setUrlError("")
          }}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddImage}
          disabled={disabled || !newImageUrl.trim()}
          variant="outline"
        >
          Add Image
        </Button>
      </div>

      {urlError && (
        <p className="text-sm text-red-500">{urlError}</p>
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
                    <Star className="w-3 h-3 fill-current" />
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
                    <Star className={`w-3 h-3 mr-1 ${index === thumbnailIndex ? "fill-current" : ""}`} />
                    Set Thumbnail
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                  >
                    <X className="w-4 h-4" />
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
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-muted-foreground">
            No images added yet. Add at least one image URL above.
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
