import { useForm } from 'react-hook-form';
import { multiQuickCreateSchema, MultiQuickCreateValues, quickCreateFormSchema } from './schemas/QuickCreateFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { message } from 'antd';
import QuickCreateIntro from './QuickCreateIntro';
import QuickCreateBasicInfoCard from './QuickCreateBasicInfoCard';
import { getDefaultLanguageSelection, getQuickCreateLanguageOptions } from './quickCreateLanguageUtils';
import { GeminiTranslationRequest } from '../../types';
import ManageQuickCreateHistoryAudiosCard from './PreviewLanguageTranslationCard';
import { GeminiAISerivce } from '@/services/api/GeminiAISerivce';
import { ELEVEN_LABS_VOICES } from '../../constants';
import { useCallback, useMemo, useState } from 'react';
import { useHistoryAudioMutations } from '@/hooks/historyAudio/useHistoryAudioMutations';
import { useHistoryAudioUploadAndSave } from '@/pages/admin/historyAudio/hooks/useHistoryAudioUploadAndSave';
import { useQuickCreateSubmitAll } from './hooks/useQuickCreateSubmitAll';
import QuickCreateSubmitAllBar from './QuickCreateSubmitAllBar';
import 'flag-icons/css/flag-icons.min.css';
import QuickCreateLanguageConfigCard from './QuickCreateLanguageConfigCard';

type Props = {
  pointId: string;
  onSubmittedAll?: () => Promise<void> | void;
};

export default function QuickCreateComponent({ pointId, onSubmittedAll }: Props) {
  const defaultLanguageSelection = getDefaultLanguageSelection();
  const languageOptions = useMemo(() => getQuickCreateLanguageOptions(), []);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAudioGenerating, setIsAudioGenerating] = useState(false);

  const { createAudio, updateAudio } = useHistoryAudioMutations(pointId);
  const { handleSaveHistoryAudio } = useHistoryAudioUploadAndSave({
    createAudio,
    updateAudio,
  });

  const baseInfoForm = useForm<z.infer<typeof quickCreateFormSchema>>({
    resolver: zodResolver(quickCreateFormSchema),
    defaultValues: {
      title: '',
      artist: '',
      coverImage: '',
      script: '',
      languageSelections: [defaultLanguageSelection],
    },
    mode: 'onTouched',
  });

  const form = useForm<MultiQuickCreateValues>({
    resolver: zodResolver(multiQuickCreateSchema),
    defaultValues: {
      entries: [],
    },
    mode: 'onTouched',
  });

  const { submitStatuses, submitProgress, submitAll } = useQuickCreateSubmitAll({
    form,
    handleSaveHistoryAudio,
    onCompleted: onSubmittedAll,
  });

  function onSubmitTextData(data: z.infer<typeof quickCreateFormSchema>) {
    console.log(data);
  }

  async function handleConfirmLanguageConfig() {
    const valid = await baseInfoForm.trigger();
    if (!valid) {
      console.log('Basic info form validation failed:', baseInfoForm.formState.errors);
      message.warning('Vui lòng kiểm tra lại thông tin phần cơ bản trước khi tạo bản dịch');
      return;
    }

    const formData = baseInfoForm.getValues();

    const requestData = {
      title: formData.title,
      author: formData.artist,
      requiredLanguages: formData.languageSelections.map((selection) => selection.language),
      script: formData.script,
    } as GeminiTranslationRequest;

    setIsTranslating(true);
    try {
      const translations = await GeminiAISerivce.translate(requestData);
      const entries = formData.languageSelections.map((selection, index) => {
        const translated = translations[index] ?? translations.find((item) => item.language === selection.language);
        const voice = ELEVEN_LABS_VOICES.find((item) => item.id === selection.voiceId);
        const model =
          ELEVEN_LABS_VOICES.find((item) => item.id === selection.voiceId)?.model || 'eleven_multilingual_v2';
        return {
          metadata: {
            language: selection.language,
            voiceId: selection.voiceId,
            voiceName: voice?.name ?? selection.voiceId,
            model: selection.model || model,
            audioStatus: 'idle' as const,
            audioUrl: '',
            audioError: '',
          },
          title: translated?.title ?? formData.title,
          artist: translated?.author ?? formData.artist,
          script: translated?.script ?? formData.script,
          coverImage: formData.coverImage,
          words: [],
        };
      });

      form.setValue('entries', entries, {
        shouldDirty: true,
        shouldValidate: true,
      });
      message.success('Đã khởi tạo bản dịch, bạn có thể chỉnh sửa ở phần biên tập bên dưới');
    } catch (error: Error | any) {
      try {
        if (error.message && error.message.includes('{')) {
          const errorObject = JSON.parse(error.message);

          if (errorObject?.error?.code == 503 || errorObject?.error?.code === '503') {
            message.error('Dịch vụ AI hiện đang quá tải, vui lòng thử lại sau');
            return;
          }
        }
      } catch (parseError) {
        console.error('Parse error failed:', parseError);
      }

      message.error('Không thể tạo bản dịch từ AI, vui lòng thử lại');
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <div>
      <QuickCreateIntro />
      <div className="mt-6">
        <form onSubmit={baseInfoForm.handleSubmit(onSubmitTextData)} id="basic-info-form">
          <QuickCreateBasicInfoCard form={baseInfoForm} />

          <QuickCreateLanguageConfigCard
            form={baseInfoForm}
            onConfirm={handleConfirmLanguageConfig}
            isTranslating={isTranslating}
          />

          {/*
          <MagicBorder isGenerating={isTranslating} className="mt-6">
            <QuickCreateLanguageConfigCard
              form={baseInfoForm}
              onConfirm={handleConfirmLanguageConfig}
              isConfirming={isTranslating}
            />
          </MagicBorder>
          */}

          <ManageQuickCreateHistoryAudiosCard form={form} onBulkGeneratingChange={setIsAudioGenerating} />
        </form>

        <QuickCreateSubmitAllBar
          onSubmitAll={submitAll}
          submitProgress={submitProgress}
          submitStatuses={submitStatuses}
          disabled={isTranslating || isAudioGenerating}
        />
      </div>
    </div>
  );
}
