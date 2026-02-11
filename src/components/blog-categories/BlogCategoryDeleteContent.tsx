/**
 * BlogCategoryDeleteContent
 * Confirmation content for deleting a blog category.
 */

import { ExclamationCircleFilled } from '@ant-design/icons';
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
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
        <ExclamationCircleFilled className="text-red-500 text-2xl" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Delete Category
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        Are you sure you want to delete this category?
      </p>

      {/* Category info card */}
      <div className="w-full flex items-center gap-3 p-3 bg-red-50/60 rounded-lg border border-red-100">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-700">
          {getInitials(category.name)}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800">
            {category.name}
          </p>
          <p className="text-xs text-gray-500">
            {category.postCount} post{category.postCount !== 1 ? 's' : ''} associated
          </p>
        </div>
      </div>

      <p className="text-xs text-red-500 mt-3">
        This action cannot be undone.
      </p>
    </div>
  );
}
