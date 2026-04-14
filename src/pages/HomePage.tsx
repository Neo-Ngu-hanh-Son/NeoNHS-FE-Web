import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  Compass,
  Camera,
  Users,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Smartphone,
  Download,
  Map,
  Ticket,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Palette,
  Globe,
  Headphones,
} from 'lucide-react';

/* ============================================================
   DATA
   ============================================================ */

// Dữ liệu mẫu landmarks
const landmarks = [
  {
    id: 1,
    name: 'Chùa Linh Ứng',
    image:
      'https://danangfantasticity.com/wp-content/uploads/2019/09/chua-linh-ung-chon-binh-yen-giua-long-da-nang-013-2.jpg',
  },
  {
    id: 2,
    name: 'Ngũ Hành Sơn',
    image: 'https://res.cloudinary.com/dsrxsfr0q/image/upload/v1775755613/AboutNHSCover2_dynvk6.webp',
  },
  {
    id: 3,
    name: 'Động Âm Phủ',
    image: 'https://statics.vinpearl.com/Am-Phu-Cave-thumb_1753717235.jpg',
  },
  {
    id: 4,
    name: 'Động Huyền Không',
    image: 'https://statics.vinpearl.com/Huyen-Khong-Cave-in-Da-Nang_1753368020.jpg',
  },
];

// Các bước "Cách thức hoạt động"
const howItWorks = [
  {
    step: '01',
    icon: <Download className="w-6 h-6" />,
    title: 'Tải ứng dụng',
    description: 'Tải miễn phí ứng dụng NeoNHS trên iOS và Android. Đăng ký tài khoản chỉ trong 30 giây.',
    tags: ['Miễn phí', 'iOS & Android', 'Đăng ký nhanh'],
  },
  {
    step: '02',
    icon: <Map className="w-6 h-6" />,
    title: 'Khám phá địa điểm',
    description: 'Duyệt qua bản đồ thông minh với AI gợi ý lộ trình tối ưu phù hợp sở thích và thời gian của bạn.',
    tags: ['Bản đồ AI', 'Gợi ý thông minh', 'Panorama 360°'],
  },
  {
    step: '03',
    icon: <Ticket className="w-6 h-6" />,
    title: 'Đặt workshop',
    description:
      'Chọn và đặt vé tham gia các workshop trải nghiệm văn hoá truyền thống từ các nghệ nhân địa phương.',
    tags: ['Thanh toán an toàn', 'Xác nhận tức thì', 'E-ticket'],
  },
  {
    step: '04',
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Trải nghiệm & chia sẻ',
    description: 'Tận hưởng hành trình văn hoá trọn vẹn và chia sẻ khoảnh khắc đáng nhớ với cộng đồng.',
    tags: ['Đánh giá', 'Chia sẻ ảnh', 'Cộng đồng'],
  },
];

// Đánh giá từ du khách — đa dạng quốc tịch
const testimonials = [
  {
    id: 1,
    quote:
      '"Ứng dụng NeoNHS giúp tôi khám phá Ngũ Hành Sơn một cách hoàn toàn khác biệt. Lộ trình AI gợi ý rất chính xác với sở thích của tôi!"',
    name: 'Nguyễn Minh Anh',
    role: 'Du khách',
    location: '🇻🇳 Hà Nội, Việt Nam',
    avatar: 'NMA',
    avatarBg: 'bg-emerald-500',
    rating: 5,
    highlight: 'Tiết kiệm 80% thời gian',
  },
  {
    id: 2,
    quote:
      '"The Marble Mountains experience was magical. The AI guide talked us through every cave and temple in detail. Truly a must-have app for tourists!"',
    name: 'Sarah Johnson',
    role: 'Travel Blogger',
    location: '🇺🇸 New York, USA',
    avatar: 'SJ',
    avatarBg: 'bg-blue-500',
    rating: 5,
    highlight: 'Top #1 travel app',
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
  },
];

// FAQ data
const faqCategories = [
  { id: 'general', label: 'Tổng quan', icon: <Globe className="w-5 h-5" />, count: 3 },
  { id: 'booking', label: 'Đặt vé & Workshop', icon: <Ticket className="w-5 h-5" />, count: 3 },
  { id: 'features', label: 'Tính năng', icon: <Sparkles className="w-5 h-5" />, count: 3 },
];

