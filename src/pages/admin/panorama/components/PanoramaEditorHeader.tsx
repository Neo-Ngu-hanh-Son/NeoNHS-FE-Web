import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Trash2, Eye } from 'lucide-react';
import type { PointPanoramaResponse } from '@/types';

interface PanoramaEditorHeaderProps {
  variant?: 'page' | 'embedded';
  panorama: PointPanoramaResponse | null;
  targetPointId: string;
  saving: boolean;
  hasImage: boolean;
  onSave: () => void;
  onDelete: () => void;
  /** Tên điểm từ modal POI (ưu tiên hiển thị khi nhúng) */
  pointName?: string;
  onBackToParent?: () => void;
}

export default function PanoramaEditorHeader({
  variant = 'page',
  panorama,
  targetPointId,
  saving,
  hasImage,
  onSave,
  onDelete,
  pointName,
  onBackToParent,
}: PanoramaEditorHeaderProps) {
  const embedded = variant === 'embedded';

  const pointLabel = (pointName?.trim() || '').trim();
  const panoramaLabel = (panorama?.title?.trim() || '').trim();
  const titleSuffix = panoramaLabel ? `: ${panoramaLabel}` : pointLabel ? `: ${pointLabel}` : '';
  const deleteTargetLabel = pointLabel || panoramaLabel || 'mục đã chọn';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="min-w-0">
          <h1
            className={
              embedded ? 'text-lg font-semibold tracking-tight text-slate-900 dark:text-white' : 'text-xl font-bold'
            }
          >
            {panorama ? 'Chỉnh sửa ảnh' : 'Tạo mới ảnh'} panorama{titleSuffix}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {hasImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/places/${targetPointId}/panorama`, '_blank')}
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            Xem trước
          </Button>
        )}

        {panorama && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa panorama?</AlertDialogTitle>
                <AlertDialogDescription>
                  Thao tác này sẽ xóa vĩnh viễn ảnh panorama và mọi điểm nóng tại {deleteTargetLabel}. Không thể hoàn
                  tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button onClick={onSave} disabled={saving} size="sm" className="gap-1">
          <Save className="h-4 w-4" />
          {saving ? 'Đang lưu…' : 'Lưu panorama'}
        </Button>
      </div>
    </div>
  );
}
