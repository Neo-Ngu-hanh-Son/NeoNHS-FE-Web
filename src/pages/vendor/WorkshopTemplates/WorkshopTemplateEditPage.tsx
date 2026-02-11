import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WorkshopTemplateForm } from "./components/workshop-template-form"
import { WorkshopTemplateFormData, UpdateWorkshopTemplateRequest, WorkshopStatus } from "./types"
import { mockWorkshopTemplates } from "./data"
import { TemplateStatusBadge } from "./components/template-status-badge"
import { RejectionAlert } from "./components/rejection-alert"
import { SubmitApprovalDialog } from "./components/submit-approval-dialog"

export default function WorkshopTemplateEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const template = mockWorkshopTemplates.find((t) => t.id === id)
  const [submitDialog, setSubmitDialog] = useState(false)

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-2xl font-bold">Template Not Found</h2>
        <p className="text-muted-foreground">The workshop template you're trying to edit doesn't exist.</p>
        <Button onClick={() => navigate("/vendor/workshop-templates")}>
          Back to Templates
        </Button>
      </div>
    )
  }

  // Check if template can be edited
  const canEdit = template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED
  
  if (!canEdit) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/vendor/workshop-templates/${id}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Cannot Edit Template</h1>
            <p className="text-muted-foreground">{template.name}</p>
          </div>
        </div>

        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <p className="font-medium">
              ⚠️ This template is currently <TemplateStatusBadge status={template.status} size="sm" /> and cannot be edited.
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              {template.status === WorkshopStatus.PENDING 
                ? "The template is under admin review. Please wait for approval or rejection."
                : "This template is active and published. Contact admin to make changes."
              }
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate(`/vendor/workshop-templates/${id}`)}
            >
              View Template Details
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = (data: WorkshopTemplateFormData) => {
    // Transform form data to API request format
    const updateRequest: UpdateWorkshopTemplateRequest = {
      name: data.name,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      estimatedDuration: data.estimatedDuration,
      defaultPrice: data.defaultPrice,
      minParticipants: data.minParticipants,
      maxParticipants: data.maxParticipants,
      imageUrls: data.imageUrls,
      thumbnailIndex: data.thumbnailIndex,
      tagIds: data.tagIds,
    }
    
    // TODO: Call API to update template
    console.log("Updating template:", id, updateRequest)
    // In real implementation:
    // const updatedTemplate = await workshopTemplateApi.update(id, updateRequest)
    // Template stays in DRAFT or REJECTED status after update
    // navigate(`/vendor/workshop-templates/${id}`)
    
    // Navigate to detail page
    navigate(`/vendor/workshop-templates/${id}`)
  }

  const handleCancel = () => {
    navigate(`/vendor/workshop-templates/${id}`)
  }

  const handleSubmitForApproval = () => {
    // TODO: Call API to submit for approval
    console.log("Submitting template for approval:", id)
    // In real implementation:
    // await workshopTemplateApi.register(id)
    // Status changes to PENDING
    navigate(`/vendor/workshop-templates/${id}`)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Edit Workshop Template</h1>
              <TemplateStatusBadge status={template.status} size="sm" />
            </div>
            <p className="text-muted-foreground">{template.name}</p>
          </div>
        </div>

        {/* Submit for Approval Button */}
        <Button
          onClick={() => setSubmitDialog(true)}
          variant="default"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit for Approval
        </Button>
      </div>

      {/* Rejection Alert */}
      {template.status === WorkshopStatus.REJECTED && template.rejectReason && (
        <RejectionAlert rejectReason={template.rejectReason} />
      )}

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <p className="text-sm">
            💡 <strong>Tip:</strong> After saving your changes, you can submit this template for admin approval. 
            Once submitted, you won't be able to edit it until it's approved or rejected.
          </p>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm">
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
          <CardDescription>
            Update the details of your workshop template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkshopTemplateForm
            defaultValues={template}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={true}
          />
        </CardContent>
      </Card>

      {/* Submit for Approval Dialog */}
      <SubmitApprovalDialog
        open={submitDialog}
        onOpenChange={setSubmitDialog}
        templateName={template.name}
        onConfirm={handleSubmitForApproval}
      />
    </div>
  )
}
