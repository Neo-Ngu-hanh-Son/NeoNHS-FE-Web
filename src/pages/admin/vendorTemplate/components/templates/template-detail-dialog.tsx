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
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react"
import { AdminWorkshopTemplateResponse, WorkshopStatus } from "./types"
import { formatDate, formatDuration, formatPrice } from "@/pages/vendor/WorkshopTemplates/utils/formatters"

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
  if (!template) return null

  const thumbnail =
    template.images.find((img) => img.isThumbnail)?.imageUrl ||
    template.images[0]?.imageUrl ||
    "https://via.placeholder.com/800x400?text=Workshop+Template"

  const tags = template.tags ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">
                {template.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Review full details of this workshop template and its vendor.
              </DialogDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge(template.status)}
              {template.vendorVerified === false && (
                <Badge
                  variant="outline"
                  className="text-xs bg-amber-50 text-amber-700 border-amber-300 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  Unverified Vendor
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Banner */}
          <Card className="overflow-hidden">
            <img
              src={thumbnail}
              alt={template.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/800x400?text=Workshop+Template"
              }}
            />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Summary */}
              {template.shortDescription && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Summary
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {template.shortDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Full description */}
              {template.fullDescription && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Full Description
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {template.fullDescription}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Rejection reason */}
              {template.status === WorkshopStatus.REJECTED &&
                template.rejectReason && (
                  <Card className="border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20">
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Rejection Reason
                      </h3>
                      <p className="text-xs text-red-700 leading-relaxed whitespace-pre-line">
                        {template.rejectReason}
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
                        {formatDuration(template.estimatedDuration)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Default Price
                      </span>
                      <span className="font-medium">
                        {formatPrice(template.defaultPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Capacity
                      </span>
                      <span className="font-medium">
                        {template.minParticipants} - {template.maxParticipants}{" "}
                        participants
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created
                      </span>
                      <span className="font-medium">
                        {formatDate(template.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Last Updated
                      </span>
                      <span className="font-medium">
                        {formatDate(template.updatedAt)}
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
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{template.vendorName}</p>
                        {template.vendorVerified && (
                          <p className="text-xs text-green-700 flex items-center gap-1">
                            <Star className="w-3 h-3 text-green-600 fill-green-600" />
                            Verified Vendor
                          </p>
                        )}
                      </div>
                    </div>
                    {template.vendorEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">
                          {template.vendorEmail}
                        </span>
                      </div>
                    )}
                    {template.vendorPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{template.vendorPhone}</span>
                      </div>
                    )}
                    {template.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">
                          {template.location}
                        </span>
                      </div>
                    )}
                  </div>
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
              {(template.submittedAt ||
                template.reviewedAt ||
                template.approvedAt) && (
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
                    {template.approvedAt && (
                      <p>
                        Approved:{" "}
                        <span className="font-medium">
                          {formatDate(template.approvedAt)}
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

