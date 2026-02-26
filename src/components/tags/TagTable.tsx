import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TagResponse } from "@/types/tag";
import TagTableRowItem from "./tagTable/TagTableRowItem";
import {
  TagTableEmptyState,
  TagTableErrorState,
  TagTableLoadingState,
} from "./tagTable/TagTableStates";

interface TagTableProps {
  kind: "event" | "workshop";
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
    return <TagTableErrorState error={error} onRetry={onRetry} />;
  }

  if (!loading && !error && tags.length === 0) {
    return <TagTableEmptyState />;
  }

  if (loading) {
    return <TagTableLoadingState kind={kind} />;
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
              {kind === "event" && (
                <TableHead className="font-semibold text-gray-600 w-[90px]">Status</TableHead>
              )}
              <TableHead className="font-semibold text-gray-600 w-[140px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tags.map((tag) => (
              <TagTableRowItem
                key={tag.id}
                kind={kind}
                tag={tag}
                onEdit={onEdit}
                onDelete={onDelete}
                onRestore={onRestore}
              />
            ))}
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
                variant={index === currentPage ? "default" : "outline"}
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
