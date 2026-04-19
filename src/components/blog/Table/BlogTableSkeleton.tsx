/**
 * BlogTableSkeleton
 * Skeleton loading state for the blog admin table.
 */

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BlogTableSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80">
            <TableHead className="font-semibold text-gray-600">Bài viết</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[120px]">Danh mục</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[100px]">Trạng thái</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[80px] text-center">
              Lượt xem
            </TableHead>
            <TableHead className="font-semibold text-gray-600 w-[130px]">Ngày tạo</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[120px] text-right">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-16 rounded-md shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-8 mx-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
