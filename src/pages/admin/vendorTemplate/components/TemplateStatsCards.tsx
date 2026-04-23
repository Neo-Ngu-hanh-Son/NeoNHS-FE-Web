import { CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import { AdminTemplateStats } from "./templates/types"

interface TemplateStatsCardsProps {
  stats: AdminTemplateStats
}

export function TemplateStatsCards({ stats }: TemplateStatsCardsProps) {
  const cards = [
    {
      title: "Tổng số mẫu",
      value: stats.total,
      icon: FileText,
      trend: "Tất cả mẫu trong hệ thống",
      colorClass: "text-blue-600 dark:text-blue-400",
      bgColorClass: "bg-blue-50 dark:bg-blue-500/20",
    },
    {
      title: "Chờ duyệt",
      value: stats.pending,
      icon: Clock,
      trend: "Cần phản hồi",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgColorClass: "bg-amber-50 dark:bg-amber-500/20",
    },
    {
      title: "Đã duyệt",
      value: stats.approved,
      icon: CheckCircle,
      trend: "Sống hoạt động",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgColorClass: "bg-emerald-50 dark:bg-emerald-500/20",
    },
    {
      title: "Bị từ chối",
      value: stats.rejected,
      icon: XCircle,
      trend: "Cần chỉnh sửa",
      colorClass: "text-red-600 dark:text-red-400",
      bgColorClass: "bg-red-50 dark:bg-red-500/20",
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="group">
            <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl p-3 transition-colors ${card.bgColorClass}`}>
                  <Icon className={`h-6 w-6 outline-none ${card.colorClass}`} />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="mb-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {card.value}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                <div className="mt-3 text-xs font-medium text-slate-400 dark:text-slate-500">
                  {card.trend}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
