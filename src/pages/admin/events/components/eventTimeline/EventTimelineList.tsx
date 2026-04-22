import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Pencil, Trash2, MoreHorizontal, Clock, MapPin, User, CalendarDays, MoonStar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEventTimelines } from '@/hooks/event';
import type { EventTimelineResponse } from '@/types/eventTimeline';
import dayjs from 'dayjs';

// ── Helpers ──────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return dayjs(dateStr).format('DD/MM/YYYY');
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—';
  return dayjs(dateStr).format('DD/MM');
}

function formatDayLabel(dateStr: string): string {
  if (!dateStr) return '';
  const d = dayjs(dateStr);
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return weekdays[d.day()];
}

function formatTimeRange(start: string, end: string): string {
  const startDisplay = start?.length >= 5 ? start.slice(0, 5) : start;
  const endDisplay = end?.length >= 5 ? end.slice(0, 5) : end;
  return `${startDisplay} – ${endDisplay}`;
}

function getTimelineLocation(timeline: EventTimelineResponse): string {
  return timeline.eventPoint?.address || timeline.eventPoint?.name || '—';
}

// ── Component ────────────────────────────────────────

interface EventTimelineListProps {
  eventId: string;
  eventStartDate?: string;
  eventEndDate?: string;
}

export function EventTimelineList({ eventId, eventStartDate, eventEndDate }: EventTimelineListProps) {
  const navigate = useNavigate();
  const { timelines, loading, deleteTimeline } = useEventTimelines(eventId);

  const [deleteTarget, setDeleteTarget] = useState<EventTimelineResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Group timelines by date and get sorted unique dates
  const { dateList, groupedByDate } = useMemo(() => {
    const grouped: Record<string, EventTimelineResponse[]> = {};
    for (const tl of timelines) {
      const dateKey = tl.date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(tl);
    }
    // Sort entries within each date by startTime
    Object.values(grouped).forEach((list) => {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    // Sort dates
    const dates = Object.keys(grouped).sort();
    return { dateList: dates, groupedByDate: grouped };
  }, [timelines]);

  const handleCreate = (date?: string) => {
    const params = new URLSearchParams();
    if (date) {
      params.set('date', date);
    }
    const query = params.toString();
    navigate(`/admin/events/${eventId}/timeline/create${query ? `?${query}` : ''}`);
  };

  const handleEdit = (timeline: EventTimelineResponse) => {
    navigate(`/admin/events/${eventId}/timeline/${timeline.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteTimeline(deleteTarget.id);
    setDeleteTarget(null);
  };

  // Determine which timelines to display based on active tab
  const displayTimelines = useMemo(() => {
    if (activeTab === 'all') {
      // Sort all by date then startTime
      return [...timelines].sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });
    }
    return groupedByDate[activeTab] || [];
  }, [activeTab, timelines, groupedByDate]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {timelines.length} mục timeline
        </span>
        <Button size="sm" onClick={() => handleCreate(activeTab !== 'all' ? activeTab : undefined)}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm mục
        </Button>
      </div>

      {timelines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CalendarDays className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">Chưa có mục timeline nào</p>
          <p className="text-xs mt-1">Tạo một mục để bắt đầu</p>
        </div>
      ) : (
        <>
          {/* Date Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all" className="text-xs">
                Tất cả
                <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px]">
                  {timelines.length}
                </Badge>
              </TabsTrigger>
              {dateList.map((date) => (
                <TabsTrigger key={date} value={date} className="text-xs">
                  <span className="font-medium">{formatDateShort(date)}</span>
                  <span className="ml-1 text-muted-foreground hidden sm:inline">{formatDayLabel(date)}</span>
                  <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px]">
                    {groupedByDate[date].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All tab + each date tab share the same table renderer */}
            {['all', ...dateList].map((tabKey) => (
              <TabsContent key={tabKey} value={tabKey}>
                <TimelineTable
                  timelines={tabKey === 'all' ? displayTimelines : groupedByDate[tabKey] || []}
                  showDate={tabKey === 'all'}
                  onEdit={handleEdit}
                  onDelete={(tl) => setDeleteTarget(tl)}
                />
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa mục timeline</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">Bạn có chắc chắn muốn xóa "{deleteTarget?.name}"?</span>
              <span className="block text-destructive font-medium">⚠️ Hành động này không thể hoàn tác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Sub-component: Timeline Table ────────────────────

interface TimelineTableProps {
  timelines: EventTimelineResponse[];
  showDate: boolean;
  onEdit: (tl: EventTimelineResponse) => void;
  onDelete: (tl: EventTimelineResponse) => void;
}

function TimelineTable({ timelines, showDate, onEdit, onDelete }: TimelineTableProps) {
  if (timelines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <p className="text-sm">Không có mục nào cho ngày này</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {showDate && <TableHead className="min-w-[100px]">Ngày</TableHead>}
            <TableHead className="min-w-[90px]">Thời gian</TableHead>
            <TableHead className="min-w-[180px]">Tên</TableHead>
            <TableHead className="min-w-[150px]">Địa điểm</TableHead>
            <TableHead className="min-w-[130px]">Đơn vị tổ chức</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timelines.map((tl) => (
            <TableRow key={tl.id}>
              {showDate && (
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    <span>{formatDate(tl.date)}</span>
                  </div>
                  {tl.lunarDate && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MoonStar className="h-3 w-3 shrink-0" />
                      <span>{tl.lunarDate}</span>
                    </div>
                  )}
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {formatTimeRange(tl.startTime, tl.endTime)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <span className="font-medium text-sm">{tl.name}</span>
                  {tl.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[250px]">{tl.description}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getTimelineLocation(tl) !== '—' ? (
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[150px]">{getTimelineLocation(tl)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {tl.organizer || tl.coOrganizer ? (
                  <div className="space-y-1">
                    {tl.organizer && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[130px]">{tl.organizer}</span>
                      </div>
                    )}
                    {tl.coOrganizer && (
                      <p className="text-xs text-muted-foreground truncate max-w-[130px]">Đồng: {tl.coOrganizer}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(tl)}>
                      <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(tl)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
