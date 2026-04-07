import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavlinkWithChildren from '../../components/adminLayout/NavlinkWithChildren.tsx';
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
      label: 'Dashboard',
      path: '',
      icon: <LayoutDashboard className="w-6 h-6" />,
      children: [
        {
          label: 'Admin Dashboard',
          path: '/admin/dashboard',
          icon: <Store className="w-6 h-6" />,
        },
        {
          label: 'Revenue',
          path: '/admin/revenue',
          icon: <CircleDollarSign className="w-6 h-6" />,
        },
      ],
    },
    {
      label: 'Destination',
      path: 'destinations-composite',
      icon: <Map className="w-6 h-6" />,
      children: [
        {
          label: 'Manage Destinations',
          path: '/admin/destinations',
          icon: <Map className="w-6 h-6" />,
        },
        {
          label: 'Checkin Points',
          path: '/admin/checkin-points',
          icon: <MapPin className="w-6 h-6" />,
        },
      ],
    },

    { label: 'Users', path: '/admin/users', icon: <Users className="w-6 h-6" /> },
    {
      label: 'Vendors',
      path: 'vendors-composite',
      icon: <Store className="w-6 h-6" />,
      children: [
        {
          label: 'Vendors Management',
          path: '/admin/vendors',
          icon: <Store className="w-6 h-6" />,
        },
        {
          label: 'Template Review',
          path: '/admin/vendors/templates',
          icon: <FileText className="w-6 h-6" />,
        },
      ],
    },
    { label: 'Tickets', path: '/admin/tickets', icon: <Ticket className="w-6 h-6" /> },
    {
      label: 'Vouchers',
      path: 'vouchers-composite',
      icon: <BadgePercent className="w-6 h-6" />,
      children: [
        {
          label: 'Platform Vouchers',
          path: '/admin/vouchers/platform',
          icon: <BadgePercent className="w-6 h-6" />,
        },
        {
          label: 'Vendor Vouchers',
          path: '/admin/vouchers/vendor',
          icon: <BadgePercent className="w-6 h-6" />,
        },
      ],
    },
    { label: 'Reports', path: '/admin/reports', icon: <BarChart3 className="w-6 h-6" /> },
    {
      label: 'Manage Events',
      path: 'events-composite',
      icon: <Calendar className="w-6 h-6" />,
      children: [
        { label: 'Events', path: '/admin/events', icon: <Calendar className="w-6 h-6" /> },
        { label: 'Event Tags', path: '/admin/event-tags', icon: <Tag className="w-6 h-6" /> },
      ],
    },
    { label: 'Workshop Tags', path: '/admin/workshop-tags', icon: <Tags className="w-6 h-6" /> },
    {
      label: 'Manage blogs',
      path: 'blogs-composite',
      icon: <BookOpen className="w-6 h-6" />,
      children: [
        { label: 'Blog Categories', path: '/admin/blog-categories', icon: <Tag className="w-6 h-6" /> },
        { label: 'Blog', path: '/admin/blog', icon: <BookOpen className="w-6 h-6" /> },
      ],
    },
    { label: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-6 h-6" /> },
  ];

  // Helper to get breadcrumb from path
  const getPageHierarchy = () => {
    const path = window.location.pathname;
    const findInItems = (items: Array<AdminNavItem | AdminNavChild>): string[] | null => {
      for (const item of items) {
        if (item.path === path) return [item.label];
        if ('children' in item && item.children) {
          const childPath = findInItems(item.children);
          if (childPath) return [item.label, ...childPath];
        }
      }
      return null;
    };

    const hierarchy = findInItems(navItems);
    return hierarchy || ['System'];
  };

  const hierarchy = getPageHierarchy();
  const pageTitle = hierarchy[hierarchy.length - 1];

  return (
    <div className="flex h-screen overflow-hidden font-display">
      {/* Sidebar */}
      <aside
        className={`bg-sidebar-bg flex flex-col justify-between py-6 shrink-0 border-r border-white/10 transition-all 
          duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex flex-col gap-8 ${isCollapsed ? 'items-center px-2' : 'px-6'}`}>
          {/* Brand */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="size-10 rounded-lg bg-accent-gold flex items-center justify-center text-sidebar-bg shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-white text-base font-bold leading-tight">Tourism Admin</h1>
                <p className="text-white/60 text-xs font-normal">System Management</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 w-full">
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
          className={`flex flex-col gap-2 border-t border-white/10 pt-6 ${isCollapsed ? 'items-center px-2' : 'px-6'}`}
        >
          <div
            onClick={handleLogout}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {!isCollapsed && <p className="text-sm font-medium">Logout</p>}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark text-[#101914] dark:text-white">
        {/* Top Navbar */}
        <header className="flex items-center justify-between border-b border-[#d3e4da] bg-white dark:bg-background-dark px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-background-light dark:hover:bg-white/5 transition-colors text-primary flex items-center justify-center border-none outline-none"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-[#588d70]">
                <span>System</span>
                {hierarchy.map((label, index) => (
                  <React.Fragment key={index}>
                    <span>/</span>
                    <span className={index === hierarchy.length - 1 ? 'text-primary font-medium' : ''}>{label}</span>
                  </React.Fragment>
                ))}
              </div>
              <h2 className="text-xl font-bold mt-1">{pageTitle} Overview</h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#588d70] w-6 h-6" />
              <input
                className="pl-10 pr-4 py-2 bg-background-light dark:bg-white/5 border border-[#d3e4da] dark:border-white/10 rounded-lg text-sm w-64 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Search data..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-background-light dark:bg-white/5 hover:bg-[#e9f1ed] transition-colors relative border-none outline-none">
                <Bell className="text-[#101914] dark:text-white w-5 h-5" />
                <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="h-8 w-px bg-[#d3e4da] mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {user?.fullname || 'Admin'}
                  </p>
                  <p className="text-[11px] text-[#588d70] font-medium tracking-wide uppercase">System Admin</p>
                </div>
                <div
                  className="size-10 rounded-full bg-primary/10 bg-center bg-cover border-2 border-primary/20"
                  style={{
                    backgroundImage: user?.avatarUrl
                      ? `url(${user.avatarUrl})`
                      : `url("https://lh3.googleusercontent.com/aida-public/AB6AXuADGFml9SUZm46Hz--HyVemu0zyCnCXClRTBn_X5EfDBwH5zFADVS5MmxAsg4UI3cOSE3ul_r2WFpWcHYb9IHBJMfR527_AU3VBRpfxefjb4PnmN30EQLWtdbNuR2-juuwn9uCiuiNey0jc9m6Ldlr9sPi5LxUX1pLH_Ig9wvSmMCew0EH0M1W-oYkWpblNFH4Bv9d5XGltiVFHrbARxFSUFs2XmZPStYmT8J94v4AYhKyH4gEa_WAsQ95x7td4OXBNdI23v3v_Ch43")`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content area with standardized padding */}
        <div className="flex-1 overflow-y-auto p-8" style={{ scrollbarGutter: 'stable' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
