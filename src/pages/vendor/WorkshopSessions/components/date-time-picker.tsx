import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import {
  formatInstantToVietnamDateTimeLocal,
  vietnamDateTimeLocalToUtcInstant,
} from "../utils/formatters"

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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (!raw) {
      onChange(undefined)
      return
    }
    const d = vietnamDateTimeLocalToUtcInstant(raw)
    onChange(Number.isNaN(d.getTime()) ? undefined : d)
  }

  const minDateStr = minDate
    ? formatInstantToVietnamDateTimeLocal(minDate)
    : undefined

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="datetime-local"
          value={value ? formatInstantToVietnamDateTimeLocal(value) : ""}
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
