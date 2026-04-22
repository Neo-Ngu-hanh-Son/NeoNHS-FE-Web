import { WorkshopSessionResponse, SessionStatus } from "../../types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SessionStatusBadge } from "../session-status-badge"
import {
  canEditWorkshopSession,
  getEditWorkshopSessionBlockReason,
} from "../../utils/workshopSessionRules"
import { Eye, Edit, XCircle, Clock, Users, DollarSign } from "lucide-react"
import {
  formatTimeRange,
  formatPrice,
  formatAvailability,
  isSessionOnVietnamCalendarDay,
  getVietnamHour,
  parseSessionInstant,
} from "../../utils/formatters"
import { cn } from "@/lib/utils"

interface DayViewProps {
  currentDate: Date
  sessions: WorkshopSessionResponse[]
  onSessionClick: (session: WorkshopSessionResponse) => void
  onSessionEdit: (session: WorkshopSessionResponse) => void
  onSessionCancel: (session: WorkshopSessionResponse) => void
  onEmptySlotClick: (date: Date, hour: number) => void
}

export function DayView({ 
  currentDate, 
  sessions, 
  onSessionClick, 
  onSessionEdit, 
  onSessionCancel,
  onEmptySlotClick 
}: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i + 1) // 1 AM to 12 AM (24 hours)

  // Get sessions for the selected date
  const daySessions = sessions
    .filter((session) =>
      isSessionOnVietnamCalendarDay(session.startTime, currentDate)
    )
    .sort(
      (a, b) =>
        parseSessionInstant(a.startTime).getTime() -
        parseSessionInstant(b.startTime).getTime()
    )

  // Format date header
  const dateHeader = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="space-y-4">
      {/* Date Header */}
      <div className="text-center py-4 bg-primary/5 rounded-lg">
        <h2 className="text-xl font-bold">{dateHeader}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {daySessions.length} session{daySessions.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {hours.map(hour => {
          const actualHour = hour % 24 // Convert 24 to 0 for midnight
          const hourSessions = daySessions.filter(
            (session) => getVietnamHour(session.startTime) === actualHour
          )

          const timeLabel = actualHour === 0 ? '12:00 AM' 
            : actualHour < 12 ? `${actualHour}:00 AM` 
            : actualHour === 12 ? '12:00 PM' 
            : `${actualHour - 12}:00 PM`

          return (
            <div key={hour} className="flex gap-4">
              {/* Time Label */}
              <div className="w-24 text-sm text-muted-foreground font-medium pt-2 text-right shrink-0">
                {timeLabel}
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {hourSessions.length > 0 ? (
                  <div className="space-y-2">
                    {hourSessions.map(session => {
                      const thumbnail = session.workshopTemplate?.images?.find(img => img.isThumbnail)?.imageUrl 
                        || session.workshopTemplate?.images?.[0]?.imageUrl
                      const canCancel =
                        session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.ONGOING
                      const showEditSlot = session.status === SessionStatus.SCHEDULED
                      const editBlockedReason = showEditSlot ? getEditWorkshopSessionBlockReason(session) : null

                      return (
                        <Card
                          key={session.id}
                          className={cn(
                            "overflow-hidden border-l-4 hover:shadow-md transition-all cursor-pointer",
                            session.status === SessionStatus.SCHEDULED && "border-l-green-500",
                            session.status === SessionStatus.ONGOING && "border-l-blue-500",
                            session.status === SessionStatus.COMPLETED && "border-l-gray-500",
                            session.status === SessionStatus.CANCELLED && "border-l-red-500"
                          )}
                          onClick={() => onSessionClick(session)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {/* Thumbnail */}
                              {thumbnail && (
                                <img
                                  src={thumbnail}
                                  alt={session.workshopTemplate?.name || 'Workshop'}
                                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/80x80?text=No+Image"
                                  }}
                                />
                              )}

                              {/* Details */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-semibold text-lg">
                                    {session.workshopTemplate?.name || 'Unnamed Workshop'}
                                  </h3>
                                  <SessionStatusBadge status={session.status} size="sm" />
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatTimeRange(session.startTime, session.endTime)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {session.currentEnrollments}/{session.maxParticipants}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    {formatPrice(session.price)}
                                  </div>
                                </div>

                                {/* Availability */}
                                <div className={cn(
                                  "text-sm font-medium",
                                  session.availableSlots === 0 ? "text-red-500" : "text-green-600"
                                )}>
                                  {formatAvailability(session.availableSlots)}
                                </div>

                                {/* Tags */}
                                {session.workshopTemplate?.tags && session.workshopTemplate.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {session.workshopTemplate.tags.slice(0, 3).map(tag => (
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
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <TooltipProvider delayDuration={200}>
                                <div className="flex shrink-0 flex-col gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onSessionClick(session)
                                    }}
                                  >
                                    <Eye className="mr-1 h-3.5 w-3.5" />
                                    Xem
                                  </Button>
                                  {showEditSlot &&
                                    (canEditWorkshopSession(session) ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onSessionEdit(session)
                                        }}
                                      >
                                        <Edit className="mr-1 h-3.5 w-3.5" />
                                        Sửa
                                      </Button>
                                    ) : (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span>
                                            <Button size="sm" variant="outline" disabled>
                                              <Edit className="mr-1 h-3.5 w-3.5" />
                                              Sửa
                                            </Button>
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="left" className="max-w-xs text-left">
                                          <p>{editBlockedReason}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                  {canCancel && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onSessionCancel(session)
                                      }}
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </TooltipProvider>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  // Empty time slot
                  <div
                    onClick={() => onEmptySlotClick(currentDate, actualHour)}
                    className="border-2 border-dashed rounded-lg p-4 text-center text-muted-foreground hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer min-h-[60px] flex items-center justify-center"
                  >
                    <span className="text-sm">+ Add session</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {daySessions.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-lg font-semibold mb-2">No sessions scheduled for this day</p>
          <p className="text-muted-foreground mb-4">
            Click on any time slot above to create a new session
          </p>
        </Card>
      )}
    </div>
  )
}
