import { WorkshopSessionResponse, SessionStatus } from "../../types"
import { isSameDay } from "../../utils/formatters"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  currentDate: Date
  sessions: WorkshopSessionResponse[]
  onSessionClick: (session: WorkshopSessionResponse) => void
  onDateClick: (date: Date) => void
}

export function WeekView({ currentDate, sessions, onSessionClick, onDateClick }: WeekViewProps) {
  // Get the week containing currentDate (Sunday to Saturday)
  const getWeekDates = (date: Date) => {
    const day = date.getDay() // 0 = Sunday
    const diff = date.getDate() - day
    const sunday = new Date(date)
    sunday.setDate(diff)
    
    const weekDates: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday)
      d.setDate(sunday.getDate() + i)
      weekDates.push(d)
    }
    return weekDates
  }

  const weekDates = getWeekDates(currentDate)
  const today = new Date()
  const hours = Array.from({ length: 15 }, (_, i) => i + 6) // 6 AM to 8 PM

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime)
      return isSameDay(sessionDate, date)
    })
  }

  // Get session position in hour slot
  const getSessionPosition = (session: WorkshopSessionResponse, hour: number) => {
    const start = new Date(session.startTime)
    const startHour = start.getHours()
    const startMinute = start.getMinutes()
    
    // Check if session starts in this hour
    if (startHour === hour) {
      return {
        show: true,
        topOffset: (startMinute / 60) * 100, // percentage
        duration: (new Date(session.endTime).getTime() - start.getTime()) / (1000 * 60 * 60) // hours
      }
    }
    return { show: false, topOffset: 0, duration: 0 }
  }

  const getStatusBgColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.SCHEDULED: return 'bg-green-500 hover:bg-green-600'
      case SessionStatus.ONGOING: return 'bg-blue-500 hover:bg-blue-600'
      case SessionStatus.COMPLETED: return 'bg-gray-500 hover:bg-gray-600'
      case SessionStatus.CANCELLED: return 'bg-red-500 hover:bg-red-600'
    }
  }

  return (
    <div className="space-y-4">
      {/* Week Date Headers */}
      <div className="grid grid-cols-8 gap-2 sticky top-0 bg-background z-10 pb-2">
        <div className="text-sm font-semibold text-muted-foreground">Time</div>
        {weekDates.map(date => {
          const isToday = isSameDay(date, today)
          return (
            <div
              key={date.toISOString()}
              className={cn(
                "text-center p-2 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors",
                isToday && "bg-primary/20 border border-primary"
              )}
              onClick={() => onDateClick(date)}
            >
              <div className="text-xs text-muted-foreground">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={cn(
                "text-lg font-bold",
                isToday && "text-primary"
              )}>
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-8 gap-2 relative">
        {hours.map(hour => (
          <div key={hour} className="contents">
            {/* Hour Label */}
            <div className="text-sm text-muted-foreground py-4 text-right pr-2">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>

            {/* Day Columns */}
            {weekDates.map(date => {
              const dateSessions = getSessionsForDate(date)
              
              return (
                <div
                  key={`${hour}-${date.toISOString()}`}
                  className="border-t border-gray-200 dark:border-gray-700 min-h-[60px] relative hover:bg-primary/5 cursor-pointer transition-colors"
                  onClick={() => onDateClick(date)}
                >
                  {/* Render sessions that start in this hour */}
                  {dateSessions.map(session => {
                    const position = getSessionPosition(session, hour)
                    if (!position.show) return null

                    const heightInPixels = position.duration * 60 // 60px per hour
                    
                    return (
                      <div
                        key={session.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSessionClick(session)
                        }}
                        className={cn(
                          "absolute left-1 right-1 rounded-md p-1.5 text-white text-xs cursor-pointer z-10 shadow-sm",
                          getStatusBgColor(session.status)
                        )}
                        style={{
                          top: `${position.topOffset}%`,
                          height: `${Math.min(heightInPixels, 240)}px`,
                        }}
                      >
                        <div className="font-semibold truncate">
                          {session.workshopTemplate?.name || 'Workshop'}
                        </div>
                        <div className="text-[10px] opacity-90">
                          {new Date(session.startTime).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </div>
                        <div className="text-[10px] opacity-90">
                          {session.currentEnrollments}/{session.maxParticipants}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
