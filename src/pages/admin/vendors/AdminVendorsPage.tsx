import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, PlusCircle, Users, CheckCircle2, Ban as BanIcon, UserCheck } from 'lucide-react'
import { notification } from 'antd'
import { mockVendors, mockVendorStats } from './data'
import { VendorProfileResponse, VendorStats } from './types'
import { VendorCard } from './components/vendor-card'
import { BanVendorDialog, UnbanVendorDialog } from './components/ban-vendor-dialog'
import { VendorDetailDialog } from './components/vendor-detail-dialog'

export default function AdminVendorsPage() {
  const [vendors] = useState<VendorProfileResponse[]>(mockVendors)
  const [stats] = useState<VendorStats>(mockVendorStats)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [verificationFilter, setVerificationFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')

  const [banDialog, setBanDialog] = useState<{ open: boolean; vendor: VendorProfileResponse | null }>({
    open: false,
    vendor: null,
  })

  const [unbanDialog, setUnbanDialog] = useState<{ open: boolean; vendor: VendorProfileResponse | null }>({
    open: false,
    vendor: null,
  })

  const [detailDialog, setDetailDialog] = useState<{ open: boolean; vendor: VendorProfileResponse | null }>({
    open: false,
    vendor: null,
  })

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    let filtered = vendors

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v =>
        v.fullname.toLowerCase().includes(query) ||
        v.businessName.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(v => v.isActive && !v.isBanned)
      } else if (statusFilter === 'banned') {
        filtered = filtered.filter(v => v.isBanned)
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(v => !v.isActive && !v.isBanned)
      }
    }

    // Verification filter
    if (verificationFilter !== 'all') {
      if (verificationFilter === 'verified') {
        filtered = filtered.filter(v => v.isVerifiedVendor)
      } else if (verificationFilter === 'unverified') {
        filtered = filtered.filter(v => !v.isVerifiedVendor)
      }
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullname.localeCompare(b.fullname)
        case 'businessName':
          return a.businessName.localeCompare(b.businessName)
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return filtered
  }, [vendors, searchQuery, statusFilter, verificationFilter, sortBy])

  const handleView = (id: string) => {
    const vendor = vendors.find(v => v.id === id)
    if (vendor) {
      setDetailDialog({ open: true, vendor })
    }
  }

  const handleEdit = (id: string) => {
    // TODO: Open edit vendor modal
    console.log('Edit vendor:', id)
    notification.info({
      message: 'Edit Vendor',
      description: 'Vendor edit form will be implemented',
    })
  }

  const handleBanClick = (vendor: VendorProfileResponse) => {
    setBanDialog({ open: true, vendor })
  }

  const handleBanConfirm = (reason: string) => {
    if (banDialog.vendor) {
      // TODO: Call API to ban vendor
      console.log('Banning vendor:', banDialog.vendor.id, 'Reason:', reason)
      setBanDialog({ open: false, vendor: null })
      notification.warning({
        message: 'Vendor Banned',
        description: `${banDialog.vendor.businessName} has been banned.`,
      })
    }
  }

  const handleUnbanClick = (vendor: VendorProfileResponse) => {
    setUnbanDialog({ open: true, vendor })
  }

  const handleUnbanConfirm = () => {
    if (unbanDialog.vendor) {
      // TODO: Call API to unban vendor
      console.log('Unbanning vendor:', unbanDialog.vendor.id)
      setUnbanDialog({ open: false, vendor: null })
      notification.success({
        message: 'Vendor Unbanned',
        description: `${unbanDialog.vendor.businessName} has been unbanned.`,
      })
    }
  }

  const handleVerify = (vendor: VendorProfileResponse) => {
    // TODO: Call API to verify vendor
    console.log('Verifying vendor:', vendor.id)
    notification.success({
      message: 'Vendor Verified',
      description: `${vendor.businessName} has been verified.`,
    })
  }

  const handleCreateVendor = () => {
    // TODO: Open create vendor modal
    notification.info({
      message: 'Create Vendor',
      description: 'Create vendor form will be implemented',
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground">Manage and monitor all vendor accounts</p>
        </div>
        <Button
          size="lg"
          onClick={handleCreateVendor}
          className="gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Banned</p>
                <p className="text-3xl font-bold text-red-600">{stats.banned}</p>
              </div>
              <BanIcon className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, business, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>

        {/* Verification Filter */}
        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Not Verified</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Recently Updated</SelectItem>
            <SelectItem value="createdAt">Recently Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="businessName">Business Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{filteredVendors.length}</strong> of <strong>{vendors.length}</strong> vendors
        </p>
        {(searchQuery || statusFilter !== 'all' || verificationFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setVerificationFilter('all')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onView={handleView}
              onEdit={handleEdit}
              onBan={handleBanClick}
              onUnban={handleUnbanClick}
              onVerify={handleVerify}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || verificationFilter !== 'all'
                ? "Try adjusting your filters"
                : "Get started by creating your first vendor account"}
            </p>
            {!searchQuery && statusFilter === 'all' && verificationFilter === 'all' && (
              <Button onClick={handleCreateVendor}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Vendor
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <BanVendorDialog
        vendor={banDialog.vendor}
        open={banDialog.open}
        onOpenChange={(open) => setBanDialog({ open, vendor: open ? banDialog.vendor : null })}
        onConfirm={handleBanConfirm}
      />

      <UnbanVendorDialog
        vendor={unbanDialog.vendor}
        open={unbanDialog.open}
        onOpenChange={(open) => setUnbanDialog({ open, vendor: open ? unbanDialog.vendor : null })}
        onConfirm={handleUnbanConfirm}
      />

      <VendorDetailDialog
        vendor={detailDialog.vendor}
        open={detailDialog.open}
        onOpenChange={(open) => setDetailDialog({ open, vendor: open ? detailDialog.vendor : null })}
        onEdit={handleEdit}
        onBan={handleBanClick}
        onUnban={handleUnbanClick}
        onVerify={handleVerify}
      />
    </div>
  )
}
