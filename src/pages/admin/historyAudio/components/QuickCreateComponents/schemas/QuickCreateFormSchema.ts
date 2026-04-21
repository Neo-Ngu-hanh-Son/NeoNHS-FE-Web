import z from 'zod';

const titleSchema = z.string().min(2, 'Tiêu đề phải có ít nhất 2 ký tự').max(100, 'Tiêu đề phải có từ 2 đến 100 ký tự');
const artistSchema = z
  .string()
  .min(2, 'Tên tác giả phải có ít nhất 2 ký tự')
  .max(100, 'Tên tác giả phải có từ 2 đến 100 ký tự');
const scriptSchema = z
  .string()
  .min(10, 'Nội dung phải có ít nhất 10 ký tự')
  .max(2000, 'Nội dung phải có từ 10 đến 2000 ký tự');

const quickCreateLanguageItemSchema = z.object({
  language: z.string().min(1, 'Vui lòng chọn ngôn ngữ'),
  voiceId: z.string().min(1, 'Vui lòng chọn giọng đọc'),
  model: z.string().optional(),
});

const quickCreateAudioStatusSchema = z.enum(['idle', 'generating', 'uploading', 'uploaded', 'failed']);

const forcedAlignmentWordSchema = z.object({
  text: z.string().min(1, 'Thiếu từ căn chỉnh'),
  start: z.number(),
  end: z.number(),
  loss: z.number().optional(),
});

export const quickCreateFormSchema = z.object({
  title: titleSchema,
  artist: artistSchema,
  coverImage: z.string().optional(),
  script: scriptSchema,
  languageSelections: z.array(quickCreateLanguageItemSchema).min(1, 'Vui lòng chọn ít nhất một ngôn ngữ'),
});

const quickCreateTranslationEntrySchema = z.object({
  metadata: z.object({
    language: z.string().min(1, 'Thiếu thông tin ngôn ngữ'),
    voiceId: z.string().min(1, 'Thiếu thông tin giọng đọc'),
    voiceName: z.string().min(1, 'Thiếu thông tin tên giọng đọc'),
    model: z.string().min(1, 'Thiếu thông tin model giọng đọc'),
    audioStatus: quickCreateAudioStatusSchema,
    audioUrl: z.string().optional(),
    audioError: z.string().optional(),
  }),
  title: titleSchema,
  artist: artistSchema,
  coverImage: z.string().optional(),
  script: scriptSchema,
  words: z.array(forcedAlignmentWordSchema).optional(),
});

export const multiQuickCreateSchema = z.object({
  entries: z.array(quickCreateTranslationEntrySchema).min(1, 'Vui lòng tạo ít nhất một bản dịch trước khi tiếp tục'),
});

export type MultiQuickCreateValues = z.infer<typeof multiQuickCreateSchema>;
export type QuickCreateTranslationEntry = z.infer<typeof quickCreateTranslationEntrySchema>;
export type QuickCreateAudioStatus = z.infer<typeof quickCreateAudioStatusSchema>;
