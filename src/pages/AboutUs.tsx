import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Heart,
  Globe,
  Lightbulb,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowRight,
  Users,
  Sparkles,
} from 'lucide-react';

/* ============================================================
   DATA
   ============================================================ */

const values = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Tính xác thực',
    description:
      'Chúng tôi cam kết mang đến những trải nghiệm văn hoá chính xác và tôn trọng truyền thống Ngũ Hành Sơn.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Đam mê',
    description:
      'Đội ngũ được thúc đẩy bởi tình yêu sâu sắc với di sản và mong muốn chia sẻ vẻ đẹp với thế giới.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Cộng đồng',
    description:
      'Hợp tác chặt chẽ với nghệ nhân và cư dân địa phương để đảm bảo du lịch mang lại lợi ích cho toàn cộng đồng.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Đổi mới',
    description:
      'Ứng dụng công nghệ để tạo nên trải nghiệm du lịch thông minh, liền mạch và hấp dẫn cho du khách hiện đại.',
    color: 'bg-amber-50 text-amber-600',
  },
];

const teamMembers = [
  { name: 'Châu Thành Đạt', role: 'Trưởng nhóm', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
  { name: 'Phạm Minh Kiệt', role: 'Thành viên', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { name: 'Nguyễn Quang Huy', role: 'Thành viên', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
  { name: 'Đoàn Trần Quang Huy', role: 'Thành viên', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name: 'Lê Nhật Trường', role: 'Thành viên', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
];

const contactInfo = [
  { icon: <MapPin className="w-6 h-6" />, label: 'Vị trí', value: '81 Huyền Trân Công Chúa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng' },
  { icon: <Phone className="w-6 h-6" />, label: 'Điện thoại', value: '+84 236 3961 114' },
  { icon: <Mail className="w-6 h-6" />, label: 'Email', value: 'contact@neonhs.vn' },
  { icon: <Clock className="w-6 h-6" />, label: 'Thời gian', value: 'Thứ 2 - CN: 07:00 - 17:00' },
];

/* ============================================================
   ANIMATION HELPERS
   ============================================================ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
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
   MAIN COMPONENT
   ============================================================ */

export function AboutUs() {
  return (
    <div className="min-h-screen bg-page-gradient overflow-x-hidden">

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="relative h-[440px] w-full overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dsrxsfr0q/image/upload/v1775755613/AboutNHSCover2_dynvk6.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-white/10 border border-white/15 text-white/90 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Về chúng tôi
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Kết nối di sản với{' '}
              <span className="gradient-text">thế giới</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/80 leading-relaxed">
              Cầu nối giữa quá khứ và hiện tại, đưa bạn đến trái tim của Ngũ Hành Sơn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          OUR MISSION
          ======================================== */}
      <section className="py-24 px-6">
        <AnimatedSection className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} className="order-2 lg:order-1">
              <div className="section-badge mb-6">
                <Globe className="w-4 h-4" />
                Sứ mệnh
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-slate-500 text-lg mb-6 leading-relaxed">
                Tại NeoNHS, sứ mệnh của chúng tôi là bảo tồn và quảng bá di sản văn hoá phong phú của
                Ngũ Hành Sơn, đồng thời thúc đẩy du lịch bền vững. Chúng tôi tin rằng du lịch không chỉ
                là tham quan — mà là đắm chìm trong linh hồn của một vùng đất.
              </p>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Bằng cách kết nối du khách với nghệ nhân địa phương và cung cấp lộ trình thông minh,
                chúng tôi tạo nên những trải nghiệm ý nghĩa để lại dấu ấn lâu dài.
              </p>
              <div className="flex gap-8">
                <div className="text-center">
                  <span className="text-3xl font-extrabold gradient-text">50+</span>
                  <p className="text-sm text-slate-400 mt-1">Đối tác địa phương</p>
                </div>
                <div className="w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-3xl font-extrabold gradient-text">10K+</span>
                  <p className="text-sm text-slate-400 mt-1">Du khách hài lòng</p>
                </div>
                <div className="w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-3xl font-extrabold gradient-text">200+</span>
                  <p className="text-sm text-slate-400 mt-1">Nghệ nhân</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="order-1 lg:order-2 relative">
              <img
                src="https://images.unsplash.com/photo-1552353617-3bfd679b3bdd?w=800&q=80"
                alt="Sứ mệnh NeoNHS"
                className="w-full h-[480px] object-cover rounded-[2.5rem] shadow-xl"
              />
              <div className="absolute -z-10 top-8 -right-8 w-full h-full border-2 border-emerald-200 rounded-[2.5rem] hidden lg:block" />
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* ========================================
          CORE VALUES
          ======================================== */}
      <section className="py-24 px-6">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="section-badge mx-auto mb-6">
              <Heart className="w-4 h-4" />
              Giá trị cốt lõi
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Kim chỉ nam hành động
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Những nguyên tắc dẫn dắt mọi cuộc hành trình và sự kết nối chúng tôi tạo ra.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[2rem] bg-white group"
              >
                <CardContent className="p-8 text-center flex flex-col items-center h-full">
                  <div className={`mb-6 p-4 rounded-2xl ${value.color} transition-transform group-hover:scale-110 duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ========================================
          MEET THE TEAM
          ======================================== */}
      <section className="py-24 px-6">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="section-badge mx-auto mb-6">
              <Users className="w-4 h-4" />
              Đội ngũ
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Gặp gỡ đội ngũ <span className="gradient-text">NeoNHS</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Những con người đam mê đứng sau NeoNHS
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-4 overflow-hidden rounded-[2rem]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-emerald-600 font-medium text-sm">{member.role}</p>
              </div>
            ))}
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ========================================
          CONTACT SECTION
          ======================================== */}
      <section id="contact" className="py-24 px-6">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="section-badge mx-auto mb-6">
              <Mail className="w-4 h-4" />
              Liên hệ
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Kết nối với <span className="gradient-text">chúng tôi</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Bạn có câu hỏi hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng!
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{info.label}</p>
                    <p className="font-semibold text-slate-800 text-sm">{info.value}</p>
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-100 h-[200px] shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.73339639183!2d108.2616233!3d15.9922649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314210967389814b%3A0xe54df96813292415!2zTmfFqSBIw6BuaCBTxqFuLCDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1711111111111!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border border-slate-100 shadow-lg rounded-[2rem] bg-white">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">Gửi tin nhắn cho chúng tôi</h3>
                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                          Họ
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all bg-slate-50/50 text-sm"
                          placeholder="Nguyễn"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                          Tên
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all bg-slate-50/50 text-sm"
                          placeholder="Văn A"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all bg-slate-50/50 text-sm"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-semibold text-slate-700">
                        Chủ đề
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all bg-slate-50/50 text-sm"
                        placeholder="Chúng tôi có thể giúp gì?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                        Nội dung
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all bg-slate-50/50 resize-none text-sm"
                        placeholder="Viết tin nhắn của bạn..."
                      />
                    </div>

                    <Button className="w-full h-12 text-base font-semibold flex items-center justify-center gap-2 group bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all">
                      Gửi tin nhắn
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>
    </div>
  );
}

export default AboutUs;
