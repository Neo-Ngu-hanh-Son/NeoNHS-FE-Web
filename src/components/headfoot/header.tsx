import { FunctionComponent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui/button';

const Header: FunctionComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Landing Page', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="w-full bg-white text-gray-900 font-[Poppins] sticky top-0 z-50">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section - Left */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">NeoNHS</span>
          </Link>

          {/* Desktop Navigation - Right */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Nav Links */}
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={`text-base transition-colors duration-300 ${
                      isActiveLink(link.href)
                        ? 'text-emerald-400 font-semibold'
                        : 'text-gray-900 hover:text-emerald-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:text-emerald-400 hover:bg-gray-100 transition-colors duration-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300">
                  Register
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-emerald-400 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <CloseOutlined className="text-xl" />
            ) : (
              <MenuOutlined className="text-xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden pb-6 border-t border-gray-800">
            <ul className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={`block text-base transition-colors duration-300 ${
                      isActiveLink(link.href)
                        ? 'text-emerald-400 font-semibold'
                        : 'text-gray-300 hover:text-emerald-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-800">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-emerald-400 hover:bg-gray-800 transition-colors duration-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300">
                  Register
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
