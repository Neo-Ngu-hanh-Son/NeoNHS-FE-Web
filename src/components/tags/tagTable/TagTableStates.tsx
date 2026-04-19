import { AlertTriangle, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TagTableErrorStateProps {
  error: string;
  onRetry: () => void;
}

interface TagTableEmptyStateProps {
  message?: string;
}

interface TagTableLoadingStateProps {
  kind: "event" | "workshop";
}

export function TagTableErrorState({ error, onRetry }: TagTableErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <p className="text-sm font-medium text-gray-700 mb-4">{error}</p>
      <Button
        size="sm"
        onClick={onRetry}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Thử lại
      </Button>
    </div>
  );
}

export function TagTableEmptyState({
  message = "Thêm nhãn mới để bắt đầu.",
}: TagTableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
        <Tags className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Chưa có nhãn nào.</h3>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function TagTableLoadingState({ kind }: TagTableLoadingStateProps) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="font-semibold text-gray-600">Tên</TableHead>
            <TableHead className="font-semibold text-gray-600">Mô tả</TableHead>
            <TableHead className="font-semibold text-gray-600">Màu</TableHead>
            <TableHead className="font-semibold text-gray-600">Biểu tượng</TableHead>
            {kind === "event" && (
              <TableHead className="font-semibold text-gray-600">Trạng thái</TableHead>
            )}
            <TableHead className="font-semibold text-gray-600 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell colSpan={kind === "event" ? 6 : 5}>
                <div className="h-7 w-full rounded bg-muted animate-pulse" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
