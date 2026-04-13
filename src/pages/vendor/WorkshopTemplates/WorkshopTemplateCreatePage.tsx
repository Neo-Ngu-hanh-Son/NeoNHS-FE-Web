import { useNavigate } from "react-router-dom"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import { WorkshopTemplateForm } from "./components/workshop-template-form"
import { WorkshopTemplateFormData, CreateWorkshopTemplateRequest } from "./types"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { notification } from "antd"
import { useState } from "react"
import { Lightbulb } from "lucide-react"

export default function WorkshopTemplateCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data: WorkshopTemplateFormData) => {
    const createRequest: CreateWorkshopTemplateRequest = {
      name: data.name,
      shortDescription: data.shortDescription || "",
      fullDescription: data.fullDescription || "",
      estimatedDuration: data.estimatedDuration,
      defaultPrice: data.defaultPrice,
      minParticipants: data.minParticipants,
      maxParticipants: data.maxParticipants,
      imageUrls: data.imageUrls as string[],
      thumbnailIndex: data.thumbnailIndex,
      tagIds: data.tagIds,
    }

    try {
      setSubmitting(true)
      const newTemplate = await WorkshopTemplateService.createTemplate(createRequest)

      notification.success({
        message: 'Template Created',
        description: `Template "${newTemplate.name}" has been created as DRAFT.`
      })

      navigate(`/vendor/workshop-templates/${newTemplate.id}`)
    } catch (error: any) {
      console.error('Create failed:', error)
      notification.error({
        message: 'Creation Failed',
        description: error.message || 'Failed to create template. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/vendor/workshop-templates")
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => navigate("/vendor/workshop-templates")}
        >
          <ArrowLeftOutlined />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Template</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the details below. Your template will be saved as a draft.
          </p>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
        <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> Your template will be saved as a <strong>DRAFT</strong>.
          You can edit it anytime before submitting for admin approval.
        </p>
      </div>

      {/* Form (contains its own section cards) */}
      <WorkshopTemplateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
        submitting={submitting}
      />
    </div>
  )
}
