import { useState, useMemo } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function VendorLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/vendor/dashboard', icon: 'dashboard' },
        { label: 'Profile', path: '/vendor/profile', icon: 'person' },
        { label: 'Workshop Templates', path: '/vendor/workshop-templates', icon: 'architecture' },
        { label: 'Workshop Sessions', path: '/vendor/workshop-sessions', icon: 'event_repeat' },
        { label: "Messages", path: "/vendor/messages", icon: "chat" },
        { label: 'Ticket Verification', path: '/vendor/ticket-verification', icon: 'qr_code_scanner' },
        { label: 'Vouchers', path: '/vendor/vouchers', icon: 'loyalty' },
    ];

    const location = useLocation();
    const params = useParams();

    const breadcrumb = useMemo(() => {
        const path = location.pathname;
        const templateName = 'Template Details';

        // Workshop Templates routes
        if (path.startsWith('/vendor/workshop-templates')) {
            if (path === '/vendor/workshop-templates') {
                return {
                    items: [
                        { label: 'Vendor', path: '/vendor/dashboard' },
                        { label: 'Workshop Templates', path: '/vendor/workshop-templates' }
                    ],
                    title: 'Workshop Templates'
                };
            }

            if (path === '/vendor/workshop-templates/new') {
                return {
                    items: [
                        { label: 'Vendor', path: '/vendor/dashboard' },
                        { label: 'Workshop Templates', path: '/vendor/workshop-templates' },
                        { label: 'Create New', path: '/vendor/workshop-templates/new' }
                    ],
                    title: 'Create New Template'
                };
            }

            const templateId = params.id;
            if (templateId) {
                if (path.includes('/edit')) {
                    return {
                        items: [
                            { label: 'Vendor', path: '/vendor/dashboard' },
                            { label: 'Workshop Templates', path: '/vendor/workshop-templates' },
                            { label: templateName, path: `/vendor/workshop-templates/${templateId}` },
                            { label: 'Edit', path: `/vendor/workshop-templates/${templateId}/edit` }
                        ],
                        title: `Edit ${templateName}`
                    };
                }

                return {
                    items: [
                        { label: 'Vendor', path: '/vendor/dashboard' },
                        { label: 'Workshop Templates', path: '/vendor/workshop-templates' },
                        { label: templateName, path: `/vendor/workshop-templates/${templateId}` }
                    ],
                    title: templateName
                };
            }
        }

        const item = navItems.find(i => i.path === path);
        if (item) {
            return {
                items: [
                    { label: 'Vendor', path: '/vendor/dashboard' },
                    { label: item.label, path: item.path }
                ],
                title: item.label
            };
        }

        return {
            items: [
                { label: 'Vendor', path: '/vendor/dashboard' },
                { label: 'Portal', path: '/vendor/dashboard' }
            ],
            title: 'Vendor Portal'
        };
    }, [location.pathname, params.id]);

    return (
        <div className="flex h-screen overflow-hidden font-display">
            {/* Sidebar */}
            <aside
                className={`bg-sidebar-bg flex flex-col justify-between py-6 shrink-0 border-r border-white/10 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className={`flex flex-col gap-8 ${isCollapsed ? 'items-center px-2' : 'px-6'}`}>
                    {/* Brand */}
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="size-10 rounded-lg bg-accent-gold flex items-center justify-center text-sidebar-bg shrink-0">
                            <span className="material-symbols-outlined font-bold">storefront</span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <h1 className="text-white text-base font-bold leading-tight">Vendor Center</h1>
                                <p className="text-white/60 text-xs font-normal">Business Management</p>
                            </div>
                        )}
                    </div>

                    {/* Nav */}
                    <nav className="flex flex-col gap-2 w-full">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={isCollapsed ? item.label : ''}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${isCollapsed ? 'justify-center' : ''
                                    } ${isActive
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined shrink-0">{item.icon}</span>
                                {!isCollapsed && <p className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className={`flex flex-col gap-2 border-t border-white/10 pt-6 ${isCollapsed ? 'items-center px-2' : 'px-6'}`}>
                    <div
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 p-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white cursor-pointer transition-all ${isCollapsed ? 'justify-center' : ''
                            }`}
                        title={isCollapsed ? 'Back to Home' : ''}
                    >
                        <span className="material-symbols-outlined shrink-0">home</span>
                        {!isCollapsed && <p className="text-sm font-medium">Back to Home</p>}
                    </div>
                    <div
                        onClick={handleLogout}
                        className={`flex items-center gap-3 p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-all ${isCollapsed ? 'justify-center' : ''
                            }`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <span className="material-symbols-outlined shrink-0">logout</span>
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
                            {isCollapsed ? <MenuUnfoldOutlined style={{ fontSize: '20px' }} /> : <MenuFoldOutlined style={{ fontSize: '20px' }} />}
                        </button>
                        <div className="flex flex-col">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumb.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            {index > 0 && <BreadcrumbSeparator />}
                                            <BreadcrumbItem>
                                                {index === breadcrumb.items.length - 1 ? (
                                                    <BreadcrumbPage className="text-primary font-medium">
                                                        {item.label}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link to={item.path} className="text-[#588d70] hover:text-primary transition-colors">
                                                            {item.label}
                                                        </Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </div>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                            <h2 className="text-xl font-bold mt-1">{breadcrumb.title}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <div className="relative hidden lg:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#588d70]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-background-light dark:bg-white/5 border border-[#d3e4da] dark:border-white/10 rounded-lg text-sm w-64 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="Search..."
                                type="text"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-background-light dark:bg-white/5 hover:bg-[#e9f1ed] transition-colors relative border-none outline-none">
                                <span className="material-symbols-outlined text-[#101914] dark:text-white">notifications</span>
                                <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="h-8 w-px bg-[#d3e4da] mx-2"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.fullname || 'Vendor'}</p>
                                    <p className="text-[11px] text-[#588d70] font-medium tracking-wide uppercase">Vendor</p>
                                </div>
                                <div
                                    className="size-10 rounded-full bg-primary/10 bg-center bg-cover border-2 border-primary/20"
                                    style={{
                                        backgroundImage: user?.avatarUrl
                                            ? `url(${user.avatarUrl})`
                                            : `url("https://ui-avatars.com/api/?name=${user?.fullname || 'V'}&background=random")`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
