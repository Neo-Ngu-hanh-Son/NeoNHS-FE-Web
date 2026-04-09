import { WorkshopSessionResponse, SessionStatus } from "../../types"
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatTime,
  isSessionOnVietnamCalendarDay,
  vietnamDateKeyFromCalendarDate,
} from "../../utils/formatters"
import { cn } from "@/lib/utils"

interface MonthViewProps {
  currentDate: Date
  sessions: WorkshopSessionResponse[]
  onDateClick: (date: Date) => void
  onSessionClick: (session: WorkshopSessionResponse) => void
}

export function MonthView({ currentDate, sessions, onDateClick, onSessionClick }: MonthViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)
  const today = new Date()

  // Create array of all days in the month grid
  const days: (Date | null)[] = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) =>
      isSessionOnVietnamCalendarDay(session.startTime, date)
    )
  }

  // Get status color for indicator dot
  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED: return 'bg-green-500'
      case SessionStatus.ONGOING: return 'bg-blue-500'
      case SessionStatus.COMPLETED: return 'bg-gray-500'
      case SessionStatus.CANCELLED: return 'bg-red-500'
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-4">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            // Empty cell before month starts
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dateSessions = getSessionsForDate(date)
          const isToday =
            vietnamDateKeyFromCalendarDate(date) ===
            vietnamDateKeyFromCalendarDate(today)
          const isPast = date < today && !isToday
          const hasScheduledSessions = dateSessions.some(s => s.status === SessionStatus.SCHEDULED)

          return (
            <div
              key={date.toISOString()}
              onClick={() => onDateClick(date)}
              className={cn(
                "aspect-square border rounded-lg p-2 cursor-pointer transition-all hover:border-primary hover:shadow-md",
                isToday && "border-primary border-2 bg-primary/5",
                isPast && "bg-gray-50 dark:bg-gray-900/50",
                hasScheduledSessions && "bg-green-50 dark:bg-green-950/20"
              )}
            >
              {/* Date Number */}
              <div className={cn(
                "text-sm font-semibold mb-1",
                isToday && "text-primary",
                isPast && "text-muted-foreground"
              )}>
                {date.getDate()}
              </div>

              {/* Session Indicators */}
              {dateSessions.length > 0 && (
                <div className="space-y-1">
                  {/* Status Dots (max 3 shown) */}
                  <div className="flex gap-1 flex-wrap">
                    {dateSessions.slice(0, 3).map((session, idx) => (
                      <div
                        key={session.id}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getStatusColor(session.status)
                        )}
                        title={session.workshopTemplate?.name || 'Workshop'}
                      />
                    ))}
                    {dateSessions.length > 3 && (
                      <span className="text-[10px] text-muted-foreground ml-0.5">
                        +{dateSessions.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Session Count */}
                  <div className="text-[10px] text-muted-foreground font-medium">
                    {dateSessions.length} session{dateSessions.length !== 1 ? 's' : ''}
                  </div>

                  {/* Mini Session List (max 3) */}
                  <div className="space-y-0.5 mt-1">
                    {dateSessions.slice(0, 3).map(session => {
                      const timeStr = formatTime(session.startTime)
                      
                      return (
                        <div
                          key={session.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSessionClick(session)
                          }}
                          className={cn(
                            "text-[10px] p-1 rounded truncate hover:bg-primary/20 transition-colors",
                            session.status === SessionStatus.SCHEDULED && "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
                            session.status === SessionStatus.ONGOING && "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
                            session.status === SessionStatus.COMPLETED && "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                            session.status === SessionStatus.CANCELLED && "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                          )}
                          title={session.workshopTemplate?.name || 'Workshop'}
                        >
                          {timeStr} {session.workshopTemplate?.name?.substring(0, 15) || 'Workshop'}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {dateSessions.length === 0 && !isPast && (
                <div className="text-[10px] text-muted-foreground text-center mt-2">
                  +
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm mt-6 pt-4 border-t">
        <span className="font-medium text-muted-foreground">Status:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  )
}
