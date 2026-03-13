import { FunctionComponent } from 'react';
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
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Workshops', href: '/workshops' },
    { label: 'Blog', href: '/blog' },
  ];

  const supportLinks = [
    { label: 'Help Center', href: '/help' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const socialLinks = [
    { icon: <FacebookFilled className="text-lg" />, href: '#', label: 'Facebook' },
    { icon: <TwitterOutlined className="text-lg" />, href: '#', label: 'Twitter' },
    { icon: <InstagramFilled className="text-lg" />, href: '#', label: 'Instagram' },
    { icon: <YoutubeFilled className="text-lg" />, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="w-full bg-gray-900 text-white font-[Poppins]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">NeoNHS</span>
            </div>
            <p className="text-gray-400 text-base leading-relaxed">
              Connecting heritage, experiences, and commerce in Ngu Hanh Son Ward.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <EnvironmentOutlined className="text-emerald-400 text-lg mt-1" />
                <span className="text-gray-300 text-base leading-relaxed">
                  Ngu Hanh Son Ward, Da Nang, Vietnam
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneOutlined className="text-emerald-400 text-lg" />
                <a
                  href="tel:+842363961114"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-base"
                >
                  +84 236 3961 114
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailOutlined className="text-emerald-400 text-lg" />
                <a
                  href="mailto:info@ccte-nhs.com"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-base"
                >
                  info@ccte-nhs.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <GlobalOutlined className="text-emerald-400 text-lg" />
                <a
                  href="https://www.ccte-nhs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-base"
                >
                  www.ccte-nhs.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <Separator className="my-8 bg-gray-700" />
        <div className="text-center">
          <p className="text-gray-500 text-base">
            © {new Date().getFullYear()} CCTE - Ngu Hanh Son Cultural Tourism Experience. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
      			