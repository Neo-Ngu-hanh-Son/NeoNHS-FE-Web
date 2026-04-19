import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  Compass,
  Camera,
  Users,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Smartphone,
  Download,
  Map,
  Ticket,
  Sparkles,
  Star,
  MessageCircle,
  Palette,
  Globe,
  Headphones,
  Zap,
} from 'lucide-react';

import { AnimatedSection } from './home/components/AnimatedSection';
import { PhoneVideoMockup } from './home/components/PhoneVideoMockup';
import { FaqAccordion } from './home/components/FaqAccordion';
import { TestimonialCard } from './home/components/TestimonialCard';
import { IconByName } from './home/components/IconMap';
import { AnimatedCounter } from './home/components/AnimatedCounter';
import {
  landmarks,
  howItWorks,
  testimonials,
  faqCategories,
  faqData,
  partners,
  heroTrustSignals,
  ctaTrustSignals,
  ctaStats,
} from './home/homepage-data';

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

/* ============================================================
   STEP MOCKUPS — each "How It Works" step visual
   ============================================================ */

function StepMockup({ index }: { index: number }) {
  const cardCls =
    'w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 space-y-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl';

  if (index === 0) {
    return (
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Tải ứng dụng</span>
          <span className="text-xs text-slate-400">0/2</span>
        </div>
        {['iOS App Store', 'Google Play Store'].map((store) => (
          <div key={store} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{store}</p>
              <p className="text-xs text-slate-400">Miễn phí</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className={cardCls}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
            <Map className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Bản đồ tương tác</p>
            <p className="text-xs text-slate-400">Khám phá ngay</p>
          </div>
        </div>
        {/* Mini map placeholder */}
        <div className="w-full h-24 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-violet-500 animate-pulse-dot" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-4 left-1/2 w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot" style={{ animationDelay: '1s' }} />
          </div>
          <MapPin className="w-6 h-6 text-emerald-500 animate-bounce-subtle" />
        </div>
        <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          {[
            { icon: '📍', text: 'Chỉ đường đến điểm tham quan' },
            { icon: '✅', text: 'Check-in địa điểm đẹp' },
            { icon: '🌐', text: 'Panorama 360° sống động' },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2">
              <span className="text-sm">{s.icon}</span>
              {s.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className={cardCls}>
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Workshop & Sự kiện</span>
        </div>
        {[
          { name: 'Chạm khắc đá mĩ nghệ', price: '250.000đ', tag: 'Workshop' },
          { name: 'Lễ hội Quán Thế Âm', price: 'Miễn phí', tag: 'Sự kiện' },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
          >
            <div>
              <span className="text-sm text-slate-700 dark:text-slate-300 block">{item.name}</span>
              <span className="text-xs text-slate-400">{item.price}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              item.tag === 'Sự kiện'
                ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400'
                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            }`}>
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Trải nghiệm</span>
      </div>
      <div className="flex gap-2" role="img" aria-label="5 trên 5 sao">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 italic">
        "Trải nghiệm tuyệt vời, tôi đã học chạm khắc đá từ nghệ nhân!"
      </p>
      <div className="flex items-center gap-2 pt-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
          DK
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Du khách</p>
          <p className="text-[11px] text-slate-400">Vừa đánh giá</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN HOMEPAGE
   ============================================================ */

export function HomePage() {
  const [activeFaqCat, setActiveFaqCat] = useState('general');

  return (
    <div className="min-h-screen bg-page-gradient text-slate-900 dark:text-slate-100 selection:bg-primary/20 overflow-x-hidden">
      <main>
        {/* ========== FLOATING PARTICLES (decorative) — enhanced ========== */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {[
            { pos: 'top-[8%] left-[5%]', size: 'particle-lg' },
            { pos: 'top-[15%] left-[55%]', size: 'particle-md' },
            { pos: 'top-[35%] left-[85%]', size: 'particle-sm' },
            { pos: 'top-[50%] left-[12%]', size: 'particle-md' },
            { pos: 'top-[65%] left-[70%]', size: 'particle-lg' },
            { pos: 'top-[22%] left-[35%]', size: 'particle-sm' },
            { pos: 'top-[78%] left-[25%]', size: 'particle-md' },
            { pos: 'top-[45%] left-[92%]', size: 'particle-sm' },
            { pos: 'top-[88%] left-[60%]', size: 'particle-lg' },
            { pos: 'top-[5%] left-[78%]', size: 'particle-md' },
          ].map((p, i) => (
            <div key={i} className={`particle absolute ${p.pos} ${p.size}`} />
          ))}
        </div>

        {/* =============================================
            SECTION 1 — HERO
            ============================================= */}
        <section className="relative pt-28 pb-20 px-6 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-purple-300/25 dark:bg-purple-900/20 rounded-full -z-10 gradient-orb gradient-orb-1" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/20 dark:bg-emerald-900/15 rounded-full -z-10 gradient-orb gradient-orb-2" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-200/15 dark:bg-cyan-900/10 rounded-full -z-10 gradient-orb gradient-orb-3" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Animated badge */}
              <motion.div
                className="section-badge mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Smartphone className="w-4 h-4" />
                Nền tảng du lịch thông minh
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-[3.5rem] font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-950 dark:text-white">
                Khám phá di sản{' '}
                <span className="gradient-text gradient-text-animated">Ngũ Hành Sơn</span>
              </h1>

              <motion.p
                className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mb-10 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Hệ sinh thái thông minh kết nối du khách với những giá trị văn hóa
                và làng nghề truyền thống tại Đà Nẵng.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/about-us"
                  className="btn-shimmer px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
                >
                  Bắt đầu hành trình
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about-us"
                  className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                >
                  Tìm hiểu thêm
                </Link>
              </motion.div>

              {/* Trust signals with pulsing dots */}
              <motion.div
                className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {heroTrustSignals.map((text, i) => (
                  <span key={text} className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center relative">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span
                        className="absolute inset-0 rounded-full bg-emerald-400/30 animate-pulse-dot"
                        style={{ animationDelay: `${i * 0.5}s` }}
                      />
                    </span>
                    {text}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Phone Video Mockup with floating cards */}
            <div className="relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <PhoneVideoMockup />

                {/* Floating pop-out cards — hidden on mobile, continuous bob animation */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="hidden lg:flex absolute -right-4 top-12 animate-float-bob bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 px-4 py-3 items-center gap-3 backdrop-blur-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Điểm tham quan mới</p>
                    <p className="text-[11px] text-slate-400">Động Huyền Không</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="hidden lg:block absolute -left-8 bottom-24 animate-float-bob-reverse bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">99.9% Uptime</p>
                  </div>
                  <p className="text-[11px] text-slate-400">Sẵn sàng phục vụ</p>
                </motion.div>

                {/* Third floating card — rating */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="hidden lg:flex absolute -right-2 bottom-16 animate-float-bob bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 px-4 py-3 items-center gap-2 backdrop-blur-sm"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">4.9/5</span>
                </motion.div>
              </motion.div>

              {/* Animated glow behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-200/20 dark:bg-violet-900/15 -z-10 rounded-full gradient-orb gradient-orb-3" />
            </div>
          </div>
        </section>

        {/* =============================================
            SECTION 2 — FEATURES BENTO GRID
            ============================================= */}
        <section className="py-24 px-6 relative">
          <AnimatedSection className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <div className="section-badge mx-auto mb-6">
                <Sparkles className="w-4 h-4" />
                Tính năng nổi bật
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                Tất cả những gì bạn cần để{' '}
                <span className="gradient-text gradient-text-animated">khám phá di sản</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Từ bản đồ tương tác đến workshop &amp; sự kiện văn hoá. Hệ sinh thái du lịch thông minh toàn diện.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Smart Map – Large card with gradient + shine effect */}
              <Card className="md:col-span-2 card-gradient-purple card-gradient-shine rounded-[2rem] p-8 text-white border-0 overflow-hidden relative group cursor-pointer">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Compass className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2">Bản đồ tương tác</h3>
                  <p className="text-white/80 mb-6 max-w-md">
                    Khám phá bản đồ thông minh với chỉ đường, check-in tại các địa điểm đẹp và trải nghiệm panorama 360° sống động.
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                      <span className="text-xs text-white/70">Bản đồ thông minh</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs text-white/90">Chỉ đường</div>
                      <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs text-white/90">Check-in</div>
                      <div className="bg-white/15 rounded-lg px-3 py-1.5 text-xs text-white/90">360°</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </Card>

              {/* Workshops & Events – Teal gradient + shine */}
              <Card className="card-gradient-teal card-gradient-shine rounded-[2rem] p-8 text-white border-0 relative overflow-hidden group cursor-pointer">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-2">Workshop & Sự kiện</h3>
                  <p className="text-white/80 text-sm">Workshop nghề truyền thống và các sự kiện lễ hội lớn.</p>
                  <div className="mt-6 space-y-2">
                    {[
                      { emoji: '🎨', name: 'Chạm khắc đá mĩ nghệ' },
                      { emoji: '🏮', name: 'Lễ hội Quán Thế Âm' },
                      { emoji: '🎭', name: 'Sự kiện văn hoá đặc sắc' },
                    ].map((item) => (
                      <div key={item.name} className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2 hover:bg-white/20 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px]">
                          {item.emoji}
                        </div>
                        <span className="text-xs text-white/90">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Community — hover glow */}
              <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-8 flex flex-col card-hover-glow cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Cộng đồng nghệ nhân</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Kết nối trực tiếp với hơn 200+ nghệ nhân bản địa giữ gìn nghề truyền thống.
                </p>
              </Card>

              {/* Secure — hover glow */}
              <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-8 flex flex-col card-hover-glow cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Dữ liệu xác thực</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Thông tin di sản được xác thực chính xác bởi chuyên gia lịch sử &amp; văn hoá.
                </p>
              </Card>

              {/* Panorama 360° – Orange gradient + shine */}
              <Card className="card-gradient-orange card-gradient-shine rounded-[2rem] p-8 text-white border-0 relative overflow-hidden group cursor-pointer">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-2">Panorama 360°</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Tham quan ảo các danh thắng với công nghệ ảnh 360° sống động.
                  </p>
                  <div className="bg-white/10 rounded-xl px-3 py-2 inline-flex items-center gap-2 text-xs text-white/90 hover:bg-white/20 transition-colors">
                    <Camera className="w-3 h-3" /> Xem panorama →
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp} className="text-center mt-12">
              <Link
                to="/about-us"
                className="section-badge hover:bg-slate-800 transition-all cursor-pointer inline-flex hover:scale-105 active:scale-95"
              >
                Khám phá tất cả tính năng <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatedSection>
        </section>

        {/* =============================================
            SECTION 3 — LANDMARK IMAGES
            ============================================= */}
        <section className="py-12 px-6">
          <AnimatedSection className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-10">
              <div className="section-badge mx-auto mb-6">
                <MapPin className="w-4 h-4" />
                Địa điểm nổi bật
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                Những danh thắng{' '}
                <span className="gradient-text gradient-text-animated">không thể bỏ lỡ</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Khám phá vẻ đẹp tự nhiên và di sản văn hoá độc đáo tại Ngũ Hành Sơn, Đà Nẵng.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-6 md:p-8 rounded-[3rem] border border-slate-200/60 dark:border-slate-700/60 shadow-inner"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[180px] md:auto-rows-[220px]">
                {landmarks.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`${index === 0 ? 'md:col-span-2' : ''} relative rounded-[2rem] overflow-hidden shadow-md group cursor-pointer`}
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute bottom-6 left-6 transition-transform duration-300 group-hover:translate-y-[-4px]">
                      <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                      <div className="flex items-center gap-1 text-white/80 text-sm">
                        <MapPin className="w-3 h-3" /> Đà Nẵng, Việt Nam
                      </div>
                    </div>
                    {/* Hover shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        </section>

        {/* =============================================
            SECTION 4 — HOW IT WORKS
            ============================================= */}
        <section className="py-24 px-6 relative">
          {/* Decorative animated orb */}
          <div className="absolute top-20 right-0 w-[350px] h-[350px] bg-emerald-200/15 dark:bg-emerald-900/10 rounded-full -z-10 gradient-orb gradient-orb-2" />

          <AnimatedSection className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-20">
              <div className="section-badge mx-auto mb-6">▶ Cách thức hoạt động</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                Từ tải app đến{' '}
                <span className="gradient-text gradient-text-animated">trải nghiệm di sản</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Quy trình 4 bước đơn giản giúp bạn khám phá Ngũ Hành Sơn một cách trọn vẹn.
              </p>
            </motion.div>

            <div className="space-y-24">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  variants={index % 2 === 0 ? slideInLeft : slideInRight}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.span
                        className="text-5xl font-black text-slate-200 dark:text-slate-700"
                        whileInView={{ opacity: [0, 1], scale: [0.5, 1] }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {step.step}
                      </motion.span>
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center animate-bounce-subtle">
                        <IconByName name={step.iconName} className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-6 max-w-md">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 font-medium hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center">
                    <StepMockup index={index} />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mt-16">
              <Link
                to="/about-us"
                className="btn-shimmer btn-glow-pulse px-8 py-4 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
              >
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about-us"
                className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm flex items-center gap-2"
              >
                ▶ Xem demo
              </Link>
            </motion.div>
          </AnimatedSection>
        </section>

        {/* =============================================
            SECTION 5 — TESTIMONIALS
            ============================================= */}
        <section className="py-24 px-6 relative">
          <AnimatedSection className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <div className="section-badge mx-auto mb-6">
                <Star className="w-4 h-4" />
                Khách hàng nói gì
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                Được yêu thích bởi{' '}
                <span className="gradient-text gradient-text-animated">hàng nghìn du khách</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Xem cách du khách từ khắp nơi trên thế giới trải nghiệm Ngũ Hành Sơn cùng NeoNHS.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Featured testimonial */}
              <div className="md:col-span-1 md:row-span-2">
                <TestimonialCard testimonial={testimonials[0]} variant="featured" />
              </div>

              {/* Stats Card — with animated counters */}
              <div className="card-gradient-dark rounded-[2rem] p-8 text-white border border-white/5 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 gradient-orb gradient-orb-1" />
                <div className="relative z-10">
                  <p className="text-sm text-white/50 font-medium mb-6">Được tin tưởng bởi</p>
                  <div className="space-y-5">
                    {[
                      { Icon: Users, value: '10K+', label: 'Du khách' },
                      { Icon: Palette, value: '5K+', label: 'Workshop hoàn thành' },
                      { Icon: Globe, value: '99.9%', label: 'Uptime' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                          <stat.Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <AnimatedCounter value={stat.value} className="text-xl font-bold" />
                          <p className="text-xs text-white/50">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Remaining testimonials */}
              {testimonials.slice(1).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </motion.div>

            {/* Marquee partner logos */}
            <motion.div variants={fadeUp} className="mt-16">
              <p className="text-sm text-slate-400 mb-6 text-center">
                Được tin tưởng bởi các đối tác du lịch hàng đầu
              </p>
              <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
                <div className="marquee-track">
                  {[...partners, ...partners].map((name, i) => (
                    <span
                      key={`${name}-${i}`}
                      className="mx-8 md:mx-12 text-slate-300 dark:text-slate-600 font-bold text-lg whitespace-nowrap hover:text-slate-500 dark:hover:text-slate-400 transition-colors cursor-default shrink-0"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </section>

        {/* =============================================
            SECTION 6 — FAQ
            ============================================= */}
        <section className="py-24 px-6 relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-200/20 dark:bg-violet-900/10 rounded-full -z-10 gradient-orb gradient-orb-1" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-200/15 dark:bg-pink-900/10 rounded-full -z-10 gradient-orb gradient-orb-2" />

          <AnimatedSection className="max-w-5xl mx-auto">
            <motion.div variants={fadeUp} className="text-center mb-16">
              <div className="section-badge mx-auto mb-6">❓ Câu hỏi thường gặp</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                Giải đáp{' '}
                <span className="gradient-text-cool">thắc mắc</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
                Tất cả thông tin bạn cần về NeoNHS. Liên hệ chúng tôi nếu chưa tìm được câu trả lời.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
              {/* Category sidebar */}
              <div className="space-y-3">
                {faqCategories.map((cat) => {
                  const isActive = activeFaqCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFaqCat(cat.id)}
                      aria-label={`${cat.label} — ${cat.count} câu hỏi`}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                        isActive
                          ? 'bg-white dark:bg-slate-800 shadow-md border-l-4 border-emerald-500 text-slate-900 dark:text-white scale-[1.02]'
                          : 'bg-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:scale-[1.01]'
                      }`}
                    >
                      <span className={`transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        <IconByName name={cat.iconName} className="w-5 h-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{cat.label}</p>
                        <p className="text-xs text-slate-400">{cat.count} câu hỏi</p>
                      </div>
                    </button>
                  );
                })}

                <div className="card-gradient-dark rounded-2xl p-5 text-white mt-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent gradient-orb gradient-orb-3" />
                  <div className="relative z-10">
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
              </div>

              {/* FAQ content */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <IconByName
                    name={faqCategories.find((c) => c.id === activeFaqCat)?.iconName ?? ''}
                    className="w-5 h-5"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      {faqCategories.find((c) => c.id === activeFaqCat)?.label}
                    </h3>
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
              className="mt-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4 card-hover-glow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center animate-bounce-subtle">
                  <Headphones className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Vẫn còn thắc mắc?</p>
                  <p className="text-sm text-slate-400">Đội ngũ hỗ trợ sẵn sàng giúp đỡ bạn.</p>
                </div>
              </div>
              <Link
                to="/about-us"
                className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                Liên hệ hỗ trợ <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatedSection>
        </section>

        {/* =============================================
            SECTION 7 — DARK CTA
            ============================================= */}
        <section className="bg-dark-cta py-24 px-6 text-white relative overflow-hidden">
          {/* Animated decorative orbs */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full gradient-orb gradient-orb-1" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-600/10 rounded-full gradient-orb gradient-orb-2" />
          <div className="absolute top-1/2 right-10 w-[200px] h-[200px] bg-cyan-600/5 rounded-full gradient-orb gradient-orb-3" />

          <AnimatedSection className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div variants={fadeScale}>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-white/10 border border-white/10 text-white/90 mb-8 backdrop-blur-sm animate-float-slow">
                <Zap className="w-4 h-4 text-amber-400" />
                Tham gia cùng 500+ du khách đang sử dụng NeoNHS
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
            >
              Biến hành trình du lịch thành
              <br />
              <span className="gradient-text gradient-text-animated">trải nghiệm đáng nhớ</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-white/50 text-lg max-w-2xl mx-auto mb-10">
              Dừng tìm kiếm, bắt đầu khám phá. NeoNHS giúp biến hành trình thăm Ngũ Hành Sơn thành
              ký ức không thể quên với bản đồ tương tác, panorama 360° và sự kiện văn hoá đặc sắc.
            </motion.p>

            {/* Animated stat counters */}
            <motion.div variants={fadeUp} className="flex justify-center gap-12 md:gap-20 mb-12">
              {ctaStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <AnimatedCounter
                    value={stat.value}
                    className="text-3xl md:text-4xl font-extrabold text-white"
                  />
                  <p className="text-sm text-white/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                to="/about-us"
                className="btn-shimmer btn-glow-pulse px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 group"
              >
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] transition-all backdrop-blur-sm"
              >
                Xem cách hoạt động
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
              {ctaTrustSignals.map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                  {item}
                </span>
              ))}
            </motion.div>
          </AnimatedSection>
        </section>
      </main>
    </div>
  );
}
