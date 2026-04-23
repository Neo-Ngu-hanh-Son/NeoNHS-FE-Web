import { useState, useMemo } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  QrCode,
  Repeat2,
  Search,
  Store,
  Tag,
  User,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function VendorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Bảng điều khiển', path: '/vendor/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Hồ sơ', path: '/vendor/profile', icon: <User className="w-5 h-5" /> },
    { label: 'Mẫu Workshop', path: '/vendor/workshop-templates', icon: <Store className="w-5 h-5" /> },
    { label: 'Phiên Workshop', path: '/vendor/workshop-sessions', icon: <Repeat2 className="w-5 h-5" /> },
    { label: 'Tin nhắn', path: '/vendor/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Xác minh vé', path: '/vendor/ticket-verification', icon: <QrCode className="w-5 h-5" /> },
    { label: 'Voucher', path: '/vendor/vouchers', icon: <Tag className="w-5 h-5" /> },
  ];

  const location = useLocation();
  const params = useParams();

  const breadcrumb = useMemo(() => {
    const path = location.pathname;
    const templateName = 'Chi tiết mẫu';

    // Workshop Templates routes
    if (path.startsWith('/vendor/workshop-templates')) {
      if (path === '/vendor/workshop-templates') {
        return {
          items: [
            { label: 'Đối tác', path: '/vendor/dashboard' },
            { label: 'Mẫu Workshop', path: '/vendor/workshop-templates' },
          ],
          title: 'Mẫu Workshop',
        };
      }

      if (path === '/vendor/workshop-templates/new') {
        return {
          items: [
            { label: 'Đối tác', path: '/vendor/dashboard' },
            { label: 'Mẫu Workshop', path: '/vendor/workshop-templates' },
            { label: 'Tạo mới', path: '/vendor/workshop-templates/new' },
          ],
          title: 'Tạo mẫu Workshop mới',
        };
      }

      const templateId = params.id;
      if (templateId) {
        if (path.includes('/edit')) {
          return {
            items: [
              { label: 'Đối tác', path: '/vendor/dashboard' },
              { label: 'Mẫu Workshop', path: '/vendor/workshop-templates' },
              { label: templateName, path: `/vendor/workshop-templates/${templateId}` },
              { label: 'Chỉnh sửa', path: `/vendor/workshop-templates/${templateId}/edit` },
            ],
            title: `Chỉnh sửa ${templateName}`,
          };
        }

        return {
          items: [
            { label: 'Đối tác', path: '/vendor/dashboard' },
            { label: 'Mẫu Workshop', path: '/vendor/workshop-templates' },
            { label: templateName, path: `/vendor/workshop-templates/${templateId}` },
          ],
          title: templateName,
        };
      }
    }

    // Vouchers routes
    if (path.startsWith('/vendor/vouchers')) {
      if (path === '/vendor/vouchers') {
        return {
          items: [
            { label: 'Đối tác', path: '/vendor/dashboard' },
            { label: 'Quản lý Voucher', path: '/vendor/vouchers' },
          ],
          title: 'Quản lý Voucher',
        };
      }

      if (path === '/vendor/vouchers/create') {
        return {
          items: [
            { label: 'Đối tác', path: '/vendor/dashboard' },
            { label: 'Quản lý Voucher', path: '/vendor/vouchers' },
            { label: 'Tạo mới', path: '/vendor/vouchers/create' },
          ],
          title: 'Tạo Voucher mới',
        };
      }

      if (path === '/vendor/vouchers/deleted') {
        return {
          items: [
            { label: 'Đối tác', path: '/vendor/dashboard' },
            { label: 'Quản lý Voucher', path: '/vendor/vouchers' },
            { label: 'Thùng rác', path: '/vendor/vouchers/deleted' },
          ],
          title: 'Voucher đã xóa',
        };
      }

      const voucherId = params.id;
      if (voucherId) {
        if (path.includes('/edit')) {
          return {
            items: [
              { label: 'Đối tác', path: '/vendor/dashboard' },
              { label: 'Quản lý Voucher', path: '/vendor/vouchers' },
              { label: 'Chi tiết', path: `/vendor/vouchers/${voucherId}` },
              { label: 'Chỉnh sửa', path: `/vendor/vouchers/${voucherId}/edit` },
            ],
            title: 'Chỉnh sửa Voucher',
          };
        }

        return {
          items: [
            { label: 'Đối tác', path: '/vendor/dashboard' },
            { label: 'Quản lý Voucher', path: '/vendor/vouchers' },
            { label: 'Chi tiết', path: `/vendor/vouchers/${voucherId}` },
          ],
          title: 'Chi tiết Voucher',
        };
      }
    }

    const item = navItems.find((i) => i.path === path);
    if (item) {
      return {
        items: [
          { label: 'Đối tác', path: '/vendor/dashboard' },
          { label: item.label, path: item.path },
        ],
        title: item.label,
      };
    }

    return {
      items: [
        { label: 'Đối tác', path: '/vendor/dashboard' },
        { label: 'Cổng đối tác', path: '/vendor/dashboard' },
      ],
      title: 'Cổng đối tác',
    };
  }, [location.pathname, params.id]);

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-sidebar-bg flex flex-col justify-between py-6 shrink-0 border-r border-white/10 transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        <div className={`flex flex-col gap-8 ${isCollapsed ? 'items-center px-2' : 'px-6'}`}>
          {/* Brand */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-white text-base font-bold leading-tight">Đối tác</h1>
                <p className="text-white/50 text-xs font-normal">Quản lý kinh doanh</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 w-full">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : ''}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : ''
                  } ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <p className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</p>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div
          className={`flex flex-col gap-1 border-t border-white/10 pt-6 ${isCollapsed ? 'items-center px-2' : 'px-6'
            }`}
        >
          <div
            onClick={() => navigate('/')}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
            title={isCollapsed ? 'Trang chủ' : ''}
          >
            <Home className="w-5 h-5 shrink-0" />
            {!isCollapsed && <p className="text-sm font-medium">Trang chủ</p>}
          </div>
          <div
            onClick={handleLogout}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
            title={isCollapsed ? 'Đăng xuất' : ''}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <p className="text-sm font-medium">Đăng xuất</p>}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Top Navbar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 flex items-center justify-center border-none outline-none"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
            <div className="flex flex-col">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumb.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === breadcrumb.items.length - 1 ? (
                          <BreadcrumbPage className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              to={item.path}
                              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-xl font-bold mt-0.5 text-slate-900 dark:text-white">
                {breadcrumb.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <input
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-60 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
                placeholder="Tìm kiếm..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative border-none outline-none">
                <Bell className="text-slate-600 dark:text-slate-300 w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    {user?.fullname || 'Đối tác'}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">
                    Đối tác
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/20 bg-center bg-cover border-2 border-emerald-200 dark:border-emerald-500/30"
                  style={{
                    backgroundImage: user?.avatarUrl
                      ? `url(${user.avatarUrl})`
                      : `url("https://ui-avatars.com/api/?name=${user?.fullname || 'V'}&background=10b981&color=fff")`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content area with standardized padding per guideline: p-4 md:p-6 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
