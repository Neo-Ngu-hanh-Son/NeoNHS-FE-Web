// Date and Time Formatting
// Giờ hiển thị theo múi giờ Việt Nam (Asia/Ho_Chi_Minh); locale vi-VN cho định dạng.

/** Múi giờ cố định cho lịch workshop (không phụ thuộc múi trình duyệt). */
export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh'

const vnDateOptions: Intl.DateTimeFormatOptions = {
  timeZone: VIETNAM_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

const vnTimeOptions: Intl.DateTimeFormatOptions = {
  timeZone: VIETNAM_TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

/**
 * Parse chuỗi từ API thành Date (UTC instant).
 *
 * - Có Z hoặc offset ("+07:00") → parse thẳng (đúng chuẩn ISO-8601).
 * - Không có Z / offset (kiểu Java LocalDateTime: "2026-04-10T08:00:00") →
 *   coi là giờ VIỆT NAM (append "+07:00"), vì backend gửi/nhận giờ VN local.
 */
export function parseSessionInstant(iso: string): Date {
  const s = iso?.trim() ?? ''
  if (!s) return new Date(NaN)
  if (/[zZ]$/.test(s) || /[+-]\d{2}:\d{2}$/.test(s) || /[+-]\d{4}$/.test(s)) {
    return new Date(s)
  }
  if (s.includes('T')) {
    // No timezone info → treat as Vietnam local time (+07:00)
    return new Date(`${s}+07:00`)
  }
  return new Date(s)
}

/** YYYY-MM-DD của instant theo giờ Việt Nam */
export function vietnamDateKey(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', vnDateOptions).format(parseSessionInstant(iso))
}

/** YYYY-MM-DD của một Date (ô lịch) theo giờ Việt Nam */
export function vietnamDateKeyFromCalendarDate(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', vnDateOptions).format(d)
}

/** Session có cùng ngày lịch (VN) với ô đang chọn không */
export function isSessionOnVietnamCalendarDay(iso: string, calendarDate: Date): boolean {
  return vietnamDateKey(iso) === vietnamDateKeyFromCalendarDate(calendarDate)
}

export function getVietnamHour(iso: string): number {
  const d = parseSessionInstant(iso)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIETNAM_TIMEZONE,
    hour: 'numeric',
    hour12: false,
    hourCycle: 'h23',
  }).formatToParts(d)
  return parseInt(parts.find((x) => x.type === 'hour')?.value ?? '0', 10)
}

export function getVietnamMinute(iso: string): number {
  const d = parseSessionInstant(iso)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIETNAM_TIMEZONE,
    minute: 'numeric',
  }).formatToParts(d)
  return parseInt(parts.find((x) => x.type === 'minute')?.value ?? '0', 10)
}

/** Giá trị cho input datetime-local: giờ theo tường VN */
export function formatInstantToVietnamDateTimeLocal(date: Date): string {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: VIETNAM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    p.find((x) => x.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`
}

/** Chuỗi từ datetime-local được hiểu là giờ Việt Nam → Date (UTC instant) */
export function vietnamDateTimeLocalToUtcInstant(dateTimeStr: string): Date {
  if (!dateTimeStr?.trim()) return new Date(NaN)
  const trimmed = dateTimeStr.trim()
  const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)
    ? `${trimmed}:00`
    : trimmed
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(withSeconds)) {
    return new Date(withSeconds)
  }
  return new Date(`${withSeconds}+07:00`)
}

/**
 * Format a Date for sending to the API as Vietnam local time string.
 * Produces "YYYY-MM-DDTHH:mm:ss" (no Z, no offset, no milliseconds).
 *
 * Java LocalDateTime on the backend parses this directly as VN local.
 * Example: user picks 8:00 AM VN → sends "2026-04-10T08:00:00"
 */
export function formatDateForApi(date: Date): string {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: VIETNAM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    p.find((x) => x.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`
}

export const formatDate = (isoDate: string) => {
  return parseSessionInstant(isoDate).toLocaleDateString('vi-VN', vnDateOptions)
}

export const formatDateTime = (isoDate: string) => {
  return parseSessionInstant(isoDate).toLocaleString('vi-VN', {
    ...vnDateOptions,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export const formatTime = (isoDate: string) => {
  return parseSessionInstant(isoDate).toLocaleTimeString('vi-VN', vnTimeOptions)
}

export const formatTimeRange = (startTime: string, endTime: string) => {
  const start = formatTime(startTime)
  const end = formatTime(endTime)
  return `${start} - ${end}`
}

export const formatDayOfWeek = (isoDate: string) => {
  const day = parseSessionInstant(isoDate).toLocaleDateString('vi-VN', {
    timeZone: VIETNAM_TIMEZONE,
    weekday: 'long',
  })
  return day.charAt(0).toUpperCase() + day.slice(1)
}

export const formatFullDateTime = (isoDate: string) => {
  // Định dạng: Thứ Sáu, 13/02/2026 lúc 14:30
  return `${formatDayOfWeek(isoDate)}, ${formatDate(isoDate)} lúc ${formatTime(isoDate)}`
}

// Price Formatting
export const formatPrice = (price: number) => {
  if (price === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
  // Kết quả ví dụ: 100.000 ₫
}

/** Hiển thị số tiền kiểu 1,234,567 VND (dấu phẩy ngăn cách hàng nghìn). */
export function formatVndCommaAmount(price: number): string {
  if (price === 0) return 'Miễn phí'
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(price)} VND`
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
  const start = parseSessionInstant(startTime).getTime()
  const end = parseSessionInstant(endTime).getTime()
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
  const todayKey = vietnamDateKeyFromCalendarDate(new Date())
  return vietnamDateKey(isoDate) === todayKey
}

export const isFuture = (isoDate: string) => {
  return parseSessionInstant(isoDate) > new Date()
}

export const isPast = (isoDate: string) => {
  return parseSessionInstant(isoDate) < new Date()
}

export const isOngoing = (startTime: string, endTime: string) => {
  const now = new Date()
  const start = parseSessionInstant(startTime)
  const end = parseSessionInstant(endTime)
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