import React, { useState, useEffect } from "react";
import adminDashboardService from "@/services/api/adminDashboardService";
import { RevenueReport, Transaction } from "@/types/adminDashboard";
import { Spin, message, Table, Tag, Select, Button } from "antd";
import { motion } from "framer-motion";
import type { ColumnsType } from "antd/es/table";
import { RevenueTrendsCard } from "./components/RevenueTrendsCard";

const MaterialIcon: React.FC<{ name: string; className?: string; fill?: boolean }> = ({ name, className = "", fill = false }) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={fill ? { fontVariationSettings: "'FILL' 1" } : {}}
    >
        {name}
    </span>
);

const RevenuePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<RevenueReport | null>(null);
    const [selectedRange, setSelectedRange] = useState<string>("last_month");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | Transaction["status"]>("ALL");
    const [dateRange, setDateRange] = useState<[string, string]>([
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
    ]);

    const calculateDates = (range: string): [string, string] => {
        const end = new Date();
        const start = new Date();
        if (range === "last_month") {
            start.setMonth(end.getMonth() - 1);
        } else if (range === "3_months") {
            start.setMonth(end.getMonth() - 3);
        } else if (range === "6_months") {
            start.setMonth(end.getMonth() - 6);
        }
        return [
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0]
        ];
    };

    const fetchData = async (start: string, end: string) => {
        setLoading(true);
        try {
            const result = await adminDashboardService.getRevenueReport(start, end);

            // Calculate percentages locally if missing
            const total = result.summary.totalGross || 1;
            const vendorBreakdown = result.vendorBreakdown.map(v => ({
                ...v,
                percentage: v.percentage ?? (v.amount / total) * 100
            }));

            setData({
                ...result,
                vendorBreakdown
            });
        } catch (error) {
            console.error("Error fetching revenue report:", error);
            message.error("Failed to fetch revenue report data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(dateRange[0], dateRange[1]);
    }, []);

    const handleRangeChange = (value: string) => {
        setSelectedRange(value);
        const [start, end] = calculateDates(value);
        setDateRange([start, end]);
        fetchData(start, end);
    };

    const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const filteredTransactions = (data?.transactions || [])
        .filter(t => {
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
                t.vendor.toLowerCase().includes(q) ||
                t.item.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q)
            );
        })
        .filter(t => statusFilter === "ALL" ? true : t.status === statusFilter);

    const columns: ColumnsType<Transaction> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => (
                <span className="text-gray-500 dark:text-gray-400 font-mono text-[11px] bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    #{text}
                </span>
            ),
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            render: (text) => <span className="font-bold text-slate-900 dark:text-white">{text}</span>,
        },
        {
            title: 'Activity Item',
            dataIndex: 'item',
            key: 'item',
            render: (text) => <span className="text-xs text-slate-600 dark:text-slate-300">{text}</span>,
        },
        {
            title: 'Amount',
            dataIndex: 'gross',
            key: 'gross',
            align: 'right',
            render: (value) => <span className="font-black text-slate-900 dark:text-white tabular-nums">{formatVND(value)}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = "blue";
                if (status === "COMPLETED" || status === "SUCCESS") color = "success";
                if (status === "PENDING") color = "warning";
                if (status === "REFUNDED") color = "error";
                return (
                    <Tag color={color} className="font-bold uppercase rounded-full px-3 text-[9px] border-none">
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Transaction Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <span className="font-medium text-slate-500 dark:text-slate-400 text-[11px]">{new Date(text).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>,
        }
    ];

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="size-16 border-4 border-primary border-t-transparent rounded-full shadow-lg"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-white/5 dark:to-transparent p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Revenue
                        </h2>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                            Monitor gross revenue, admin earnings, vendor payouts, and transaction activity.
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300">
                            <MaterialIcon name="date_range" className="text-base text-slate-500 dark:text-slate-300" />
                            <span className="font-semibold tabular-nums">{dateRange[0]}</span>
                            <span className="opacity-60">→</span>
                            <span className="font-semibold tabular-nums">{dateRange[1]}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                        <div className="min-w-[280px]">
                            <p className="text-xs font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                                Date Range
                            </p>
                            <Select className="w-full h-11" value={selectedRange} onChange={handleRangeChange}>
                                <Select.Option value="last_month">Last Month</Select.Option>
                                <Select.Option value="3_months">Last 3 Months</Select.Option>
                                <Select.Option value="6_months">Last 6 Months</Select.Option>
                            </Select>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                icon={<MaterialIcon name="refresh" className="text-lg" />}
                                onClick={() => fetchData(dateRange[0], dateRange[1])}
                                className="h-11 px-4 border-slate-200 hover:text-primary hover:border-primary"
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Gross */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-2xl border-l-4 border-primary shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <MaterialIcon name="payments" className="text-xl" />
                        </div>
                        {data?.summary.revenueGrowth !== undefined && (
                            <span className={`text-xs font-bold flex items-center gap-1 ${data.summary.revenueGrowth >= 0 ? "text-primary" : "text-red-500"}`}>
                                <MaterialIcon name={data.summary.revenueGrowth >= 0 ? "trending_up" : "trending_down"} className="text-xs" />
                                {Math.abs(data.summary.revenueGrowth).toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Gross</p>
                    <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white tabular-nums">
                        {formatVND(data?.summary.totalGross || 0)}
                    </h3>
                </div>

                {/* Admin Earnings */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-2xl border-l-4 border-accent-gold shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-accent-gold/20 rounded-lg text-sidebar-bg">
                            <MaterialIcon name="account_balance_wallet" className="text-xl text-[#b8860b]" />
                        </div>
                        {data?.summary.netRevenueGrowth !== undefined && (
                            <span className={`text-xs font-bold flex items-center gap-1 ${data.summary.netRevenueGrowth >= 0 ? "text-primary" : "text-red-500"}`}>
                                <MaterialIcon name={data.summary.netRevenueGrowth >= 0 ? "trending_up" : "trending_down"} className="text-xs" />
                                {Math.abs(data.summary.netRevenueGrowth).toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Admin Earnings</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white tabular-nums">
                            {formatVND(data?.summary.adminEarnings || 0)}
                        </h3>
                        <div className="size-2 rounded-full bg-accent-gold shadow-[0_0_8px_#FFD700]"></div>
                    </div>
                </div>

                {/* Total Transactions */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-2xl border-l-4 border-primary shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <MaterialIcon name="receipt_long" className="text-xl" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest opacity-60">Success Rates</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Transactions</p>
                    <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white tabular-nums">
                        {data?.summary.totalTransactions.toLocaleString() || 0}
                    </h3>
                </div>

                {/* Vendor Payouts */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-2xl border-l-4 border-primary shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <MaterialIcon name="group" className="text-xl" />
                        </div>
                        {data?.summary.avgOrderValueGrowth !== undefined && (
                            <span className={`text-xs font-bold flex items-center gap-1 ${data.summary.avgOrderValueGrowth >= 0 ? "text-primary" : "text-red-500"}`}>
                                <MaterialIcon name={data.summary.avgOrderValueGrowth >= 0 ? "trending_up" : "trending_down"} className="text-xs" />
                                {Math.abs(data.summary.avgOrderValueGrowth).toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Vendor Payouts</p>
                    <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white tabular-nums">
                        {formatVND(data?.summary.vendorPayouts || 0)}
                    </h3>
                </div>
            </section>

            {/* Section 3: Trends + Vendor Breakdown */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RevenueTrendsCard points={data?.revenueTrends || []} />
                </div>

                {/* Vendor Breakdown */}
                <div className="lg:col-span-1 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <MaterialIcon name="pie_chart" className="text-xl" />
                        </div>
                        <h4 className="font-bold text-lg">Vendor Contribution</h4>
                    </div>
                    <div className="space-y-6 flex-grow">
                        {data?.vendorBreakdown.slice(0, 5).map((vendor, index) => (
                            <div key={index} className="space-y-2 group">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">{vendor.vendorName}</span>
                                    <span className="font-black tabular-nums text-gray-900">{formatVND(vendor.amount)}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${vendor.percentage}%` }}
                                        className="bg-primary h-full rounded-full"
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    ></motion.div>
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">
                                    {vendor.percentage?.toFixed(1)}%
                                </div>
                            </div>
                        ))}
                        {data?.vendorBreakdown.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 py-10 scale-90">
                                <MaterialIcon name="folder_open" className="text-6xl mb-2" />
                                <p className="font-black uppercase tracking-tighter">No data</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 4: Transactions */}
            <section className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between bg-gray-50/50 dark:bg-white/5 gap-4">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                        <MaterialIcon name="history" /> Transactions
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-72">
                            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10" />
                            <input
                                type="text"
                                placeholder="Search by vendor, item, or id..."
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black/10 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            className="w-full sm:w-44 h-10"
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(v)}
                        >
                            <Select.Option value="ALL">All statuses</Select.Option>
                            <Select.Option value="SUCCESS">Success</Select.Option>
                            <Select.Option value="COMPLETED">Completed</Select.Option>
                            <Select.Option value="PENDING">Pending</Select.Option>
                            <Select.Option value="REFUNDED">Refunded</Select.Option>
                        </Select>
                        <Button
                            icon={<MaterialIcon name="refresh" className="text-lg" />}
                            onClick={() => fetchData(dateRange[0], dateRange[1])}
                            className="border-gray-200 hover:text-primary hover:border-primary"
                        />
                    </div>
                </div>
                <div className="p-0 overflow-x-auto">
                    <Table
                        dataSource={filteredTransactions}
                        columns={columns}
                        pagination={{ pageSize: 8, showSizeChanger: false, position: ['bottomCenter'] }}
                        loading={loading}
                        rowKey="id"
                        className="revenue-table"
                    />
                </div>
            </section>
        </div>
    );
};

export default RevenuePage;
