import { ELEVEN_LABS_VOICES, type ElevenLabVoice } from '@/pages/admin/historyAudio/constants';

export interface QuickCreateLanguageOption {
  code: string;
  label: string;
  voices: ElevenLabVoice[];
  countryCode: string;
}

// Have to map because Eleven Labs use different language ISO codes than the standard ones (e.g. zh for Chinese instead of zh-CN), and we want to display the correct country flags for each language.
const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  en: 'us', // English -> USA flag
  vi: 'vn', // Vietnamese -> Vietnam flag
  ja: 'jp', // Japanese -> Japan flag
  ko: 'kr', // Korean -> South Korea flag
  zh: 'cn', // Chinese -> China flag
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'Tiếng Anh',
  vi: 'Tiếng Việt',
  ja: 'Tiếng Nhật',
  ko: 'Tiếng Hàn',
  zh: 'Tiếng Trung',
};

export function getQuickCreateLanguageOptions(): QuickCreateLanguageOption[] {
  return Array.from(new Set(ELEVEN_LABS_VOICES.map((voice) => voice.language))).map((languageCode) => ({
    code: languageCode,
    label: LANGUAGE_LABELS[languageCode] ?? languageCode.toUpperCase(),
    voices: ELEVEN_LABS_VOICES.filter((voice) => voice.language === languageCode),
    countryCode: LANGUAGE_TO_COUNTRY[languageCode] ?? languageCode,
  }));
}

export function getVoiceOptionsByLanguage(language: string): ElevenLabVoice[] {
  return ELEVEN_LABS_VOICES.filter((voice) => voice.language === language);
}

export function getDefaultVoiceIdForLanguage(language: string): string {
  const byLanguage = getVoiceOptionsByLanguage(language);
  if (byLanguage.length > 0) {
    return byLanguage[0].id;
  }

  return ELEVEN_LABS_VOICES[0]?.id ?? '';
}

export function getDefaultLanguageSelection() {
  const options = getQuickCreateLanguageOptions();
  const defaultLanguage = options[0]?.code ?? '';

  return {
    language: defaultLanguage,
    voiceId: getDefaultVoiceIdForLanguage(defaultLanguage),
  };
}
