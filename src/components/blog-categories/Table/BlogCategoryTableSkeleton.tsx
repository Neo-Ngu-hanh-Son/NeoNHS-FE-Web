import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {}

export default function BlogCategoryTableSkeleton({ }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80">
            <TableHead className="font-semibold text-gray-600">Tên danh mục</TableHead>
            <TableHead className="font-semibold text-gray-600">Slug</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[100px]">Trạng thái</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[120px] text-center">Bài viết</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[140px]">Ngày tạo</TableHead>
            <TableHead className="font-semibold text-gray-600 w-[120px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
              <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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