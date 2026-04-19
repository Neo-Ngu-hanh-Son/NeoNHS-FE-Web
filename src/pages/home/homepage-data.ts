/* ============================================================
   TYPES
   ============================================================ */

export interface Landmark {
  id: number;
  name: string;
  alt: string;
  image: string;
}

export interface HowItWorksStep {
  step: string;
  iconName: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  avatarBg: string;
  rating: number;
  highlight: string;
  highlightBg: string;
  highlightText: string;
  highlightDot: string;
}

export interface FaqCategory {
  id: string;
  label: string;
  iconName: string;
  count: number;
}

/* ============================================================
   LANDMARKS
   ============================================================ */

export const landmarks: Landmark[] = [
  {
    id: 1,
    name: 'Chùa Linh Ứng',
    alt: 'Toàn cảnh chùa Linh Ứng với tượng Quán Thế Âm trên bán đảo Sơn Trà',
    image:
      'https://danangfantasticity.com/wp-content/uploads/2019/09/chua-linh-ung-chon-binh-yen-giua-long-da-nang-013-2.jpg',
  },
  {
    id: 2,
    name: 'Ngũ Hành Sơn',
    alt: 'Quang cảnh núi Ngũ Hành Sơn với các hang động và chùa chiền',
    image: 'https://res.cloudinary.com/dsrxsfr0q/image/upload/v1775755613/AboutNHSCover2_dynvk6.webp',
  },
  {
    id: 3,
    name: 'Động Âm Phủ',
    alt: 'Lối vào Động Âm Phủ bên trong Ngũ Hành Sơn',
    image: 'https://statics.vinpearl.com/Am-Phu-Cave-thumb_1753717235.jpg',
  },
  {
    id: 4,
    name: 'Động Huyền Không',
    alt: 'Bên trong Động Huyền Không với ánh sáng chiếu qua vòm đá',
    image: 'https://statics.vinpearl.com/Huyen-Khong-Cave-in-Da-Nang_1753368020.jpg',
  },
];

/* ============================================================
   HOW IT WORKS
   ============================================================ */

export const howItWorks: HowItWorksStep[] = [
  {
    step: '01',
    iconName: 'Download',
    title: 'Tải ứng dụng',
    description: 'Tải miễn phí ứng dụng NeoNHS trên iOS và Android. Đăng ký tài khoản chỉ trong 30 giây.',
    tags: ['Miễn phí', 'iOS & Android', 'Đăng ký nhanh'],
  },
  {
    step: '02',
    iconName: 'Map',
    title: 'Khám phá bản đồ',
    description: 'Tương tác với bản đồ thông minh để tìm đường, check-in tại các địa điểm đẹp và trải nghiệm panorama 360° ngay trên ứng dụng.',
    tags: ['Bản đồ tương tác', 'Check-in', 'Panorama 360°', 'Chỉ đường'],
  },
  {
    step: '03',
    iconName: 'Ticket',
    title: 'Đặt workshop & sự kiện',
    description:
      'Đặt vé tham gia workshop văn hoá truyền thống và các sự kiện lớn như Lễ hội Quán Thế Âm với những chương trình hấp dẫn, độc đáo.',
    tags: ['Workshop', 'Sự kiện lễ hội', 'E-ticket', 'Thanh toán an toàn'],
  },
  {
    step: '04',
    iconName: 'Sparkles',
    title: 'Trải nghiệm & chia sẻ',
    description: 'Tận hưởng hành trình văn hoá trọn vẹn và chia sẻ khoảnh khắc đáng nhớ với cộng đồng.',
    tags: ['Đánh giá', 'Chia sẻ ảnh', 'Cộng đồng'],
  },
];

/* ============================================================
   TESTIMONIALS
   ============================================================ */

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      '"Ứng dụng NeoNHS giúp tôi khám phá Ngũ Hành Sơn một cách hoàn toàn khác biệt. Bản đồ tương tác và panorama 360° thực sự ấn tượng!"',
    name: 'Nguyễn Minh Anh',
    role: 'Du khách',
    location: '🇻🇳 Hà Nội, Việt Nam',
    avatar: 'NMA',
    avatarBg: 'bg-emerald-500',
    rating: 5,
    highlight: 'Tiết kiệm 80% thời gian',
    highlightBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    highlightText: 'text-emerald-700 dark:text-emerald-400',
    highlightDot: 'bg-emerald-500',
  },
  {
    id: 2,
    quote:
      '"The Marble Mountains experience was magical. The interactive map and 360° panorama guided us through every cave and temple. A must-have app for tourists!"',
    name: 'Sarah Johnson',
    role: 'Travel Blogger',
    location: '🇺🇸 New York, USA',
    avatar: 'SJ',
    avatarBg: 'bg-blue-500',
    rating: 5,
    highlight: 'Top #1 travel app',
    highlightBg: 'bg-blue-50 dark:bg-blue-500/10',
    highlightText: 'text-blue-700 dark:text-blue-400',
    highlightDot: 'bg-blue-500',
  },
  {
    id: 3,
    quote:
      '"워크숍에서 전통 석재 조각을 배웠는데, 정말 특별한 경험이었어요. 앱이 한국어도 지원해서 편리했습니다."',
    name: '김지현 (Kim Ji-hyun)',
    role: 'Photographer',
    location: '🇰🇷 Seoul, Hàn Quốc',
    avatar: 'KJ',
    avatarBg: 'bg-purple-500',
    rating: 5,
    highlight: 'Đa ngôn ngữ',
    highlightBg: 'bg-purple-50 dark:bg-purple-500/10',
    highlightText: 'text-purple-700 dark:text-purple-400',
    highlightDot: 'bg-purple-500',
  },
  {
    id: 4,
    quote:
      '"这个平台让我发现了岘港最美的一面。大理石山的全景VR太震撼了！强烈推荐给所有来越南旅游的朋友。"',
    name: '王小明 (Wang Xiaoming)',
    role: 'Photographer',
    location: '🇨🇳 Thượng Hải, Trung Quốc',
    avatar: 'WX',
    avatarBg: 'bg-orange-500',
    rating: 5,
    highlight: 'VR tuyệt vời',
    highlightBg: 'bg-orange-50 dark:bg-orange-500/10',
    highlightText: 'text-orange-700 dark:text-orange-400',
    highlightDot: 'bg-orange-500',
  },
];

