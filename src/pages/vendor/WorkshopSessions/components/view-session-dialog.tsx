import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { WorkshopSessionResponse, SessionStatus } from "../types"
import { SessionStatusBadge } from "./session-status-badge"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Users, DollarSign, User, Mail, Play, CheckCircle, XCircle } from "lucide-react"
import {
  formatFullDateTime,
  formatTimeRange,
  formatPrice,
  getEnrollmentPercentage,
  formatAvailability,
  formatDuration,
  calculateDuration
} from "../utils/formatters"

interface ViewSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: WorkshopSessionResponse | null
  onStart?: (session: WorkshopSessionResponse) => void
  onComplete?: (session: WorkshopSessionResponse) => void
  onCancel?: (session: WorkshopSessionResponse) => void
}

export function ViewSessionDialog({
  open,
  onOpenChange,
  session,
  onStart,
  onComplete,
  onCancel,
}: ViewSessionDialogProps) {

  if (!session) return null

  const images = session.workshopTemplate?.images ?? []
  const thumbnailIdx = images.findIndex(img => img.isThumbnail)
  const [activeImg, setActiveImg] = useState(thumbnailIdx >= 0 ? thumbnailIdx : 0)
  const enrollmentPercentage = getEnrollmentPercentage(session.currentEnrollments, session.maxParticipants)
  const duration = calculateDuration(session.startTime, session.endTime)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-slate-100 p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{session.workshopTemplate?.name || 'Workshop chưa phân loại'}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {session.workshopTemplate?.shortDescription || 'Chưa có mô tả'}
              </p>
            </div>
            <SessionStatusBadge status={session.status} size="lg" />
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4 space-y-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative h-64 rounded-lg overflow-hidden bg-muted">
                <img
                  src={images[activeImg]?.imageUrl}
                  alt={session.workshopTemplate?.name || 'Workshop'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
                  }}
                />
              </div>
              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id ?? idx}
                      onClick={() => setActiveImg(idx)}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${idx === activeImg ? 'border-primary ring-1 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/160x112?text=No+Image"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Schedule Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Lịch Trình</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <Calendar className="w-5 h-5 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">Ngày & Giờ</p>
                  <p className="text-muted-foreground mt-0.5">{formatFullDateTime(session.startTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <Clock className="w-5 h-5 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">Khung Giờ</p>
                  <p className="text-muted-foreground mt-0.5">{formatTimeRange(session.startTime, session.endTime)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium text-amber-600">Thời lượng: {formatDuration(duration)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Chi Phí</h3>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/20 flex items-center justify-center font-semibold">
                <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatPrice(session.price)}</span>
              <span className="text-sm text-muted-foreground mt-1">/ người tham gia</span>
            </div>
          </div>

          <Separator />

          {/* Enrollment Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Tình Trạng Đăng Ký</h3>
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">
                    {session.currentEnrollments} / {session.maxParticipants} học viên tham gia
                  </span>
                </div>
                <span className="text-muted-foreground font-semibold text-emerald-600">{enrollmentPercentage}%</span>
              </div>
              <Progress value={enrollmentPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" />
              <p className={`text-sm font-medium ${session.availableSlots === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                {session.availableSlots === 0 ? 'Đã hết chỗ trống' : `Còn lại ${session.availableSlots} chỗ trống`}
              </p>
            </div>
          </div>

          <Separator />

          {/* Workshop Description */}
          {session.workshopTemplate?.fullDescription && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Giới Thiệu Workshop</h3>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                {session.workshopTemplate.fullDescription}
              </div>
            </div>
          )}

          {/* Tags */}
          {session.workshopTemplate?.tags && session.workshopTemplate.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Danh Mục Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {session.workshopTemplate.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{
                        borderColor: tag.tagColor + "40",
                        backgroundColor: tag.tagColor + "10",
                        color: tag.tagColor,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Vendor Information */}
          {session.vendor && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Người Tổ Chức</h3>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {session.vendor.avatar && (
                    <img
                      src={session.vendor.avatar}
                      alt={session.vendor.name}
                      className="w-12 h-12 rounded-full border shadow-sm"
                    />
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{session.vendor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-muted-foreground">{session.vendor.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Rating (if available) */}
          {session.workshopTemplate?.averageRating ? (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Đánh Giá Từ Học Viên</h3>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-2xl">★</span>
                  <span className="text-2xl font-bold">{session.workshopTemplate.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({session.workshopTemplate.totalRatings || session.workshopTemplate.totalReview} đánh giá)
                  </span>
                </div>
              </div>
            </>
          ) : null}

          {/* Status Action Buttons */}
          {(session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.ONGOING) && (
            <>
              <Separator />
              <div className="flex gap-3 justify-end items-center bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-slate-100 dark:border-slate-800">
                {session.status === SessionStatus.SCHEDULED && onStart && (
                  <Button
                    onClick={() => { onStart(session); onOpenChange(false) }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Bắt Đầu Phiên Này
                  </Button>
                )}
                {session.status === SessionStatus.ONGOING && onComplete && (
                  <Button
                    onClick={() => { onComplete(session); onOpenChange(false) }}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Hoàn Thành Phiên
                  </Button>
                )}
                {onCancel && (
                  <Button
                    variant="destructive"
                    onClick={() => { onCancel(session); onOpenChange(false) }}
                    className="shadow-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Hủy Phiên Này
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
