import { useState, useEffect } from "react"
import { WorkshopSessionResponse, SessionStatus } from "../types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SessionStatusBadge } from "./session-status-badge"
import { Calendar, Users, Eye, Edit, XCircle, Play, CheckCircle } from "lucide-react"
import { formatDate, formatTimeRange, formatPrice, getEnrollmentPercentage } from "../utils/formatters"
import {
  canCompleteWorkshopSession,
  canEditWorkshopSession,
  canStartWorkshopSession,
  getCompleteWorkshopSessionBlockReason,
  getEditWorkshopSessionBlockReason,
  getStartWorkshopSessionBlockReason,
} from "../utils/workshopSessionRules"

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

  const editBlockedReason =
    session.status === SessionStatus.SCHEDULED ? getEditWorkshopSessionBlockReason(session) : null
  const canEditAction = session.status === SessionStatus.SCHEDULED && onEdit

  const startBlockedReason =
    session.status === SessionStatus.SCHEDULED ? getStartWorkshopSessionBlockReason(session) : null
  const canStartAction = session.status === SessionStatus.SCHEDULED && onStart

  const completeBlockedReason =
    session.status === SessionStatus.ONGOING ? getCompleteWorkshopSessionBlockReason(session) : null
  const canCompleteAction = session.status === SessionStatus.ONGOING && onComplete

  const canCancel = session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.ONGOING
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
            <span className={`font-semibold tabular-nums ${session.price === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {session.price === 0 ? 'Miễn phí' : formatPrice(session.price)}
            </span>
            {session.maxParticipants !== 999999 && (
              <>
                <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                    {session.currentEnrollments}/{session.maxParticipants}
                  </span>
                  {session.maxParticipants !== 999999 && (
                    <span className="text-emerald-600 dark:text-emerald-400">({enrollmentPercentage}%)</span>
                  )}
                </span>
              </>
            )}
            {session.maxParticipants === 999999 && (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                  Không giới hạn
                </span>
              </span>
            )}
          </div>

          {session.maxParticipants !== 999999 && (
            <Progress value={enrollmentPercentage} className="h-1.5 bg-slate-100 dark:bg-slate-700" />
          )}

          {/* Actions — tooltip khi nút bị khóa theo quy tắc backend */}
          <TooltipProvider delayDuration={200}>
            <div className="mt-1 flex w-full flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
              {onView && (
                <Button type="button" size="sm" variant="outline" onClick={onView} className="h-8 min-w-[100px] flex-1 gap-1.5 text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Chi tiết</span>
                </Button>
              )}

              {canEditAction &&
                (canEditWorkshopSession(session) ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onEdit}
                    className="h-8 min-w-[100px] flex-1 gap-1.5 text-xs"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Sửa lịch</span>
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex min-w-[100px] flex-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled
                          className="h-8 w-full gap-1.5 text-xs"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Sửa lịch</span>
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-left">
                      <p>{editBlockedReason}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

              {canStartAction &&
                (canStartWorkshopSession(session) ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={onStart}
                    className="h-8 min-w-[100px] flex-1 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Bắt đầu</span>
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex min-w-[100px] flex-1">
                        <Button
                          type="button"
                          size="sm"
                          disabled
                          className="h-8 w-full gap-1.5 bg-primary/80 text-xs text-primary-foreground"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Bắt đầu</span>
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-left">
                      <p>{startBlockedReason}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

              {canCompleteAction &&
                (canCompleteWorkshopSession(session) ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={onComplete}
                    className="h-8 min-w-[100px] flex-1 gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Hoàn tất</span>
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex min-w-[100px] flex-1">
                        <Button type="button" size="sm" disabled className="h-8 w-full gap-1.5 bg-blue-600/80 text-xs text-white">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Hoàn tất</span>
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-left">
                      <p>{completeBlockedReason}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

              {canCancel && onCancel && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 min-w-[100px] flex-1 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={onCancel}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Hủy phiên</span>
                </Button>
              )}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  )
}