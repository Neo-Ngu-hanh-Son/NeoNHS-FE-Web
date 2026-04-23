/**
 * BlogCategoryDeleteContent
 * Confirmation content for deleting a blog category.
 * Uses Lucide icons + Tailwind. No Ant Design dependencies.
 */

import { TriangleAlert } from 'lucide-react';
import type { BlogCategoryResponse } from '@/types/blog';
import { getInitials } from '@/utils/helpers';

interface BlogCategoryDeleteContentProps {
  category: BlogCategoryResponse;
}

export default function BlogCategoryDeleteContent({
  category,
}: BlogCategoryDeleteContentProps) {
  return (
    <div className="flex flex-col items-center text-center pt-2 pb-1">
      {/* Warning icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <TriangleAlert className="h-7 w-7 text-destructive" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1">Xóa danh mục</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Bạn có chắc muốn xóa danh mục này?
      </p>

      {/* Category info card */}
      <div className="w-full flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/15">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-xs font-bold text-destructive">
          {getInitials(category.name)}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">
            {category.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {category.postCount} bài viết liên quan
          </p>
        </div>
      </div>

      <p className="text-xs text-destructive mt-3">
        Không thể hoàn tác thao tác này.
      </p>
    </div>
  );
}
