import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import { WorkshopTemplateResponse, WorkshopStatus } from './types'
import { DeleteTemplateDialog } from './components/delete-template-dialog'
import { SubmitApprovalDialog } from './components/submit-approval-dialog'
import { WorkshopTemplateCard } from './components/workshop-template-card'
import { WorkshopTemplateService } from '@/services/api/workshopTemplateService'

export default function WorkshopTemplatesPage() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<WorkshopTemplateResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updatedAt')

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; template: WorkshopTemplateResponse | null }>({
    open: false,
    template: null,
  })

  const [submitDialog, setSubmitDialog] = useState<{ open: boolean; template: WorkshopTemplateResponse | null }>({
    open: false,
    template: null,
  })

  // Fetch templates on mount
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await WorkshopTemplateService.getMyTemplates({
        page: 0, // TODO: Add pagination later
        size: 100, // Get all for now
        sortBy: 'updatedAt',
        sortDirection: 'DESC',
      })
      setTemplates(response.content || [])
    } catch (error: any) {
      console.error('Failed to fetch templates:', error)
      notification.error({
        message: 'Failed to Load Templates',
        description: error.message || 'Unable to fetch workshop templates. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.shortDescription.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          return a.defaultPrice - b.defaultPrice
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return filtered
  }, [templates, searchQuery, statusFilter, sortBy])

  const handleView = (id: string) => {
    navigate(`/vendor/workshop-templates/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/vendor/workshop-templates/${id}/edit`)
  }

  const handleDeleteClick = (template: WorkshopTemplateResponse) => {
    if (template.status === WorkshopStatus.ACTIVE) {
      notification.error({
        message: 'Cannot Deleted',
        description: "Cannot delete an active template. Please contact admin if you need to remove this template."
      })
      return
    }
    setDeleteDialog({ open: true, template })
  }

  const handleDeleteConfirm = async () => {
    if (deleteDialog.template) {
      try {
        await WorkshopTemplateService.deleteTemplate(deleteDialog.template.id)
        
        // Remove from local state
        setTemplates(prev => prev.filter(t => t.id !== deleteDialog.template!.id))
        
        setDeleteDialog({ open: false, template: null })
        notification.success({
          message: 'Template Deleted',
          description: `Template "${deleteDialog.template.name}" has been deleted.`
        })
      } catch (error: any) {
        console.error('Delete failed:', error)
        notification.error({
          message: 'Delete Failed',
          description: error.message || 'Failed to delete template. Please try again.',
        })
      }
    }
  }

  const handleSubmitClick = (template: WorkshopTemplateResponse) => {
    setSubmitDialog({ open: true, template })
  }

  const handleSubmitConfirm = async () => {
    if (submitDialog.template) {
      try {
        const updated = await WorkshopTemplateService.submitForApproval(submitDialog.template.id)
        
        // Update local state
        setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t))
        
        setSubmitDialog({ open: false, template: null })
        notification.success({
          message: 'Template Submitted',
          description: `Template "${submitDialog.template.name}" has been submitted for approval.`
        })
      } catch (error: any) {
        console.error('Submit failed:', error)
        notification.error({
          message: 'Submission Failed',
          description: error.message || 'Failed to submit template for approval. Please try again.',
        })
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workshop Templates</h1>
          <p className="text-muted-foreground">Create and manage your workshop definitions</p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate('/vendor/workshop-templates/new')}
          className="gap-2"
        >
          <PlusCircleOutlined className="text-lg" />
          Create New Template
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={WorkshopStatus.DRAFT}>Draft</SelectItem>
            <SelectItem value={WorkshopStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={WorkshopStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={WorkshopStatus.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Recently Updated</SelectItem>
            <SelectItem value="createdAt">Recently Created</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTemplates.length} of {templates.length} template{templates.length !== 1 ? 's' : ''}
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <WorkshopTemplateCard
              key={template.id}
              template={template}
              onView={() => handleView(template.id)}
              onEdit={
                (template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED)
                  ? () => handleEdit(template.id)
                  : undefined
              }
              onDelete={
                template.status !== WorkshopStatus.ACTIVE
                  ? () => handleDeleteClick(template)
                  : undefined
              }
              onSubmit={
                (template.status === WorkshopStatus.DRAFT || template.status === WorkshopStatus.REJECTED)
                  ? () => handleSubmitClick(template)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? "Try adjusting your filters"
              : "Get started by creating your first workshop template"
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => navigate('/vendor/workshop-templates/new')}>
              <PlusCircleOutlined className="mr-2" />
              Create Template
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteTemplateDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, template: null })}
        templateName={deleteDialog.template?.name || ''}
        onConfirm={handleDeleteConfirm}
      />

      {/* Submit for Approval Dialog */}
      <SubmitApprovalDialog
        open={submitDialog.open}
        onOpenChange={(open) => setSubmitDialog({ open, template: null })}
        templateName={submitDialog.template?.name || ''}
        onConfirm={handleSubmitConfirm}
      />
    </div>
  )
}
