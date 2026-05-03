import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '@/components';
import { CheckCircle2, Loader2, Save, XCircle } from 'lucide-react';
import type { QuickCreateSubmitProgressState, QuickCreateSubmitStatusItem } from '../../hooks/useQuickCreateSubmitAll';

interface QuickCreateSubmitAllBarProps {
  disabled?: boolean;
  submitProgress: QuickCreateSubmitProgressState;
  submitStatuses: QuickCreateSubmitStatusItem[];
  onSubmitAll: () => void;
}

export default function QuickCreateSubmitAllBar({
  disabled = false,
  submitProgress,
  submitStatuses,
  onSubmitAll,
}: QuickCreateSubmitAllBarProps) {
  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader>
        <CardTitle className="text-base md:text-lg">3. Lưu toàn bộ bản ghi lên hệ thống</CardTitle>
        <CardDescription>
          Sau khi đã hoàn tất việc tạo bản dịch và audio, hãy nhấn nút "Lưu toàn bộ" để lưu tất cả dữ liệu lên hệ thống.
          Bạn có thể theo dõi tiến trình lưu ở thanh tiến trình bên dưới.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            {submitProgress.subtitle || 'Sẵn sàng lưu dữ liệu'}
            {submitProgress.total > 0 ? ` (${submitProgress.completed}/${submitProgress.total})` : ''}
          </div>

          <Button type="button" onClick={onSubmitAll} disabled={disabled || submitProgress.running}>
            {submitProgress.running ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {submitProgress.running ? 'Đang lưu...' : 'Lưu toàn bộ'}
          </Button>
        </div>

        <Progress value={submitProgress.progress} className="h-2" />

        {submitStatuses.length > 0 ? (
          <div className="space-y-2 rounded-md border bg-muted/20 p-3">
            {submitStatuses.map((statusItem, index) => (
              <div key={`${statusItem.language}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  {statusItem.language.toUpperCase()} - {statusItem.title}
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {statusItem.status === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
                  {statusItem.status === 'failed' ? <XCircle className="h-4 w-4 text-destructive" /> : null}
                  {statusItem.status === 'submitting' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : null}
                  {statusItem.message || 'Chưa submit'}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
