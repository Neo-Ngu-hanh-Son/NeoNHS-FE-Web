import { WorkshopStatus } from "../types"
import { Badge } from "@/components/ui/badge"

interface TemplateStatusBadgeProps {
  status: WorkshopStatus
  isPublished?: boolean
  size?: "sm" | "md" | "lg"
}

export function TemplateStatusBadge({ status, isPublished, size = "md" }: TemplateStatusBadgeProps) {
  const getStatusConfig = (status: WorkshopStatus) => {
    switch (status) {
      case WorkshopStatus.DRAFT:
        return {
          variant: "secondary" as const,
          label: "Bản nháp",
          className: "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
        }
      case WorkshopStatus.PENDING:
        return {
          variant: "default" as const,
          label: "Chờ duyệt",
          className: "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-500",
        }
      case WorkshopStatus.ACTIVE:
        if (isPublished) {
          return {
            variant: "default" as const,
            label: "Công khai",
            className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-500",
          }
        }
        return {
          variant: "default" as const,
          label: "Đã duyệt (Chưa công khai)",
          className: "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400",
        }
      case WorkshopStatus.REJECTED:
        return {
          variant: "destructive" as const,
          label: "Bị từ chối",
          className: "bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/40 dark:text-rose-500",
        }
    }
  }

  const config = getStatusConfig(status)
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-base px-4 py-1.5" : "text-sm px-3 py-1.5"

  return (
    <Badge variant={config.variant} className={`${config.className} ${sizeClass} font-semibold shadow-sm border-0 transition-colors`}>
      {config.label}
    </Badge>
  )
}
