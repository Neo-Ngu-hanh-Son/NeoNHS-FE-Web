import { Card, CardContent } from "@/components/ui/card"
import { WorkshopStatus, WorkshopTemplateResponse } from "../types"
import { RejectionAlert } from "../components/rejection-alert"

interface TemplateDetailAlertsProps {
  template: WorkshopTemplateResponse;
}

export const TemplateDetailAlerts = ({ template }: TemplateDetailAlertsProps) => {
  return (
    <>
      {/* Rejection Alert */}
      {template.status === WorkshopStatus.REJECTED && template.adminNote && (
        <RejectionAlert adminNote={template.adminNote} />
      )}

      {/* Locked Message for PENDING/ACTIVE */}
      {template.status === WorkshopStatus.PENDING && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              ⏳ This template is currently under review and cannot be edited.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Published / Unpublished banner for ACTIVE */}
      {template.status === WorkshopStatus.ACTIVE && (
        <Card className={template.isPublished
          ? "border-green-200 bg-green-50 dark:bg-green-950/20"
          : "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
        }>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              {template.isPublished
                ? "🟢 This template is published and visible to tourists in the public catalog."
                : "ℹ️ This template is approved but not yet published. Click 'Publish' to make it visible to tourists."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
