import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppstoreOutlined,
  TagsOutlined,
  FileTextOutlined,
  PictureOutlined,
  TeamOutlined,
  SettingOutlined,
  PlusOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useAuth } from '@/hooks/useAuth'

const sidebarMainNav = [
  { label: 'Dashboard', icon: <AppstoreOutlined />, href: '/admin' },
  {
    label: 'Categories',
    icon: <TagsOutlined />,
    href: '/admin/blog-categories',
  },
  { label: 'Posts', icon: <FileTextOutlined />, href: '/admin/posts' },
  {
    label: 'Media Library',
    icon: <PictureOutlined />,
    href: '/admin/media',
  },
  { label: 'Users', icon: <TeamOutlined />, href: '/admin/users' },
]

const sidebarSystemNav = [
  { label: 'Settings', icon: <SettingOutlined />, href: '/admin/settings' },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: 'Profile', onClick: () => navigate('/account') },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  /** Build breadcrumb segments from the current URL */
  const buildBreadcrumb = () => {
    const parts = location.pathname.replace('/admin', '').split('/').filter(Boolean)
    const crumbs = [{ label: 'Admin', href: '/admin' }]
    let path = '/admin'
    for (const part of parts) {
      path += `/${part}`
      const label = part
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      crumbs.push({ label, href: path })
    }
    return crumbs
  }

  const breadcrumbs = buildBreadcrumb()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="flex w-[220px] shrink-0 flex-col bg-[#1a3a2a] text-white">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <AppstoreOutlined className="text-base text-white" />
          </div>
          <div className="leading-tight">
            <span className="text-sm font-bold tracking-wide">Blog CMS</span>
            <span className="block text-[10px] uppercase tracking-widest text-emerald-300/80">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Main nav */}
        <nav className="mt-2 flex-1 space-y-0.5 px-3">
          {sidebarMainNav.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          {/* System section */}
          <div className="!mt-6 mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            System
          </div>
          {sidebarSystemNav.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom button */}
        <div className="p-3">
          <Link
            to="/admin/blog-categories/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-700/30 px-4 py-2.5 text-[13px] font-semibold text-emerald-200 transition-colors hover:bg-emerald-600 hover:text-white"
          >
            <PlusOutlined /> Add Category
          </Link>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link
                    to={crumb.href}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-800">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <button className="text-gray-500 transition-colors hover:text-gray-700">
              <BellOutlined className="text-lg" />
            </button>
            <button className="text-gray-500 transition-colors hover:text-gray-700">
              <QuestionCircleOutlined className="text-lg" />
            </button>
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <button className="flex items-center gap-2.5 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100">
                <div className="text-right leading-tight">
                  <span className="block text-sm font-semibold text-gray-800">
                    {user?.fullname ?? 'Admin'}
                  </span>
                  <span className="block text-[11px] text-emerald-600">
                    {user?.role ?? 'Super Admin'}
                  </span>
                </div>
                <Avatar
                  size={34}
                  src={user?.avatarUrl}
                  className="bg-emerald-100 text-emerald-700"
                >
                  {(user?.fullname ?? 'A').charAt(0)}
                </Avatar>
              </button>
            </Dropdown>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
