import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import { WorkshopTemplateResponse, WorkshopStatus } from './types'
import { DeleteTemplateDialog } from './components/delete-template-dialog'
import { SubmitApprovalDialog } from './components/submit-approval-dialog'
import { WorkshopTemplateService } from '@/services/api/workshopTemplateService'

import { TemplateHeader } from './ListPage/TemplateHeader'
import { TemplateFilters } from './ListPage/TemplateFilters'
import { TemplateGrid } from './ListPage/TemplateGrid'
import { TemplatePagination } from './ListPage/TemplatePagination'

const PAGE_SIZE = 9

export default function WorkshopTemplatesPage() {
  const navigate = useNavigate()

  // Data state
  const [templates, setTemplates] = useState<WorkshopTemplateResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Filter states
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updatedAt')
  const [currentPage, setCurrentPage] = useState(0) // 0-indexed for API

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; template: WorkshopTemplateResponse | null }>({
    open: false,
    template: null,
  })

  const [submitDialog, setSubmitDialog] = useState<{ open: boolean; template: WorkshopTemplateResponse | null }>({
    open: false,
    template: null,
  })

  // Debounce search keyword (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
      setCurrentPage(0) // Reset to first page when search changes
    }, 500)

    return () => clearTimeout(timer)
  }, [keyword])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [statusFilter, sortBy])

  // Fetch templates when filters or page change
  useEffect(() => {
    fetchTemplates()
  }, [debouncedKeyword, statusFilter, sortBy, currentPage])

  const fetchTemplates = async () => {
    try {
      setLoading(true)

      // Determine sort direction based on sortBy
      const sortDirection: 'ASC' | 'DESC' = sortBy === 'name' ? 'ASC' : 'DESC'

      const response = await WorkshopTemplateService.getMyTemplates({
        page: currentPage,
        size: PAGE_SIZE,
        sortBy,
        sortDirection,
      })

      // Apply filters on the fetched data
      let filtered = response.content || []

      // Apply keyword filter
      if (debouncedKeyword.trim()) {
        const query = debouncedKeyword.toLowerCase()
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(query) ||
          (t.shortDescription && t.shortDescription.toLowerCase().includes(query))
        )
      }

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter)
      }

      setTemplates(filtered)
      setTotalElements(response.totalElements)
      setTotalPages(response.totalPages)
    } catch (error: any) {
      console.error('Failed to fetch templates:', error)
      notification.error({
        message: 'Failed to Load Templates',
        description: error.message || 'Unable to fetch workshop templates. Please try again.',
      })
      setTemplates([])
      setTotalElements(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

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

        setDeleteDialog({ open: false, template: null })
        notification.success({
          message: 'Template Deleted',
          description: `Template "${deleteDialog.template.name}" has been deleted.`
        })

        // Refresh the list
        fetchTemplates()
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
        await WorkshopTemplateService.submitForApproval(submitDialog.template.id)

        setSubmitDialog({ open: false, template: null })
        notification.success({
          message: 'Template Submitted',
          description: `Template "${submitDialog.template.name}" has been submitted for approval.`
        })

        // Refresh the list
        fetchTemplates()
      } catch (error: any) {
        console.error('Submit failed:', error)
        notification.error({
          message: 'Submission Failed',
          description: error.message || 'Failed to submit template for approval. Please try again.',
        })
      }
    }
  }

  const handleTogglePublish = async (template: WorkshopTemplateResponse) => {
    try {
      await WorkshopTemplateService.togglePublish(template.id)

      notification.success({
        message: template.isPublished ? 'Template Unpublished' : 'Template Published',
        description: template.isPublished
          ? `Template "${template.name}" is now hidden from the public catalog.`
          : `Template "${template.name}" is now visible to tourists!`
      })

      // Refresh the list
      fetchTemplates()
    } catch (error: any) {
      console.error('Toggle publish failed:', error)
      notification.error({
        message: 'Toggle Publish Failed',
        description: error.message || 'Failed to toggle publish status. Please try again.',
      })
    }
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(0)

      // Calculate range around current page
      let start = Math.max(1, currentPage - 1)
      let end = Math.min(totalPages - 2, currentPage + 1)

      // Adjust if we're near the start
      if (currentPage <= 2) {
        end = 3
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 3) {
        start = totalPages - 4
      }

      // Add ellipsis after first page if needed
      if (start > 1) {
        pages.push('ellipsis')
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      pages.push(totalPages - 1)
    }

    return pages
  }, [currentPage, totalPages])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <TemplateHeader />

      <TemplateFilters
        keyword={keyword}
        setKeyword={setKeyword}
        debouncedKeyword={debouncedKeyword}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        loading={loading}
      />

      {/* Results count */}
      {!loading && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {templates.length > 0 ? (
              <>
                Showing {currentPage * PAGE_SIZE + 1}-{Math.min((currentPage + 1) * PAGE_SIZE, totalElements)} of {totalElements} template{totalElements !== 1 ? 's' : ''}
                {(keyword || statusFilter !== 'all') && ' (filtered)'}
              </>
            ) : (
              'No templates found'
            )}
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </div>
          )}
        </div>
      )}

      <TemplateGrid
        loading={loading}
        templates={templates}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
        handleSubmitClick={handleSubmitClick}
        handleTogglePublish={handleTogglePublish}
        keyword={keyword}
        statusFilter={statusFilter}
      />

      {!loading && (
        <TemplatePagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          pageNumbers={pageNumbers}
        />
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
