import { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ClockCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import {
    Banknote,
    Wallet,
    Receipt,
    Users,
    RefreshCw,
    History,
    Search,
    FolderOpen,
} from 'lucide-react';
import adminDashboardService from '@/services/api/adminDashboardService';
import { RevenueReport, Transaction } from '@/types/adminDashboard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueTrendsCard } from './components/RevenueTrendsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatCompactNumber, formatCurrency } from '@/utils/helpers';

const RANGE_OPTIONS = [
    { value: 'last_month', label: 'Tháng qua' },
    { value: '3_months', label: '3 tháng qua' },
    { value: '6_months', label: '6 tháng qua' },
] as const;

type RangeKey = (typeof RANGE_OPTIONS)[number]['value'];

const STATUS_LABEL_VI: Record<Transaction['status'], string> = {
    SUCCESS: 'Thành công',
    COMPLETED: 'Hoàn tất',
    PENDING: 'Đang chờ',
    REFUNDED: 'Hoàn tiền',
};

function statusBadgeClass(status: Transaction['status']) {
    if (status === 'SUCCESS' || status === 'COMPLETED') {
        return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200';
    }
    if (status === 'PENDING') {
        return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200';
    }
    return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200';
}

const RevenuePage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<RevenueReport | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [selectedRange, setSelectedRange] = useState<RangeKey>('last_month');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | Transaction['status']>('ALL');
    const [dateRange, setDateRange] = useState<[string, string]>([
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
    ]);

    const calculateDates = (range: RangeKey): [string, string] => {
        const end = new Date();
        const start = new Date();
        if (range === 'last_month') {
            start.setMonth(end.getMonth() - 1);
        } else if (range === '3_months') {
            start.setMonth(end.getMonth() - 3);
        } else if (range === '6_months') {
            start.setMonth(end.getMonth() - 6);
        }
        return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
    };

    const fetchData = async (start: string, end: string) => {
        setLoading(true);
        setFetchError(null);
        try {
            const result = await adminDashboardService.getRevenueReport(start, end);
            const total = result.summary.totalGross || 1;
            const vendorBreakdown = result.vendorBreakdown.map((v) => ({
                ...v,
                percentage: v.percentage ?? (v.amount / total) * 100,
            }));
            setData({
                ...result,
                vendorBreakdown,
            });
        } catch (error) {
            //console.error('Error fetching revenue report:', error);
            setFetchError('Không tải được báo cáo doanh thu. Vui lòng thử lại sau.');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(dateRange[0], dateRange[1]);
    }, []);

    const handleRangeChange = (value: RangeKey) => {
        setSelectedRange(value);
        const [start, end] = calculateDates(value);
        setDateRange([start, end]);
        fetchData(start, end);
    };

    const formatVND = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const filteredTransactions = (data?.transactions || [])
        .filter((t) => {
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
                t.vendor.toLowerCase().includes(q) ||
                t.item.toLowerCase().includes(q) ||
                t.id.toLowerCase().includes(q)
            );
        })
        .filter((t) => (statusFilter === 'ALL' ? true : t.status === statusFilter));

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Mã',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => (
                <span className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">#{text}</span>
            ),
        },
        {
            title: 'Đối tác',
            dataIndex: 'vendor',
            key: 'vendor',
            render: (text: string) => <span className="font-medium text-slate-900 dark:text-slate-100">{text}</span>,
        },
        {
            title: 'Mục / hoạt động',
            dataIndex: 'item',
            key: 'item',
            render: (text: string) => <span className="text-xs text-muted-foreground">{text}</span>,
        },
        {
            title: 'Số tiền',
            dataIndex: 'gross',
            key: 'gross',
            align: 'right',
            render: (value: number) => (
                <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">{formatVND(value)}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Transaction['status']) => (
                <Badge variant="outline" className={`text-[10px] font-semibold uppercase ${statusBadgeClass(status)}`}>
                    {STATUS_LABEL_VI[status] ?? status}
                </Badge>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => (
                <span className="text-[11px] font-medium text-muted-foreground">
                    {new Date(text).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            ),
        },
    ];

    if (loading && !data) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center p-12">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
                    <p className="text-muted-foreground">Đang tải báo cáo doanh thu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl p-4">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-transparent">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Báo cáo doanh thu</h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            Theo dõi doanh thu gộp, thu nhập quản trị, chi trả Đối tác và giao dịch.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            <ClockCircleOutlined className="text-primary" />
                            <span className="font-semibold tabular-nums">{dateRange[0]}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-semibold tabular-nums">{dateRange[1]}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground">Khoảng thời gian</p>
                            <Select value={selectedRange} onValueChange={(v) => handleRangeChange(v as RangeKey)}>
                                <SelectTrigger className="h-9 w-full min-w-[200px] bg-background sm:w-[220px]">
                                    <SelectValue placeholder="Chọn kỳ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RANGE_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2"
                            onClick={() => fetchData(dateRange[0], dateRange[1])}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                    </div>
                </div>
            </div>

            {fetchError ? (
                <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
                    <AlertDescription>{fetchError}</AlertDescription>
                </Alert>
            ) : null}

            {data ? (
                <>
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} sm={12} xl={6}>
                            <StatsCard
                                title="Tổng doanh thu gộp"
                                value={formatCompactNumber(data.summary.totalGross)}
                                subtitle={formatCurrency(data.summary.totalGross)}
                                icon={<Banknote className="h-6 w-6 text-white" />}
                                iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
                                trend={
                                    data.summary.revenueGrowth !== undefined
                                        ? {
                                              value: Math.abs(data.summary.revenueGrowth),
                                              isPositive: data.summary.revenueGrowth >= 0,
                                          }
                                        : undefined
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} xl={6}>
                            <StatsCard
                                title="Thu nhập quản trị"
                                value={formatCompactNumber(data.summary.adminEarnings)}
                                subtitle={formatCurrency(data.summary.adminEarnings)}
                                icon={<Wallet className="h-6 w-6 text-white" />}
                                iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
                                trend={
                                    data.summary.netRevenueGrowth !== undefined
                                        ? {
                                              value: Math.abs(data.summary.netRevenueGrowth),
                                              isPositive: data.summary.netRevenueGrowth >= 0,
                                          }
                                        : undefined
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} xl={6}>
                            <StatsCard
                                title="Số giao dịch"
                                value={data.summary.totalTransactions.toLocaleString('vi-VN')}
                                icon={<Receipt className="h-6 w-6 text-white" />}
                                iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                            />
                        </Col>
                        <Col xs={24} sm={12} xl={6}>
                            <StatsCard
                                title="Chi trả Đối tác"
                                value={formatCompactNumber(data.summary.vendorPayouts)}
                                subtitle={formatCurrency(data.summary.vendorPayouts)}
                                icon={<Users className="h-6 w-6 text-white" />}
                                iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
                                trend={
                                    data.summary.avgOrderValueGrowth !== undefined
                                        ? {
                                              value: Math.abs(data.summary.avgOrderValueGrowth),
                                              isPositive: data.summary.avgOrderValueGrowth >= 0,
                                          }
                                        : undefined
                                }
                            />
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 16 }} align="stretch">
                        <Col xs={24} lg={16} style={{ display: 'flex' }}>
                            <div className="w-full" style={{ flex: 1 }}>
                                <RevenueTrendsCard points={data.revenueTrends} />
                            </div>
                        </Col>
                        <Col xs={24} lg={8} style={{ display: 'flex' }}>
                            <Card className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
                                <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                            <PieChartOutlined className="text-lg" />
                                        </div>
                                        <div className="min-w-0">
                                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                                                Đóng góp theo Đối tác
                                            </CardTitle>
                                            <CardDescription className="text-xs text-muted-foreground">Top 5 theo doanh thu</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col space-y-5 pt-4">
                                    {data.vendorBreakdown.length > 0 ? (
                                        data.vendorBreakdown.slice(0, 5).map((vendor, index) => (
                                            <div key={`${vendor.vendorName}-${index}`} className="space-y-2">
                                                <div className="flex justify-between gap-2 text-sm">
                                                    <span className="truncate font-medium text-slate-800 dark:text-slate-100" title={vendor.vendorName}>
                                                        {vendor.vendorName}
                                                    </span>
                                                    <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">
                                                        {formatVND(vendor.amount)}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                                                        style={{ width: `${Math.min(100, vendor.percentage ?? 0)}%` }}
                                                    />
                                                </div>
                                                <div className="text-right text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                                    {(vendor.percentage ?? 0).toFixed(1)}%
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col flex-1 items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
                                            <FolderOpen className="h-10 w-10 opacity-30" />
                                            <p>Chưa có dữ liệu phân bổ</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-sm dark:border-slate-700">
                        <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-700">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        <History className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Giao dịch</CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground">Danh sách giao dịch trong khoảng thời gian</CardDescription>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
                                    <div className="relative flex-1 sm:max-w-xs">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm theo Đối tác, mục hoặc mã..."
                                            className="h-9 pl-9"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
                                    >
                                        <SelectTrigger className="h-9 w-full bg-background sm:w-[160px]">
                                            <SelectValue placeholder="Trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Mọi trạng thái</SelectItem>
                                            <SelectItem value="SUCCESS">Thành công</SelectItem>
                                            <SelectItem value="COMPLETED">Hoàn tất</SelectItem>
                                            <SelectItem value="PENDING">Đang chờ</SelectItem>
                                            <SelectItem value="REFUNDED">Hoàn tiền</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-9 w-9 shrink-0"
                                        onClick={() => fetchData(dateRange[0], dateRange[1])}
                                        disabled={loading}
                                        aria-label="Làm mới danh sách"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 pb-4">
                            <div className="overflow-x-auto px-4 pt-2">
                                <Table
                                    dataSource={filteredTransactions}
                                    columns={columns}
                                    pagination={{ pageSize: 8, showSizeChanger: false, position: ['bottomCenter'] }}
                                    loading={loading}
                                    rowKey="id"
                                    size="middle"
                                    className="revenue-table"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : !fetchError ? (
                <p className="mt-8 text-center text-sm text-muted-foreground">Không có dữ liệu.</p>
            ) : null}
        </div>
    );
};

export default RevenuePage;
