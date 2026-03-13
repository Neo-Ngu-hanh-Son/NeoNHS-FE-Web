import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/common/TablePagination";
import type { ParentPointOption, PointCheckinResponse } from "@/types/checkinPoint";

interface CheckinPointTableProps {
  loading: boolean;
  data: PointCheckinResponse[];
  parentPoints: ParentPointOption[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onEdit: (item: PointCheckinResponse) => void;
  onDelete: (item: PointCheckinResponse) => void;
}

const getParentPointName = (item: PointCheckinResponse, pointMap: Map<string, string>): string => {
  if (item.parentPointName) return item.parentPointName;
  if (item.pointName) return item.pointName;

  const parentId = item.pointId || item.parentPointId;
  if (!parentId) return "Unknown";
  return pointMap.get(parentId) || "Unknown";
};

export function CheckinPointTable({
  loading,
  data,
  parentPoints,
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onEdit,
  onDelete,
}: CheckinPointTableProps) {
  const pointMap = new Map(parentPoints.map((p) => [p.id, p.name]));

  if (!loading && data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        No checkin points found for current filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Parent Point</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Loading checkin points...
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{getParentPointName(item, pointMap)}</TableCell>
                  <TableCell>{item.position || "-"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {typeof item.latitude === "number" && typeof item.longitude === "number"
                      ? `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`
                      : "-"}
                  </TableCell>
                  <TableCell>{item.rewardPoints ?? 0}</TableCell>
                  <TableCell>
                    {item.deletedAt ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : item.isActive === false ? (
                      <Badge variant="secondary">Inactive</Badge>
                    ) : (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(item)}
                        disabled={!!item.deletedAt}
                        title={item.deletedAt ? "Already deleted" : "Soft delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && totalElements > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default CheckinPointTable;
