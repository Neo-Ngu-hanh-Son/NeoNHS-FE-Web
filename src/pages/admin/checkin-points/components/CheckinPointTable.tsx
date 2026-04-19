import { Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TablePagination from '@/components/common/TablePagination';
import type { ParentPointOption, PointCheckinResponse } from '@/types/checkinPoint';

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
  onRestore?: (id: string) => void;
}

const getParentPointName = (item: PointCheckinResponse, pointMap: Map<string, string>): string => {
  if (item.parentPointName) return item.parentPointName;
  if (item.pointName) return item.pointName;

  const parentId = item.pointId || item.parentPointId;
  if (!parentId) return 'Unknown';
  return pointMap.get(parentId) || 'Unknown';
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
  onRestore,
}: CheckinPointTableProps) {
  const pointMap = new Map(parentPoints.map((p) => [p.id, p.name]));

  if (!loading && data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-10 text-center text-sm text-slate-500 dark:text-slate-400">
        Không tìm thấy điểm check-in nào theo bộ lọc hiện tại.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow className="border-slate-100 dark:border-slate-700 hover:bg-transparent">
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold py-4">Tên điểm</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Địa điểm chính</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Vị trí chèn</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Tọa độ</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Điểm thưởng</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Trạng thái</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-300 font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  Đang tải danh sách điểm check-in...
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <TableCell className="font-medium text-slate-900 dark:text-white">{item.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{getParentPointName(item, pointMap)}</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">{item.position || '-'}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {typeof item.latitude === 'number' && typeof item.longitude === 'number'
                      ? `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{item.rewardPoints ?? 0}</TableCell>
                  <TableCell>
                    {item.deletedAt ? (
                      <Badge variant="destructive" className="font-medium">Đã xóa</Badge>
                    ) : item.isActive === false ? (
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">Ngưng hoạt động</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 font-medium shadow-none border-0">Hoạt động</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm" onClick={() => onEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {item.deletedAt && onRestore ? (
                        <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-sm" onClick={() => onRestore(item.id)} title="Khôi phục">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="shadow-sm"
                          onClick={() => onDelete(item)}
                          disabled={!!item.deletedAt}
                          title="Xóa tạm thời"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
