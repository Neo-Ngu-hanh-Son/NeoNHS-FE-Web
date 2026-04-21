import { Button } from '@/components';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MultiQuickCreateValues, QuickCreateTranslationEntry } from './schemas/QuickCreateFormSchema';
import type { FieldErrors } from 'react-hook-form';
import type { QuickCreateLanguageOption } from './quickCreateLanguageUtils';
import { CheckCircle2, Trash2 } from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';

interface QuickCreateLanguageSidebarProps {
  entries: QuickCreateTranslationEntry[];
  activeLanguageKey: string;
  onChangeLanguageKey: (value: string) => void;
  getEntryKey: (language: string, index: number) => string;
  languageOptions: QuickCreateLanguageOption[];
  entryErrors?: FieldErrors<MultiQuickCreateValues>['entries'];
  onRemoveEntry: (index: number) => void;
}

export default function QuickCreateLanguageSidebar({
  entries,
  activeLanguageKey,
  onChangeLanguageKey,
  getEntryKey,
  languageOptions,
  entryErrors,
  onRemoveEntry,
}: QuickCreateLanguageSidebarProps) {
  return (
    <TabsList
      className="flex h-auto w-full flex-row justify-start rounded-none border-b bg-muted/30 p-0 md:w-72 md:flex-col md:border-b-0 md:border-r"
      aria-label="Danh sách ngôn ngữ"
    >
      {entries.map((entry, index) => {
        const langOpt = languageOptions.find((option) => option.code === entry.metadata.language);
        const tabValue = getEntryKey(entry.metadata.language, index);
        const hasError = !!entryErrors?.[index];
        const audioReady = entry.metadata.audioStatus === 'uploaded' && Boolean(entry.metadata.audioUrl);

        return (
          <div key={tabValue} className="relative w-full border-b last:border-b-0 md:border-b md:last:border-b-0">
            <TabsTrigger
              value={tabValue}
              onClick={() => onChangeLanguageKey(tabValue)}
              className="relative flex w-full items-center justify-start gap-3 rounded-none border-b-2 border-transparent px-6 py-4 pr-16 text-left data-[state=active]:border-primary data-[state=active]:bg-background md:border-b-0 md:border-r-2"
            >
              <span className={`fi fi-${langOpt?.countryCode} shrink-0 shadow-sm`} />
              <div className="flex min-w-0 flex-col overflow-hidden text-left">
                <span className="truncate text-sm font-semibold uppercase">{langOpt?.label}</span>
                <span className="truncate text-xs text-muted-foreground">{entry.metadata.voiceName}</span>
              </div>

              {audioReady ? (
                <CheckCircle2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
              ) : null}

              {hasError && !audioReady ? (
                <span className="absolute right-10 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-destructive" />
              ) : null}
            </TabsTrigger>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={entries.length <= 1}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-destructive"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRemoveEntry(index);
              }}
              aria-label="Xóa ngôn ngữ"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </TabsList>
  );
}
