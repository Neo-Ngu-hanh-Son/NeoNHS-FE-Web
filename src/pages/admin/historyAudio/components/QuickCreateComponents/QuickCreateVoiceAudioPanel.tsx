import { Button, Input } from '@/components';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CheckCircle2, Loader2, Pause, Play, Settings2, Sparkles, Upload, Wand2 } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { ELEVEN_LABS_VOICES } from '../../constants';
import type { MultiQuickCreateValues, QuickCreateTranslationEntry } from './schemas/QuickCreateFormSchema';
import QuickCreateEntryTimingSection from './QuickCreateEntryTimingSection';

interface QuickCreateVoiceAudioPanelProps {
  form: UseFormReturn<MultiQuickCreateValues>;
  entry: QuickCreateTranslationEntry;
  index: number;
  previewingVoiceId: string | null;
  onPreviewVoice: (voiceId: string) => void;
  onGenerateAudio: (index: number) => void;
  isGeneratingAudio: boolean;
}

function getAudioStatusLabel(status?: string) {
  switch (status) {
    case 'generating':
      return 'Đang tạo audio và timing...';
    case 'uploading':
      return 'Đang tải audio lên hệ thống...';
    case 'uploaded':
      return 'Đã tạo và tải audio thành công';
    case 'failed':
      return 'Tạo audio thất bại, vui lòng thử lại';
    default:
      return 'Chưa tạo audio cho ngôn ngữ này';
  }
}

export default function QuickCreateVoiceAudioPanel({
  form,
  entry,
  index,
  previewingVoiceId,
  onPreviewVoice,
  onGenerateAudio,
  isGeneratingAudio,
}: QuickCreateVoiceAudioPanelProps) {
  const voices = ELEVEN_LABS_VOICES.filter((voice) => voice.language === entry.metadata.language);
  const status = entry.metadata.audioStatus;
  const isUploaded = status === 'uploaded' && Boolean(entry.metadata.audioUrl);
  const isFailed = status === 'failed';
  const isUploading = status === 'uploading';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_auto]">
        <Controller
          control={form.control}
          name={`entries.${index}.metadata.voiceId` as const}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="mb-2 flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <span className="font-bold text-lg">Giọng đọc ({entry.metadata.language.toUpperCase()})</span>
              </FieldLabel>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedVoice = voices.find((v) => v.id === value);
                    form.setValue(`entries.${index}.metadata.voiceName`, selectedVoice?.name ?? value);
                    // Reset status
                    form.setValue(`entries.${index}.metadata.audioStatus`, 'idle');
                    form.setValue(`entries.${index}.metadata.audioUrl`, undefined);
                    form.setValue(`entries.${index}.metadata.audioError`, undefined);
                    form.setValue(`entries.${index}.words`, []);
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Chọn giọng đọc" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name} ({voice.gender === 'Male' ? 'Nam' : 'Nữ'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => onPreviewVoice(field.value)}
                  className="shrink-0"
                  title="Nghe thử giọng"
                >
                  {previewingVoiceId === field.value ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border',
                isUploaded
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  : isFailed
                    ? 'border-destructive/20 bg-destructive/10 text-destructive'
                    : isUploading
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'bg-muted text-muted-foreground',
              )}
            >
              {status === 'generating' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isUploaded ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isUploading ? (
                <Upload className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </div>

            <div>
              <p
                className={cn(
                  'text-sm font-semibold',
                  isUploaded ? 'text-emerald-700' : isFailed ? 'text-destructive' : 'text-foreground',
                )}
              >
                {getAudioStatusLabel(status)}
              </p>
              {entry.metadata.audioError && <p className="text-xs text-destructive/80">{entry.metadata.audioError}</p>}
            </div>
          </div>

          <Button
            type="button"
            onClick={() => onGenerateAudio(index)}
            disabled={isGeneratingAudio}
            variant={isUploaded ? 'outline' : 'default'}
            className={cn('shadow-sm', !isUploaded && 'btn-glow-pulse')}
          >
            {isGeneratingAudio ? null : <Wand2 className="mr-2 h-4 w-4" />}
            {isUploaded ? 'Tạo lại Audio' : 'Khởi tạo Audio AI'}
          </Button>
        </div>

        {/* {entry.metadata.audioUrl && (
          <div className="rounded-lg border bg-background p-4 animate-in fade-in zoom-in-95 duration-300">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Bản thu hiện tại</p>
            <audio controls src={entry.metadata.audioUrl} className="h-10 w-full" />
          </div>
        )} */}

        <QuickCreateEntryTimingSection audioUrl={entry.metadata.audioUrl} script={entry.script} words={entry.words} />
      </div>
    </div>
  );
}
