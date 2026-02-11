import { WorkshopTemplateResponse, WorkshopStatus } from "../types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplateStatusBadge } from "./template-status-badge"
import { Edit, Eye, Trash2, Send, Clock, Users, DollarSign } from "lucide-react"
import { formatDuration, formatPrice, formatDate } from "../utils/formatters"

interface WorkshopTemplateCardProps {
  template: WorkshopTemplateResponse
  onEdit?: () => void
  onDelete?: () => void
  onSubmit?: () => void
  onView?: () => void
}

export function WorkshopTemplateCard({
  template,
  onEdit,
  onDelete,
  onSubmit,
  onView,
}: WorkshopTemplateCardProps) {
  const thumbnail = template.images.find(img => img.isThumbnail)?.imageUrl || template.images[0]?.imageUrl

  const canEdit = template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED
  const canDelete = template.status !== WorkshopStatus.ACTIVE
  const canSubmit = template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {/* Thumbnail Image */}
      {thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={thumbnail}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
            }}
          />
          <div className="absolute top-3 right-3">
            <TemplateStatusBadge status={template.status} size="sm" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
            {template.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {template.shortDescription}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price and Duration */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <span className="text-lg">{formatPrice(template.defaultPrice)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(template.estimatedDuration)}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{template.minParticipants}-{template.maxParticipants} participants</span>
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
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
                +{template.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Created/Updated Date */}
        <p className="text-xs text-muted-foreground">
          Updated: {formatDate(template.updatedAt)}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        {/* Status-based action buttons */}
        {template.status === WorkshopStatus.DRAFT && (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
                <Edit className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            )}
            {onSubmit && (
              <Button size="sm" onClick={onSubmit} className="flex-1">
                <Send className="w-3.5 h-3.5 mr-1" />
                Submit
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </>
        )}

        {template.status === WorkshopStatus.PENDING && (
          <>
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1">
                <Eye className="w-3.5 h-3.5 mr-1" />
                View
              </Button>
            )}
            <span className="text-xs text-muted-foreground flex-1 text-center">
              Awaiting approval...
            </span>
          </>
        )}

        {template.status === WorkshopStatus.ACTIVE && (
          <>
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1">
                <Eye className="w-3.5 h-3.5 mr-1" />
                View
              </Button>
            )}
            {template.averageRating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{template.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({template.totalReview})</span>
              </div>
            )}
          </>
        )}

        {template.status === WorkshopStatus.REJECTED && (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
                <Edit className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            )}
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1">
                <Eye className="w-3.5 h-3.5 mr-1" />
                View Reason
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
