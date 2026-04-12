import { WorkshopTemplateResponse, WorkshopStatus } from "../types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplateStatusBadge } from "./template-status-badge"
import { EditOutlined, EyeOutlined, DeleteOutlined, SendOutlined, ClockCircleOutlined, TeamOutlined, StarFilled, StarOutlined, GlobalOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { formatDuration, formatPrice, formatDate } from "../utils/formatters"

interface WorkshopTemplateCardProps {
  template: WorkshopTemplateResponse
  onEdit?: () => void
  onDelete?: () => void
  onSubmit?: () => void
  onView?: () => void
  onTogglePublish?: () => void
}

export function WorkshopTemplateCard({
  template,
  onEdit,
  onDelete,
  onSubmit,
  onView,
  onTogglePublish,
}: WorkshopTemplateCardProps) {
  const thumbnail = template.images.find(img => img.isThumbnail)?.imageUrl || template.images[0]?.imageUrl

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {/* Thumbnail Image */}
      {thumbnail && (
        <div
          className="relative h-48 shrink-0 overflow-hidden cursor-pointer"
          onClick={onView}
        >
          <img
            src={thumbnail}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
            }}
          />
          <div className="absolute top-3 right-3">
            <TemplateStatusBadge status={template.status} isPublished={template.isPublished} size="sm" />
          </div>
        </div>
      )}

      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
            {template.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {template.shortDescription}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3">
        {/* Price and Duration */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <span className="text-lg">{formatPrice(template.defaultPrice)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ClockCircleOutlined />
            <span>{formatDuration(template.estimatedDuration)}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <TeamOutlined />
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
                <div className="flex items-center gap-1">
                  {tag.iconUrl && (
                    <img src={tag.iconUrl} alt={tag.name} className="w-3 h-3 object-contain rounded-sm" />
                  )}
                  <span>{tag.name}</span>
                </div>
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

      <CardFooter className="mt-auto flex shrink-0 flex-wrap gap-2 border-t pt-4">
        {/* Status-based action buttons */}
        {template.status === WorkshopStatus.DRAFT && (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 gap-1">
                <EditOutlined />
                Edit
              </Button>
            )}
            {onSubmit && (
              <Button size="sm" onClick={onSubmit} className="flex-1 gap-1">
                <SendOutlined />
                Submit
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <DeleteOutlined />
              </Button>
            )}
          </>
        )}

        {template.status === WorkshopStatus.PENDING && (
          <>
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1 gap-1">
                <EyeOutlined />
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
              <Button size="sm" variant="outline" onClick={onView} className="flex-1 gap-1">
                <EyeOutlined />
                View
              </Button>
            )}
            {onTogglePublish && (
              <Button
                size="sm"
                variant={template.isPublished ? "outline" : "default"}
                onClick={onTogglePublish}
                className="flex-1 gap-1"
              >
                {template.isPublished ? (
                  <><EyeInvisibleOutlined /> Unpublish</>
                ) : (
                  <><GlobalOutlined /> Publish</>
                )}
              </Button>
            )}
            {template.averageRating != null && (
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-full px-2.5 py-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-xs">
                      {template.averageRating! >= star ? (
                        <StarFilled className="text-amber-500" />
                      ) : template.averageRating! >= star - 0.5 ? (
                        <StarFilled className="text-amber-300" />
                      ) : (
                        <StarOutlined className="text-gray-300 dark:text-gray-600" />
                      )}
                    </span>
                  ))}
                </div>
                <span className="average-rating font-bold text-sm text-amber-700 dark:text-amber-400">
                  {template.averageRating.toFixed(1)}
                </span>
                <span className="total-review text-xs text-muted-foreground">
                  ({template.totalReview})
                </span>
              </div>
            )}
          </>
        )}

        {template.status === WorkshopStatus.REJECTED && (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 gap-1">
                <EditOutlined />
                Edit
              </Button>
            )}
            {onView && (
              <Button size="sm" variant="outline" onClick={onView} className="flex-1 gap-1">
                <EyeOutlined />
                View Reason
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <DeleteOutlined />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
