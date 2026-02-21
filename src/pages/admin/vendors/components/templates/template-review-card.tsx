import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Building2,
  Mail,
  Phone,
  AlertCircle,
  Star,
} from "lucide-react"
import { AdminWorkshopTemplateResponse, WorkshopStatus } from "./types"
import { formatDate } from "@/pages/vendor/WorkshopTemplates/utils/formatters"
import { formatPrice, formatDuration } from "@/pages/vendor/WorkshopTemplates/utils/formatters"

interface TemplateReviewCardProps {
  template: AdminWorkshopTemplateResponse
  onView?: (id: string) => void
  onApprove?: (template: AdminWorkshopTemplateResponse) => void
  onReject?: (template: AdminWorkshopTemplateResponse) => void
}

export function TemplateReviewCard({
  template,
  onView,
  onApprove,
  onReject,
}: TemplateReviewCardProps) {
  const thumbnail = template.images.find(img => img.isThumbnail)?.imageUrl 
    || template.images[0]?.imageUrl 
    || "https://via.placeholder.com/400x300?text=No+Image"

  const getStatusBadge = () => {
    switch (template.status) {
      case WorkshopStatus.PENDING:
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        )
      case WorkshopStatus.ACTIVE:
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case WorkshopStatus.REJECTED:
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            <XCircle className="w-3 h-3 mr-1" />
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnail}
          alt={template.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image"
          }}
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
        {!template.vendorVerified && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              <AlertCircle className="w-3 h-3 mr-1" />
              Unverified Vendor
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="font-bold text-lg line-clamp-2 mb-1">
            {template.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {template.shortDescription}
          </p>
        </div>

        {/* Vendor Info */}
        <div className="space-y-1.5 py-2 border-y">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{template.vendorName}</span>
            {template.vendorVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{template.vendorEmail}</span>
          </div>
          {template.vendorPhone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{template.vendorPhone}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{formatDuration(template.estimatedDuration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>{formatPrice(template.defaultPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{template.minParticipants}-{template.maxParticipants} people</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(template.createdAt)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map(tag => (
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
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Rating (if approved) */}
        {template.status === WorkshopStatus.ACTIVE && template.averageRating && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{template.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({template.totalReview} reviews)</span>
          </div>
        )}

        {/* Rejection Reason */}
        {template.status === WorkshopStatus.REJECTED && template.rejectReason && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">
              Rejection Reason:
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 line-clamp-3">
              {template.rejectReason}
            </p>
          </div>
        )}

        {/* Review Info */}
        {template.reviewedAt && (
          <div className="text-xs text-muted-foreground">
            Reviewed: {formatDate(template.reviewedAt)}
            {template.reviewedBy && ` by Admin ${template.reviewedBy.slice(0, 8)}`}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView?.(template.id)}
            className="flex-1"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            View Details
          </Button>

          {template.status === WorkshopStatus.PENDING && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove?.(template)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject?.(template)}
                className="flex-1"
              >
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
