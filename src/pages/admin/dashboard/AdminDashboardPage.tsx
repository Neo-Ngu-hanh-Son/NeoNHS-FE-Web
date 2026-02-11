import { useEffect, useState } from 'react';
import { authService } from '@/services/api/authService';

export function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            await authService.getCurrentUser();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Users */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-lg border border-[#d3e4da] dark:border-white/10 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#588d70] text-sm font-medium">Total Users</span>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">groups</span>
                    </div>
                    <p className="text-2xl font-bold">12,840</p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                        <span className="text-[#078829] font-bold">+12%</span>
                        <span className="text-[#588d70]">from last month</span>
                    </div>
                </div>

                {/* Vendors */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-lg border border-[#d3e4da] dark:border-white/10 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#588d70] text-sm font-medium">Active Vendors</span>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">storefront</span>
                    </div>
                    <p className="text-2xl font-bold">450</p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                        <span className="text-[#078829] font-bold">+5%</span>
                        <span className="text-[#588d70]">new registrations</span>
                    </div>
                </div>

                {/* Tickets */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-lg border border-[#d3e4da] dark:border-white/10 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#588d70] text-sm font-medium">Tickets Sold</span>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">confirmation_number</span>
                    </div>
                    <p className="text-2xl font-bold">8,230</p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                        <span className="text-[#078829] font-bold">+18%</span>
                        <span className="text-[#588d70]">this season</span>
                    </div>
                </div>

                {/* Revenue - Accent Gold */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-lg border border-accent-gold/30 dark:border-accent-gold/20 flex flex-col gap-1 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-16 bg-accent-gold/5 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#588d70] text-sm font-medium">Revenue</span>
                        <span className="material-symbols-outlined text-accent-gold bg-sidebar-bg p-1.5 rounded-lg">payments</span>
                    </div>
                    <p className="text-2xl font-bold text-sidebar-bg dark:text-accent-gold">$124,500</p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                        <span className="text-[#078829] font-bold">+22%</span>
                        <span className="text-[#588d70]">vs prev. month</span>
                    </div>
                </div>

                {/* Vouchers */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-lg border border-[#d3e4da] dark:border-white/10 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#588d70] text-sm font-medium">Vouchers</span>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">loyalty</span>
                    </div>
                    <p className="text-2xl font-bold">1,200</p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                        <span className="text-[#078829] font-bold">+8%</span>
                        <span className="text-[#588d70]">redemption rate</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Line Chart: Revenue Trends */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-lg border border-[#d3e4da] dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Revenue Trends</h3>
                            <p className="text-sm text-[#588d70]">Monthly financial overview</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-bold bg-[#e9f1ed] text-primary rounded-lg border border-primary/20">Line</button>
                            <button className="px-3 py-1 text-xs font-medium text-[#588d70] hover:bg-[#e9f1ed] rounded-lg">Area</button>
                        </div>
                    </div>
                    <div className="h-64 w-full relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                            <defs>
                                <linearGradient id="gradient-accent" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#FFD700" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,150 L50,130 L100,160 L150,100 L200,120 L250,80 L300,95 L350,60 L400,75 L450,40 L500,55" fill="none" stroke="#FFD700" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                            <path d="M0,150 L50,130 L100,160 L150,100 L200,120 L250,80 L300,95 L350,60 L400,75 L450,40 L500,55 V200 H0 Z" fill="url(#gradient-accent)"></path>
                            {/* Points */}
                            <circle cx="450" cy="40" fill="#185835" r="5" stroke="#FFD700" strokeWidth="2"></circle>
                        </svg>
                        <div className="flex justify-between mt-4 px-2">
                            <span className="text-xs text-[#588d70] font-bold">Jan</span>
                            <span className="text-xs text-[#588d70] font-bold">Mar</span>
                            <span className="text-xs text-[#588d70] font-bold">May</span>
                            <span className="text-xs text-[#588d70] font-bold">Jul</span>
                            <span className="text-xs text-[#588d70] font-bold">Sep</span>
                            <span className="text-xs text-[#588d70] font-bold">Nov</span>
                        </div>
                    </div>
                </div>

                {/* Bar Chart: Sales Category */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-lg border border-[#d3e4da] dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Sales by Category</h3>
                            <p className="text-sm text-[#588d70]">Top performing sectors</p>
                        </div>
                        <button className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                            Details <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4 px-2 pb-6">
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#e9f1ed] rounded-t-lg relative" style={{ height: '90%' }}>
                                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: '100%' }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-[#588d70] uppercase">Tours</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#e9f1ed] rounded-t-lg relative" style={{ height: '70%' }}>
                                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: '100%' }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-[#588d70] uppercase">Events</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#e9f1ed] rounded-t-lg relative" style={{ height: '55%' }}>
                                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: '100%' }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-[#588d70] uppercase">Parks</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#e9f1ed] rounded-t-lg relative" style={{ height: '40%' }}>
                                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: '100%' }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-[#588d70] uppercase">Hotels</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-[#e9f1ed] rounded-t-lg relative" style={{ height: '65%' }}>
                                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: '100%' }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-[#588d70] uppercase">Museums</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white dark:bg-white/5 rounded-lg border border-[#d3e4da] dark:border-white/10 shadow-sm">
                <div className="p-6 border-b border-[#d3e4da] dark:border-white/10 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Recent Vendor Activity</h3>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Download Report
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background-light dark:bg-white/5 text-[#588d70] text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Vendor Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Registration Date</th>
                                <th className="px-6 py-4">Revenue Share</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d3e4da] dark:divide-white/10">
                            {[
                                { name: 'Safari Blue Tours', initial: 'SB', status: 'Active', category: 'Tour Agency', date: 'Oct 24, 2023', revenue: '$4,250.00', statusColor: 'green' },
                                { name: 'Grand Museum Hub', initial: 'GM', status: 'Pending', category: 'Museum', date: 'Oct 22, 2023', revenue: '$0.00', statusColor: 'yellow' },
                                { name: 'Eco Park Reserve', initial: 'EP', status: 'Active', category: 'Park', date: 'Oct 20, 2023', revenue: '$1,890.00', statusColor: 'green' },
                            ].map((vendor, index) => (
                                <tr key={index} className="hover:bg-[#f9fbfa] dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="size-8 rounded bg-[#e9f1ed] flex items-center justify-center font-bold text-primary">{vendor.initial}</div>
                                        <span className="text-sm font-medium">{vendor.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full bg-${vendor.statusColor}-100 text-${vendor.statusColor}-700 text-[10px] font-bold uppercase`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{vendor.category}</td>
                                    <td className="px-6 py-4 text-sm text-[#588d70]">{vendor.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold">{vendor.revenue}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#588d70] hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-[#d3e4da] dark:border-white/10 flex justify-center">
                    <button className="text-sm font-bold text-primary hover:underline">View All Activities</button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
