import { useNavigate } from "react-router-dom"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WorkshopTemplateForm } from "./components/workshop-template-form"
import { WorkshopTemplateFormData, CreateWorkshopTemplateRequest } from "./types"
import { WorkshopTemplateService } from "@/services/api/workshopTemplateService"
import { notification } from "antd"
import { useState } from "react"

export default function WorkshopTemplateCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data: WorkshopTemplateFormData) => {
    // Transform form data to API request format
    const createRequest: CreateWorkshopTemplateRequest = {
      name: data.name,
      shortDescription: data.shortDescription || "",
      fullDescription: data.fullDescription || "",
      estimatedDuration: data.estimatedDuration,
      defaultPrice: data.defaultPrice,
      minParticipants: data.minParticipants,
      maxParticipants: data.maxParticipants,
      imageUrls: data.imageUrls,
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
      
      // Navigate to the new template's detail page
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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/vendor/workshop-templates")}
        >
          <ArrowLeftOutlined />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Workshop Template</h1>
          <p className="text-muted-foreground">Fill in the details to create a new workshop template</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Your template will be saved as a <strong>DRAFT</strong>.
            You can edit it anytime before submitting for admin approval.
          </p>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
          <CardDescription>
            Complete all required fields marked with an asterisk (*)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkshopTemplateForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={false}
            submitting={submitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
