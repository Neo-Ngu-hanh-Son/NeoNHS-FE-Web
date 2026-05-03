import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Tags, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useEventPointTags, useEventTimelines } from '@/hooks/event';
import type { EventPointTagRequest, EventPointTagResponse } from '@/types/eventTimeline';
import { EventPointTagFormDialog } from './EventPointTagFormDialog';

export function EventPointTagList({ eventId }: { eventId: string }) {
  const { createTag, updateTag, deleteTag, restoreTag } = useEventPointTags({ autoFetch: false });
  const { fetchEventPointTags } = useEventTimelines(eventId, true);
  const [eventPointTags, setEventPointTags] = useState<EventPointTagResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<EventPointTagResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventPointTagResponse | null>(null);

  useEffect(() => {
    const loadEventPointTags = async () => {
      try {
        setLoading(true);
        const nextTags = await fetchEventPointTags();
        setEventPointTags(nextTags);
      } catch (error) {
        console.error('Không thể tải danh sách thẻ điểm:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEventPointTags();
  }, [fetchEventPointTags]);

  const handleCreate = () => {
    setEditingTag(null);
    setFormOpen(true);
  };

  const handleEdit = (tag: EventPointTagResponse) => {
    setEditingTag(tag);
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return;
    const success = await deleteTag(deleteTarget.id);
    setDeleteTarget(null);
    if (success) {
      const nextTags = await fetchEventPointTags();
      setEventPointTags(nextTags);
    }
  };

  const handleSubmit = async (data: EventPointTagRequest): Promise<boolean> => {
    let success = false;
    if (editingTag?.id) {
      success = await updateTag(editingTag.id, data);
    } else {
      success = await createTag(data);
    }

    if (success) {
      const nextTags = await fetchEventPointTags();
      setEventPointTags(nextTags);
    }

    return success;
  };

  const handleRestore = async (tagId: string) => {
    try {
      await restoreTag(tagId);
      const nextTags = await fetchEventPointTags();
      setEventPointTags(nextTags);
    } catch (error) {
      console.error('Không thể khôi phục thẻ điểm:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{eventPointTags.length} thẻ điểm</span>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Thêm thẻ điểm
        </Button>
      </div>

      {eventPointTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Tags className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">Chưa có thẻ điểm</p>
          <p className="text-xs mt-1">Tạo một thẻ để phân loại các điểm sự kiện</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Tên</TableHead>
                <TableHead className="min-w-[220px]">Mô tả</TableHead>
                <TableHead className="min-w-[140px]">Màu sắc</TableHead>
                <TableHead className="min-w-[120px]">Biểu tượng</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventPointTags.map((tag) => {
                const resolvedName = tag.name || 'Chưa đặt tên';
                const resolvedDescription = tag.description || '—';
                const resolvedColor = tag.tagColor || '#0f766e';
                const isDeleted = !!tag.deletedAt;

                return (
                  <TableRow key={tag.id || resolvedName}>
                    <TableCell>
                      <span
                        className={
                          isDeleted ? 'font-medium text-sm text-muted-foreground line-through' : 'font-medium text-sm'
                        }
                      >
                        {resolvedName}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">{resolvedDescription}</span>
                    </TableCell>

                    <TableCell>
                      <div className="inline-flex items-center gap-2 rounded-md border px-2 py-1">
                        <span className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: resolvedColor }} />
                        <code className="text-xs">{resolvedColor}</code>
                      </div>
                    </TableCell>

                    <TableCell>
                      {tag.iconUrl ? (
                        <img src={tag.iconUrl} alt={resolvedName} className="h-8 w-8 rounded border object-cover" />
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Không có biểu tượng
                        </Badge>
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
                          <DropdownMenuItem onClick={() => handleEdit(tag)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tag.deletedAt ? (
                            <DropdownMenuItem
                              className="text-green-500 focus:text-green-500"
                              onClick={() => tag.id && handleRestore(tag.id)}
                              disabled={!tag.id}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Khôi phục thẻ điểm
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(tag)}
                              disabled={!tag.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Ẩn thẻ điểm
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <EventPointTagFormDialog open={formOpen} onOpenChange={setFormOpen} tag={editingTag} onSubmit={handleSubmit} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ẩn thẻ điểm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn ẩn "{deleteTarget?.name || 'thẻ này'}" không? Thẻ đã ẩn sẽ không còn hiển thị trong
              các điểm sự kiện, nhưng bạn có thể khôi phục lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Ẩn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
