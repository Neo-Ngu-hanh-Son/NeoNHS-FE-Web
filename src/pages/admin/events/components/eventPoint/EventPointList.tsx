import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, MapPin } from 'lucide-react';
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
import { useEventPointTags, useEventPoints } from '@/hooks/event';
import type { EventPointRequest, EventPointResponse } from '@/types/eventTimeline';
import { EventPointFormDialog } from './EventPointFormDialog';

function resolveImageUrl(point: EventPointResponse): string {
  if (point.imageUrl) {
    return point.imageUrl;
  }

  if (!point.imageList) {
    return '';
  }

  const trimmed = point.imageList.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
        return parsed[0];
      }
    } catch {
      return '';
    }
  }

  if (trimmed.includes(',')) {
    return trimmed.split(',')[0].trim();
  }

  return trimmed;
}

export function EventPointList() {
  const { points, loading, createPoint, updatePoint, deletePoint } = useEventPoints();
  const { tags } = useEventPointTags();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<EventPointResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventPointResponse | null>(null);

  const tagById = useMemo(() => {
    const map = new Map<string, { name: string; color?: string }>();
    tags.forEach((tag) => {
      if (tag.id) {
        map.set(tag.id, { name: tag.name || 'Unnamed tag', color: tag.tagColor });
      }
    });
    return map;
  }, [tags]);

  const handleCreate = () => {
    setEditingPoint(null);
    setFormOpen(true);
  };

  const handleEdit = (point: EventPointResponse) => {
    setEditingPoint(point);
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return;
    await deletePoint(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleSubmit = async (data: EventPointRequest): Promise<boolean> => {
    if (editingPoint?.id) {
      return updatePoint(editingPoint.id, data);
    }

    return createPoint(data);
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
        <span className="text-sm text-muted-foreground">
          {points.length} point{points.length !== 1 ? 's' : ''}
        </span>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Event Point
        </Button>
      </div>

      {points.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <MapPin className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No event points yet</p>
          <p className="text-xs mt-1">Create one for timeline destinations</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Name</TableHead>
                <TableHead className="min-w-[160px]">Tag</TableHead>
                <TableHead className="min-w-[180px]">Coordinates</TableHead>
                <TableHead className="min-w-[220px]">Address</TableHead>
                <TableHead className="min-w-[100px]">Image</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {points.map((point) => {
                const pointTag = point.eventPointTag?.id ? tagById.get(point.eventPointTag.id) : null;
                const tagName = pointTag?.name || point.eventPointTag?.name;
                const tagColor = pointTag?.color || point.eventPointTag?.tagColor;
                const imageUrl = resolveImageUrl(point);

                return (
                  <TableRow key={point.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{point.name}</p>
                        {point.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{point.description}</p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {tagName ? (
                        <Badge
                          variant="outline"
                          style={tagColor ? { borderColor: `${tagColor}66`, color: tagColor } : undefined}
                        >
                          {tagName}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No tag</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs space-y-1">
                        <p>Lat: {Number(point.latitude).toFixed(6)}</p>
                        <p>Lng: {Number(point.longitude).toFixed(6)}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-2">{point.address || '—'}</span>
                    </TableCell>

                    <TableCell>
                      {imageUrl ? (
                        <img src={imageUrl} alt={point.name} className="h-10 w-10 rounded-md border object-cover" />
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          No image
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
                          <DropdownMenuItem onClick={() => handleEdit(point)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(point)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
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

      <EventPointFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        point={editingPoint}
        tags={tags}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event Point</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name || 'this point'}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
