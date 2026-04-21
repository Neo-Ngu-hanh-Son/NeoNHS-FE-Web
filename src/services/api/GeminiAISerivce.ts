import { GeminiTranslationObject, GeminiTranslationRequest } from '@/pages/admin/historyAudio/types';
import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_TRANSLATOR_API_KEY;

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const TRANSLATION_PROMPT = `Act as a professional cultural heritage translator and JSON formatter. 

**Context:** You are translating content for "NeoNHS", an ecosystem for experiencing the Marble Mountains (Ngũ Hành Sơn) in Da Nang, Vietnam. The content includes historical facts, legends, and descriptions of caves and pagodas.

**Task:** Translate the provided Vietnamese input into each language listed in the "requiredLanguage" array.

**Constraints:**
1. **Format:** Output MUST be a strictly valid JSON array of objects. No markdown blocks, no intro/outro.
2. **Key Requirements:** Each object must have: "title", "author", "script", and "language" (the ISO 639-1 code).
3. **Translation Quality:** - Maintain a professional, storytelling tone suitable for a tour guide.
   - **Proper Nouns:** Keep Vietnamese names of caves/mountains/pagodas in their original Vietnamese form (with or without tone marks depending on the target language's custom) and optionally include the meaning in brackets for the first mention.
   - **Cultural Sensitivity:** Use appropriate honorifics or formal terms when translating religious or historical content into Japanese (Keigo) or Korean.
4. **Author field:** Keep the author name original unless it's a generic title like "Người kể chuyện" (Narrator).


**Input Format:**
{
    "title": "...",
    "author": "...",
    "script": "...",
    "requiredLanguage": ["language1", "language2"]
}

**Output Format:**
[
  {
    "title": "translated title",
    "author": "translated author (if applicable, preserve Unique name)",
    "script": "translated script",
    "language": "language1"
  },
  ...
]



Examples:
Shot 1:
Input: {"title": "Cà phê sữa", "author": "Nam", "script": "Một ly cà phê sáng.", "requiredLanguage": ["english"]}
Output: [{"title": "Milk Coffee", "author": "Nam", "script": "A morning cup of coffee.", "language": "english"}]

Shot 2:
Input: {"title": "Biển", "author": "An", "script": "Sóng vỗ rì rào.", "requiredLanguage": ["french", "german"]}
Output: [
  {"title": "La Mer", "author": "An", "script": "Le bruit des vagues.", "language": "french"},
  {"title": "Das Meer", "author": "An", "script": "Das Rauschen der Wellen.", "language": "german"}
]

`;

function parseGeminiTranslationResponse(text: string): GeminiTranslationObject[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Gemini response is not an array');
  }

  return parsed as GeminiTranslationObject[];
}

async function translate({ title, author, script, requiredLanguages }: GeminiTranslationRequest) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: `${TRANSLATION_PROMPT} Input: ${JSON.stringify({ title, author, script, requiredLanguage: requiredLanguages })}`,
    config: {
      temperature: 0.9,
    },
  });

  const text = response.text ?? '';
  return parseGeminiTranslationResponse(text);
}

async function fakeTranslation({ title, author, script, requiredLanguages }: GeminiTranslationRequest) {
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

  return result as GeminiTranslationObject[];
}

export const GeminiAISerivce = {
  translate,
};
