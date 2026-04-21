import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components';
import { message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { quickCreateFormSchema } from './schemas/QuickCreateFormSchema';
import { Languages, Plus, Sparkles, Wand2 } from 'lucide-react';
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
  onConfirm: () => void;
  isTranslating: boolean;
}

/**
 * This component is responsible for allowing users to select which languages they want to generate audio for, and which voices to use for each language.
 */
export default function QuickCreateLanguageConfigCard({
  form,
  onConfirm,
  isTranslating,
}: QuickCreateLanguageConfigCardProps) {
  const languageOptions = useMemo(() => getQuickCreateLanguageOptions(), []);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'languageSelections',
  });

  const selectedLanguageSelections = form.watch('languageSelections');
  const selectedLanguageSet = new Set(selectedLanguageSelections.map((item) => item.language));

  const handleToggleLanguage = (language: string) => {
    const current = form.getValues('languageSelections');
    const exists = current.some((item) => item.language === language);

    const nextSelections = exists
      ? current.filter((item) => item.language !== language)
      : [...current, { language, voiceId: getDefaultVoiceIdForLanguage(language), model: '' }];

    form.setValue('languageSelections', nextSelections, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Languages className="h-4 w-4" />
          Chọn ngôn ngữ cần tạo
        </CardTitle>
        <CardDescription>Bật hoặc tắt ngôn ngữ bằng một lần nhấn, sau đó bắt đầu tạo bản dịch.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((option) => {
            const active = selectedLanguageSet.has(option.code);
            return (
              <Button
                key={option.code}
                type="button"
                variant={active ? 'default' : 'outline'}
                className={cn('h-10 gap-2 rounded-full px-4', active && 'ring-1 ring-primary/40')}
                onClick={() => handleToggleLanguage(option.code)}
              >
                <span className={`fi fi-${option.countryCode} h-4 w-5 rounded-sm`} />
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 border-t pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Đã chọn {selectedLanguageSelections.length} ngôn ngữ. Bản dịch sẽ được tạo tương ứng cho từng ngôn ngữ đã
            bật.
          </p>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isTranslating}
            className={cn(isTranslating && 'btn-shimmer')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isTranslating ? 'Đang tạo bản dịch...' : 'Bắt đầu tạo bản dịch'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
