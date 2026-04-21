import { Button } from '@/components';
import { Save, Trash2 } from 'lucide-react';
import React from 'react';

export default function HistoryAudioActions({
  activeAudioId,
  pointName,
  handleSave,
  setOpenDelete,
  deletingGuide,
  savingGuide,
  loading,
  embedded = false,
}: {
  activeAudioId: string | null;
  pointName: string | null;
  handleSave: () => void;
  setOpenDelete: (open: boolean) => void;
  deletingGuide: boolean;
  savingGuide: boolean;
  loading: boolean;
  embedded?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex flex-col">
        <h2
          className={
            embedded ? 'text-lg font-semibold tracking-tight text-slate-900 dark:text-white' : 'text-2xl font-bold'
          }
        >
          {embedded ? 'Âm thanh lịch sử' : 'Quản lý âm thanh lịch sử'}
        </h2>
        {pointName ? <span className="truncate text-sm text-muted-foreground">{pointName}</span> : null}
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={savingGuide || loading} size={'sm'}>
          <Save className="mr-2 h-4 w-4" />
          {savingGuide ? 'Đang lưu…' : activeAudioId ? 'Cập nhật' : 'Tạo mới'}
        </Button>
        {activeAudioId && (
          <Button variant="outline" onClick={() => setOpenDelete(true)} disabled={deletingGuide} size={'sm'}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        )}
      </div>
    </div>
  );
}
