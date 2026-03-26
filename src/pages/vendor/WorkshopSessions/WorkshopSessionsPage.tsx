import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarIcon, PlusCircle, Search, List, CalendarDays } from 'lucide-react'
import { notification } from 'antd'
import { WorkshopSessionResponse, SessionStatus } from './types'
import { SessionCard } from './components/session-card'
import { CancelSessionDialog } from './components/cancel-session-dialog'
import { CreateSessionDialog } from './components/create-session-dialog'
import { EditSessionDialog } from './components/edit-session-dialog'
import { ViewSessionDialog } from './components/view-session-dialog'
import { SessionCalendar } from './components/calendar'
import { formatDate } from './utils/formatters'
import { WorkshopSessionService } from '@/services/api/workshopSessionService'

export default function WorkshopSessionsPage() {
  const [sessions, setSessions] = useState<WorkshopSessionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [view, setView] = useState<'list' | 'calendar'>('list')
  
  const [createDialog, setCreateDialog] = useState(false)
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>()
  const [editDialog, setEditDialog] = useState<{ open: boolean; session: WorkshopSessionResponse | null }>({
    open: false,
    session: null,
  })
  const [viewDialog, setViewDialog] = useState<{ open: boolean; session: WorkshopSessionResponse | null }>({
    open: false,
    session: null,
  })
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; session: WorkshopSessionResponse | null }>({
    open: false,
    session: null,
  })

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await WorkshopSessionService.getMySessions({
        page: 0,
        size: 100, // Get all for now
        sortBy: 'startTime',
        sortDirection: 'ASC',
      })
      setSessions(response.content || [])
    } catch (error: any) {
      console.error('Failed to fetch sessions:', error)
      notification.error({
        message: 'Failed to Load Sessions',
        description: error.message || 'Unable to fetch workshop sessions. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let filtered = sessions

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s => 
        s.workshopTemplate.name.toLowerCase().includes(query) ||
        s.workshopTemplate.shortDescription.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter)
    }

    // Sort by start time (upcoming first)
    filtered = [...filtered].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )

    return filtered
  }, [sessions, searchQuery, statusFilter])

  // Group sessions by date for list view
  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: WorkshopSessionResponse[] } = {}
    filteredSessions.forEach(session => {
      const dateKey = formatDate(session.startTime)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(session)
    })
    return groups
  }, [filteredSessions])

  const handleView = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setViewDialog({ open: true, session })
    }
  }

  const handleCalendarSessionView = (session: WorkshopSessionResponse) => {
    setViewDialog({ open: true, session })
  }

  const handleEdit = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setEditDialog({ open: true, session })
    }
  }

  const handleCancelClick = (session: WorkshopSessionResponse) => {
    setCancelDialog({ open: true, session })
  }

  const handleCancelConfirm = async () => {
    if (cancelDialog.session) {
      try {
        await WorkshopSessionService.cancelSession(cancelDialog.session.id)
        
        // Update local state
        setSessions(prev => prev.map(s => 
          s.id === cancelDialog.session!.id 
            ? { ...s, status: SessionStatus.CANCELLED }
            : s
        ))
        
        setCancelDialog({ open: false, session: null })
        notification.success({
          message: 'Session Cancelled',
          description: `Session for "${cancelDialog.session.workshopTemplate.name}" has been cancelled.`
        })
      } catch (error: any) {
        console.error('Cancel failed:', error)
        notification.error({
          message: 'Cancellation Failed',
          description: error.message || 'Failed to cancel session. Please try again.',
        })
      }
    }
  }

  const handleStartSession = async (session: WorkshopSessionResponse) => {
    try {
      await WorkshopSessionService.updateSessionStatus(session.id, 'ONGOING')
      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: SessionStatus.ONGOING } : s
      ))
      notification.success({
        message: 'Session Started',
        description: `"${session.workshopTemplate.name}" is now ongoing.`,
      })
    } catch (error: any) {
      notification.error({
        message: 'Failed to Start Session',
        description: error.message || 'Please try again.',
      })
    }
  }

  const handleCompleteSession = async (session: WorkshopSessionResponse) => {
    try {
      await WorkshopSessionService.updateSessionStatus(session.id, 'COMPLETED')
      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: SessionStatus.COMPLETED } : s
      ))
      notification.success({
        message: 'Session Completed',
        description: `"${session.workshopTemplate.name}" has been marked as completed.`,
      })
    } catch (error: any) {
      notification.error({
        message: 'Failed to Complete Session',
        description: error.message || 'Please try again.',
      })
    }
  }

  const handleCreateSession = (date?: Date) => {
    setPreselectedDate(date)
    setCreateDialog(true)
  }

  const handleCalendarDateClick = (date: Date) => {
    // When clicking a date in calendar, open create dialog with that date
    handleCreateSession(date)
  }

  const handleCalendarSessionEdit = (session: WorkshopSessionResponse) => {
    setEditDialog({ open: true, session })
  }

  const handleCalendarSessionCancel = (session: WorkshopSessionResponse) => {
    setCancelDialog({ open: true, session })
  }

  const handleDialogSuccess = () => {
    // Refresh sessions list from API
    fetchSessions()
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workshop Sessions</h1>
          <p className="text-muted-foreground">Manage your scheduled workshop sessions</p>
        </div>
        <Button
          size="lg"
          onClick={() => handleCreateSession()}
          className="gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Session
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
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
            <SelectItem value={SessionStatus.SCHEDULED}>Scheduled</SelectItem>
            <SelectItem value={SessionStatus.ONGOING}>Ongoing</SelectItem>
            <SelectItem value={SessionStatus.COMPLETED}>Completed</SelectItem>
            <SelectItem value={SessionStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex gap-2 bg-secondary rounded-lg p-1">
          <Button
            size="sm"
            variant={view === 'list' ? 'default' : 'ghost'}
            onClick={() => setView('list')}
            className="gap-1"
          >
            <List className="w-4 h-4" />
            List
          </Button>
          <Button
            size="sm"
            variant={view === 'calendar' ? 'default' : 'ghost'}
            onClick={() => setView('calendar')}
            className="gap-1"
          >
            <CalendarDays className="w-4 h-4" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSessions.length} of {sessions.length} session{sessions.length !== 1 ? 's' : ''}
      </div>

      {/* Sessions Display */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        </div>
      ) : filteredSessions.length > 0 ? (
        view === 'list' ? (
          // List View - Grouped by Date
          <div className="space-y-6">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">{date}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">{dateSessions.length} session{dateSessions.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dateSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onView={() => handleView(session.id)}
                      onEdit={
                        session.status === SessionStatus.SCHEDULED
                          ? () => handleEdit(session.id)
                          : undefined
                      }
                      onCancel={
                        session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.ONGOING
                          ? () => handleCancelClick(session)
                          : undefined
                      }
                      onStart={
                        session.status === SessionStatus.SCHEDULED
                          ? () => handleStartSession(session)
                          : undefined
                      }
                      onComplete={
                        session.status === SessionStatus.ONGOING
                          ? () => handleCompleteSession(session)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Calendar View
          <SessionCalendar
            sessions={filteredSessions}
            onSessionClick={handleCalendarSessionView}
            onDateClick={handleCalendarDateClick}
            onSessionEdit={handleCalendarSessionEdit}
            onSessionCancel={handleCalendarSessionCancel}
            defaultView="month"
          />
        )
      ) : (
        // Empty State
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? "Try adjusting your filters"
              : "Get started by creating your first workshop session"
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => handleCreateSession()}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Session
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <CreateSessionDialog
        open={createDialog}
        onOpenChange={(open) => {
          setCreateDialog(open)
          if (!open) setPreselectedDate(undefined)
        }}
        preselectedDate={preselectedDate}
        onSuccess={handleDialogSuccess}
      />

      <EditSessionDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, session: null })}
        session={editDialog.session}
        onSuccess={handleDialogSuccess}
      />

      <ViewSessionDialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, session: null })}
        session={viewDialog.session}
        onStart={handleStartSession}
        onComplete={handleCompleteSession}
        onCancel={handleCancelClick}
      />

      <CancelSessionDialog
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog({ open, session: null })}
        sessionName={cancelDialog.session?.workshopTemplate.name || ''}
        enrollmentCount={cancelDialog.session?.currentEnrollments || 0}
        onConfirm={handleCancelConfirm}
      />
    </div>
  )
}
