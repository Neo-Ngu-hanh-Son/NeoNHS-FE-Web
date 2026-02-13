// Date and Time Formatting
export const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTimeRange = (startTime: string, endTime: string) => {
  const start = formatTime(startTime)
  const end = formatTime(endTime)
  return `${start} - ${end}`
}

export const formatDayOfWeek = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('en-US', {
    weekday: 'long'
  })
}

export const formatFullDateTime = (isoDate: string) => {
  const date = new Date(isoDate)
  return `${formatDayOfWeek(isoDate)}, ${formatDate(isoDate)} at ${formatTime(isoDate)}`
}

// Price Formatting
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Duration Formatting (in minutes)
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} hr`
  return `${hours}h ${mins}m`
}

// Calculate duration between two dates
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.floor((end - start) / (1000 * 60)) // minutes
}

// Enrollment/Availability Formatting
export const formatEnrollmentStatus = (current: number, max: number) => {
  return `${current} / ${max} enrolled`
}

export const formatAvailability = (available: number) => {
  if (available === 0) return "Fully Booked"
  if (available === 1) return "1 spot left"
  return `${available} spots available`
}

export const getEnrollmentPercentage = (current: number, max: number) => {
  return Math.round((current / max) * 100)
}

// Date Calculations
export const isToday = (isoDate: string) => {
  const today = new Date()
  const date = new Date(isoDate)
  return today.toDateString() === date.toDateString()
}

export const isFuture = (isoDate: string) => {
  return new Date(isoDate) > new Date()
}

export const isPast = (isoDate: string) => {
  return new Date(isoDate) < new Date()
}

export const isOngoing = (startTime: string, endTime: string) => {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)
  return now >= start && now <= end
}

// Calendar Helpers
export const getMonthName = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long' })
}

export const getYear = (date: Date) => {
  return date.getFullYear()
}

export const getMonthYear = (date: Date) => {
  return `${getMonthName(date)} ${getYear(date)}`
}

// Get days in month
export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Get first day of month (0 = Sunday, 6 = Saturday)
export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString()
}

// Get start of day
export const getStartOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get end of day
export const getEndOfDay = (date: Date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}