const faqData: Record<string, { q: string; a: string }[]> = {
  general: [
    {
      q: 'NeoNHS là gì?',
      a: 'NeoNHS là hệ sinh thái du lịch thông minh kết nối du khách với các điểm tham quan, làng nghề truyền thống và workshop văn hoá tại khu vực Ngũ Hành Sơn, Đà Nẵng. Ứng dụng sử dụng công nghệ AI để cá nhân hoá trải nghiệm du lịch.',
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
      q: 'AI Guide có chính xác không?',
      a: 'AI Guide được phát triển dựa trên dữ liệu di sản đã được xác thực bởi các chuyên gia lịch sử và văn hoá địa phương. Nội dung được cập nhật thường xuyên để đảm bảo độ chính xác.',
    },
    {
      q: 'Tôi có thể giao tiếp với nghệ nhân qua ứng dụng không?',
      a: 'Có! NeoNHS tích hợp tính năng chat trực tiếp cho phép bạn trao đổi với các nghệ nhân và vendor trước, trong và sau khi tham gia workshop.',
    },
  ],
};

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ============================================================
   SECTION WRAPPER — scroll-triggered animations
   ============================================================ */

function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   PHONE VIDEO COMPONENT
   ============================================================ */

function PhoneVideoMockup() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);

  const handleVideoEnd = useCallback(() => {
    setShowWhiteFlash(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      setShowWhiteFlash(false);
    }, 300);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      return () => video.removeEventListener('ended', handleVideoEnd);
    }
  }, [handleVideoEnd]);

  return (
    <div className="phone-mockup animate-float">
      <div className="phone-mockup-screen relative">
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776095885/Screen_recording_20260413_225109_gfuaio.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* 0.3s white flash overlay between loops */}
        <div
          className={`absolute inset-0 bg-white transition-opacity duration-150 pointer-events-none ${showWhiteFlash ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>
    </div>
  );
}

/* ============================================================
   FAQ ACCORDION COMPONENT
   ============================================================ */

function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === i ? 'border-emerald-200 shadow-md' : 'border-slate-100 hover:border-slate-200'
            }`}
        >
          <button
            className="w-full flex items-center justify-between p-5 text-left"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            <span className="font-semibold text-slate-800 text-[15px] pr-4">{item.q}</span>
            <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
              {openIndex === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>
          <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
            <p className="px-5 pb-5 text-slate-500 leading-relaxed text-[15px]">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MAIN HOMEPAGE
   ============================================================ */

export function HomePage() {
  const [activeFaqCat, setActiveFaqCat] = useState('general');

  return (
    <div className="min-h-screen bg-page-gradient text-slate-900 selection:bg-primary/20 overflow-x-hidden">

      {/* ========== FLOATING PARTICLES (decorative) ========== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="particle" style={{ top: '15%', left: '10%' }} />
        <div className="particle" style={{ top: '40%', left: '55%' }} />
        <div className="particle" style={{ top: '70%', left: '80%' }} />
        <div className="particle" style={{ top: '25%', left: '75%' }} />
        <div className="particle" style={{ top: '60%', left: '20%' }} />
      </div>

      {/* ========================================
          SECTION 1 — HERO
          ======================================== */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-200/30 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/20 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Dark pill badge */}
            <div className="section-badge mb-8">
              <Smartphone className="w-4 h-4" />
              Nền tảng du lịch thông minh
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[3.5rem] font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-950">
              Khám phá di sản{' '}
              <span className="gradient-text">Ngũ Hành Sơn</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
              Hệ sinh thái thông minh kết nối du khách với những giá trị văn hóa
              và làng nghề truyền thống tại Đà Nẵng.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 hover:shadow-xl transition-all flex items-center gap-2 group">
                Bắt đầu hành trình
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                Tìm hiểu thêm
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                Miễn phí hoàn toàn
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                200+ nghệ nhân
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                AI hỗ trợ 24/7
              </span>
            </div>
          </motion.div>

          {/* Phone Video Mockup */}
          <div className="relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <PhoneVideoMockup />

              {/* Floating pop-out cards */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -right-4 top-12 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Điểm tham quan mới</p>
                  <p className="text-[11px] text-slate-400">Động Huyền Không</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="absolute -left-8 bottom-24 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold text-slate-800">99.9% Uptime</p>
                </div>
                <p className="text-[11px] text-slate-400">Sẵn sàng phục vụ</p>
              </motion.div>
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-200/20 blur-[80px] -z-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 2 — FEATURES BENTO GRID
          ======================================== */}
      <section className="py-24 px-6 relative">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="section-badge mx-auto mb-6">
              <Sparkles className="w-4 h-4" />
              Tính năng nổi bật
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Tất cả những gì bạn cần để{' '}
              <span className="gradient-text">khám phá di sản</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Từ lộ trình AI đến workshop văn hoá. Hệ sinh thái du lịch thông minh toàn diện.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* AI Chat – Large card with gradient */}
            <Card className="md:col-span-2 card-gradient-purple rounded-[2rem] p-8 text-white border-0 overflow-hidden relative group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Compass className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold mb-2">Lộ trình thông minh</h3>
                <p className="text-white/80 mb-6 max-w-md">
                  Sử dụng thuật toán AI để gợi ý lịch trình phù hợp nhất với sở thích và thời gian của bạn.
                </p>
                {/* Mini UI mockup */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/70">AI Guide</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs text-white/90">Gợi ý lộ trình</div>
                    <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs text-white/90">3 điểm • 4 giờ</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            </Card>

            {/* Workshops – Teal gradient */}
            <Card className="card-gradient-teal rounded-[2rem] p-8 text-white border-0 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">Workshop văn hoá</h3>
              <p className="text-white/80 text-sm">50+ workshop trải nghiệm từ nghệ nhân địa phương.</p>
              {/* File list mockup */}
              <div className="mt-6 space-y-2">
                {['Chạm khắc đá', 'Làm gốm sứ', 'Vẽ tranh non nước'].map((name) => (
                  <div key={name} className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px]">🎨</div>
                    <span className="text-xs text-white/90">{name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community – small card */}
            <Card className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Cộng đồng nghệ nhân</h3>
              <p className="text-slate-500 text-sm">
                Kết nối trực tiếp với hơn 200+ nghệ nhân bản địa giữ gìn nghề truyền thống.
              </p>
            </Card>

            {/* Secure – small card */}
            <Card className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Dữ liệu xác thực</h3>
              <p className="text-slate-500 text-sm">
                Thông tin di sản được xác thực chính xác bởi chuyên gia lịch sử & văn hoá.
              </p>
            </Card>

            {/* Panorama 360° – Orange gradient */}
            <Card className="card-gradient-orange rounded-[2rem] p-8 text-white border-0 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">Panorama 360°</h3>
              <p className="text-white/80 text-sm mb-4">
                Tham quan ảo các danh thắng với công nghệ ảnh 360° sống động.
              </p>
              <div className="bg-white/10 rounded-xl px-3 py-2 inline-flex items-center gap-2 text-xs text-white/90">
                <Camera className="w-3 h-3" /> Xem panorama →
              </div>
            </Card>
          </motion.div>

          {/* Explore all CTA */}
          <motion.div variants={fadeUp} className="text-center mt-12">
            <button className="section-badge hover:bg-slate-800 transition-colors cursor-pointer">
              Khám phá tất cả tính năng <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ========================================
          SECTION 3 — BENTO: LANDMARK IMAGES
          ======================================== */}
      <section className="py-12 px-6">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            className="bg-white/60 backdrop-blur-sm p-6 md:p-8 rounded-[3rem] border border-slate-200/60 shadow-inner"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[220px]">
              {landmarks.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02 }}
                  className={`${index === 0 ? 'md:col-span-2' : ''} relative rounded-[2rem] overflow-hidden shadow-md group cursor-pointer`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <MapPin className="w-3 h-3" /> Đà Nẵng, Việt Nam
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ========================================
          SECTION 4 — HOW IT WORKS
          ======================================== */}
      <section className="py-24 px-6 relative">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-20">
            <div className="section-badge mx-auto mb-6">
              ▶ Cách thức hoạt động
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Từ tải app đến{' '}
              <span className="gradient-text">trải nghiệm di sản</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Quy trình 4 bước đơn giản giúp bạn khám phá Ngũ Hành Sơn một cách trọn vẹn.
            </p>
          </motion.div>

          <div className="space-y-20">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                {/* Text side */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-black text-slate-200">{step.step}</span>
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-600 mb-4">{step.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed mb-6 max-w-md">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-600 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual side — placeholder mockup card */}
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-4">
                    {index === 0 && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-800">Tải ứng dụng</span>
                          <span className="text-xs text-slate-400">0/2</span>
                        </div>
                        {['iOS App Store', 'Google Play Store'].map((store) => (
                          <div key={store} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                              <Download className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{store}</p>
                              <p className="text-xs text-slate-400">Miễn phí</p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center"><Map className="w-4 h-4" /></div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">AI Guide</p>
                            <p className="text-xs text-slate-400">Đang phân tích...</p>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                        </div>
                        <div className="space-y-2 text-sm text-slate-500">
                          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] flex items-center justify-center font-bold">1</div> Phân tích sở thích</div>
                          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] flex items-center justify-center font-bold">2</div> Tạo lộ trình tối ưu</div>
                          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-[10px] flex items-center justify-center font-bold">3</div> Gợi ý workshop</div>
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Ticket className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm font-bold text-slate-800">Đặt workshop</span>
                        </div>
                        {['Chạm khắc đá — 250.000đ', 'Làm gốm truyền thống — 180.000đ'].map((ws) => (
                          <div key={ws} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                            <span className="text-sm text-slate-700">{ws}</span>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Đặt vé</span>
                          </div>
                        ))}
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm font-bold text-slate-800">Trải nghiệm</span>
                        </div>
                        <div className="flex gap-2">
                          {[5, 5, 5, 5, 5].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-sm text-slate-500 italic">"Trải nghiệm tuyệt vời, tôi đã học chạm khắc đá từ nghệ nhân!"</p>
                        <div className="flex items-center gap-2 pt-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">DK</div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Du khách</p>
                            <p className="text-[11px] text-slate-400">Vừa đánh giá</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTAs after How It Works */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mt-16">
            <button className="px-8 py-4 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 group">
              Bắt đầu miễn phí <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              ▶ Xem demo
            </button>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ========================================
          SECTION 5 — TESTIMONIALS / SOCIAL PROOF
          ======================================== */}
      <section className="py-24 px-6 relative">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="section-badge mx-auto mb-6">
              <Star className="w-4 h-4" />
              Khách hàng nói gì
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Được yêu thích bởi{' '}
              <span className="gradient-text">hàng nghìn du khách</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Xem cách du khách từ khắp nơi trên thế giới trải nghiệm Ngũ Hành Sơn cùng NeoNHS.
            </p>
          </motion.div>

          {/* Testimonial Grid — masonry-style */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Testimonial 1 — large */}
            <div className="md:col-span-1 md:row-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 testimonial-card shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">Việt Nam</span>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-800 text-[15px] leading-relaxed mb-6">{testimonials[0].quote}</p>
                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {testimonials[0].highlight}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full ${testimonials[0].avatarBg} text-white flex items-center justify-center text-sm font-bold`}>
                  {testimonials[0].avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{testimonials[0].name}</p>
                  <p className="text-xs text-slate-400">{testimonials[0].location}</p>
                </div>
              </div>
            </div>

            {/* Stats Card — dark */}
            <div className="card-gradient-dark rounded-[2rem] p-8 text-white border border-white/5 flex flex-col justify-center">
              <p className="text-sm text-white/50 font-medium mb-6">Được tin tưởng bởi</p>
              <div className="space-y-5">
                {[
                  { icon: <Users className="w-5 h-5" />, value: '10K+', label: 'Du khách' },
                  { icon: <Palette className="w-5 h-5" />, value: '5K+', label: 'Workshop hoàn thành' },
                  { icon: <Globe className="w-5 h-5" />, value: '99.9%', label: 'Uptime' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial 2 — USA */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-7 testimonial-card shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-full ${testimonials[1].avatarBg} text-white flex items-center justify-center text-xs font-bold`}>
                  {testimonials[1].avatar}
                </div>
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">{testimonials[1].quote}</p>
              <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {testimonials[1].highlight}
              </span>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-800">{testimonials[1].name}</p>
                <span className="text-xs text-slate-400">• {testimonials[1].role}</span>
              </div>
            </div>

            {/* Testimonial 3 — Korea */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-7 testimonial-card shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-full ${testimonials[2].avatarBg} text-white flex items-center justify-center text-xs font-bold`}>
                  {testimonials[2].avatar}
                </div>
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">{testimonials[2].quote}</p>
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                {testimonials[2].highlight}
              </span>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-800">{testimonials[2].name}</p>
                <span className="text-xs text-slate-400">• {testimonials[2].location}</span>
              </div>
            </div>

            {/* Testimonial 4 — China */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-7 testimonial-card shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-full ${testimonials[3].avatarBg} text-white flex items-center justify-center text-xs font-bold`}>
                  {testimonials[3].avatar}
                </div>
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">{testimonials[3].quote}</p>
              <span className="inline-flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {testimonials[3].highlight}
              </span>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-800">{testimonials[3].name}</p>
                <span className="text-xs text-slate-400">• {testimonials[3].location}</span>
              </div>
            </div>
          </motion.div>

          {/* Trust bar */}
          <motion.div variants={fadeUp} className="text-center mt-16">
            <p className="text-sm text-slate-400 mb-6">Được tin tưởng bởi các đối tác du lịch hàng đầu</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-slate-300 font-bold text-lg">
              {['Đà Nẵng Tourism', 'FPT University', 'VinWonders', 'APEC Park', 'Sun World', 'Cocobay'].map((name) => (
                <span key={name} className="hover:text-slate-500 transition-colors cursor-default">{name}</span>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ========================================
          SECTION 6 — FAQ
          ======================================== */}
      <section className="py-24 px-6 relative">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-200/20 blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-200/15 blur-[100px] rounded-full -z-10" />

        <AnimatedSection className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="section-badge mx-auto mb-6">
              ❓ Câu hỏi thường gặp
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Giải đáp{' '}
              <span className="gradient-text-cool">thắc mắc</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Tất cả thông tin bạn cần về NeoNHS. Liên hệ chúng tôi nếu chưa tìm được câu trả lời.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Category sidebar */}
            <div className="space-y-3">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqCat(cat.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all ${activeFaqCat === cat.id
                    ? 'bg-white shadow-md border-l-4 border-emerald-500 text-slate-900'
                    : 'bg-transparent hover:bg-white/60 text-slate-500'
                    }`}
                >
                  <span className={activeFaqCat === cat.id ? 'text-emerald-600' : 'text-slate-400'}>{cat.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{cat.label}</p>
                    <p className="text-xs text-slate-400">{cat.count} câu hỏi</p>
                  </div>
                </button>
              ))}

              {/* Quick stats */}
              <div className="card-gradient-dark rounded-2xl p-5 text-white mt-4">
                <p className="text-xs text-white/50 mb-2">Thống kê</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold">9</p>
                    <p className="text-xs text-white/50">Tổng FAQ</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-white/50">Danh mục</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                {faqCategories.find((c) => c.id === activeFaqCat)?.icon}
                <div>
                  <h3 className="font-bold text-slate-800">{faqCategories.find((c) => c.id === activeFaqCat)?.label}</h3>
                  <p className="text-xs text-slate-400">
                    {faqCategories.find((c) => c.id === activeFaqCat)?.count} câu hỏi trong danh mục này
                  </p>
                </div>
              </div>
              <FaqAccordion items={faqData[activeFaqCat]} />
            </div>
          </motion.div>

          {/* Still have questions? */}
          <motion.div
            variants={fadeUp}
            className="mt-12 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Vẫn còn thắc mắc?</p>
                <p className="text-sm text-slate-400">Đội ngũ hỗ trợ sẵn sàng giúp đỡ bạn.</p>
              </div>
            </div>
            <button className="px-6 py-3 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
              Liên hệ hỗ trợ <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ========================================
          SECTION 7 — DARK CTA (before footer)
          ======================================== */}
      <section className="bg-dark-cta py-24 px-6 text-white relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-full" />

        <AnimatedSection className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-white/10 border border-white/10 text-white/90 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Tham gia cùng 500+ du khách đang sử dụng NeoNHS
            </div>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Biến hành trình du lịch thành
            <br />
            <span className="gradient-text">trải nghiệm đáng nhớ</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-white/50 text-lg max-w-2xl mx-auto mb-10">
            Dừng tìm kiếm, bắt đầu khám phá. NeoNHS sử dụng AI để biến hành trình thăm Ngũ Hành Sơn thành ký ức không thể quên.
          </motion.p>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="flex justify-center gap-12 md:gap-20 mb-12">
            {[
              { value: '10K+', label: 'Du khách mỗi tháng' },
              { value: '99.9%', label: 'Uptime đảm bảo' },
              { value: '50%', label: 'Thời gian tiết kiệm' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center gap-2 group">
              Bắt đầu miễn phí <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/15 transition-all backdrop-blur-sm">
              Xem cách hoạt động
            </button>
          </motion.div>

          {/* Trust signals */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            {['Miễn phí mãi mãi', 'Không cần thẻ tín dụng', 'Bắt đầu trong 5 phút'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {item}
              </span>
            ))}
          </motion.div>
        </AnimatedSection>
      </section>
    </div>
  );
}