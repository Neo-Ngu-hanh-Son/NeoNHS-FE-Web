import { useForm } from 'react-hook-form';
import { multiQuickCreateSchema, MultiQuickCreateValues, quickCreateFormSchema } from './schemas/QuickCreateFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { message } from 'antd';
import QuickCreateIntro from './QuickCreateIntro';
import QuickCreateBasicInfoCard from './QuickCreateBasicInfoCard';
import QuickCreateLanguageConfigCard from './QuickCreateLanguageConfigCard';
import { getDefaultLanguageSelection } from './quickCreateLanguageUtils';
import { GeminiTranslationRequest } from '../../types';
import PreviewLanguageTranslationCard from './PreviewLanguageTranslationCard';
import { GeminiAISerivce } from '@/services/api/GeminiAISerivce';
import { ELEVEN_LABS_VOICES } from '../../constants';
import { useState } from 'react';
import { MagicBorder } from '@/components/ui/MagicBorder';

type Props = {};

export default function QuickCreateComponent({}: Props) {
  const defaultLanguageSelection = getDefaultLanguageSelection();
  const [isTranslating, setIsTranslating] = useState(false);

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

  function onSubmitTextData(data: z.infer<typeof quickCreateFormSchema>) {
    console.log(data);
  }

  async function handleConfirmLanguageConfig() {
    const valid = await baseInfoForm.trigger();
    if (!valid) {
      message.warning('Vui lòng kiểm tra lại thông tin ở bước 1 và 2 trước khi dịch');
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
      const translations = await GeminiAISerivce.fakeTranslation(requestData);
      const entries = formData.languageSelections.map((selection, index) => {
        const translated = translations[index] ?? translations.find((item) => item.language === selection.language);
        const voice = ELEVEN_LABS_VOICES.find((item) => item.id === selection.voiceId);

        return {
          metadata: {
            language: selection.language,
            voiceId: selection.voiceId,
            voiceName: voice?.name ?? selection.voiceId,
          },
          title: translated?.title ?? formData.title,
          artist: translated?.author ?? formData.artist,
          script: translated?.script ?? formData.script,
          coverImage: formData.coverImage,
        };
      });

      form.setValue('entries', entries, {
        shouldDirty: true,
        shouldValidate: true,
      });
      message.success('Đã khởi tạo bản dịch, bạn có thể chỉnh sửa ở bước 3');
    } catch (error) {
      console.error(error);
      message.error('Không thể tạo bản dịch từ AI, vui lòng thử lại');
    } finally {
      setIsTranslating(false);
    }
  }

  function handleProceedToFinalStage(values: MultiQuickCreateValues) {
    console.log('Ready for ElevenLabs generation:', values);
    message.info('Đã lưu cấu hình bước 3. Bước tạo audio ElevenLabs sẽ được triển khai tiếp theo.');
  }

  return (
    <div>
      <QuickCreateIntro />
      <div className="mt-6">
        <form onSubmit={baseInfoForm.handleSubmit(onSubmitTextData)} id="basic-info-form">
          <QuickCreateBasicInfoCard form={baseInfoForm} />
          <MagicBorder isGenerating={isTranslating} className="mt-6">
            <QuickCreateLanguageConfigCard
              form={baseInfoForm}
              onConfirm={handleConfirmLanguageConfig}
              isConfirming={isTranslating}
            />
          </MagicBorder>

          <PreviewLanguageTranslationCard form={form} onProceed={handleProceedToFinalStage} />
        </form>
      </div>
    </div>
  );
}
