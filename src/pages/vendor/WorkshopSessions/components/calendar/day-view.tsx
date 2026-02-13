import { WorkshopSessionResponse, SessionStatus } from "../../types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SessionStatusBadge } from "../session-status-badge"
import { Eye, Edit, XCircle, Clock, Users, DollarSign } from "lucide-react"
import { formatTimeRange, formatPrice, formatAvailability, isSameDay } from "../../utils/formatters"
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
  const hours = Array.from({ length: 15 }, (_, i) => i + 6) // 6 AM to 8 PM

  // Get sessions for the selected date
  const daySessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime)
    return isSameDay(sessionDate, currentDate)
  }).sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
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
          const hourSessions = daySessions.filter(session => {
            const startHour = new Date(session.startTime).getHours()
            return startHour === hour
          })

          const timeLabel = hour === 0 ? '12:00 AM' 
            : hour < 12 ? `${hour}:00 AM` 
            : hour === 12 ? '12:00 PM' 
            : `${hour - 12}:00 PM`

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
                      const thumbnail = session.workshopTemplate.images.find(img => img.isThumbnail)?.imageUrl 
                        || session.workshopTemplate.images[0]?.imageUrl
                      const canEdit = session.status === SessionStatus.SCHEDULED
                      const canCancel = session.status === SessionStatus.SCHEDULED && session.currentEnrollments > 0

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
                                  alt={session.workshopTemplate.name}
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
                                    {session.workshopTemplate.name}
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
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onSessionClick(session)
                                  }}
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                  View
                                </Button>
                                {canEdit && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onSessionEdit(session)
                                    }}
                                  >
                                    <Edit className="w-3.5 h-3.5 mr-1" />
                                    Edit
                                  </Button>
                                )}
                                {canCancel && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onSessionCancel(session)
                                    }}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  // Empty time slot
                  <div
                    onClick={() => onEmptySlotClick(currentDate, hour)}
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
