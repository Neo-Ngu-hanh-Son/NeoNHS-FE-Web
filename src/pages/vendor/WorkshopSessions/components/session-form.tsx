import { useState, useEffect } from "react"
import { SingleSessionForm } from "./single-session-form"
import { BatchSessionForm } from "./batch-session-form"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { WorkshopSessionResponse, WorkshopSessionFormData, CreateWorkshopSessionRequest } from "../types"
import { WorkshopTemplateResponse } from "../../WorkshopTemplates/types"
import { TemplateSelector } from "./template-selector"

interface SessionFormProps {
  defaultValues?: WorkshopSessionResponse
  preselectedDate?: Date
  onSubmit: (data: WorkshopSessionFormData) => void
  onBatchSubmit?: (data: CreateWorkshopSessionRequest[]) => void
  onCancel: () => void
  isEditing?: boolean
  submitting?: boolean
  template?: WorkshopTemplateResponse
}

export function SessionForm({
  defaultValues,
  preselectedDate,
  onSubmit,
  onBatchSubmit,
  onCancel,
  isEditing = false,
  submitting = false,
  template,
}: SessionFormProps) {
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(defaultValues?.workshopTemplate?.id)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkshopTemplateResponse | undefined>(template)

  return (
    <div className="space-y-4">
      {/* Shared Template Selector */}
      {!isEditing && (
        <div className="mb-4">
          <TemplateSelector
            value={selectedTemplateId || ""}
            onChange={(id, t) => {
              setSelectedTemplateId(id)
              setSelectedTemplate(t)
            }}
            disabled={submitting || isEditing}
          />
        </div>
      )}

      {/* Mode Toggle - only show when creating a new session */}
      {!isEditing && (
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
          <Button
            type="button"
            size="sm"
            variant={!isBatchMode ? "default" : "ghost"}
            onClick={() => setIsBatchMode(false)}
            className="rounded-md"
          >
            Một Phiên
          </Button>

          <Button
            type="button"
            size="sm"
            variant={isBatchMode ? "default" : "ghost"}
            onClick={() => setIsBatchMode(true)}
            className="gap-1.5 rounded-md"
          >
            <CalendarDays className="w-4 h-4" /> Liên Tiếp
          </Button>
        </div>
      )}

      {/* Render selected mode */}
      {isBatchMode && !isEditing && onBatchSubmit ? (
        <BatchSessionForm
          preselectedDate={preselectedDate}
          onBatchSubmit={onBatchSubmit}
          onCancel={onCancel}
          submitting={submitting}
          template={selectedTemplate}
          externalTemplateId={selectedTemplateId}
        />
      ) : (
        <SingleSessionForm
          defaultValues={defaultValues}
          preselectedDate={preselectedDate}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isEditing={isEditing}
          submitting={submitting}
          template={selectedTemplate}
          externalTemplateId={selectedTemplateId}
        />
      )}
    </div>
  )
}
