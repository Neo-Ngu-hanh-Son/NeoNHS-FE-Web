import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { getMonthYear } from "../../utils/formatters"

interface CalendarHeaderProps {
  currentDate: Date
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  view: 'month' | 'week' | 'day'
  onViewChange: (view: 'month' | 'week' | 'day') => void
}

export function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  view,
  onViewChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Date Display and Navigation */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">{getMonthYear(currentDate)}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={onToday}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 bg-secondary rounded-lg p-1">
        <Button
          size="sm"
          variant={view === 'month' ? 'default' : 'ghost'}
          onClick={() => onViewChange('month')}
        >
          Month
        </Button>
        <Button
          size="sm"
          variant={view === 'week' ? 'default' : 'ghost'}
          onClick={() => onViewChange('week')}
        >
          Week
        </Button>
        <Button
          size="sm"
          variant={view === 'day' ? 'default' : 'ghost'}
          onClick={() => onViewChange('day')}
        >
          Day
        </Button>
      </div>
    </div>
  )
}
