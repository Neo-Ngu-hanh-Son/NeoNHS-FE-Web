import { GeminiTranslationObject, GeminiTranslationRequest } from '@/pages/admin/historyAudio/types';
import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_TRANSLATOR_API_KEY;

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const TRANSLATION_PROMPT = `Act as a professional translator and JSON formatter. 

**Task:** 
Translate the provided Vietnamese input into each language listed in the "requiredLanguage" array.

**Constraints:**
1. Output MUST be a strictly valid JSON array of objects.
2. Each object in the array must correspond to one language from the "requiredLanguage" list.
3. Each object must contain the following keys: "title", "author", "script", and "language".
4. The "language" key should contain the name of the language used for that specific translation.
5. Maintain the original meaning and tone of the "script" and "title".
6. Do not include any conversational text, explanations, or markdown code blocks (unless requested). Only the raw JSON.

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
    jp: { title: '故郷の香り', script: '午後の風に、炊きたてのご飯の香りが漂っています。' },
    kr: { title: '고향의 향기', script: '오후의 바람에 갓 지은 밥의 향기가 풍깁니다.' },
    vn: { title: 'Le Parfum du Pays', script: "L'arôme du riz nouveau embaume la brise de l'après-midi." },
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
  fakeTranslation,
};
