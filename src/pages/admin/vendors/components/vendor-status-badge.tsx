import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Ban } from "lucide-react"
import { cn } from "@/lib/utils"

interface VendorStatusBadgeProps {
  isActive: boolean
  isBanned: boolean
  isVerified?: boolean
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function VendorStatusBadge({ 
  isActive, 
  isBanned, 
  isVerified = false,
  size = 'md',
  showIcon = true 
}: VendorStatusBadgeProps) {
  const getStatusConfig = () => {
    if (isBanned) {
      return {
        label: 'Banned',
        variant: 'destructive' as const,
        icon: Ban,
        className: 'bg-red-500 hover:bg-red-600 text-white'
      }
    }
    
    if (!isActive) {
      return {
        label: 'Inactive',
        variant: 'secondary' as const,
        icon: XCircle,
        className: 'bg-gray-500 hover:bg-gray-600 text-white'
      }
    }
    
    if (isVerified) {
      return {
        label: 'Active & Verified',
        variant: 'default' as const,
        icon: CheckCircle2,
        className: 'bg-green-500 hover:bg-green-600 text-white'
      }
    }
    
    return {
      label: 'Active',
      variant: 'outline' as const,
      icon: AlertCircle,
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        sizeClasses[size],
        config.className,
        'flex items-center gap-1.5 font-medium'
      )}
    >
      {showIcon && <Icon className={cn(
        'shrink-0',
        size === 'sm' && 'w-3 h-3',
        size === 'md' && 'w-3.5 h-3.5',
        size === 'lg' && 'w-4 h-4'
      )} />}
      {config.label}
    </Badge>
  )
}

// Separate badge for verification status only
export function VerificationBadge({ 
  isVerified, 
  size = 'sm' 
}: { 
  isVerified: boolean
  size?: 'sm' | 'md' | 'lg' 
}) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  return (
    <Badge 
      variant={isVerified ? 'default' : 'outline'}
      className={cn(
        sizeClasses[size],
        isVerified 
          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-700',
        'flex items-center gap-1 font-medium'
      )}
    >
      {isVerified ? (
        <>
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3" />
          Not Verified
        </>
      )}
    </Badge>
  )
}
