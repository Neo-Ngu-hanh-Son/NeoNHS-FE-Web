import { SessionStatus } from "../types"
import { Badge } from "@/components/ui/badge"

interface SessionStatusBadgeProps {
  status: SessionStatus
  size?: "sm" | "md" | "lg"
}

export function SessionStatusBadge({ status, size = "md" }: SessionStatusBadgeProps) {
  const getStatusConfig = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED:
        return {
          variant: "default" as const,
          label: "SCHEDULED",
          className: "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500",
        }
      case SessionStatus.ONGOING:
        return {
          variant: "default" as const,
          label: "ONGOING",
          className: "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-500",
        }
      case SessionStatus.COMPLETED:
        return {
          variant: "secondary" as const,
          label: "COMPLETED",
          className: "bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
        }
      case SessionStatus.CANCELLED:
        return {
          variant: "destructive" as const,
          label: "CANCELLED",
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
