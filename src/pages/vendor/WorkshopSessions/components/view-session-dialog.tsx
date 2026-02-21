import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { WorkshopSessionResponse } from "../types"
import { SessionStatusBadge } from "./session-status-badge"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Users, DollarSign, User, Mail } from "lucide-react"
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
}

export function ViewSessionDialog({
  open,
  onOpenChange,
  session,
}: ViewSessionDialogProps) {
  
  if (!session) return null

  const thumbnail = session.workshopTemplate?.images?.find(img => img.isThumbnail)?.imageUrl 
    || session.workshopTemplate?.images?.[0]?.imageUrl
  const enrollmentPercentage = getEnrollmentPercentage(session.currentEnrollments, session.maxParticipants)
  const duration = calculateDuration(session.startTime, session.endTime)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{session.workshopTemplate?.name || 'Unnamed Workshop'}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {session.workshopTemplate?.shortDescription || 'No description available'}
              </p>
            </div>
            <SessionStatusBadge status={session.status} size="lg" />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {thumbnail && (
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src={thumbnail}
                alt={session.workshopTemplate?.name || 'Workshop'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image"
                }}
              />
            </div>
          )}

          {/* Schedule Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">{formatFullDateTime(session.startTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Time Range</p>
                  <p className="text-muted-foreground">{formatTimeRange(session.startTime, session.endTime)}</p>
                  <p className="text-xs text-muted-foreground">Duration: {formatDuration(duration)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{formatPrice(session.price)}</span>
              <span className="text-sm text-muted-foreground">per participant</span>
            </div>
          </div>

          <Separator />

          {/* Enrollment Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Enrollment Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {session.currentEnrollments} / {session.maxParticipants} participants enrolled
                  </span>
                </div>
                <span className="text-muted-foreground">{enrollmentPercentage}% filled</span>
              </div>
              <Progress value={enrollmentPercentage} className="h-3" />
              <p className={`text-sm font-medium ${session.availableSlots === 0 ? 'text-red-500' : 'text-green-600'}`}>
                {formatAvailability(session.availableSlots)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Workshop Description */}
          {session.workshopTemplate?.fullDescription && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">About This Workshop</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {session.workshopTemplate.fullDescription}
              </p>
            </div>
          )}

          {/* Tags */}
          {session.workshopTemplate?.tags && session.workshopTemplate.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Categories</h3>
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
                <h3 className="text-lg font-semibold">Hosted By</h3>
                <div className="flex items-start gap-4">
                  {session.vendor.avatar && (
                    <img
                      src={session.vendor.avatar}
                      alt={session.vendor.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{session.vendor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{session.vendor.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Rating (if available) */}
          {session.workshopTemplate?.averageRating && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Rating</h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="text-2xl font-bold">{session.workshopTemplate.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({session.workshopTemplate.totalReview} reviews)
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
