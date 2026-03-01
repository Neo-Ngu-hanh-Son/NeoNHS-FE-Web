import React, { useState, useEffect } from "react";
import adminDashboardService from "@/services/api/adminDashboardService";
import { RevenueReport, Transaction } from "@/types/adminDashboard";
import { Spin, message, Table, Tag, Select, Button } from "antd";
import type { ColumnsType } from "antd/es/table";



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
            setData(result);
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

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: 'Vendor',
            dataIndex: 'vendorName',
            key: 'vendorName',
        },
        {
            title: 'Item',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: 'Gross',
            dataIndex: 'grossAmount',
            key: 'grossAmount',
            align: 'right',
            render: (value) => <span className="font-semibold text-sidebar-bg dark:text-white">{formatVND(value)}</span>,
        },
        {
            title: 'Fee',
            dataIndex: 'fee',
            key: 'fee',
            align: 'right',
            render: (value) => <span className="text-red-500">-{formatVND(value)}</span>,
        },
        {
            title: 'Net',
            dataIndex: 'netAmount',
            key: 'netAmount',
            align: 'right',
            render: (value) => <span className="font-bold text-primary">{formatVND(value)}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = "blue";
                if (status === "COMPLETED") color = "success";
                if (status === "PENDING") color = "warning";
                if (status === "REFUNDED") color = "error";
                return (
                    <Tag color={color} className="font-bold uppercase rounded-full px-3">
                        {status}
                    </Tag>
                );
            },
        },
    ];

    if (loading && !data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spin size="large" tip="Loading Revenue Report..." />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Section 1: Filters */}
            <section className="bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 flex flex-wrap items-end gap-6 shadow-sm">
                <div className="flex-1 min-w-[300px]">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-tight">Date Range</p>
                    <Select
                        className="w-full h-11"
                        value={selectedRange}
                        onChange={handleRangeChange}
                    >
                        <Select.Option value="last_month">Last Month ({dateRange[0]} to {dateRange[1]})</Select.Option>
                        <Select.Option value="3_months">Last 3 Months</Select.Option>
                        <Select.Option value="6_months">Last 6 Months</Select.Option>
                    </Select>
                </div>
                <div className="flex gap-3">
                    <Button
                        icon={<MaterialIcon name="download" className="text-sm" />}
                        className="h-11 px-6 font-semibold border-primary text-primary hover:text-primary hover:border-primary"
                    >
                        Export CSV
                    </Button>
                </div>
            </section>

            {/* Section 2: KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-primary shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <MaterialIcon name="payments" className="text-xl" />
                        </div>
                        <span className={`text-xs font-bold flex items-center gap-1 ${data?.kpis.revenueGrowth! >= 0 ? "text-primary" : "text-red-500"}`}>
                            <MaterialIcon name={data?.kpis.revenueGrowth! >= 0 ? "trending_up" : "trending_down"} className="text-xs" />
                            {Math.abs(data?.kpis.revenueGrowth || 0).toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white">
                        {formatVND(data?.kpis.totalRevenue || 0)}
                    </h3>
                </div>

                {/* Net Revenue */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-accent-gold shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-accent-gold/20 rounded-lg text-sidebar-bg">
                            <MaterialIcon name="account_balance_wallet" className="text-xl text-[#b8860b]" />
                        </div>
                        <span className={`text-xs font-bold flex items-center gap-1 ${data?.kpis.netRevenueGrowth! >= 0 ? "text-primary" : "text-red-500"}`}>
                            <MaterialIcon name={data?.kpis.netRevenueGrowth! >= 0 ? "trending_up" : "trending_down"} className="text-xs" />
                            {Math.abs(data?.kpis.netRevenueGrowth || 0).toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Net Revenue</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white">
                            {formatVND(data?.kpis.netRevenue || 0)}
                        </h3>
                        <div className="size-2 rounded-full bg-accent-gold shadow-[0_0_8px_#FFD700]"></div>
                    </div>
                </div>

                {/* Total Transactions */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-primary shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <MaterialIcon name="receipt_long" className="text-xl" />
                        </div>
                        <span className="text-xs font-bold text-gray-400">Current Period</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Transactions</p>
                    <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white">
                        {data?.kpis.totalTransactions.toLocaleString() || 0}
                    </h3>
                </div>

                {/* Avg Order Value */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-primary shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <MaterialIcon name="avg_time" className="text-xl" />
                        </div>
                        <span className={`text-xs font-bold flex items-center gap-1 ${data?.kpis.avgOrderValueGrowth! >= 0 ? "text-primary" : "text-red-500"}`}>
                            <MaterialIcon name={data?.kpis.avgOrderValueGrowth! >= 0 ? "trending_up" : "trending_down"} className="text-xs" />
                            {Math.abs(data?.kpis.avgOrderValueGrowth || 0).toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg Order Value</p>
                    <h3 className="text-2xl font-bold mt-1 text-sidebar-bg dark:text-white">
                        {formatVND(data?.kpis.avgOrderValue || 0)}
                    </h3>
                </div>
            </section>

            {/* Section 3: Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-lg">Revenue Over Time</h4>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs">
                                <div className="size-3 rounded-full bg-primary"></div> <span>Gross</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="size-3 rounded-full bg-accent-gold"></div> <span>Net</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-2 relative">
                        {/* Simple SVG Visualization for Chart Placeholder - in real app would use Recharts/Chart.js */}
                        <svg className="w-full h-full" viewBox="0 0 400 150">
                            <defs>
                                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: "#169c53", stopOpacity: 0.2 }} />
                                    <stop offset="100%" style={{ stopColor: "#169c53", stopOpacity: 0 }} />
                                </linearGradient>
                            </defs>
                            <path d="M0,130 Q50,110 100,120 T200,80 T300,90 T400,40 L400,150 L0,150 Z" fill="url(#grad1)" />
                            <path d="M0,130 Q50,110 100,120 T200,80 T300,90 T400,40" fill="none" stroke="#169c53" strokeWidth="3" />
                            <path d="M0,140 Q50,130 100,135 T200,110 T300,120 T400,90" fill="none" stroke="#FFD700" strokeDasharray="4" strokeWidth="2" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <h4 className="font-bold text-lg mb-6">Revenue by Vendor</h4>
                    <div className="space-y-6">
                        {data?.revenueByVendor.map((vendor, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{vendor.vendorName}</span>
                                    <span className="font-bold">{formatVND(vendor.totalRevenue)}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2.5">
                                    <div
                                        className="bg-primary h-2.5 rounded-full transition-all duration-1000"
                                        style={{ width: `${vendor.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Detailed Data Table */}
            <section className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                        <MaterialIcon name="history" /> Transaction History
                    </h4>
                    <div className="flex gap-2">
                        <Button type="text" icon={<MaterialIcon name="analytics" />} />
                        <Button type="text" icon={<MaterialIcon name="refresh" />} onClick={() => fetchData(dateRange[0], dateRange[1])} />
                    </div>
                </div>
                <div className="p-0">
                    <Table
                        dataSource={data?.transactions}
                        columns={columns}
                        pagination={{ pageSize: 5 }}
                        loading={loading}
                        rowKey="transactionId"
                        className="revenue-table"
                    />
                </div>
            </section>
        </div>
    );
};

export default RevenuePage;
