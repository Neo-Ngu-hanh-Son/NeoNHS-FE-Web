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
import { formatDate, formatDuration, formatPrice } from "@/pages/vendor/WorkshopTemplates/utils/formatters"

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
  const thumbnail =
    template.images.find((img) => img.isThumbnail)?.imageUrl ||
    template.images[0]?.imageUrl ||
    "https://via.placeholder.com/400x300?text=No+Image"

  const getStatusBadge = () => {
    switch (template.status) {
      case WorkshopStatus.PENDING:
        return (
          <Badge className="bg-amber-500 text-white hover:bg-amber-600">
            <Clock className="mr-1 h-3 w-3" />
            Chờ duyệt
          </Badge>
        )
      case WorkshopStatus.ACTIVE:
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Đã duyệt
          </Badge>
        )
      case WorkshopStatus.REJECTED:
        return (
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            <XCircle className="mr-1 h-3 w-3" />
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

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-colors dark:border-slate-700">
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnail}
          alt={template.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image"
          }}
        />
        <div className="absolute right-2 top-2">{getStatusBadge()}</div>
        {template.vendorVerified === true ? (
          <div className="absolute left-2 top-2">
            <Badge variant="outline" className="border-green-300 bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Đã xác minh
            </Badge>
          </div>
        ) : template.vendorVerified === false ? (
          <div className="absolute left-2 top-2">
            <Badge variant="outline" className="border-amber-300 bg-amber-100 text-amber-800">
              <AlertCircle className="mr-1 h-3 w-3" />
              Chưa xác minh
            </Badge>
          </div>
        ) : null}
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="mb-1 line-clamp-2 text-lg font-bold">{template.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {template.shortDescription}
          </p>
        </div>

        <div className="space-y-1.5 border-y py-2">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="font-medium">{template.vendorName}</span>
            {template.vendorVerified === true && (
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{template.vendorEmail}</span>
          </div>
          {template.vendorPhone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{template.vendorPhone}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatDuration(template.estimatedDuration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatPrice(template.defaultPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {template.minParticipants}-{template.maxParticipants} người
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(template.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {template.tags.slice(0, 3).map((tag) => (
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
              +{template.tags.length - 3} thẻ
            </Badge>
          )}
        </div>

        {template.status === WorkshopStatus.ACTIVE && template.averageRating && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">{template.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({template.totalRatings} đánh giá)
            </span>
          </div>
        )}

        {template.status === WorkshopStatus.REJECTED && template.adminNote && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
            <p className="mb-1 text-xs font-medium text-red-800 dark:text-red-200">
              Lý do từ chối:
            </p>
            <p className="line-clamp-3 text-xs text-red-700 dark:text-red-300">
              {template.adminNote}
            </p>
          </div>
        )}

        {template.reviewedAt && (
          <div className="text-xs text-muted-foreground">
            Đã xử lý: {formatDate(template.reviewedAt)}
            {template.reviewedBy && ` · Quản trị ${template.reviewedBy.slice(0, 8)}`}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView?.(template.id)}
            className="flex-1 transition-colors"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Xem chi tiết
          </Button>

          {template.status === WorkshopStatus.PENDING && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove?.(template)}
                className="flex-1 bg-green-600 transition-colors hover:bg-green-700"
              >
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Duyệt
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject?.(template)}
                className="flex-1 transition-colors"
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                Từ chối
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
