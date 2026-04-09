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
import { Image as AntImage, Tag } from "antd"
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
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      )
    case WorkshopStatus.ACTIVE:
      return (
        <Badge className="bg-green-500 text-white">
          <DollarSign className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    case WorkshopStatus.REJECTED:
      return (
        <Badge className="bg-red-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      )
    case WorkshopStatus.DRAFT:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700">
          Draft
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
          setError("Failed to load template detail")
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">
                {name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Review full details of this workshop template and its vendor.
              </DialogDescription>
              {loading && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Loading latest template information...
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
                  className="text-xs bg-green-50 text-green-700 border-green-300 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Verified Vendor
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs bg-amber-50 text-amber-700 border-amber-300 flex items-center gap-1"
                >
                  <ShieldX className="w-3 h-3" />
                  Unverified Vendor
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images Gallery — same Ant Design Image + PreviewGroup pattern as vendor WorkshopTemplateDetailPage */}
          <div className="space-y-3">
            {images.length > 0 ? (
              <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden bg-muted">
                <AntImage.PreviewGroup items={images.map((img) => img.imageUrl)}>
                  <div className="relative [&>.ant-image]:w-full">
                    <AntImage
                      src={displayImage}
                      alt={name}
                      className="!w-full !h-[400px] object-cover"
                      fallback="https://via.placeholder.com/800x400?text=No+Image"
                    />
                  </div>
                </AntImage.PreviewGroup>
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
                          alt={`Workshop image ${idx + 1}`}
                          className={`w-full h-20 object-cover rounded-md transition-all ${displayImage === img.imageUrl
                            ? "ring-2 ring-primary opacity-100"
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
                            Thumbnail
                          </Tag>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm overflow-hidden bg-muted">
                <div className="relative [&>.ant-image]:w-full">
                  <AntImage
                    src={displayImage}
                    alt={name}
                    className="!w-full !h-[400px] object-cover"
                    fallback="https://via.placeholder.com/800x400?text=Workshop+Template"
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
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Summary
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {shortDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Full description */}
              {fullDescription && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Full Description
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
                  <Card className="border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20">
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Rejection Reason
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
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Template Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </span>
                      <span className="font-medium">
                        {formatDuration(estimatedDuration)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Default Price
                      </span>
                      <span className="font-medium">
                        {formatPrice(defaultPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Capacity
                      </span>
                      <span className="font-medium">
                        {minParticipants} - {maxParticipants}{" "}
                        participants
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created
                      </span>
                      <span className="font-medium">
                        {formatDate(createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Last Updated
                      </span>
                      <span className="font-medium">
                        {formatDate(updatedAt)}
                      </span>
                    </div>
                  </div>

                  {template.status === WorkshopStatus.ACTIVE &&
                    template.averageRating != null && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">
                          {template.averageRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({template.totalReview} reviews)
                        </span>
                      </div>
                    )}
                </CardContent>
              </Card>

              {/* Vendor info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Vendor Info
                  </h3>
                  {loading && !vendorProfile ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading vendor info...
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-start gap-2">
                        {vendorAvatar ? (
                          <img
                            src={vendorAvatar}
                            alt={vendorName}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                            onError={(e) => { e.currentTarget.style.display = "none" }}
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{vendorName}</p>
                          {isVendorVerified ? (
                            <p className="text-xs text-green-700 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              Verified Vendor
                            </p>
                          ) : (
                            <p className="text-xs text-amber-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Unverified
                            </p>
                          )}
                        </div>
                      </div>

                      {vendorEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{vendorEmail}</span>
                        </div>
                      )}
                      {vendorPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>{vendorPhone}</span>
                        </div>
                      )}
                      {vendorAddress && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{vendorAddress}</span>
                        </div>
                      )}
                      {vendorDescription && (
                        <p className="text-xs text-muted-foreground pt-1 border-t line-clamp-3">
                          {vendorDescription}
                        </p>
                      )}

                      {/* Vendor status badges */}
                      {vendorProfile && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {vendorIsActive === false && (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-300">
                              Inactive
                            </Badge>
                          )}
                          {vendorIsBanned && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-300">
                              Banned
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
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Tags
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
                <Card>
                  <CardContent className="p-4 space-y-1.5 text-xs text-muted-foreground">
                    <h3 className="font-semibold text-sm text-foreground mb-1">
                      Review Timeline
                    </h3>
                    {template.submittedAt && (
                      <p>
                        Submitted:{" "}
                        <span className="font-medium">
                          {formatDate(template.submittedAt)}
                        </span>
                      </p>
                    )}
                    {template.reviewedAt && (
                      <p>
                        Reviewed:{" "}
                        <span className="font-medium">
                          {formatDate(template.reviewedAt)}
                          {template.reviewedBy &&
                            ` by Admin ${template.reviewedBy.slice(0, 8)}`}
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

