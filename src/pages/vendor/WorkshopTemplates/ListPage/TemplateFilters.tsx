import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchOutlined } from '@ant-design/icons';
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
        <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates by name or description..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-10"
          disabled={loading}
        />
        {keyword !== debouncedKeyword && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value={WorkshopStatus.DRAFT}>Draft</SelectItem>
          <SelectItem value={WorkshopStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={WorkshopStatus.ACTIVE}>Active</SelectItem>
          <SelectItem value={WorkshopStatus.REJECTED}>Rejected</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort By */}
      <Select value={sortBy} onValueChange={setSortBy} disabled={loading}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updatedAt">Recently Updated</SelectItem>
          <SelectItem value="createdAt">Recently Created</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
          <SelectItem value="defaultPrice">Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
