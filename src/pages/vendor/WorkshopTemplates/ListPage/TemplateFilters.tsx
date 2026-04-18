import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { WorkshopStatus } from '../types';

interface TemplateFiltersProps {
  keyword: string;
  setKeyword: (val: string) => void;
  debouncedKeyword: string;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  loading: boolean;
}

export const TemplateFilters = ({
  keyword,
  setKeyword,
  debouncedKeyword,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  loading
}: TemplateFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm mẫu theo tên hoặc mô tả..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-10"
          disabled={loading}
        />
        {keyword !== debouncedKeyword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value={WorkshopStatus.DRAFT}>Bản nháp</SelectItem>
          <SelectItem value={WorkshopStatus.PENDING}>Chờ duyệt</SelectItem>
          <SelectItem value={WorkshopStatus.ACTIVE}>Hoạt động</SelectItem>
          <SelectItem value={WorkshopStatus.REJECTED}>Bị từ chối</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort By */}
      <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updatedAt">Cập nhật gần đây</SelectItem>
          <SelectItem value="createdAt">Tạo gần đây</SelectItem>
          <SelectItem value="name">Tên (A-Z)</SelectItem>
          <SelectItem value="defaultPrice">Giá</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
