import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@/components';
import { message } from 'antd';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { MultiQuickCreateValues } from './schemas/QuickCreateFormSchema';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import { getQuickCreateLanguageOptions } from './quickCreateLanguageUtils';
import { ArrowRight, Info, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import 'flag-icons/css/flag-icons.min.css';
import { cn } from '@/lib/utils';
import QuickCreateLanguageSidebar from './QuickCreateLanguageSidebar';
import QuickCreateVoiceAudioPanel from './QuickCreateVoiceAudioPanel';
import QuickCreateBulkAudioProgress from './QuickCreateBulkAudioProgress';
import { useQuickCreateAudioGeneration } from './hooks/useQuickCreateAudioGeneration';
import { ELEVEN_LABS_VOICES } from '../../constants';
import QuickCreateBulkGenerateConfirmDialog from './QuickCreateBulkGenerateConfirmDialog';

interface ManageQuickCreateHistoryAudiosCardProps {
  form: UseFormReturn<MultiQuickCreateValues>;
  onProceed?: (values: MultiQuickCreateValues) => void;
  isGenerating?: boolean;
  onBulkGeneratingChange?: (isRunning: boolean) => void;
}

export default function ManageQuickCreateHistoryAudiosCard({
  form,
  onProceed,
  isGenerating = false,
  onBulkGeneratingChange,
}: ManageQuickCreateHistoryAudiosCardProps) {
  const entries = form.watch('entries');
  const languageOptions = useMemo(() => getQuickCreateLanguageOptions(), []);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  const { remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const { generatingIndex, bulkProgress, isBulkRunning, isAnyGenerating, generateSingleAudio, generateAllAudio } =
    useQuickCreateAudioGeneration({
      form,
      languageOptions,
      apiKey: elevenLabsApiKey,
      useMock: false,
    });

  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  // Notify parent when bulk generation state changes
  useEffect(() => {
    onBulkGeneratingChange?.(isAnyGenerating);
  }, [isAnyGenerating, onBulkGeneratingChange]);

  const getEntryKey = (language: string, index: number) => `${language}-${index}`;
  const [activeLanguageKey, setActiveLanguageKey] = useState<string>(() =>
    entries.length ? getEntryKey(entries[0].metadata.language, 0) : '',
  );

  useEffect(() => {
    if (!entries.length) {
      setActiveLanguageKey('');
      return;
    }

    const hasActive = entries.some((entry, index) => getEntryKey(entry.metadata.language, index) === activeLanguageKey);
    if (!hasActive) {
      setActiveLanguageKey(getEntryKey(entries[0].metadata.language, 0));
    }
  }, [activeLanguageKey, entries]);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.src = '';
      }
    };
  }, []);

  const stopVoicePreview = () => {
    if (!previewAudioRef.current) {
      return;
    }

    previewAudioRef.current.pause();
    previewAudioRef.current.currentTime = 0;
    setPreviewingVoiceId(null);
  };

  const handlePreviewVoice = async (voiceId: string) => {
    const voice = ELEVEN_LABS_VOICES.find((item) => item.id === voiceId);
    if (!voice?.sampleAudio) {
      message.warning('Giọng đọc này chưa có bản nghe thử');
      return;
    }

    if (previewingVoiceId === voiceId) {
      stopVoicePreview();
      return;
    }

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio();
      previewAudioRef.current.onended = () => setPreviewingVoiceId(null);
    }

    try {
      const audio = previewAudioRef.current;
      audio.pause();
      audio.src = voice.sampleAudio;
      audio.currentTime = 0;
      await audio.play();
      setPreviewingVoiceId(voiceId);
    } catch (error) {
      console.error(error);
      setPreviewingVoiceId(null);
      message.error('Không thể phát bản nghe thử');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const currentEntry = form.getValues('entries')[index];
    if (!currentEntry) {
      return;
    }

    if (previewingVoiceId === currentEntry.metadata.voiceId) {
      stopVoicePreview();
    }

    remove(index);
    message.success(`Đã gỡ ${currentEntry.metadata.language.toUpperCase()} khỏi danh sách biên tập`);
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="mb-2">2. Biên tập bản dịch theo từng ngôn ngữ</CardTitle>
            <CardDescription>Chọn ngôn ngữ ở cột trái, sau đó quản lý thông tin ở bên phải.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!entries.length || isAnyGenerating}
              onClick={() => {
                // Check if any entries already have audio generated
                const entriesWithAudio = entries.filter(
                  (e) => e.metadata.audioStatus === 'uploaded' && Boolean(e.metadata.audioUrl),
                );
                if (entriesWithAudio.length > 0) {
                  setShowBulkConfirm(true);
                } else {
                  generateAllAudio();
                }
              }}
              className={cn(bulkProgress.running && 'btn-shimmer')}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {bulkProgress.running ? 'Đang tạo hàng loạt...' : 'Tạo tất cả audio'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <QuickCreateBulkAudioProgress
          running={bulkProgress.running}
          progress={bulkProgress.progress}
          subtitle={bulkProgress.subtitle}
          completed={bulkProgress.completed}
          total={bulkProgress.total}
        />

        {!entries.length ? (
          <div className="p-12 text-center text-muted-foreground">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Info className="h-6 w-6" />
            </div>
            <p>Chưa có dữ liệu bản dịch. Hãy hoàn thành phần thông tin cơ bản và bắt đầu tạo bản dịch.</p>
          </div>
        ) : (
          <Tabs
            value={activeLanguageKey || getEntryKey(entries[0]?.metadata.language ?? '', 0)}
            onValueChange={setActiveLanguageKey}
            orientation="vertical"
            className="flex flex-col md:flex-row"
          >
            <QuickCreateLanguageSidebar
              entries={entries}
              activeLanguageKey={activeLanguageKey}
              onChangeLanguageKey={setActiveLanguageKey}
              getEntryKey={getEntryKey}
              languageOptions={languageOptions}
              entryErrors={form.formState.errors.entries}
              onRemoveEntry={handleRemoveLanguage}
            />

            <div className="flex-1 p-6 min-h-80">
              {entries.map((entry, index) => (
                <TabsContent
                  key={getEntryKey(entry.metadata.language, index)}
                  value={getEntryKey(entry.metadata.language, index)}
                  className="m-0 focus-visible:ring-0"
                >
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between border-b pb-4">
                      <h4 className="text-lg font-bold text-primary">
                        Biên tập: {languageOptions.find((o) => o.code === entry.metadata.language)?.label}
                      </h4>
                    </div>

                    <Tabs defaultValue="script-editor" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="script-editor">Thông tin bản dịch</TabsTrigger>
                        <TabsTrigger value="metadata-voice">Âm thanh thuyết minh</TabsTrigger>
                      </TabsList>

                      <TabsContent value="script-editor" className="space-y-4">
                        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Controller
                            control={form.control}
                            name={`entries.${index}.title` as const}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Tiêu đề</FieldLabel>
                                <Input {...field} placeholder="Nhập tiêu đề đã dịch" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />

                          <Controller
                            control={form.control}
                            name={`entries.${index}.artist` as const}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Tác giả hiển thị</FieldLabel>
                                <Input {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </FieldGroup>

                        <Controller
                          control={form.control}
                          name={`entries.${index}.script` as const}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Kịch bản</FieldLabel>
                              <InputGroup>
                                <InputGroupTextarea {...field} rows={10} className="min-h-[250px] resize-none" />
                                <InputGroupAddon align="block-end">
                                  <InputGroupText className="tabular-nums">
                                    {field.value.length}/2000 kí tự
                                  </InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="metadata-voice" className="space-y-4">
                        <QuickCreateVoiceAudioPanel
                          form={form}
                          entry={entry}
                          index={index}
                          previewingVoiceId={previewingVoiceId}
                          onPreviewVoice={handlePreviewVoice}
                          onGenerateAudio={generateSingleAudio}
                          isGeneratingAudio={generatingIndex === index || isBulkRunning}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-6">
        <p className="text-xs text-muted-foreground italic">
          Mẹo: Kiểm tra kỹ các từ mượn hoặc tên riêng sau khi AI dịch.
        </p>
      </CardFooter>
      <QuickCreateBulkGenerateConfirmDialog
        open={showBulkConfirm}
        onOpenChange={setShowBulkConfirm}
        onConfirm={() => {
          setShowBulkConfirm(false);
          generateAllAudio();
        }}
        existingAudioCount={
          entries.filter((e) => e.metadata.audioStatus === 'uploaded' && Boolean(e.metadata.audioUrl)).length
        }
        totalCount={entries.length}
      />
    </Card>
  );
}
