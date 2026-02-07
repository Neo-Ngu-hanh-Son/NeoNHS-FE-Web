import { useEffect, useState } from 'react';
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
    SettingOutlined
} from '@ant-design/icons';
import { authService } from '@/services/api/authService';
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
        { key: 'security', label: 'Security', icon: <SafetyOutlined />, path: '/account/security' },
        { key: 'bookings', label: 'My Bookings', icon: <ShoppingOutlined />, path: '/account/bookings' },
    ],
    [UserRole.ADMIN]: [
        { key: 'profile', label: 'Profile', icon: <UserOutlined />, path: '/account/user' },
        { key: 'security', label: 'Security', icon: <SafetyOutlined />, path: '/account/security' },
        { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined />, path: '/admin/dashboard' },
        { key: 'users', label: 'Users', icon: <TeamOutlined />, path: '/admin/users' },
    ],
    [UserRole.VENDOR]: [
        { key: 'profile', label: 'Profile', icon: <UserOutlined />, path: '/account/vendor' },
        { key: 'security', label: 'Security', icon: <SafetyOutlined />, path: '/account/security' },
        { key: 'orders', label: 'Orders', icon: <ShopOutlined />, path: '/vendor/orders' },
        { key: 'products', label: 'Products', icon: <AppstoreOutlined />, path: '/vendor/products' },
        { key: 'revenue', label: 'Revenue', icon: <DollarOutlined />, path: '/vendor/revenue' },
        { key: 'settings', label: 'Settings', icon: <SettingOutlined />, path: '/vendor/settings' },
    ],
};

export function RoleBasedSidebar() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const user = await authService.getCurrentUser();
                const role = user?.role || UserRole.TOURIST;
                setMenuItems(menuByRole[role] || menuByRole[UserRole.TOURIST]);
            } catch {
                setMenuItems(menuByRole[UserRole.TOURIST]);
            }
        };
        loadMenu();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 transform scale-105'
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600'
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
