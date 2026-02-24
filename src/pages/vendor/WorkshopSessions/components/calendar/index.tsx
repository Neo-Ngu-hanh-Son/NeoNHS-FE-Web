import { useState } from "react"
import { WorkshopSessionResponse } from "../../types"
import { Card } from "@/components/ui/card"
import { CalendarHeader } from "./calendar-header"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { DayView } from "./day-view"

interface SessionCalendarProps {
  sessions: WorkshopSessionResponse[]
  onSessionClick: (session: WorkshopSessionResponse) => void
  onDateClick: (date: Date) => void
  onSessionEdit: (session: WorkshopSessionResponse) => void
  onSessionCancel: (session: WorkshopSessionResponse) => void
  defaultView?: 'month' | 'week' | 'day'
}

export function SessionCalendar({
  sessions,
  onSessionClick,
  onDateClick,
  onSessionEdit,
  onSessionCancel,
  defaultView = 'month',
}: SessionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>(defaultView)

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    if (view === 'month') {
      // Switch to day view for that date
      setCurrentDate(date)
      setView('day')
    } else {
      // Open create session dialog
      onDateClick(date)
    }
  }

  const handleEmptySlotClick = (date: Date, hour: number) => {
    // Create a date with specific hour
    const selectedDateTime = new Date(date)
    selectedDateTime.setHours(hour, 0, 0, 0)
    onDateClick(selectedDateTime)
  }

  return (
    <Card className="p-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        view={view}
        onViewChange={setView}
      />

      {/* Render appropriate view */}
      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          sessions={sessions}
          onDateClick={handleDateClick}
          onSessionClick={onSessionClick}
        />
      )}

      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          sessions={sessions}
          onSessionClick={onSessionClick}
          onDateClick={onDateClick}
        />
      )}

      {view === 'day' && (
        <DayView
          currentDate={currentDate}
          sessions={sessions}
          onSessionClick={onSessionClick}
          onSessionEdit={onSessionEdit}
          onSessionCancel={onSessionCancel}
          onEmptySlotClick={handleEmptySlotClick}
        />
      )}
    </Card>
  )
}
