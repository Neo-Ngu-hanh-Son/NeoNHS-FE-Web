import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavlinkWithChildren from '../../components/adminLayout/NavlinkWithChildren.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Compass,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  Search,
  Store,
  Tag,
  Tags,
  Ticket,
  Users,
  BadgePercent,
  Wand2,
} from 'lucide-react';

type AdminNavChild = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

type AdminNavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: AdminNavChild[];
};

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems: AdminNavItem[] = [
    {
      label: 'Bảng điều khiển',
      path: '',
      icon: <LayoutDashboard className="w-5 h-5" />,
      children: [
        {
          label: 'Tổng quan',
          path: '/admin/dashboard',
          icon: <Store className="w-5 h-5" />,
        },
        {
          label: 'Doanh thu',
          path: '/admin/revenue',
          icon: <CircleDollarSign className="w-5 h-5" />,
        },
      ],
    },
    {
      label: 'Điểm đến',
      path: 'destinations-composite',
      icon: <Map className="w-5 h-5" />,
      children: [
        {
          label: 'Quản lý điểm đến',
          path: '/admin/destinations',
          icon: <Map className="w-5 h-5" />,
        },
        {
          label: 'Điểm check-in',
          path: '/admin/checkin-points',
          icon: <MapPin className="w-5 h-5" />,
        },
      ],
    },

    { label: 'Người dùng', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    {
      label: 'Đối tác',
      path: 'vendors-composite',
      icon: <Store className="w-5 h-5" />,
      children: [
        {
          label: 'Quản lý đối tác',
          path: '/admin/vendors',
          icon: <Store className="w-5 h-5" />,
        },
        {
          label: 'Duyệt mẫu WS',
          path: '/admin/vendors/templates',
          icon: <FileText className="w-5 h-5" />,
        },
      ],
    },
    { label: 'Vé', path: '/admin/tickets', icon: <Ticket className="w-5 h-5" /> },
    { label: 'Voucher hệ thống', path: '/admin/vouchers/platform', icon: <BadgePercent className="w-5 h-5" /> },
    { label: 'Báo cáo', path: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
    {
      label: 'Sự kiện',
      path: 'events-composite',
      icon: <Calendar className="w-5 h-5" />,
      children: [
        { label: 'Quản lý sự kiện', path: '/admin/events', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Nhãn sự kiện', path: '/admin/event-tags', icon: <Tag className="w-5 h-5" /> },
      ],
    },
    { label: 'Nhãn Workshop', path: '/admin/workshop-tags', icon: <Tags className="w-5 h-5" /> },
    {
      label: 'Bài viết',
      path: 'blogs-composite',
      icon: <BookOpen className="w-5 h-5" />,
      children: [
        { label: 'Danh mục', path: '/admin/blog-categories', icon: <Tag className="w-5 h-5" /> },
        { label: 'Bài viết', path: '/admin/blog', icon: <BookOpen className="w-5 h-5" /> },
      ],
    },
    { label: 'Tin nhắn', path: '/admin/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Kiến thức AI', path: '/admin/knowledge-base', icon: <Wand2 className="w-5 h-5" /> },
  ];

  // Helper to get breadcrumb from path
  const getPageHierarchy = () => {
    const path = window.location.pathname;
    const findInItems = (items: Array<AdminNavItem | AdminNavChild>): { label: string; path: string }[] | null => {
      for (const item of items) {
        if (item.path === path) return [{ label: item.label, path: item.path }];
        if ('children' in item && item.children) {
          const childPath = findInItems(item.children);
          if (childPath) {
            const parentPath = item.path.startsWith('/') ? item.path : item.children[0].path;
            return [{ label: item.label, path: parentPath }, ...childPath];
          }
        }
      }
      return null;
    };

    const hierarchy = findInItems(navItems);
    if (hierarchy) return hierarchy;

    // Dynamic event routes
    if (path.startsWith('/admin/events/')) {
      const parts = path.split('/');
      if (parts.length === 4 && parts[3] === 'create') {
        return [
          { label: 'Sự kiện', path: '/admin/events' },
          { label: 'Quản lý sự kiện', path: '/admin/events' },
          { label: 'Tạo mới', path: path },
        ];
      }
      if (parts.length === 5 && parts[4] === 'edit') {
        return [
          { label: 'Sự kiện', path: '/admin/events' },
          { label: 'Quản lý sự kiện', path: '/admin/events' },
          { label: 'Chỉnh sửa', path: path },
        ];
      }
      if (parts.length === 4) {
        // /admin/events/:id
        return [
          { label: 'Sự kiện', path: '/admin/events' },
          { label: 'Quản lý sự kiện', path: '/admin/events' },
          { label: 'Chi tiết', path: path },
        ];
      }
    }

    // Dynamic voucher routes
    if (path.startsWith('/admin/vouchers/')) {
        const parts = path.split('/');
        // /admin/vouchers/create
        if (parts.length === 4 && parts[3] === 'create') {
            return [
                { label: 'Voucher hệ thống', path: '/admin/vouchers/platform' },
                { label: 'Tạo mới', path: path }
            ];
        }
        // /admin/vouchers/deleted
        if (parts.length === 4 && parts[3] === 'deleted') {
            return [
                { label: 'Voucher hệ thống', path: '/admin/vouchers/platform' },
                { label: 'Đã xóa', path: path }
            ];
        }
        // /admin/vouchers/:id/edit
        if (parts.length === 5 && parts[4] === 'edit') {
            return [
                { label: 'Voucher hệ thống', path: '/admin/vouchers/platform' },
                { label: 'Chỉnh sửa', path: path }
            ];
        }
        // /admin/vouchers/:id
        if (parts.length === 4 && parts[3] !== 'platform' && parts[3] !== 'vendor' && parts[3] !== 'create' && parts[3] !== 'deleted') {
            return [
                { label: 'Voucher hệ thống', path: '/admin/vouchers/platform' },
                { label: 'Chi tiết', path: path }
            ];
        }
    }

    return [{ label: 'Hệ thống', path: '/admin' }];
  };

  const hierarchy = getPageHierarchy();
  const pageTitle = hierarchy[hierarchy.length - 1]?.label || 'Hệ thống';

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-sidebar-bg flex flex-col justify-between py-6 shrink-0 border-r border-white/10 transition-[width] duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex flex-col gap-8 ${isCollapsed ? 'items-center px-2' : 'px-6'}`}>
          {/* Brand */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-white text-base font-bold leading-tight">Quản trị viên</h1>
                <p className="text-white/50 text-xs font-normal">Quản lý hệ thống</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 w-full">
            {navItems.map((item) => {
              if (item.children) {
                return <NavlinkWithChildren key={item.path} navItem={item} isCollapsed={isCollapsed} />;
              }
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.label : ''}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${
                      isCollapsed ? 'justify-center' : ''
                    } ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <p className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</p>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div
          className={`flex flex-col gap-1 border-t border-white/10 pt-6 ${isCollapsed ? 'items-center px-2' : 'px-6'}`}
        >
          <div
            onClick={() => navigate('/')}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white cursor-pointer transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Trang chủ' : ''}
          >
            <Home className="w-5 h-5 shrink-0" />
            {!isCollapsed && <p className="text-sm font-medium">Trang chủ</p>}
          </div>
          <div
            onClick={handleLogout}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors ${
              isCollapsed ? 'justify-center' : ''
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
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <div className="flex flex-col">
              <Breadcrumb>
                <BreadcrumbList>
                  <div className="flex items-center gap-2">
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          to="/admin"
                          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          Hệ thống
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </div>
                  {hierarchy.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {index === hierarchy.length - 1 ? (
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
              <h2 className="text-xl font-bold mt-0.5 text-slate-900 dark:text-white">{pageTitle}</h2>
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
                    {user?.fullname || 'Quản trị viên'}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">
                    Quản trị viên
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/20 bg-center bg-cover border-2 border-emerald-200 dark:border-emerald-500/30"
                  style={{
                    backgroundImage: user?.avatarUrl
                      ? `url(${user.avatarUrl})`
                      : `url("https://ui-avatars.com/api/?name=${user?.fullname || 'A'}&background=10b981&color=fff")`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content area with standardized padding per guideline: p-4 md:p-6 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ scrollbarGutter: 'stable' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
