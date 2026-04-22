import { HistoryAudioTranslationObject, HistoryAudioTranslationRequest } from '@/pages/admin/historyAudio/types';
import adminHistoryAudioService from './adminHistoryAudioService';

async function translate({ title, author, script, requiredLanguages }: HistoryAudioTranslationRequest) {
  const response = await adminHistoryAudioService.translate({ title, author, script, requiredLanguages });
  return response.data;
}

async function fakeTranslation({ title, author, script, requiredLanguages }: HistoryAudioTranslationRequest) {
  // Simulating network delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Dummy data mapping
  const dummyDatabase = {
    en: {
      title: 'Flavor of the Homeland',
      script: 'The fragrant aroma of new rice wafts through the afternoon breeze.',
    },
    ja: { title: '故郷の香り', script: '午後の風に、炊きたてのご飯の香りが漂っています。' },
    ko: { title: '고향의 향기', script: '오후의 바람에 갓 지은 밥의 향기가 풍깁니다.' },
    vi: { title: 'Le Parfum du Pays', script: "L'arôme du riz nouveau embaume la brise de l'après-midi." },
  };

  // Generate the response based on requiredLanguages
  const result = requiredLanguages.map((lang) => {
    const translation = dummyDatabase[lang as keyof typeof dummyDatabase] || {
      title: `[${lang}] ${title}`,
      script: `[${lang}] ${script}`,
    };
    return {
      title: translation.title,
      author: author, // Preserving unique name as per constraint 3
      script: translation.script,
      language: lang,
    };
  });

  return result as HistoryAudioTranslationObject[];
}

export const AITranslationService = {
  translate,
};
