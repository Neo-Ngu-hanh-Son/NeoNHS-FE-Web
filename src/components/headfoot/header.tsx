import { FunctionComponent, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  DashboardFilled,
} from '@ant-design/icons';
import { Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/useAuth';
import { LayoutDashboard, SquareChartGantt, User } from 'lucide-react';

const Header: FunctionComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Glassmorphism scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    // Nếu là ADMIN -> Hiện Admin Dashboard
    ...(user?.role === 'ADMIN'
      ? [
          {
            key: 'admin-dashboard',
            label: 'Admin Dashboard',
            icon: <LayoutDashboard className="w-4 h-4" />,
            onClick: () => navigate('/admin/dashboard'), // Thêm dấu '/' phía trước để đảm bảo absolute routing
          },
        ]
      : []),

    // Nếu là VENDOR -> Hiện Vendor Dashboard
    ...(user?.role === 'VENDOR'
      ? [
          {
            key: 'vendor-dashboard',
            label: 'Vendor Dashboard',
            icon: <LayoutDashboard className="w-4 h-4" />,
            onClick: () => navigate('/vendor/dashboard'),
          },
        ]
      : []),

    // Các menu chung cho tất cả mọi người (kể cả TOURIST)
    {
      key: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      onClick: () => navigate('/account'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  const navLinks = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Về chúng tôi', href: '/about-us' },
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header
      className={`w-full font-[Inter] sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav shadow-sm' : 'glass-nav-transparent bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo Section - Left */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="https://res.cloudinary.com/dsrxsfr0q/image/upload/v1776956348/NeoNHSLogo_Optimized_m2ieop.jpg" alt="NeoNHS Logo" className="w-9 h-9 rounded-full" />
            <span className="text-xl font-bold tracking-tight text-slate-900">NeoNHS</span>
          </Link>

          {/* Desktop Navigation - Center + Right */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Nav Links */}
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={`text-[15px] px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActiveLink(link.href)
                        ? 'text-emerald-600 font-semibold bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Buttons / User Avatar */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar
                      size={38}
                      src={user?.avatarUrl}
                      icon={!user?.avatarUrl && <UserOutlined />}
                      className="bg-emerald-500 ring-2 ring-emerald-100"
                    />
                  </div>
                </Dropdown>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 text-[15px]"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 h-10 text-[15px] font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                      Đăng ký miễn phí
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <CloseOutlined className="text-xl" /> : <MenuOutlined className="text-xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden pb-6 border-t border-slate-100 bg-white/95 backdrop-blur-lg">
            <ul className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={`block text-base px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActiveLink(link.href)
                        ? 'text-emerald-600 font-semibold bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Auth Buttons / User Menu */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-100">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar
                      size={36}
                      src={user?.avatarUrl}
                      icon={!user?.avatarUrl && <UserOutlined />}
                      className="bg-emerald-500"
                    />
                    <span className="text-slate-900 font-medium">{user?.fullname || 'User'}</span>
                  </div>
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-300"
                    >
                      <ProfileOutlined className="mr-2" />
                      Hồ sơ
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogoutOutlined className="mr-2" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-300"
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-colors duration-300">
                      Đăng ký miễn phí
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
