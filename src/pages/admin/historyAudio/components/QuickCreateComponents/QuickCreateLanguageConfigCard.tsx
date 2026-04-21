import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components';
import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { quickCreateFormSchema } from './schemas/QuickCreateFormSchema';
import { Languages, Plus, Wand2 } from 'lucide-react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ELEVEN_LABS_VOICES } from '@/pages/admin/historyAudio/constants';
import {
  getDefaultVoiceIdForLanguage,
  getQuickCreateLanguageOptions,
  getVoiceOptionsByLanguage,
} from './quickCreateLanguageUtils';
import QuickCreateLanguageRow from './QuickCreateLanguageRow';
import { TranslationOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';

type QuickCreateFormValues = z.infer<typeof quickCreateFormSchema>;

interface QuickCreateLanguageConfigCardProps {
  form: UseFormReturn<QuickCreateFormValues>;
  onConfirm: () => void | Promise<void>;
  isConfirming?: boolean;
}

/**
 * This component is responsible for allowing users to select which languages they want to generate audio for, and which voices to use for each language.
 */
export default function QuickCreateLanguageConfigCard({
  form,
  onConfirm,
  isConfirming = false,
}: QuickCreateLanguageConfigCardProps) {
  const languageOptions = useMemo(() => getQuickCreateLanguageOptions(), []);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'languageSelections',
  });

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

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

  const handleSelectLanguage = (index: number, language: string) => {
    form.setValue(`languageSelections.${index}.language`, language, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(`languageSelections.${index}.voiceId`, getDefaultVoiceIdForLanguage(language), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addLanguageItem = () => {
    const current = form.getValues('languageSelections');
    const unusedLanguage = languageOptions.find((option) => !current.some((item) => item.language === option.code));
    const nextLanguage = unusedLanguage?.code ?? languageOptions[0]?.code ?? '';
    const nextVoiceId = getDefaultVoiceIdForLanguage(nextLanguage);
    append({ language: nextLanguage, voiceId: nextVoiceId });
  };

  const removeLanguageItem = (index: number) => {
    const voiceId = form.getValues(`languageSelections.${index}.voiceId`);
    if (previewingVoiceId === voiceId) {
      stopVoicePreview();
    }
    remove(index);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>2. Cấu hình các ngôn ngữ</CardTitle>
        <CardDescription>
          Chọn các ngôn ngữ cần tạo và giọng đọc tương ứng. Bạn có thể thêm nhiều cấu hình và xóa từng cấu hình bất kỳ.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead>Ngôn ngữ</TableHead>
              <TableHead>Giọng đọc</TableHead>
              <TableHead className="w-[120px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const currentLanguage = form.watch(`languageSelections.${index}.language`);
              const voiceOptions = getVoiceOptionsByLanguage(currentLanguage).map((voice) => ({
                id: voice.id,
                name: voice.name,
              }));

              return (
                <QuickCreateLanguageRow
                  key={field.id}
                  rowId={field.id}
                  index={index}
                  form={form}
                  languageOptions={languageOptions}
                  voiceOptions={voiceOptions}
                  previewingVoiceId={previewingVoiceId}
                  onSelectLanguage={handleSelectLanguage}
                  onPreviewVoice={handlePreviewVoice}
                  onRemove={removeLanguageItem}
                  disableRemove={fields.length <= 1}
                />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="outline" onClick={addLanguageItem} className="mr-2">
          <Plus className="mr-2 h-4 w-4" />
          Thêm ngôn ngữ
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className={cn({ 'btn-shimmer': isConfirming })}
        >
          <Languages className="mr-2 h-4 w-4" />
          {isConfirming ? 'Đang dịch...' : 'Dịch và khởi tạo'}
        </Button>
      </CardFooter>
    </Card>
  );
}
