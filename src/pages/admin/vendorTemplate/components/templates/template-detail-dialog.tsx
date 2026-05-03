import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldX,
  Star,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import { AdminWorkshopTemplateResponse, WorkshopStatus } from "./types"
import { formatDate, formatDuration, formatPrice } from "@/pages/vendor/WorkshopTemplates/utils/formatters"
import WorkshopTemplateService from "@/services/api/workshopTemplateService"
import { adminWorkshopService } from "@/services/api/adminWorkshopService"
import type { WorkshopTemplateResponse } from "@/pages/vendor/WorkshopTemplates/types"
import type { VendorProfileResponse } from "@/pages/admin/vendors/types"
import { PictureOutlined } from "@ant-design/icons"
import { Tag } from "antd"

const MAIN_IMAGE_FALLBACK =
  "https://via.placeholder.com/800x400?text=Workshop+Template"
interface TemplateDetailDialogProps {
  template: AdminWorkshopTemplateResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusBadge = (status: WorkshopStatus) => {
  switch (status) {
    case WorkshopStatus.PENDING:
      return (
        <Badge className="bg-amber-500 text-white">
          <Clock className="mr-1 h-3 w-3" />
          Chờ duyệt
        </Badge>
      )
    case WorkshopStatus.ACTIVE:
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="mr-1 h-3 w-3" />
          Đã duyệt
        </Badge>
      )
    case WorkshopStatus.REJECTED:
      return (
        <Badge className="bg-red-500 text-white">
          <AlertCircle className="mr-1 h-3 w-3" />
          Đã từ chối
        </Badge>
      )
    case WorkshopStatus.DRAFT:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700">
          Bản nháp
        </Badge>
      )
  }
}

