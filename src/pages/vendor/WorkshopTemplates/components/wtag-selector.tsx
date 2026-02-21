import { useState, useEffect } from "react"
import { WTagResponse } from "../types"
import { CheckOutlined } from "@ant-design/icons"
import { Label } from "@/components/ui/label"
import { WTagService } from "@/services/api/wtagService"
import { notification } from "antd"

interface WTagSelectorProps {
  selectedTagIds: string[]
  onChange: (tagIds: string[]) => void
  error?: string
  disabled?: boolean
}

export function WTagSelector({ selectedTagIds, onChange, error, disabled }: WTagSelectorProps) {
  const [tags, setTags] = useState<WTagResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const data = await WTagService.getAllTags()
      setTags(data)
    } catch (error: any) {
      console.error('Failed to fetch tags:', error)
      notification.error({
        message: 'Failed to Load Tags',
        description: error.message || 'Unable to fetch workshop tags. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTag = (tagId: string) => {
    if (disabled) return

    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId))
    } else {
      onChange([...selectedTagIds, tagId])
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Categories / Tags *</Label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Categories / Tags *</Label>
        <span className="text-sm text-muted-foreground">
          {selectedTagIds.length} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map(tag => {
          const isSelected = selectedTagIds.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleToggleTag(tag.id)}
              disabled={disabled}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                ${isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tag.tagColor }}
              />
              <span className="font-medium text-sm">{tag.name}</span>
              {isSelected && (
                <CheckOutlined className="text-primary ml-1" />
              )}
            </button>
          )
        })}
      </div>

      {selectedTagIds.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Select at least 1 category for your workshop
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
