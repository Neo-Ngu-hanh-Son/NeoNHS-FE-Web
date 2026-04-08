import { useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Tags } from 'lucide-react';
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
import { useEventPointTags } from '@/hooks/event';
import type { EventPointTagRequest, EventPointTagResponse } from '@/types/eventTimeline';
import { EventPointTagFormDialog } from './EventPointTagFormDialog';

export function EventPointTagList() {
  const { tags, loading, createTag, updateTag, deleteTag } = useEventPointTags();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<EventPointTagResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventPointTagResponse | null>(null);

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
    await deleteTag(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleSubmit = async (data: EventPointTagRequest): Promise<boolean> => {
    if (editingTag?.id) {
      return updateTag(editingTag.id, data);
    }

    return createTag(data);
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
          {tags.length} point tag{tags.length !== 1 ? 's' : ''}
        </span>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Point Tag
        </Button>
      </div>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Tags className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No point tags yet</p>
          <p className="text-xs mt-1">Create one to classify event points</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Name</TableHead>
                <TableHead className="min-w-[220px]">Description</TableHead>
                <TableHead className="min-w-[140px]">Color</TableHead>
                <TableHead className="min-w-[120px]">Icon</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => {
                const resolvedName = tag.name || 'Unnamed';
                const resolvedDescription = tag.description || '—';
                const resolvedColor = tag.tagColor || '#0f766e';

                return (
                  <TableRow key={tag.id || resolvedName}>
                    <TableCell>
                      <span className="font-medium text-sm">{resolvedName}</span>
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
                          No icon
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
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(tag)}
                            disabled={!tag.id}
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

      <EventPointTagFormDialog open={formOpen} onOpenChange={setFormOpen} tag={editingTag} onSubmit={handleSubmit} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Point Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name || 'this tag'}"? This action cannot be undone.
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
