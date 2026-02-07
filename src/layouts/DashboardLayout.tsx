import { ReactNode, useState } from 'react';
import { ModernSidebar } from '@/components/dashboard/ModernSidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Sidebar */}
            <ModernSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content */}
            <main className="flex-1 min-h-screen">
                {/* Content Container */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {!sidebarCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}
        </div>
    );
}
