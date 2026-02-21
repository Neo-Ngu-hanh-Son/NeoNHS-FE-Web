import { useState, useEffect } from "react"
import { WorkshopTemplateResponse, WorkshopStatus } from "../../WorkshopTemplates/types"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { formatPrice, formatDuration } from "../../WorkshopTemplates/utils/formatters"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { notification } from "antd"

interface TemplateSelectorProps {
  value: string
  onChange: (templateId: string, template: WorkshopTemplateResponse | undefined) => void
  error?: string
  disabled?: boolean
}

export function TemplateSelector({ value, onChange, error, disabled }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<WorkshopTemplateResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkshopTemplateResponse | undefined>()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await WorkshopTemplateService.getMyTemplates({
        page: 0,
        size: 100,
        sortBy: 'name',
        sortDirection: 'ASC',
      })
      
      // Filter only ACTIVE templates (can create sessions only from ACTIVE templates)
      const activeTemplates = (response.content || []).filter(t => t.status === WorkshopStatus.ACTIVE)
      setTemplates(activeTemplates)
    } catch (error: any) {
      console.error('Failed to fetch templates:', error)
      notification.error({
        message: 'Failed to Load Templates',
        description: error.message || 'Unable to fetch workshop templates. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (value) {
      const template = templates.find(t => t.id === value)
      setSelectedTemplate(template)
    } else {
      setSelectedTemplate(undefined)
    }
  }, [value, templates])

  const handleChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    setSelectedTemplate(template)
    onChange(templateId, template)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Workshop Template *</Label>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Workshop Template *</Label>
        <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ No active templates available. Please create and activate a workshop template first.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label>Workshop Template *</Label>
      
      <Select value={value} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select a workshop template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              <div className="flex items-center gap-2">
                {template.images[0] && (
                  <img
                    src={template.images.find(img => img.isThumbnail)?.imageUrl || template.images[0].imageUrl}
                    alt={template.name}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/32x32?text=No+Image"
                    }}
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(template.estimatedDuration)} • {formatPrice(template.defaultPrice)}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      {/* Template Preview */}
      {selectedTemplate && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex gap-4">
            {selectedTemplate.images[0] && (
              <img
                src={selectedTemplate.images.find(img => img.isThumbnail)?.imageUrl || selectedTemplate.images[0].imageUrl}
                alt={selectedTemplate.name}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80x80?text=No+Image"
                }}
              />
            )}
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold">{selectedTemplate.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {selectedTemplate.shortDescription}
              </p>
              <div className="flex gap-4 text-sm">
                <span>Duration: {formatDuration(selectedTemplate.estimatedDuration)}</span>
                <span>•</span>
                <span>Price: {formatPrice(selectedTemplate.defaultPrice)}</span>
                <span>•</span>
                <span>Max: {selectedTemplate.maxParticipants} people</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
