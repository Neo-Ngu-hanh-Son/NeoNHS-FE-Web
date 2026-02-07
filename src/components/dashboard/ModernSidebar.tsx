import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
    UserOutlined,
    SafetyOutlined,
    ShoppingOutlined,
    DashboardOutlined,
    TeamOutlined,
    ShopOutlined,
    AppstoreOutlined,
    DollarOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

interface MenuItem {
    key: string;
    label: string;
    icon: React.ReactElement;
    path: string;
}

const menuByRole: Record<string, MenuItem[]> = {
    [UserRole.TOURIST]: [
        { key: 'profile', label: 'Profile', icon: <UserOutlined />, path: '/account/user' },
        { key: 'voucher', label: 'Voucher', icon: <SafetyOutlined />, path: '/account/voucher' },
        { key: 'bookings', label: 'My Bookings', icon: <ShoppingOutlined />, path: '/account/bookings' },
        { key: 'promotions', label: 'Promotions', icon: <SettingOutlined />, path: '/account/promotions' },
    ],
    [UserRole.ADMIN]: [
        { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/admin/dashboard' },
        { key: 'users', label: 'Users', icon: <TeamOutlined />, path: '/admin/users' },
        { key: 'profile', label: 'Profile', icon: <UserOutlined />, path: '/account/user' },
    ],
    [UserRole.VENDOR]: [
        { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/vendor/dashboard' },
        { key: 'orders', label: 'Orders', icon: <ShopOutlined />, path: '/vendor/orders' },
        { key: 'products', label: 'Products', icon: <AppstoreOutlined />, path: '/vendor/products' },
        { key: 'revenue', label: 'Revenue', icon: <DollarOutlined />, path: '/vendor/revenue' },
        { key: 'profile', label: 'Profile', icon: <UserOutlined />, path: '/account/vendor' },
    ],
};

interface ModernSidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export function ModernSidebar({ collapsed = false, onToggle }: ModernSidebarProps) {
    const { user } = useAuth();

    const menuItems = useMemo(() => {
        const role = user?.role || UserRole.TOURIST;
        return menuByRole[role] || menuByRole[UserRole.TOURIST];
    }, [user?.role]);

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case UserRole.ADMIN:
                return 'bg-gradient-to-r from-red-500 to-pink-500';
            case UserRole.VENDOR:
                return 'bg-gradient-to-r from-purple-500 to-indigo-500';
            default:
                return 'bg-gradient-to-r from-blue-500 to-cyan-500';
        }
    };

    return (
        <aside
            className={`
                sticky top-0 h-screen bg-white border-r border-gray-200
                transition-all duration-300 ease-in-out z-40 flex flex-col
                shadow-lg
                ${collapsed ? 'w-20' : 'w-72'}
            `}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-xl">N</span>
                            </div>
                            <div>
                                <h1 className="text-gray-900 font-bold text-lg">NeoNHS</h1>
                                <p className="text-gray-500 text-xs">Tourism Platform</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="text-gray-500 hover:text-emerald-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>
                </div>
            </div>

            {/* User Profile Section */}
            {user && !collapsed && (
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.fullname} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    user.fullname.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-semibold text-sm truncate">{user.fullname}</p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs text-white font-medium ${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                            }
                            ${collapsed ? 'justify-center' : ''}
                            `
                        }
                    >
                        <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                            {item.icon}
                        </span>
                        {!collapsed && (
                            <span className="font-medium text-sm">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
