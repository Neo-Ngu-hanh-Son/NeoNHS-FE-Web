export const DEFAULT_TEXT = `Chào mừng đến với Ngũ Hành Sơn — cụm năm ngọn núi đá vôi và đá cẩm thạch tại quận Ngũ Hành Sơn, Đà Nẵng, Việt Nam. Năm ngọn được đặt theo ngũ hành: Kim, Thủy, Mộc, Hỏa, Thổ. Ngọn lớn và nổi tiếng nhất là Thủy Sơn, nơi có nhiều chùa Phật giáo và hang động.`;

export const ELEVEN_LABS_MODELS = [
  {
    id: "eleven_multilingual_v2",
    name: "Eleven đa ngôn ngữ v2",
    language: "Đa ngôn ngữ",
  },
] as const;

export type ElevenLabVoice = {
  id: string;
  name: string;
  gender: "Male" | "Female";
  language: string;
  sampleAudio: string;
  model: string;
};

export const ELEVEN_LABS_VOICES: ElevenLabVoice[] = [
  // {
  //   id: "jdlxsPOZOHdGEfcItXVu",
  //   name: "Hien",
  //   gender: "Female",
  //   language: "Vietnamese",
  // },
  // {
  //   id: "UsgbMVmY3U59ijwK5mdh",
  //   name: "Trieu Duong",
  //   gender: "Male",
  //   language: "Vietnamese",
  // },
  // {
  //   id: "pNInz6obpgDQGcFmaJgB",
  //   name: "Adam (Nam, tiếng Anh)",
  //   gender: "Male",
  //   language: "en", // Giọng trầm, phù hợp phim tài liệu
  // },
  // {
  //   id: "21m00Tcm4TlvDq8ikWAM",
  //   name: "Rachel (Nữ, tiếng Anh)",
  //   gender: "Female",
  //   language: "en", // Giọng điềm, rõ ràng, phù hợp thiên nhiên/lịch sử
  // },

  // ENGLISH VOICES
  {
    id: "alFofuDn3cOwyoz1i44T",
    name: "Dallin (Nam, tiếng Anh)",
    gender: "Male",
    language: "en",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702614/voice_preview_dallin_-_positive_inspiring_and_clear_cvkh8m.mp3",
    model: "eleven_multilingual_v2",
  },
  {
    id: "lxYfHSkYm1EzQzGhdbfc",
    name: "Jessica (Nữ, tiếng Anh)",
    gender: "Female",
    language: "en",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702614/voice_preview_jessica_anne_bogart_-_a_vo_professional_now_cloned_ggpk1p.mp3",
    model: "eleven_multilingual_v2",
  },

  // VIETNAMESE VOICES
  {
    id: "ywBZEqUhld86Jeajq94o",
    name: "Anh (Nam, tiếng Việt)",
    gender: "Male",
    language: "vn",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702614/voice_preview_anh_-_warm_calm_and_deep_vwrl9q.mp3",
    model: "eleven_turbo_v2_5",
  },
  {
    id: "jdlxsPOZOHdGEfcItXVu",
    name: "Hiền (Nữ, tiếng Việt)",
    gender: "Female",
    language: "vn",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702615/voice_preview_hien_-_warm_and_deep_broadcaster_rqfpu4.mp3",
    model: "eleven_turbo_v2_5",
  },

  // JAPANESE VOICES
  {
    id: "3JDquces8E8bkmvbh6Bc",
    name: "Otani (Nam, tiếng Nhật)",
    gender: "Male",
    language: "jp",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702615/voice_preview_otani_-_inviting_clear_and_measured_zbpzex.mp3",
    model: "eleven_multilingual_v2",
  },
  {
    id: "fUjY9K2nAIwlALOwSiwc",
    name: "Yui (Nữ, tiếng Nhật)",
    gender: "Female",
    language: "jp",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702615/voice_preview_yui_-_warm_clear_and_natural_kzk1yx.mp3",
    model: "eleven_multilingual_v2",
  },
  // KOREAN VOICES
  {
    id: "WqVy7827vjE2r3jWvbnP",
    name: "Hyuk (Nam, tiếng Hàn)",
    gender: "Male",
    language: "kr",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702615/voice_preview_hyuk_-_encourging_and_clear_rocn7j.mp3",
    model: "eleven_multilingual_v2",
  },
  {
    id: "8MwPLtBplylvbrksiBOC",
    name: "Chungman (Nữ, tiếng Hàn)",
    gender: "Female",
    language: "kr",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702615/voice_preview_chungman_-_meditative_clear_and_soft_edptgz.mp3",
    model: "eleven_multilingual_v2",
  },

  // CHINESE VOICES
  {
    id: "W8lBaQb9YIoddhxfQNLP",
    name: "Siqi Liu (Nam, tiếng Trung Quốc)",
    gender: "Male",
    language: "cn",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702616/voice_preview_siqi_liu_-_calm_warm_and_gentle_mjz2yu.mp3",
    model: "eleven_multilingual_v2",
  },
  {
    id: "r6qgCCGI7RWKXCagm158",
    name: "Anna Su (Nữ, tiếng Trung Quốc)",
    gender: "Female",
    language: "cn",
    sampleAudio: "https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776702615/voice_preview_anna_su_-_trustworthy_clear_and_natural_zf49qa.mp3",
    model: "eleven_multilingual_v2",
  },

] as const;