/* ============================================================
   FAQ
   ============================================================ */

export const faqCategories: FaqCategory[] = [
  { id: 'general', label: 'Tổng quan', iconName: 'Globe', count: 3 },
  { id: 'booking', label: 'Đặt vé & Workshop', iconName: 'Ticket', count: 3 },
  { id: 'features', label: 'Tính năng', iconName: 'Sparkles', count: 3 },
];

export const faqData: Record<string, { q: string; a: string }[]> = {
  general: [
    {
      q: 'NeoNHS là gì?',
      a: 'NeoNHS là hệ sinh thái du lịch thông minh kết nối du khách với các điểm tham quan, làng nghề truyền thống, workshop văn hoá và sự kiện lễ hội tại khu vực Ngũ Hành Sơn, Đà Nẵng. Ứng dụng tích hợp bản đồ tương tác, check-in và panorama 360°.',
    },
    {
      q: 'Ứng dụng có miễn phí không?',
      a: 'Hoàn toàn miễn phí! Bạn có thể tải ứng dụng trên iOS và Android mà không tốn bất kỳ chi phí nào. Một số workshop trải nghiệm sẽ có phí tham gia riêng.',
    },
    {
      q: 'NeoNHS hỗ trợ ngôn ngữ nào?',
      a: 'Hiện tại ứng dụng hỗ trợ Tiếng Việt, Tiếng Anh, Tiếng Hàn và Tiếng Trung. Chúng tôi đang mở rộng thêm các ngôn ngữ khác trong tương lai.',
    },
  ],
  booking: [
    {
      q: 'Làm sao để đặt vé tham gia workshop?',
      a: 'Chọn workshop bạn muốn tham gia, chọn ngày giờ phù hợp và thanh toán trực tuyến. Bạn sẽ nhận e-ticket ngay lập tức qua email và trong ứng dụng.',
    },
    {
      q: 'Tôi có thể huỷ vé không?',
      a: 'Bạn có thể huỷ vé miễn phí trước 24 giờ so với lịch workshop. Sau thời hạn đó, chính sách hoàn tiền sẽ tuỳ thuộc vào từng vendor cung cấp workshop.',
    },
    {
      q: 'Phương thức thanh toán nào được hỗ trợ?',
      a: 'Chúng tôi hỗ trợ thanh toán qua thẻ Visa/Mastercard, chuyển khoản ngân hàng, các ví điện tử phổ biến (MoMo, ZaloPay, VNPay) và thanh toán tại chỗ.',
    },
  ],
  features: [
    {
      q: 'Tính năng Panorama 360° hoạt động như thế nào?',
      a: 'Chúng tôi sử dụng công nghệ chụp ảnh 360° để tái tạo các địa điểm tham quan. Bạn có thể "đi dạo" ảo trong các hang động, chùa chiền mà không cần di chuyển thực tế.',
    },
    {
      q: 'Thông tin trên ứng dụng có chính xác không?',
      a: 'Toàn bộ nội dung di sản trên NeoNHS được xác thực bởi các chuyên gia lịch sử và văn hoá địa phương. Dữ liệu bản đồ và thông tin điểm tham quan được cập nhật thường xuyên để đảm bảo độ chính xác.',
    },
    {
      q: 'Tôi có thể giao tiếp với nghệ nhân qua ứng dụng không?',
      a: 'Có! NeoNHS tích hợp tính năng chat trực tiếp cho phép bạn trao đổi với các nghệ nhân và vendor trước, trong và sau khi tham gia workshop.',
    },
  ],
};

/* ============================================================
   PARTNER NAMES
   ============================================================ */

export const partners = [
  'Đà Nẵng Tourism',
  'FPT University',
  'VinWonders',
  'APEC Park',
  'Sun World',
  'Cocobay',
];

/* ============================================================
   TRUST SIGNALS
   ============================================================ */

export const heroTrustSignals = ['Miễn phí hoàn toàn', '200+ nghệ nhân', 'Panorama 360°'];

export const ctaTrustSignals = ['Miễn phí mãi mãi', 'Không cần thẻ tín dụng', 'Bắt đầu trong 5 phút'];

export const ctaStats = [
  { value: '10K+', label: 'Du khách mỗi tháng' },
  { value: '99.9%', label: 'Uptime đảm bảo' },
  { value: '50%', label: 'Thời gian tiết kiệm' },
];
