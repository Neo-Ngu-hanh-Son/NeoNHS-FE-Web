import { WorkshopSessionResponse, SessionStatus } from "../types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SessionStatusBadge } from "./session-status-badge"
import { Calendar, Clock, Users, DollarSign, Eye, Edit, XCircle } from "lucide-react"
import { formatDate, formatTimeRange, formatPrice, getEnrollmentPercentage } from "../utils/formatters"

interface SessionCardProps {
  session: WorkshopSessionResponse
  onView?: () => void
  onEdit?: () => void
  onCancel?: () => void
}

export function SessionCard({ session, onView, onEdit, onCancel }: SessionCardProps) {
  const thumbnail = session.workshopTemplate.images.find(img => img.isThumbnail)?.imageUrl 
    || session.workshopTemplate.images[0]?.imageUrl

  const canEdit = session.status === SessionStatus.SCHEDULED
  const canCancel = session.status === SessionStatus.SCHEDULED && session.currentEnrollments > 0
  const enrollmentPercentage = getEnrollmentPercentage(session.currentEnrollments, session.maxParticipants)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {/* Thumbnail Image */}
      {thumbnail && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={thumbnail}
            alt={session.workshopTemplate.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
            }}
          />
          <div className="absolute top-3 right-3">
            <SessionStatusBadge status={session.status} size="sm" />
          </div>
          {session.availableSlots === 0 && session.status === SessionStatus.SCHEDULED && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-center py-1 text-sm font-semibold">
              FULLY BOOKED
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
          {session.workshopTemplate.name}
        </h3>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Date and Time */}
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="font-medium">{formatDate(session.startTime)}</p>
            <p className="text-muted-foreground">{formatTimeRange(session.startTime, session.endTime)}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-primary text-base">{formatPrice(session.price)}</span>
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {session.currentEnrollments} / {session.maxParticipants}
              </span>
            </div>
            <span className="text-muted-foreground">{enrollmentPercentage}% filled</span>
          </div>
          <Progress value={enrollmentPercentage} className="h-2" />
        </div>

        {/* Tags */}
        {session.workshopTemplate.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {session.workshopTemplate.tags.slice(0, 2).map((tag) => (
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
            {session.workshopTemplate.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{session.workshopTemplate.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        {onView && (
          <Button size="sm" variant="outline" onClick={onView} className="flex-1">
            <Eye className="w-3.5 h-3.5 mr-1" />
            View
          </Button>
        )}
        {canEdit && onEdit && (
          <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
            <Edit className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
        )}
        {canCancel && onCancel && (
          <Button size="sm" variant="destructive" onClick={onCancel}>
            <XCircle className="w-3.5 h-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
