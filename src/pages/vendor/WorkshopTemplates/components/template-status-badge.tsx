import { WorkshopStatus } from "../types"
import { Badge } from "@/components/ui/badge"

interface TemplateStatusBadgeProps {
  status: WorkshopStatus
  size?: "sm" | "md" | "lg"
}

export function TemplateStatusBadge({ status, size = "md" }: TemplateStatusBadgeProps) {
  const getStatusConfig = (status: WorkshopStatus) => {
    switch (status) {
      case WorkshopStatus.DRAFT:
        return {
          variant: "secondary" as const,
          label: "DRAFT",
          className: "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
        }
      case WorkshopStatus.PENDING:
        return {
          variant: "default" as const,
          label: "PENDING",
          className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-500",
        }
      case WorkshopStatus.ACTIVE:
        return {
          variant: "default" as const,
          label: "ACTIVE",
          className: "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500",
        }
      case WorkshopStatus.REJECTED:
        return {
          variant: "destructive" as const,
          label: "REJECTED",
          className: "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-500",
        }
    }
  }

  const config = getStatusConfig(status)
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-base px-4 py-1.5" : "text-sm px-3 py-1"

  return (
    <Badge variant={config.variant} className={`${config.className} ${sizeClass} font-semibold`}>
      {config.label}
    </Badge>
  )
}
