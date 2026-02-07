import { ReactNode } from 'react';
import { RoleBasedSidebar } from '@/components/profile/RoleBasedSidebar';

interface ProfileLayoutProps {
    children: ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-24">
                            <RoleBasedSidebar />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
