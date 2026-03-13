import React, { useState, useEffect } from "react";
import adminDashboardService from "@/services/api/adminDashboardService";
import { RevenueReport, Transaction } from "@/types/adminDashboard";
import { Spin, message, Table, Tag, Select, Button } from "antd";
import { motion } from "framer-motion";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import type { ColumnsType } from "antd/es/table";

const chartConfig = {
    revenue: {
        label: "Gross Revenue",
        color: "#169c53",
    },
    previousRevenue: {
        label: "Admin Earnings",
        color: "#FFD700",
    },
} satisfies ChartConfig;

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

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <span className="font-medium text-xs truncate max-w-[120px] inline-block">{new Date(text).toLocaleString()}</span>,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span className="text-gray-500 font-mono text-xs">{text}</span>,
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
            render: (text) => <span className="text-xs">{text}</span>,
        },
        {
            title: 'Gross',
            dataIndex: 'gross',
            key: 'gross',
            align: 'right',
            render: (value) => <span className="font-semibold text-sidebar-bg dark:text-white tabular-nums">{formatVND(value)}</span>,
        },
        {
            title: 'Fee',
            dataIndex: 'fee',
            key: 'fee',
            align: 'right',
            render: (value) => <span className="text-red-500 tabular-nums">-{formatVND(value)}</span>,
        },
        {
            title: 'Net',
            dataIndex: 'net',
            key: 'net',
            align: 'right',
            render: (value) => <span className="font-bold text-primary tabular-nums">{formatVND(value)}</span>,
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
                    <Tag color={color} className="font-bold uppercase rounded-full px-3 text-[10px]">
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
                {/* Total Gross */}
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-primary shadow-sm">
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
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-accent-gold shadow-sm">
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
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-primary shadow-sm">
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
                <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-6 rounded-xl border-l-4 border-primary shadow-sm">
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

            {/* Section 3: Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm relative overflow-visible">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-lg">Revenue Over Time</h4>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs">
                                <div className="size-3 rounded-full bg-primary"></div> <span>Gross</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="size-3 rounded-full bg-accent-gold"></div> <span>Earned</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart
                                data={data?.revenueTrends || []}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                                <XAxis
                                    dataKey="period"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={12}
                                    fontSize={10}
                                    className="font-medium"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={12}
                                    fontSize={10}
                                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) => String(value)}
                                            formatter={(value, name) => [
                                                formatVND(Number(value)),
                                                name === "revenue" ? "Gross" : "Earnings"
                                            ]}
                                        />
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-revenue)"
                                    fill="url(#fillRevenue)"
                                    strokeWidth={3}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
                    <h4 className="font-bold text-lg mb-6">Revenue breakdown by Vendor</h4>
                    <div className="space-y-6">
                        {data?.vendorBreakdown.map((vendor, index) => (
                            <div key={index} className="space-y-2 group">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium group-hover:text-primary transition-colors">{vendor.vendorName}</span>
                                    <span className="font-bold tabular-nums">{formatVND(vendor.amount)}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${vendor.percentage}%` }}
                                        className="bg-primary h-2.5 rounded-full"
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    ></motion.div>
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">
                                    {vendor.percentage?.toFixed(1)}% of total
                                </div>
                            </div>
                        ))}
                        {data?.vendorBreakdown.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 py-10 scale-90">
                                <MaterialIcon name="folder_open" className="text-6xl mb-2" />
                                <p className="font-black uppercase tracking-tighter">No vendor data available</p>
                            </div>
                        )}
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
                <div className="p-4">
                    <Table
                        dataSource={data?.transactions}
                        columns={columns}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
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
