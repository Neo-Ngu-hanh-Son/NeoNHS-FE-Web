import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookFilled,
  TwitterOutlined,
  InstagramFilled,
  YoutubeFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Separator } from '@/components/ui/separator';

const Footer: FunctionComponent = () => {
  const productLinks = [
    { label: 'Tính năng', href: '/#features' },
    { label: 'Workshop', href: '/#workshops' },
    { label: 'Panorama 360°', href: '/#panorama' },
    { label: 'AI Guide', href: '/#ai-guide' },
  ];

  const companyLinks = [
    { label: 'Về chúng tôi', href: '/about-us' },
    { label: 'Blog', href: '/blog' },
    { label: 'Liên hệ', href: '/about-us#contact' },
  ];

  const supportLinks = [
    { label: 'Trung tâm hỗ trợ', href: '/help' },
    { label: 'Điều khoản dịch vụ', href: '/terms' },
    { label: 'Chính sách bảo mật', href: '/privacy' },
    { label: 'Câu hỏi thường gặp', href: '/#faq' },
  ];

  const socialLinks = [
    { icon: <FacebookFilled className="text-lg" />, href: '#', label: 'Facebook' },
    { icon: <TwitterOutlined className="text-lg" />, href: '#', label: 'Twitter' },
    { icon: <InstagramFilled className="text-lg" />, href: '#', label: 'Instagram' },
    { icon: <YoutubeFilled className="text-lg" />, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="w-full bg-[#020617] text-white font-[Inter]">
      {/* Gradient divider — smooth transition from dark CTA */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section — wider */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">NeoNHS</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Hệ sinh thái du lịch thông minh kết nối du khách với giá trị văn hoá và làng nghề truyền thống tại Ngũ Hành Sơn, Đà Nẵng.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/5 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all duration-300 text-white/50 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/30">Sản phẩm</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/30">Công ty</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/30">Hỗ trợ</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="h-px bg-white/5 my-10" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} NeoNHS — Hệ sinh thái Du lịch Ngũ Hành Sơn. All rights reserved.
          </p>
          <a href="mailto:contact@neonhs.vn" className="text-white/30 hover:text-white/60 transition-colors text-sm flex items-center gap-2">
            <MailOutlined />
            contact@neonhs.vn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;