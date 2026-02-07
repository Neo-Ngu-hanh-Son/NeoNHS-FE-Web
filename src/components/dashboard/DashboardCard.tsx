import { ReactNode } from 'react';
import { Spin } from 'antd';

interface DashboardCardProps {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    loading?: boolean;
    className?: string;
}

export function DashboardCard({
    title,
    subtitle,
    actions,
    children,
    footer,
    loading = false,
    className = '',
}: DashboardCardProps) {
    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
            {/* Header */}
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                        <div>
                            {title && (
                                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                            )}
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spin size="large" />
                    </div>
                ) : (
                    children
                )}
            </div>

            {/* Footer */}
            {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
}
