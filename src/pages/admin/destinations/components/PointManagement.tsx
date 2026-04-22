import { useState, useEffect } from 'react';
import { Plus, Pin, MapPin, Edit, Trash2, ChevronLeft, ChevronRight, Search, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Destination, Point } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pointTypeLabel } from '../pointTypeLabels';

interface PointManagementProps {
  currentDestination: Destination | null;
  allPoints: Point[];
  loading: boolean;
  onAddPoint: () => void;
  onEditPoint: (point: Point) => void;
  onDeletePoint: (id: string, isSoftDeleted?: boolean) => void;
  onRestorePoint: (id: string) => void;
  onFocus: (lat: number, lng: number) => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  searchText: string;
  onSearchChange: (text: string) => void;
  destinations: Destination[];
  onDestinationChange: (dest: Destination | null) => void;
}

export function PointManagement({
  currentDestination,
  allPoints,
  loading,
  onAddPoint,
  onEditPoint,
  onDeletePoint,
  onRestorePoint,
  onFocus,
  pagination,
  searchText,
  onSearchChange,
  destinations,
  onDestinationChange,
}: PointManagementProps) {
  const [inputValue, setInputValue] = useState(searchText);

  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  const triggerSearch = () => {
    onSearchChange(inputValue);
  };

  const totalPages = Math.ceil(pagination.totalElements / pagination.pageSize) || 1;

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
        <CardHeader className="shrink-0 space-y-4 border-b border-slate-100 pb-4 dark:border-slate-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/20">
                <Pin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Danh sách điểm (POI)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Tìm kiếm, lọc theo điểm đến và thao tác trên bản đồ
                </CardDescription>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">

              <Button type="button" className="font-medium transition-colors" onClick={onAddPoint}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm điểm
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div className="relative flex items-center">
              <Input
                placeholder="Tìm theo tên hoặc mô tả… (Enter)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                className="h-9 pr-10"
                aria-label="Tìm kiếm điểm"
              />
              <button
                type="button"
                className="absolute right-1.5 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                onClick={triggerSearch}
                title="Tìm"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            <Select
              value={currentDestination?.id || 'all'}
              onValueChange={(val) => {
                if (val === 'all') onDestinationChange(null);
                else {
                  const dest = destinations.find((d) => d.id === val);
                  if (dest) onDestinationChange(dest);
                }
              }}
            >
              <SelectTrigger className="h-9 bg-background">
                <SelectValue placeholder="Tất cả điểm đến" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả điểm đến</SelectItem>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col overflow-hidden px-4 pb-4 pt-2 sm:px-6">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-card dark:border-slate-700">
            <div className="custom-scrollbar flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12 text-center text-xs font-medium text-muted-foreground">#</TableHead>
                    <TableHead className="w-[35%] text-xs font-medium text-muted-foreground">Tên điểm</TableHead>
                    <TableHead className="w-[25%] text-xs font-medium text-muted-foreground">Khu vực</TableHead>
                    <TableHead className="w-[18%] text-xs font-medium text-muted-foreground">Loại</TableHead>
                    {/* <TableHead className="w-[10%] text-center text-xs font-medium text-muted-foreground">Thời gian</TableHead> */}
                    <TableHead className="w-[120px] pr-4 text-center text-xs font-medium text-muted-foreground">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <p className="text-sm font-medium text-muted-foreground">Đang tải danh sách…</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : allPoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-56">
                        <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
                          <Pin className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Chưa có điểm nào</h3>
                          <p className="max-w-sm text-sm text-muted-foreground">
                            Thêm điểm đầu tiên hoặc nhập từ tệp Excel để bắt đầu quản lý.
                          </p>
                          <Button type="button" className="mt-2" onClick={onAddPoint}>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm điểm
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allPoints.map((p, idx) => (
                      <TableRow
                        key={p.id}
                        className={`cursor-pointer border-border transition-colors hover:bg-muted/50 ${p.deletedAt ? 'bg-slate-50/50 opacity-60 grayscale-[0.5] blur-[0.2px]' : ''
                          }`}
                        onClick={() => {
                          if (p.deletedAt) return;
                          onFocus(p.latitude, p.longitude);
                          onEditPoint(p);
                        }}
                      >
                        <TableCell className="text-center text-xs font-medium tabular-nums text-muted-foreground">
                          {pagination.currentPage * pagination.pageSize + idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-muted dark:border-slate-700">
                              {p.thumbnailUrl ? (
                                <img src={p.thumbnailUrl} className="h-full w-full object-cover" alt="" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Pin className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span
                                className="line-clamp-2 break-words font-medium text-slate-900 dark:text-slate-100"
                                title={p.name}
                              >
                                {p.name}
                              </span>
                              {p.deletedAt && (
                                <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">
                                  Đã xóa tạm thời
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {(p as { destinationName?: string }).destinationName ||
                            (p as { attractionName?: string }).attractionName ||
                            'Chưa gán'}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {pointTypeLabel(p.type)}
                          </span>
                        </TableCell>
                        <TableCell className="pr-2 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            {!p.deletedAt ? (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onFocus(p.latitude, p.longitude);
                                      }}
                                    >
                                      <MapPin className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Định vị</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-400"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditPoint(p);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Sửa</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeletePoint(p.id, false);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Xóa</TooltipContent>
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-full text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRestorePoint(p.id);
                                      }}
                                    >
                                      <RefreshCcw className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Khôi phục</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-full text-destructive transition-colors hover:bg-destructive/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeletePoint(p.id, true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Xóa vĩnh viễn</TooltipContent>
                                </Tooltip>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-muted/30 px-4 py-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Hiển thị <span className="font-semibold text-foreground">{allPoints.length}</span> /{' '}
                  <span className="font-semibold text-foreground">{pagination.totalElements}</span> kết quả
                </span>
                <Select
                  value={String(pagination.pageSize)}
                  onValueChange={(v) => pagination.onPageSizeChange(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[100px] bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 / trang</SelectItem>
                    <SelectItem value="20">20 / trang</SelectItem>
                    <SelectItem value="50">50 / trang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={pagination.currentPage === 0}
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i;
                    if (totalPages > 5 && pagination.currentPage > 2) {
                      pageNum = pagination.currentPage - 2 + i;
                      if (pageNum >= totalPages) pageNum = totalPages - 5 + i;
                    }
                    if (pageNum < 0) return null;
                    return (
                      <Button
                        key={pageNum}
                        type="button"
                        variant={pagination.currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => pagination.onPageChange(pageNum)}
                        className="h-8 min-w-8 px-2 text-xs font-semibold"
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={pagination.currentPage >= totalPages - 1 || totalPages === 0}
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  aria-label="Trang sau"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
