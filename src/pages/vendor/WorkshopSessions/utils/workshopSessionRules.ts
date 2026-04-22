import { SessionStatus, type WorkshopSessionResponse } from '../types'
import { parseSessionInstant } from './formatters'

/** Khớp backend: chỉ trong ±30 phút so với giờ bắt đầu / kết thúc */
const STATUS_WINDOW_MS = 30 * 60 * 1000

/** Chỉ SCHEDULED và chưa có ai đăng ký — khớp updateWorkshopSession */
export function canEditWorkshopSession(session: WorkshopSessionResponse): boolean {
  return (
    session.status === SessionStatus.SCHEDULED &&
    session.currentEnrollments === 0
  )
}

/** null = được phép chỉnh sửa */
export function getEditWorkshopSessionBlockReason(
  session: WorkshopSessionResponse,
): string | null {
  if (session.status !== SessionStatus.SCHEDULED) {
    return 'Chỉ có thể chỉnh sửa khi phiên đang ở trạng thái "Đã lên lịch".'
  }
  if (session.currentEnrollments > 0) {
    return 'Không thể chỉnh sửa vì đã có khách đăng ký tham gia.'
  }
  return null
}

/** SCHEDULED + đã có đăng ký + trong cửa sổ ±30 phút quanh giờ bắt đầu */
export function canStartWorkshopSession(
  session: WorkshopSessionResponse,
  now: Date = new Date(),
): boolean {
  if (session.status !== SessionStatus.SCHEDULED) return false
  if (session.currentEnrollments === 0) return false
  const start = parseSessionInstant(session.startTime)
  const min = new Date(start.getTime() - STATUS_WINDOW_MS)
  const max = new Date(start.getTime() + STATUS_WINDOW_MS)
  return now >= min && now <= max
}

export function getStartWorkshopSessionBlockReason(
  session: WorkshopSessionResponse,
  now: Date = new Date(),
): string | null {
  if (session.status !== SessionStatus.SCHEDULED) {
    return 'Chỉ có thể bắt đầu khi phiên đang ở trạng thái "Đã lên lịch".'
  }
  if (session.currentEnrollments === 0) {
    return 'Cần có ít nhất một khách đăng ký mới có thể bắt đầu phiên.'
  }
  const start = parseSessionInstant(session.startTime)
  const min = new Date(start.getTime() - STATUS_WINDOW_MS)
  const max = new Date(start.getTime() + STATUS_WINDOW_MS)
  if (now < min) {
    return 'Chỉ được bắt đầu trong khoảng ±30 phút quanh giờ bắt đầu. Hiện tại còn quá sớm.'
  }
  if (now > max) {
    return 'Đã quá khung giờ cho phép bắt đầu (±30 phút so với giờ bắt đầu).'
  }
  return null
}

/** ONGOING + trong cửa sổ ±30 phút quanh giờ kết thúc */
export function canCompleteWorkshopSession(
  session: WorkshopSessionResponse,
  now: Date = new Date(),
): boolean {
  if (session.status !== SessionStatus.ONGOING) return false
  const end = parseSessionInstant(session.endTime)
  const min = new Date(end.getTime() - STATUS_WINDOW_MS)
  const max = new Date(end.getTime() + STATUS_WINDOW_MS)
  return now >= min && now <= max
}

export function getCompleteWorkshopSessionBlockReason(
  session: WorkshopSessionResponse,
  now: Date = new Date(),
): string | null {
  if (session.status !== SessionStatus.ONGOING) {
    return 'Chỉ có thể hoàn thành khi phiên đang "Đang diễn ra".'
  }
  const end = parseSessionInstant(session.endTime)
  const min = new Date(end.getTime() - STATUS_WINDOW_MS)
  const max = new Date(end.getTime() + STATUS_WINDOW_MS)
  if (now < min) {
    return 'Chỉ được hoàn thành trong khoảng ±30 phút quanh giờ kết thúc. Hiện tại còn quá sớm.'
  }
  if (now > max) {
    return 'Đã quá khung giờ cho phép hoàn thành (±30 phút so với giờ kết thúc).'
  }
  return null
}

/** Dịch thông báo lỗi tiếng Anh từ backend sang tiếng Việt (fallback giữ nguyên nếu không khớp). */
export function mapWorkshopSessionErrorToVi(message: string): string {
  const m = message.trim()
  const lower = m.toLowerCase()

  if (lower.includes('cannot update') && lower.includes('registered')) {
    return 'Không thể cập nhật phiên vì đã có khách đăng ký tham gia.'
  }
  if (lower.includes('only update scheduled')) {
    return 'Chỉ có thể cập nhật phiên đang ở trạng thái "Đã lên lịch".'
  }
  if (lower.includes('start time must be in the future')) {
    return 'Giờ bắt đầu phải ở tương lai.'
  }
  if (lower.includes('end time must be after start time')) {
    return 'Giờ kết thúc phải sau giờ bắt đầu.'
  }
  if (lower.includes('cannot start') && lower.includes('no tourists')) {
    return 'Không thể bắt đầu vì chưa có khách đăng ký.'
  }
  if (lower.includes('only change status to ongoing') && lower.includes('30 minutes')) {
    return 'Chỉ được chuyển sang "Đang diễn ra" trong khoảng ±30 phút quanh giờ bắt đầu.'
  }
  if (lower.includes('only update status to completed') && lower.includes('ongoing')) {
    return 'Chỉ có thể hoàn thành khi phiên đang "Đang diễn ra".'
  }
  if (lower.includes('only change status to completed') && lower.includes('30 minutes')) {
    return 'Chỉ được hoàn thành trong khoảng ±30 phút quanh giờ kết thúc.'
  }
  if (lower.includes('invalid status update')) {
    return 'Thao tác trạng thái không hợp lệ. Chỉ được chuyển sang Đang diễn ra hoặc Đã hoàn thành.'
  }
  if (lower.includes('do not have permission')) {
    return 'Bạn không có quyền thực hiện thao tác này với phiên workshop.'
  }
  if (lower.includes('max participants') && lower.includes('minimum')) {
    return m
  }

  return m
}
