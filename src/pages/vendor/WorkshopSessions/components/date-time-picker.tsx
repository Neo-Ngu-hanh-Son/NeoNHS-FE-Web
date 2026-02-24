import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

interface DateTimePickerProps {
  label: string
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  error?: string
  disabled?: boolean
  minDate?: Date
  required?: boolean
}

export function DateTimePicker({ 
  label, 
  value, 
  onChange, 
  error, 
  disabled,
  minDate,
  required = false 
}: DateTimePickerProps) {
  
  // Convert Date to datetime-local format (YYYY-MM-DDTHH:mm)
  const toDateTimeLocal = (date: Date | undefined) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Convert datetime-local format to Date
  const fromDateTimeLocal = (dateTimeStr: string) => {
    if (!dateTimeStr) return undefined
    return new Date(dateTimeStr)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = fromDateTimeLocal(e.target.value)
    onChange(newDate)
  }

  const minDateStr = minDate ? toDateTimeLocal(minDate) : undefined

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="datetime-local"
          value={toDateTimeLocal(value)}
          onChange={handleChange}
          disabled={disabled}
          min={minDateStr}
          className={`pl-10 ${error ? 'border-red-500' : ''}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
