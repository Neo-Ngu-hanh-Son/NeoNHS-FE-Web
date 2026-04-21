import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarIcon, PlusCircle, Plus, Search, List, CalendarDays, RefreshCcw } from 'lucide-react'
import { notification } from 'antd'
import { WorkshopSessionResponse, SessionStatus } from './types'
import { SessionCard } from './components/session-card'
import { CancelSessionDialog } from './components/cancel-session-dialog'
import { CreateSessionDialog } from './components/create-session-dialog'
import { EditSessionDialog } from './components/edit-session-dialog'
import { ViewSessionDialog } from './components/view-session-dialog'
import { SessionCalendar } from './components/calendar'
import { formatDate, parseSessionInstant } from './utils/formatters'
import {
  canCompleteWorkshopSession,
  canStartWorkshopSession,
  mapWorkshopSessionErrorToVi,
} from './utils/workshopSessionRules'
import { getApiErrorMessage } from '@/utils/getApiErrorMessage'
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
    } catch (error: unknown) {
      console.error('Failed to fetch sessions:', error)
      notification.error({
        message: 'Tải dữ liệu thất bại',
        description: mapWorkshopSessionErrorToVi(getApiErrorMessage(error, 'Không thể tải danh sách phiên. Vui lòng thử lại.')),
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

    // Sort by start time (newest first)
    filtered = [...filtered].sort(
      (a, b) =>
        parseSessionInstant(b.startTime).getTime() -
        parseSessionInstant(a.startTime).getTime()
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
          message: 'Đã Hủy Phiên',
          description: `Phiên "${cancelDialog.session.workshopTemplate.name}" đã được hủy thành công.`
        })
      } catch (error: any) {
        console.error('Cancel failed:', error)
        notification.error({
          message: 'Hủy Thất Bại',
          description: error.message || 'Không thể hủy phiên. Vui lòng thử lại.',
        })
      }
    }
  }

  const handleStartSession = async (session: WorkshopSessionResponse) => {
    if (!canStartWorkshopSession(session)) {
      notification.warning({
        message: 'Chưa thể bắt đầu phiên',
        description: 'Vui lòng đảm bảo đã có khách đăng ký và chỉ thao tác trong khoảng ±30 phút quanh giờ bắt đầu.',
      })
      return
    }
    try {
      await WorkshopSessionService.updateSessionStatus(session.id, 'ONGOING')
      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: SessionStatus.ONGOING } : s
      ))
      notification.success({
        message: 'Đã bắt đầu phiên',
        description: `"${session.workshopTemplate.name}" hiện đang diễn ra.`,
      })
    } catch (error: unknown) {
      notification.error({
        message: 'Bắt đầu thất bại',
        description: mapWorkshopSessionErrorToVi(getApiErrorMessage(error, 'Không thể cập nhật trạng thái. Vui lòng thử lại.')),
      })
    }
  }

  const handleCompleteSession = async (session: WorkshopSessionResponse) => {
    if (!canCompleteWorkshopSession(session)) {
      notification.warning({
        message: 'Chưa thể hoàn thành phiên',
        description: 'Chỉ được hoàn thành khi phiên đang diễn ra và trong khoảng ±30 phút quanh giờ kết thúc.',
      })
      return
    }
    try {
      await WorkshopSessionService.updateSessionStatus(session.id, 'COMPLETED')
      setSessions(prev => prev.map(s =>
        s.id === session.id ? { ...s, status: SessionStatus.COMPLETED } : s
      ))
      notification.success({
        message: 'Đã hoàn thành phiên',
        description: `"${session.workshopTemplate.name}" đã được đánh dấu hoàn thành.`,
      })
    } catch (error: unknown) {
      notification.error({
        message: 'Hoàn thành thất bại',
        description: mapWorkshopSessionErrorToVi(getApiErrorMessage(error, 'Không thể cập nhật trạng thái. Vui lòng thử lại.')),
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
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-white/5 dark:to-transparent p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Danh Sách Các Phiên</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Quản lý lịch trình hoạt động Workshop của bạn</p>
          </div>
          <Button
            size="lg"
            onClick={() => handleCreateSession()}
            className="gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            Hẹn Lịch Phiên Mới
          </Button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm phiên workshop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={SessionStatus.SCHEDULED}>Đã lên lịch</SelectItem>
            <SelectItem value={SessionStatus.ONGOING}>Đang diễn ra</SelectItem>
            <SelectItem value={SessionStatus.COMPLETED}>Đã hoàn thành</SelectItem>
            <SelectItem value={SessionStatus.CANCELLED}>Đã hủy</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <Button
            size="sm"
            variant={view === 'list' ? 'default' : 'ghost'}
            onClick={() => setView('list')}
            className="gap-1 rounded-md"
          >
            <List className="w-4 h-4" />
            Danh Sách
          </Button>
          <Button
            size="sm"
            variant={view === 'calendar' ? 'default' : 'ghost'}
            onClick={() => setView('calendar')}
            className="gap-1 rounded-md"
          >
            <CalendarDays className="w-4 h-4" />
            Lịch
          </Button>
        </div>
        <div className="flex gap-2 dark:bg-slate-800 rounded-lg p-1">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchSessions}
            className="gap-1 rounded-md w-full"
          >
            <RefreshCcw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground font-medium">
        Hiển thị {filteredSessions.length} / {sessions.length} phiên
      </div>

      {/* Sessions Display */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải danh sách phiên...</p>
          </div>
        </div>
      ) : filteredSessions.length > 0 ? (
        view === 'list' ? (
          // List View - Grouped by Date
          <div className="space-y-6">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">{date}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground font-medium">{dateSessions.length} phiên</span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
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
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900">
          <CalendarIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy phiên nào</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== 'all'
              ? "Vui lòng thử điều chỉnh bộ lọc của bạn"
              : "Bắt đầu bằng cách tạo lịch trình phiên đầu tiên"
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => handleCreateSession()} className="rounded-xl">
              <PlusCircle className="w-4 h-4 mr-2" />
              Tạo Phiên Mới
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
