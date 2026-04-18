import { useState, useEffect } from "react"
import { WorkshopSessionResponse, SessionStatus } from "../types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SessionStatusBadge } from "./session-status-badge"
import { Calendar, Users, Eye, Edit, XCircle, Play, CheckCircle } from "lucide-react"
import { formatDate, formatTimeRange, formatPrice, getEnrollmentPercentage } from "../utils/formatters"

interface SessionCardProps {
  session: WorkshopSessionResponse
  onView?: () => void
  onEdit?: () => void
  onCancel?: () => void
  onStart?: () => void
  onComplete?: () => void
}

export function SessionCard({ session, onView, onEdit, onCancel, onStart, onComplete }: SessionCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const thumbnail =
    session.workshopTemplate?.images?.find((img) => img.isThumbnail)?.imageUrl ||
    session.workshopTemplate?.images?.[0]?.imageUrl
  const showImage = Boolean(thumbnail) && !imageFailed

  useEffect(() => {
    setImageFailed(false)
  }, [session.id, thumbnail])

  const canEdit = session.status === SessionStatus.SCHEDULED
  const canCancel = session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.ONGOING
  const canStart = session.status === SessionStatus.SCHEDULED
  const canComplete = session.status === SessionStatus.ONGOING
  const enrollmentPercentage = getEnrollmentPercentage(session.currentEnrollments, session.maxParticipants)
  const isFull = session.availableSlots === 0 && session.status === SessionStatus.SCHEDULED

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white text-card-foreground shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex gap-4 p-4">
        {/* Thumbnail — Đã tăng kích thước lên w-24 h-24 */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-muted dark:border-slate-600">
          {showImage ? (
            <img
              src={thumbnail}
              alt={session.workshopTemplate.name}
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-700">
              <Calendar className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
          )}
          {isFull && (
            <span className="absolute bottom-0 left-0 right-0 bg-destructive/90 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white">
              Kín chỗ
            </span>
          )}
        </div>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-w-0 flex-1 text-base font-semibold leading-snug text-slate-900 dark:text-white">
              {session.workshopTemplate?.name || "Workshop chưa phân loại"}
            </h3>
            <SessionStatusBadge status={session.status} size="sm" />
          </div>

          {/* When — single scan line */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
              <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </span>
            <span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(session.startTime)}</span>
              <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
              <span>{formatTimeRange(session.startTime, session.endTime)}</span>
            </span>
          </div>

          {/* Price + capacity */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatPrice(session.price)}
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                {session.currentEnrollments}/{session.maxParticipants}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">({enrollmentPercentage}%)</span>
            </span>
          </div>

          <Progress value={enrollmentPercentage} className="h-1.5 bg-slate-100 dark:bg-slate-700" />

          {/* Actions — Đã bỏ hidden sm:inline và thêm flex-wrap để tự rớt dòng */}
          <div className="mt-1 flex flex-wrap w-full gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
            {onView && (
              <Button type="button" size="sm" variant="outline" onClick={onView} className="flex-1 min-w-[100px] h-8 gap-1.5 text-xs">
                <Eye className="h-3.5 w-3.5" />
                <span>Chi tiết</span>
              </Button>
            )}

            {canEdit && onEdit && (
              <Button type="button" size="sm" variant="outline" onClick={onEdit} className="flex-1 min-w-[100px] h-8 gap-1.5 text-xs">
                <Edit className="h-3.5 w-3.5" />
                <span>Sửa lịch</span>
              </Button>
            )}

            {canStart && onStart && (
              <Button type="button" size="sm" onClick={onStart} className="flex-1 min-w-[100px] h-8 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90">
                <Play className="h-3.5 w-3.5" />
                <span>Bắt đầu</span>
              </Button>
            )}

            {canComplete && onComplete && (
              <Button type="button" size="sm" onClick={onComplete} className="flex-1 min-w-[100px] h-8 gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Hoàn tất</span>
              </Button>
            )}

            {canCancel && onCancel && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1 min-w-[100px] h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onCancel}
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Hủy phiên</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}