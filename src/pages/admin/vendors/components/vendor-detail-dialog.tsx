import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  MapPinned,
  Edit,
  Ban,
  CheckCircle,
  Briefcase,
  Users,
  ClipboardList,
} from "lucide-react"
import { VendorProfileResponse } from "../types"
import { VendorStatusBadge, VerificationBadge } from "./vendor-status-badge"
import { formatDate, formatDateTime, formatPhoneNumber, formatBankAccount } from "../utils/formatters"

interface VendorDetailDialogProps {
  vendor: VendorProfileResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (id: string) => void
  onBan?: (vendor: VendorProfileResponse) => void
  onUnban?: (vendor: VendorProfileResponse) => void
  onVerify?: (vendor: VendorProfileResponse) => void
}

export function VendorDetailDialog({
  vendor,
  open,
  onOpenChange,
  onEdit,
  onBan,
  onUnban,
  onVerify,
}: VendorDetailDialogProps) {
  if (!vendor) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">Vendor Details</DialogTitle>
                <DialogDescription>
                  Complete information about {vendor.businessName}
                </DialogDescription>
              </div>
              <VendorStatusBadge
                isActive={vendor.isActive}
                isBanned={vendor.isBanned}
                isVerified={vendor.isVerifiedVendor}
                size="md"
              />
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header with Avatar */}
            <div className="flex items-center gap-4">
              <img
                src={vendor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.fullname)}&background=4F46E5&color=fff&size=96`}
                alt={vendor.fullname}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.fullname)}&background=4F46E5&color=fff&size=96`
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{vendor.fullname}</h2>
                <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4" />
                  {vendor.businessName}
                </p>
                <div className="flex gap-2 mt-2">
                  <VerificationBadge isVerified={vendor.isVerifiedVendor} size="sm" />
                  {vendor.taxCode && (
                    <Badge variant="outline" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      Tax: {vendor.taxCode}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {vendor.description && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">About</h3>
                  <p className="text-sm">{vendor.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium break-all">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{formatPhoneNumber(vendor.phoneNumber)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg md:col-span-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{vendor.address || 'Not provided'}</p>
                  </div>
                </div>
                {(vendor.latitude && vendor.longitude) && (
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg md:col-span-2">
                    <MapPinned className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">GPS Coordinates</p>
                      <p className="text-sm font-medium">
                        {vendor.latitude}, {vendor.longitude}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Business Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tax Code</p>
                    <p className="text-sm font-medium">{vendor.taxCode || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bank Account</p>
                    <p className="text-sm font-medium">
                      {formatBankAccount(vendor.bankName, vendor.bankAccountNumber)}
                    </p>
                    {vendor.bankAccountName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Account Name: {vendor.bankAccountName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Statistics
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold">{vendor.totalTemplates || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Templates</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold">{vendor.activeTemplates || 0}</p>
                    <p className="text-xs text-muted-foreground">Active Templates</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold">{vendor.totalSessions || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Sessions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                    <p className="text-2xl font-bold">{formatDate(vendor.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">Join Date</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* System Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant="outline">{vendor.role}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Account Status:</span>
                  <Badge variant={vendor.isActive ? "default" : "secondary"}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDateTime(vendor.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formatDateTime(vendor.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => onEdit?.(vendor.id)}
                disabled={vendor.isBanned}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Vendor
              </Button>

              {vendor.isBanned ? (
                <Button
                  onClick={() => onUnban?.(vendor)}
                  variant="outline"
                  className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Unban Vendor
                </Button>
              ) : (
                <Button
                  onClick={() => onBan?.(vendor)}
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Ban Vendor
                </Button>
              )}

              {!vendor.isVerifiedVendor && !vendor.isBanned && (
                <Button
                  onClick={() => onVerify?.(vendor)}
                  variant="default"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Vendor
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
