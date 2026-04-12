import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  FileText
} from "lucide-react"
import { VendorProfileResponse } from "../types"
import { VendorStatusBadge, VerificationBadge } from "./vendor-status-badge"
import { formatDate, formatPhoneNumber } from "../utils/formatters"

interface VendorCardProps {
  vendor: VendorProfileResponse
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onBan?: (vendor: VendorProfileResponse) => void
  onUnban?: (vendor: VendorProfileResponse) => void
}

export function VendorCard({
  vendor,
  onView,
  onEdit,
  onBan,
  onUnban,
}: VendorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with Avatar and Name */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={vendor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.fullname)}&background=4F46E5&color=fff`}
                  alt={vendor.fullname}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.fullname)}&background=4F46E5&color=fff`
                  }}
                />
                {vendor.isVerifiedVendor && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Name and Business */}
              <div>
                <h3 className="font-bold text-lg">{vendor.fullname}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {vendor.businessName}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-col gap-2 items-end">
              <VendorStatusBadge
                isActive={vendor.isActive}
                isBanned={vendor.isBanned}
                isVerified={vendor.isVerifiedVendor}
                size="sm"
              />
            </div>
          </div>

          {/* Description */}
          {vendor.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {vendor.description}
            </p>
          )}

          {/* Contact Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate">{vendor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{formatPhoneNumber(vendor.phoneNumber)}</span>
            </div>
            {vendor.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate">{vendor.address}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-4 pt-2 border-t">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Templates</span>
              <span className="text-sm font-semibold">
                {vendor.totalTemplates || 0} ({vendor.activeTemplates || 0} active)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Sessions</span>
              <span className="text-sm font-semibold">{vendor.totalSessions || 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Joined</span>
              <span className="text-sm font-semibold">{formatDate(vendor.createdAt)}</span>
            </div>
          </div>

          {/* Verification & Tax Info */}
          <div className="flex flex-wrap gap-2">
            <VerificationBadge isVerified={vendor.isVerifiedVendor} size="sm" />
            {vendor.taxCode && (
              <Badge variant="outline" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Tax: {vendor.taxCode}
              </Badge>
            )}
            {!vendor.taxCode && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                <FileText className="w-3 h-3 mr-1" />
                No Tax Code
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(vendor.id)}
              className="flex-1"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(vendor.id)}
              className="flex-1"
              disabled={vendor.isBanned}
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>

            {/* Ban/Unban Button */}
            {vendor.isBanned ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUnban?.(vendor)}
                className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Unban
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBan?.(vendor)}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Ban className="w-3.5 h-3.5 mr-1.5" />
                Ban
              </Button>
            )}


          </div>
        </div>
      </CardContent>
    </Card>
  )
}
