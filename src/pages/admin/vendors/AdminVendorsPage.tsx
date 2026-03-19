import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, PlusCircle, Users, CheckCircle2, Ban as BanIcon, UserCheck, Loader2 } from 'lucide-react'
import { notification, Pagination } from 'antd'
import adminVendorService from '@/services/api/adminVendorService'
import { VendorProfileResponse, VendorStats, VendorFilterOptions } from './types'
import { VendorCard } from './components/vendor-card'
import { BanVendorDialog, UnbanVendorDialog } from './components/ban-vendor-dialog'
import { VendorDetailDialog } from './components/vendor-detail-dialog'
import { CreateVendorDialog } from './components/create-vendor-dialog'
import { EditVendorDialog } from './components/edit-vendor-dialog'
import { ArrowUp, ArrowDown } from 'lucide-react'

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorProfileResponse[]>([])
  const [stats, setStats] = useState<VendorStats>({
    total: 0,
    active: 0,
    banned: 0,
    pendingVerification: 0,
    verified: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [verificationFilter, setVerificationFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)

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

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialog, setEditDialog] = useState<{ open: boolean; vendor: VendorProfileResponse | null }>({
    open: false,
    vendor: null,
  })

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    try {
      const options: VendorFilterOptions = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
        keyword: searchQuery || undefined,
      }

      // Add specialized filters if not 'all'
      if (statusFilter === 'active') options.isActive = true
      if (statusFilter === 'inactive') options.isActive = false
      if (statusFilter === 'banned') options.isBanned = true
      if (verificationFilter === 'verified') options.isVerified = true
      if (verificationFilter === 'unverified') options.isVerified = false

      const response = await adminVendorService.getAllVendors(options)
      setVendors(response.content)
      setTotalElements(response.totalElements)

      // Update local stats from content if needed, 
      // or ideally fetch from a stats endpoint
      // For now, let's use the totals from the pagination if available
      // or fetch separate stats if we implement that.
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to load vendors list.',
      })
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, sortBy, sortDirection, searchQuery, statusFilter, verificationFilter])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  // Fetch stats separately
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await adminVendorService.getVendorStats()
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch vendor stats:', error)
      // Fallback to basic total if endpoint fails
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Debounced search could be added here for better performance
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleView = (id: string) => {
    const vendor = vendors.find(v => v.id === id)
    if (vendor) {
      setDetailDialog({ open: true, vendor })
    }
  }

  const handleEdit = (id: string) => {
    const vendor = vendors.find(v => v.id === id)
    if (vendor) {
      setEditDialog({ open: true, vendor })
    }
  }

  const handleEditSuccess = async (id: string, data: any) => {
    try {
      await adminVendorService.updateVendor(id, data)
      notification.success({
        message: 'Success',
        description: 'Vendor account updated successfully.',
      })
      fetchVendors()
      fetchStats()

      // Update detail dialog vendor if it's open
      if (detailDialog.open && detailDialog.vendor && detailDialog.vendor.id === id) {
        setDetailDialog(prev => ({ ...prev, vendor: { ...prev.vendor!, ...data } }))
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update vendor account.',
      })
      throw error // Re-throw to keep dialog open/handle in component
    }
  }

  const handleBanClick = (vendor: VendorProfileResponse) => {
    setBanDialog({ open: true, vendor })
  }

  const handleBanConfirm = async (reason: string) => {
    if (banDialog.vendor) {
      try {
        await adminVendorService.banVendor(banDialog.vendor.id, { reason })
        setBanDialog({ open: false, vendor: null })
        notification.warning({
          message: 'Vendor Banned',
          description: `${banDialog.vendor.businessName} has been banned.`,
        })
        fetchVendors()
        fetchStats()
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to ban vendor.',
        })
      }
    }
  }

  const handleUnbanClick = (vendor: VendorProfileResponse) => {
    setUnbanDialog({ open: true, vendor })
  }

  const handleUnbanConfirm = async () => {
    if (unbanDialog.vendor) {
      try {
        await adminVendorService.unbanVendor(unbanDialog.vendor.id)
        setUnbanDialog({ open: false, vendor: null })
        notification.success({
          message: 'Vendor Unbanned',
          description: `${unbanDialog.vendor.businessName} has been unbanned.`,
        })
        fetchVendors()
        fetchStats()
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to unban vendor.',
        })
      }
    }
  }

  const handleVerify = async (vendor: VendorProfileResponse) => {
    try {
      await adminVendorService.verifyVendor(vendor.id)
      notification.success({
        message: 'Vendor Verified',
        description: `${vendor.businessName} has been verified.`,
      })
      fetchVendors()
      fetchStats()
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to verify vendor.',
      })
    }
  }

  const handleCreateVendor = () => {
    setCreateDialogOpen(true)
  }

  const handleCreateSuccess = async (data: any) => {
    try {
      await adminVendorService.createVendor(data)
      notification.success({
        message: 'Success',
        description: 'Vendor account created successfully.',
      })
      fetchVendors()
      fetchStats()
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create vendor account.',
      })
      throw error // Re-throw to keep dialog open/handle in component
    }
  }

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC')
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
            onChange={handleSearch}
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
        <div className="flex items-center gap-2">
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
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
            title={sortDirection === 'ASC' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'ASC' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{vendors.length}</strong> of <strong>{totalElements}</strong> vendors
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
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : vendors.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
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

          {/* Pagination */}
          <div className="flex justify-center py-4 bg-white dark:bg-zinc-900 rounded-xl border p-4 shadow-sm">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalElements}
              onChange={(page, size) => {
                setCurrentPage(page)
                setPageSize(size)
              }}
              showSizeChanger
              showTotal={(total) => `Total ${total} vendors`}
            />
          </div>
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

      <CreateVendorDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditVendorDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog(prev => ({ ...prev, open }))}
        vendor={editDialog.vendor}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
