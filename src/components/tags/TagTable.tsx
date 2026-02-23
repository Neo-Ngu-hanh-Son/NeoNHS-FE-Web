import { AlertTriangle, Pencil, RotateCcw, Tags, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TagResponse } from '@/types/tag';

interface TagTableProps {
  kind: 'event' | 'workshop';
  tags: TagResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onEdit: (tag: TagResponse) => void;
  onDelete: (tag: TagResponse) => void;
  onRestore?: (tag: TagResponse) => void;
}

function isValidUrl(value?: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function TagTable({
  kind,
  tags,
  loading,
  error,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onRetry,
  onEdit,
  onDelete,
  onRestore,
}: TagTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const rangeStart = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const rangeEnd = Math.min((currentPage + 1) * pageSize, totalElements);

  if (!loading && error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-4">{error}</p>
        <Button size="sm" onClick={onRetry} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Try Again
        </Button>
      </div>
    );
  }

  if (!loading && !error && tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
          <Tags className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No tags found.</h3>
        <p className="text-sm text-gray-500">Create a new tag to get started.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">Name</TableHead>
              <TableHead className="font-semibold text-gray-600">Description</TableHead>
              <TableHead className="font-semibold text-gray-600">Color</TableHead>
              <TableHead className="font-semibold text-gray-600">Icon</TableHead>
              {kind === 'event' && <TableHead className="font-semibold text-gray-600">Status</TableHead>}
              <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={kind === 'event' ? 6 : 5}>
                  <div className="h-7 w-full rounded bg-muted animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600 w-[200px]">Name</TableHead>
              <TableHead className="font-semibold text-gray-600">Description</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[130px]">Color</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[120px]">Icon</TableHead>
              {kind === 'event' && <TableHead className="font-semibold text-gray-600 w-[90px]">Status</TableHead>}
              <TableHead className="font-semibold text-gray-600 w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tags.map((tag) => {
              const isDeleted = kind === 'event' && !!tag.deletedAt;

              return (
                <TableRow key={tag.id} className="hover:bg-primary/5">
                  <TableCell>
                    <span className="text-sm font-semibold text-gray-800">{tag.name}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm font-medium text-gray-600 line-clamp-2">
                      {tag.description || 'No description provided.'}
                    </span>
                  </TableCell>

                  <TableCell>
                    {tag.tagColor ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: tag.tagColor }}
                        />
                        <span className="text-xs text-muted-foreground">{tag.tagColor}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {isValidUrl(tag.iconUrl) ? (
                      <img
                        src={tag.iconUrl}
                        alt={`${tag.name} icon`}
                        className="h-7 w-7 rounded object-cover border border-border"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {kind === 'event' && (
                    <TableCell>
                      <Badge
                        variant={isDeleted ? 'secondary' : 'default'}
                        className={
                          isDeleted
                            ? 'bg-secondary text-muted-foreground hover:bg-secondary rounded-full'
                            : 'bg-primary/15 text-primary hover:bg-primary/15 border-primary/20 rounded-full'
                        }
                      >
                        {isDeleted ? 'Deleted' : 'Active'}
                      </Badge>
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    <TooltipProvider delayDuration={200}>
                      <div className="flex items-center justify-end gap-1">
                        {!isDeleted && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onEdit(tag)}
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit tag</TooltipContent>
                          </Tooltip>
                        )}

                        {isDeleted ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onRestore?.(tag)}
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Restore tag</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onDelete(tag)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{kind === 'event' ? 'Delete tag' : 'Delete tag permanently'}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalElements > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-500">
            Showing {rangeStart} to {rangeEnd} of {totalElements} results
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 px-3 text-xs"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={index === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(index)}
                className="h-8 w-8 p-0 text-xs"
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 px-3 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagTable;
