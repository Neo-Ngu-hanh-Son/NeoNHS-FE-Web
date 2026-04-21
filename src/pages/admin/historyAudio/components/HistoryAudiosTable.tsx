import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, WandSparkles } from 'lucide-react';
import type { HistoryAudioResponse } from '@/types/historyAudio';

function formatAudioSource(mode: string): string {
  if (mode === 'generate') return 'Tạo từ văn bản';
  if (mode === 'upload') return 'Tải lên';
  return mode;
}

interface HistoryAudiosTableProps {
  audios: HistoryAudioResponse[];
  activeAudioId: string | null;
  hasAudio: boolean;
  text: string;
  onNewAudio: () => void;
  onSelectAudio: (id: string) => void;
  isQuickGenerating?: boolean;
  toggleQuickGenerating: (isGenerating: boolean) => void;
}

export default function HistoryAudiosTable({
  audios,
  activeAudioId,
  hasAudio,
  text,
  onNewAudio,
  onSelectAudio,
  toggleQuickGenerating,
  isQuickGenerating,
}: HistoryAudiosTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Danh sách âm thanh</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onNewAudio} disabled={!activeAudioId && !text && !hasAudio}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Thêm mới
            </Button>
            {isQuickGenerating ? (
              <Button size="sm" variant="destructive" onClick={() => toggleQuickGenerating(false)}>
                <WandSparkles className="mr-1.5 h-3.5 w-3.5" />
                Hủy tạo nhanh
              </Button>
            ) : (
              <Button size="sm" variant="default" onClick={() => toggleQuickGenerating(true)}>
                <WandSparkles className="mr-1.5 h-3.5 w-3.5" />
                Tạo nhanh
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {audios.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            Chưa có âm thanh lịch sử. Dùng biểu mẫu bên dưới để tạo mới.
          </p>
        ) : (
          <div className="max-h-[220px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead className="w-[90px]">Ảnh bìa</TableHead>
                  <TableHead className="w-[180px]">Tiêu đề</TableHead>
                  <TableHead className="w-[160px]">Tác giả</TableHead>
                  <TableHead>Xem trước nội dung</TableHead>
                  <TableHead className="w-[100px]">Ngôn ngữ</TableHead>
                  <TableHead className="w-[90px]">Nguồn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audios.map((entry, idx) => {
                  const isSelected = entry.id === activeAudioId;
                  const lang = entry.metadata?.language?.toUpperCase() ?? '-';
                  const source = entry.metadata?.mode ?? '-';
                  const hasEntryAudio = Boolean(entry.audioUrl);
                  const coverImage = entry.metadata?.coverImage ?? '';
                  const title = entry.metadata?.title ?? '-';
                  const artist = entry.metadata?.artist ?? '-';
                  const preview = entry.historyText
                    ? entry.historyText.length > 30
                      ? `${entry.historyText.slice(0, 30)}...`
                      : entry.historyText
                    : '-';

                  return (
                    <TableRow
                      key={entry.id}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                      onClick={() => onSelectAudio(entry.id)}
                    >
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={title !== '-' ? `Ảnh bìa: ${title}` : 'Ảnh bìa'}
                            className="h-10 w-10 rounded object-cover border"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{title}</TableCell>
                      <TableCell className="text-sm">{artist}</TableCell>
                      <TableCell className="text-sm">{preview}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {source === '-' ? '-' : formatAudioSource(source)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