export function TemplateDetailDialog({
  template,
  open,
  onOpenChange,
}: TemplateDetailDialogProps) {
  const [detail, setDetail] = useState<WorkshopTemplateResponse | null>(null)
  const [vendorProfile, setVendorProfile] = useState<VendorProfileResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !template?.id) {
      return
    }

    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [templateData, vendorData] = await Promise.allSettled([
          WorkshopTemplateService.getTemplateById(template.id),
          template.vendorId
            ? adminWorkshopService.getVendorById(template.vendorId)
            : Promise.reject("no vendorId"),
        ])

        if (!cancelled) {
          if (templateData.status === "fulfilled") {
            setDetail(templateData.value)
          }
          if (vendorData.status === "fulfilled") {
            setVendorProfile(vendorData.value)
          } else {
            setVendorProfile(null)
          }
        }
      } catch (e) {
        console.error("Failed to load template/vendor detail", e)
        if (!cancelled) {
          setError("Không tải được chi tiết mẫu")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [open, template?.id, template?.vendorId])

  // Reset selected image when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedImage(null)
    }
  }, [open])

  if (!template) return null

  const images = detail?.images?.length ? detail.images : (template.images || [])

  const displayImage =
    selectedImage ??
    images.find((img) => img.isThumbnail)?.imageUrl ??
    images[0]?.imageUrl ??
    "https://via.placeholder.com/800x400?text=Workshop+Template"

  const tags = (detail?.tags as AdminWorkshopTemplateResponse["tags"]) ?? template.tags ?? []

  const name = detail?.name ?? template.name
  const shortDescription = detail?.shortDescription ?? template.shortDescription
  const fullDescription = detail?.fullDescription ?? template.fullDescription
  const estimatedDuration = detail?.estimatedDuration ?? template.estimatedDuration
  const defaultPrice = detail?.defaultPrice ?? template.defaultPrice
  const minParticipants = detail?.minParticipants ?? template.minParticipants
  const maxParticipants = detail?.maxParticipants ?? template.maxParticipants
  const createdAt = detail?.createdAt ?? template.createdAt
  const updatedAt = detail?.updatedAt ?? template.updatedAt

  // Vendor info: prefer vendorProfile (fresh from API), fallback to template fields
  const isVendorVerified = vendorProfile?.isVerifiedVendor ?? template.vendorVerified ?? false
  const vendorName = vendorProfile?.businessName || template.vendorName
  const vendorEmail = vendorProfile?.email || template.vendorEmail
  const vendorPhone = vendorProfile?.phoneNumber || template.vendorPhone
  const vendorAddress = vendorProfile?.address
  const vendorDescription = vendorProfile?.description
  const vendorAvatar = vendorProfile?.avatarUrl
  const vendorIsActive = vendorProfile?.isActive
  const vendorIsBanned = vendorProfile?.isBanned

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">
                {name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Xem đầy đủ mẫu workshop và thông tin Đối tác.
              </DialogDescription>
              {loading && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Đang tải thông tin mẫu mới nhất…
                </p>
              )}
              {error && (
                <p className="mt-1 text-xs text-red-600">
                  {error}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge(template.status)}
              {isVendorVerified ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-green-300 bg-green-50 text-xs text-green-700"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Đối tác đã xác minh
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-amber-300 bg-amber-50 text-xs text-amber-700"
                >
                  <ShieldX className="h-3 w-3" />
                  Chưa xác minh
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images Gallery */}
          <div className="space-y-3">
            {images.length > 0 ? (
              <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-muted shadow-sm dark:border-slate-700">
                <div className="relative w-full">
                  <img
                    src={displayImage}
                    alt={name}
                    className="h-[400px] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = MAIN_IMAGE_FALLBACK
                    }}
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className="relative cursor-pointer group"
                        onClick={() => setSelectedImage(img.imageUrl)}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`Ảnh workshop ${idx + 1}`}
                          className={`h-20 w-full rounded-md object-cover transition-opacity ${displayImage === img.imageUrl
                            ? "opacity-100 ring-2 ring-primary"
                            : "opacity-70 group-hover:opacity-100"
                            }`}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/200x200?text=Image"
                          }}
                        />
                        {img.isThumbnail && (
                          <Tag
                            color="blue"
                            className="!absolute top-1 left-1 !m-0 !text-[10px] !px-1 !leading-4"
                            icon={<PictureOutlined />}
                          >
                            Ảnh đại diện
                          </Tag>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-muted shadow-sm dark:border-slate-700">
                <div className="relative w-full">
                  <img
                    src={displayImage}
                    alt={name}
                    className="h-[400px] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = MAIN_IMAGE_FALLBACK
                    }}
                  />
                </div>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Summary */}
              {shortDescription && (
                <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                  <CardContent className="space-y-2 p-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Tóm tắt ngắn
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {shortDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Full description */}
              {fullDescription && (
                <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                  <CardContent className="space-y-2 p-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Mô tả đầy đủ
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {fullDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Rejection reason */}
              {template.status === WorkshopStatus.REJECTED &&
                template.adminNote && (
                  <Card className="rounded-2xl border border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20">
                    <CardContent className="space-y-2 p-4">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        Lý do từ chối
                      </h3>
                      <p className="text-xs text-red-700 leading-relaxed whitespace-pre-line">
                        {template.adminNote}
                      </p>
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Sidebar: template + vendor info */}
            <div className="space-y-4">
              {/* Template quick facts */}
              <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                <CardContent className="space-y-3 p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Thông tin mẫu
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Thời lượng
                      </span>
                      <span className="font-medium">
                        {formatDuration(estimatedDuration)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Giá mặc định
                      </span>
                      <span className="font-medium">
                        {formatPrice(defaultPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Sức chứa
                      </span>
                      <span className="font-medium">
                        {maxParticipants === 999999 ? 'Không giới hạn' : `${minParticipants} - ${maxParticipants} người`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Ngày tạo
                      </span>
                      <span className="font-medium">
                        {formatDate(createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Cập nhật lần cuối
                      </span>
                      <span className="font-medium">
                        {formatDate(updatedAt)}
                      </span>
                    </div>
                  </div>

                  {template.status === WorkshopStatus.ACTIVE &&
                    template.averageRating != null && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">
                          {template.averageRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({template.totalRatings} đánh giá)
                        </span>
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* Vendor info */}
              <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                <CardContent className="space-y-3 p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Thông tin Đối tác
                  </h3>
                  {loading && !vendorProfile ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải thông tin Đối tác…
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-start gap-2">
                        {vendorAvatar ? (
                          <img
                            src={vendorAvatar}
                            alt={vendorName}
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = "none" }}
                          />
                        ) : (
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{vendorName}</p>
                          {isVendorVerified ? (
                            <p className="flex items-center gap-1 text-xs text-green-700">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Đã xác minh
                            </p>
                          ) : (
                            <p className="flex items-center gap-1 text-xs text-amber-600">
                              <AlertCircle className="h-3 w-3" />
                              Chưa xác minh
                            </p>
                          )}
                        </div>
                      </div>

                      {vendorEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{vendorEmail}</span>
                        </div>
                      )}
                      {vendorPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span>{vendorPhone}</span>
                        </div>
                      )}
                      {vendorAddress && (
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-muted-foreground">{vendorAddress}</span>
                        </div>
                      )}
                      {vendorDescription && (
                        <p className="line-clamp-3 border-t pt-1 text-xs text-muted-foreground">
                          {vendorDescription}
                        </p>
                      )}

                      {vendorProfile && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {vendorIsActive === false && (
                            <Badge variant="outline" className="border-gray-300 bg-gray-50 text-xs text-gray-600">
                              Không hoạt động
                            </Badge>
                          )}
                          {vendorIsBanned && (
                            <Badge variant="outline" className="border-red-300 bg-red-50 text-xs text-red-700">
                              Đã cấm
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              {tags.length > 0 && (
                <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                  <CardContent className="space-y-2 p-4">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Thẻ
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
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
                  </CardContent>
                </Card>
              )}

              {/* Review meta */}
              {(template.submittedAt || template.reviewedAt) && (
                <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                  <CardContent className="space-y-1.5 p-4 text-xs text-muted-foreground">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Mốc thời gian xử lý
                    </h3>
                    {template.submittedAt && (
                      <p>
                        Đã gửi:{" "}
                        <span className="font-medium">
                          {formatDate(template.submittedAt)}
                        </span>
                      </p>
                    )}
                    {template.reviewedAt && (
                      <p>
                        Đã xử lý:{" "}
                        <span className="font-medium">
                          {formatDate(template.reviewedAt)}
                          {template.reviewedBy &&
                            ` · QT ${template.reviewedBy.slice(0, 8)}`}
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

