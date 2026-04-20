/**
 * BlogCategoryViewContent
 * Read-only detail content for viewing a blog category.
 * Uses shadcn/ui Badge + Lucide icons + Tailwind.
 */

import { Link2, FileText, Tags, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BlogCategoryResponse } from '@/types/blog';
import { formatShortDate, getInitials } from '@/utils/helpers';

interface BlogCategoryViewContentProps {
  category: BlogCategoryResponse;
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm min-w-[130px] shrink-0 pt-0.5">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm text-foreground/80 flex-1">{children}</div>
    </div>
  );
}

export default function BlogCategoryViewContent({
  category,
}: BlogCategoryViewContentProps) {
  return (
    <div className="pt-2 space-y-4">
      {/* Category name banner */}
      <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
          {getInitials(category.name)}
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground">
            {category.name}
          </h4>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            /{category.slug}
          </p>
          <Badge
            variant={category.status === 'ACTIVE' ? 'default' : 'secondary'}
            className={
              category.status === 'ACTIVE'
                ? 'mt-1.5 bg-primary/15 text-primary hover:bg-primary/15 border-primary/20 rounded-full'
                : 'mt-1.5 bg-secondary text-muted-foreground hover:bg-secondary border-border rounded-full'
            }
          >
            {category.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã lưu trữ'}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-lg border border-border px-4 divide-y divide-border/60">
        <DetailRow icon={<Link2 className="h-4 w-4" />} label="Đường dẫn (slug)">
          <code className="text-xs bg-secondary px-2 py-0.5 rounded text-foreground/80">
            {category.slug}
          </code>
        </DetailRow>

        <DetailRow icon={<FileText className="h-4 w-4" />} label="Mô tả">
          {category.description || (
            <span className="text-muted-foreground italic">Không có mô tả</span>
          )}
        </DetailRow>

        <DetailRow icon={<Tags className="h-4 w-4" />} label="Bài viết">
          <span className="font-semibold text-foreground">
            {category.postCount}
          </span>
        </DetailRow>

        <DetailRow icon={<Calendar className="h-4 w-4" />} label="Ngày tạo">
          {formatShortDate(category.createdAt)}
        </DetailRow>

        {category.updatedAt && (
          <DetailRow icon={<Calendar className="h-4 w-4" />} label="Cập nhật lần cuối">
            {formatShortDate(category.updatedAt)}
          </DetailRow>
        )}
      </div>
    </div>
  );
}
