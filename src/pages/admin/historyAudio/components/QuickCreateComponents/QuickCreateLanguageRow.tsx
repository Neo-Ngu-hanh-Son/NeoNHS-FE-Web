import { Button } from '@/components';
import { Field, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Pause, Play, Trash2 } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { quickCreateFormSchema } from './schemas/QuickCreateFormSchema';
import type { QuickCreateLanguageOption } from './quickCreateLanguageUtils';
import 'flag-icons/css/flag-icons.min.css';

type QuickCreateFormValues = z.infer<typeof quickCreateFormSchema>;

interface QuickCreateLanguageRowProps {
  index: number;
  rowId: string;
  form: UseFormReturn<QuickCreateFormValues>;
  languageOptions: QuickCreateLanguageOption[];
  voiceOptions: Array<{ id: string; name: string }>;
  previewingVoiceId: string | null;
  onSelectLanguage: (index: number, language: string) => void;
  onPreviewVoice: (voiceId: string) => void;
  onRemove: (index: number) => void;
  disableRemove: boolean;
}

export default function QuickCreateLanguageRow({
  index,
  rowId,
  form,
  languageOptions,
  voiceOptions,
  previewingVoiceId,
  onSelectLanguage,
  onPreviewVoice,
  onRemove,
  disableRemove,
}: QuickCreateLanguageRowProps) {
  return (
    <TableRow key={rowId}>
      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
      <TableCell>
        <Controller
          control={form.control}
          name={`languageSelections.${index}.language` as const}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select value={field.value} onValueChange={(language) => onSelectLanguage(index, language)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.code && (
                        <span
                          className={`fi fi-${languageOptions.find((o) => o.code === option.code)?.countryCode} shrink-0 mr-2`}
                        />
                      )}
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={form.control}
          name={`languageSelections.${index}.voiceId` as const}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giọng đọc" />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Controller
            control={form.control}
            name={`languageSelections.${index}.voiceId` as const}
            render={({ field }) => (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  'h-9 w-9 shrink-0 rounded-md border border-transparent text-muted-foreground hover:text-foreground',
                  previewingVoiceId === field.value && 'bg-muted',
                )}
                onClick={() => onPreviewVoice(field.value)}
                aria-label="Nghe thử giọng đọc"
              >
                {previewingVoiceId === field.value ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            disabled={disableRemove}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
