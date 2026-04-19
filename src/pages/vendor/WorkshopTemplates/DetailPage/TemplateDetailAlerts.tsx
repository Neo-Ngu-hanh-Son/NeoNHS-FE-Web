import { Card, CardContent } from "@/components/ui/card"
import { WorkshopStatus, WorkshopTemplateResponse } from "../types"
import { RejectionAlert } from "../components/rejection-alert"

interface TemplateDetailAlertsProps {
  template: WorkshopTemplateResponse;
}

import { Info, AlertCircle, CheckCircle2 } from "lucide-react"

export const TemplateDetailAlerts = ({ template }: TemplateDetailAlertsProps) => {
  return (
    <div className="space-y-4">
      {/* Rejection Alert */}
      {template.status === WorkshopStatus.REJECTED && template.adminNote && (
        <RejectionAlert adminNote={template.adminNote} />
      )}

      {/* Locked Message for PENDING */}
      {template.status === WorkshopStatus.PENDING && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Đang chờ duyệt:</strong> Mẫu này hiện đang được chờ xem xét và không thể chỉnh sửa.
          </p>
        </div>
      )}

      {/* Published / Unpublished banner for ACTIVE */}
      {template.status === WorkshopStatus.ACTIVE && (
        template.isPublished ? (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              <strong>Tuyệt vời:</strong> Mẫu này đã được xuất bản và đang hiển thị cho khách du lịch trong danh mục.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Thông tin:</strong> Mẫu này đã được phê duyệt nhưng chưa được xuất bản. Nhấn 'Xuất bản' để hiển thị cho khách du lịch.
            </p>
          </div>
        )
      )}
    </div>
  )
}
