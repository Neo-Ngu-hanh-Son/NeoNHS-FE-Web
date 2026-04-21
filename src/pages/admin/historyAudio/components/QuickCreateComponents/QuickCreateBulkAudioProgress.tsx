import { Progress } from '@/components';

interface QuickCreateBulkAudioProgressProps {
  running: boolean;
  progress: number;
  subtitle: string;
  completed: number;
  total: number;
}

export default function QuickCreateBulkAudioProgress({
  running,
  progress,
  subtitle,
  completed,
  total,
}: QuickCreateBulkAudioProgressProps) {
  if (!running && total === 0) {
    return null;
  }

  return (
    <div className="border-b bg-muted/20 p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-medium">
        <span>Tiến trình tạo audio hàng loạt</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Đã xử lý {completed}/{total} ngôn ngữ
      </p>
    </div>
  );
}
