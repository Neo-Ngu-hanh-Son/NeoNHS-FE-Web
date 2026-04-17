import { WorkshopSessionResponse, SessionStatus } from "../types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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
  const thumbnail = session.workshopTemplate?.images?.find(img => img.isThumbnail)?.imageUrl 
    || session.workshopTemplate?.images?.[0]?.imageUrl

  const canEdit = session.status === SessionStatus.SCHEDULED
  const canCancel = session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.ONGOING
  const canStart = session.status === SessionStatus.SCHEDULED
  const canComplete = session.status === SessionStatus.ONGOING
  const enrollmentPercentage = getEnrollmentPercentage(session.currentEnrollments, session.maxParticipants)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group rounded-2xl border-slate-100 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      {/* Thumbnail Image */}
      {thumbnail && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={thumbnail}
            alt={session.workshopTemplate.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
            }}
          />
          <div className="absolute top-3 right-3">
            <SessionStatusBadge status={session.status} size="sm" />
          </div>
          {session.availableSlots === 0 && session.status === SessionStatus.SCHEDULED && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-center py-1 text-sm font-semibold tracking-wider">
              KÍN CHỖ
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3 px-5 pt-5">
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight text-slate-800 dark:text-slate-200">
          {session.workshopTemplate?.name || 'Workshop chưa phân loại'}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pb-5 flex-1">
        {/* Date and Time */}
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="font-medium">{formatDate(session.startTime)}</p>
            <p className="text-muted-foreground">{formatTimeRange(session.startTime, session.endTime)}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-500/10 p-2 rounded-xl">
          <span className="font-bold text-orange-600 dark:text-orange-400 text-lg px-1">{formatPrice(session.price)}</span>
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {session.currentEnrollments} / {session.maxParticipants}
              </span>
            </div>
            <span className="text-muted-foreground font-semibold text-emerald-600 dark:text-emerald-400">{enrollmentPercentage}%</span>
          </div>
          <Progress value={enrollmentPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Tags */}
        {session.workshopTemplate?.tags && session.workshopTemplate.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {session.workshopTemplate.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: tag.tagColor + "40",
                  backgroundColor: tag.tagColor + "10",
                  color: tag.tagColor,
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {session.workshopTemplate.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{session.workshopTemplate.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4 px-5 pb-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
        <div className="flex gap-2 w-full">
          {onView && (
            <Button size="sm" variant="outline" onClick={onView} className="flex-1 rounded-xl bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border-none">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Chi tiết
            </Button>
          )}
          {canEdit && onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Sửa lịch
            </Button>
          )}
          {canCancel && onCancel && (
            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-2" onClick={onCancel}>
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
        {(canStart || canComplete) && (
          <div className="flex gap-2 w-full pt-1">
            {canStart && onStart && (
              <Button size="sm" onClick={onStart} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm">
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Bắt đầu lớp
              </Button>
            )}
            {canComplete && onComplete && (
              <Button size="sm" onClick={onComplete} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Hoàn tất
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
