// Date and Time Formatting
// Sử dụng locale 'vi-VN' cho định dạng ngày tháng Việt Nam

export const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  // Kết quả ví dụ: 13/02/2026
}

export const formatDateTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Sử dụng hệ 24 giờ
  })
  // Kết quả ví dụ: 13:30 13/02/2026
}

export const formatTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Sử dụng hệ 24 giờ
  })
  // Kết quả ví dụ: 14:30
}

export const formatTimeRange = (startTime: string, endTime: string) => {
  const start = formatTime(startTime)
  const end = formatTime(endTime)
  return `${start} - ${end}`
}

export const formatDayOfWeek = (isoDate: string) => {
  // Viết hoa chữ cái đầu (ví dụ: thứ Hai -> Thứ Hai) nếu cần thiết
  const day = new Date(isoDate).toLocaleDateString('vi-VN', {
    weekday: 'long'
  })
  return day.charAt(0).toUpperCase() + day.slice(1)
}

export const formatFullDateTime = (isoDate: string) => {
  // Định dạng: Thứ Sáu, 13/02/2026 lúc 14:30
  return `${formatDayOfWeek(isoDate)}, ${formatDate(isoDate)} lúc ${formatTime(isoDate)}`
}

// Price Formatting
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
  // Kết quả ví dụ: 100.000 ₫
}

// Duration Formatting (in minutes)
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins} phút`
  if (mins === 0) return `${hours} giờ`
  return `${hours}h ${mins}p` // Hoặc dùng "giờ", "phút" nếu muốn đầy đủ
}

// Calculate duration between two dates
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.floor((end - start) / (1000 * 60)) // minutes
}

// Enrollment/Availability Formatting
export const formatEnrollmentStatus = (current: number, max: number) => {
  return `${current} / ${max} đã đăng ký`
}

export const formatAvailability = (available: number) => {
  if (available === 0) return "Đã kín chỗ"
  if (available === 1) return "Còn 1 chỗ"
  return `Còn ${available} chỗ`
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
  // 'Tháng 2' thay vì 'February'
  return date.toLocaleDateString('vi-VN', { month: 'long' })
}

export const getYear = (date: Date) => {
  return date.getFullYear()
}

export const getMonthYear = (date: Date) => {
  // Kết quả: Tháng 2 năm 2026
  // Ở VN thường thêm chữ "năm" ở giữa, nhưng format mặc định có thể là "Tháng 2 2026"
  // Code dưới đây tùy chỉnh để tự nhiên hơn:
  const month = getMonthName(date)
  const year = getYear(date)
  return `${month} năm ${year}`
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