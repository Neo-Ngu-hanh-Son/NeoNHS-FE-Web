  import { useState, useMemo } from 'react';
import {
    DollarSign,
    Briefcase,
    CalendarCheck,
    Ticket,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Bell,
    Star,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from '@/components/ui/chart';
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Pie,
    PieChart,
    Cell,
    Label,
} from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────

const revenueWeekly = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 2100 },
    { name: 'Wed', revenue: 800 },
    { name: 'Thu', revenue: 1600 },
    { name: 'Fri', revenue: 2400 },
    { name: 'Sat', revenue: 3200 },
    { name: 'Sun', revenue: 2800 },
];

const revenueMonthly = [
    { name: 'Week 1', revenue: 8200 },
    { name: 'Week 2', revenue: 12500 },
    { name: 'Week 3', revenue: 9800 },
    { name: 'Week 4', revenue: 14200 },
];

const revenueYearly = [
    { name: 'Jan', revenue: 32000 },
    { name: 'Feb', revenue: 28000 },
    { name: 'Mar', revenue: 45000 },
    { name: 'Apr', revenue: 38000 },
    { name: 'May', revenue: 52000 },
    { name: 'Jun', revenue: 48000 },
    { name: 'Jul', revenue: 61000 },
    { name: 'Aug', revenue: 55000 },
    { name: 'Sep', revenue: 42000 },
    { name: 'Oct', revenue: 58000 },
    { name: 'Nov', revenue: 67000 },
    { name: 'Dec', revenue: 72000 },
];

const workshopStatusData = [
    { name: 'Active', value: 12, fill: 'var(--color-active)' },
    { name: 'Pending', value: 5, fill: 'var(--color-pending)' },
    { name: 'Register', value: 8, fill: 'var(--color-register)' },
    { name: 'Draft', value: 3, fill: 'var(--color-draft)' },
];

const transactions = [
    { id: 'TXN-001', workshop: 'Pottery Making', customer: 'John Doe', amount: 150, date: '2026-03-05', status: 'completed' as const },
    { id: 'TXN-002', workshop: 'Silk Weaving', customer: 'Jane Smith', amount: 200, date: '2026-03-04', status: 'completed' as const },
    { id: 'TXN-003', workshop: 'Cooking Class', customer: 'Mike Brown', amount: 85, date: '2026-03-04', status: 'pending' as const },
    { id: 'TXN-004', workshop: 'Lantern Making', customer: 'Sarah Lee', amount: 120, date: '2026-03-03', status: 'completed' as const },
    { id: 'TXN-005', workshop: 'Pottery Making', customer: 'Tom Wilson', amount: 150, date: '2026-03-03', status: 'refunded' as const },
    { id: 'TXN-006', workshop: 'Silk Weaving', customer: 'Anna Nguyen', amount: 200, date: '2026-03-02', status: 'completed' as const },
];

const workshopReviews = [
    { workshop: 'Pottery Making', totalReviews: 128, avgRating: 4.8, recent: '+12 this week' },
    { workshop: 'Silk Weaving', totalReviews: 95, avgRating: 4.6, recent: '+8 this week' },
    { workshop: 'Cooking Class', totalReviews: 72, avgRating: 4.9, recent: '+5 this week' },
    { workshop: 'Lantern Making', totalReviews: 64, avgRating: 4.3, recent: '+3 this week' },
    { workshop: 'Bamboo Craft', totalReviews: 41, avgRating: 4.5, recent: '+2 this week' },
];

const workshops = [
    {
        id: 1,
        name: 'Pottery Making',
        sessions: [
            { date: new Date(2026, 2, 5), time: '09:00 - 11:00', slots: 8 },
            { date: new Date(2026, 2, 7), time: '14:00 - 16:00', slots: 5 },
            { date: new Date(2026, 2, 10), time: '09:00 - 11:00', slots: 10 },
        ],
    },
    {
        id: 2,
        name: 'Silk Weaving',
        sessions: [
            { date: new Date(2026, 2, 6), time: '10:00 - 12:00', slots: 6 },
            { date: new Date(2026, 2, 9), time: '10:00 - 12:00', slots: 4 },
        ],
    },
    {
        id: 3,
        name: 'Cooking Class',
        sessions: [
            { date: new Date(2026, 2, 5), time: '15:00 - 17:00', slots: 12 },
            { date: new Date(2026, 2, 8), time: '15:00 - 17:00', slots: 10 },
        ],
    },
    {
        id: 4,
        name: 'Lantern Making',
        sessions: [
            { date: new Date(2026, 2, 11), time: '09:00 - 11:00', slots: 15 },
        ],
    },
];

const notifications = [
    { id: 1, type: 'booking' as const, message: 'New booking for Pottery Making by John Doe', time: '5 min ago', read: false },
    { id: 2, type: 'system' as const, message: 'Your workshop "Silk Weaving" has been approved', time: '1 hour ago', read: false },
    { id: 3, type: 'review' as const, message: 'New 5-star review on Cooking Class', time: '2 hours ago', read: false },
    { id: 4, type: 'payment' as const, message: 'Payment of $200 received for Silk Weaving', time: '3 hours ago', read: true },
    { id: 5, type: 'system' as const, message: 'System maintenance scheduled for March 10', time: '5 hours ago', read: true },
    { id: 6, type: 'booking' as const, message: 'Booking cancelled for Lantern Making by Tom', time: '6 hours ago', read: true },
    { id: 7, type: 'review' as const, message: 'New 4-star review on Pottery Making', time: '1 day ago', read: true },
    { id: 8, type: 'system' as const, message: 'Monthly report is ready for download', time: '1 day ago', read: true },
];

// ─── Chart Configs ───────────────────────────────────────────

const revenueChartConfig = {
    revenue: {
        label: 'Revenue',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

const workshopStatusConfig = {
    active: {
        label: 'Active',
        color: 'hsl(142, 72%, 29%)',
    },
    pending: {
        label: 'Pending',
        color: 'hsl(38, 92%, 50%)',
    },
    register: {
        label: 'Register',
        color: 'hsl(221, 83%, 53%)',
    },
    draft: {
        label: 'Draft',
        color: 'hsl(var(--muted-foreground))',
    },
} satisfies ChartConfig;

// ─── Helper Components ───────────────────────────────────────

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    iconBg,
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: { value: number; isPositive: boolean };
    iconBg: string;
}) {
    return (
        <Card className="relative overflow-hidden">
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold tracking-tight">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-1 text-xs">
                                {trend.isPositive ? (
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span className={trend.isPositive ? 'text-emerald-500' : 'text-red-500'}>
                                    {trend.isPositive ? '+' : ''}{trend.value}%
                                </span>
                                <span className="text-muted-foreground">vs last period</span>
                            </div>
                        )}
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function NotificationIcon({ type }: { type: string }) {
    switch (type) {
        case 'booking':
            return <CalendarCheck className="h-4 w-4 text-blue-500" />;
        case 'system':
            return <AlertCircle className="h-4 w-4 text-amber-500" />;
        case 'review':
            return <Star className="h-4 w-4 text-yellow-500" />;
        case 'payment':
            return <DollarSign className="h-4 w-4 text-emerald-500" />;
        default:
            return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
}

const statusBadgeVariant = (status: string) => {
    switch (status) {
        case 'completed': return 'success' as const;
        case 'pending': return 'warning' as const;
        case 'refunded': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

// ─── Main Component ──────────────────────────────────────────

export default function VendorDashboardPage() {
    const [revenueFilter, setRevenueFilter] = useState<'week' | 'month' | 'year'>('week');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });

    const revenueData = useMemo(() => {
        switch (revenueFilter) {
            case 'week': return revenueWeekly;
            case 'month': return revenueMonthly;
            case 'year': return revenueYearly;
        }
    }, [revenueFilter]);

    const totalPieValue = workshopStatusData.reduce((acc, cur) => acc + cur.value, 0);

    // Get sessions for the current week
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const filteredSessions = useMemo(() => {
        return workshops.flatMap((w) =>
            w.sessions
                .filter((s) => {
                    const d = new Date(s.date);
                    return d >= currentWeekStart && d <= weekEnd;
                })
                .map((s) => ({ ...s, workshopName: w.name, workshopId: w.id }))
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [currentWeekStart]);

    const navigateWeek = (dir: number) => {
        setCurrentWeekStart((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + dir * 7);
            return next;
        });
    };

    const formatWeekRange = () => {
        const end = new Date(currentWeekStart);
        end.setDate(end.getDate() + 6);
        const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return `${currentWeekStart.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
    };

    // Highlight dates with sessions on the calendar
    const sessionDates = useMemo(() => {
        return workshops.flatMap((w) => w.sessions.map((s) => new Date(s.date)));
    }, []);

    return (
        <div
            className="grid gap-4 p-4"
            style={{
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'auto repeat(3, 150px) repeat(4, 120px)',
            }}
        >
            {/* ── div1: Revenue Stat ── */}
            <div style={{ gridArea: '1 / 1 / 2 / 3' }}>
                <StatCard
                    title="Revenue"
                    value="$45,280"
                    icon={DollarSign}
                    trend={{ value: 12.5, isPositive: true }}
                    iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
                />
            </div>

            {/* ── div2: Workshops Stat ── */}
            <div style={{ gridArea: '1 / 3 / 2 / 5' }}>
                <StatCard
                    title="Workshops"
                    value="28"
                    icon={Briefcase}
                    trend={{ value: 4.2, isPositive: true }}
                    iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
            </div>

            {/* ── div3: Bookings Stat ── */}
            <div style={{ gridArea: '1 / 5 / 2 / 7' }}>
                <StatCard
                    title="Bookings"
                    value="156"
                    icon={CalendarCheck}
                    trend={{ value: 8.1, isPositive: true }}
                    iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
                />
            </div>

            {/* ── div4: Vouchers Stat ── */}
            <div style={{ gridArea: '1 / 7 / 2 / 9' }}>
                <StatCard
                    title="Vouchers"
                    value="42"
                    icon={Ticket}
                    trend={{ value: 2.3, isPositive: false }}
                    iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
                />
            </div>

            {/* ── div5: Revenue Area Chart ── */}
            <div style={{ gridArea: '2 / 1 / 5 / 6' }}>
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-base">Revenue Overview</CardTitle>
                            <CardDescription>Track your earnings over time</CardDescription>
                        </div>
                        <Select
                            value={revenueFilter}
                            onValueChange={(v) => setRevenueFilter(v as typeof revenueFilter)}
                        >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                        <ChartContainer config={revenueChartConfig} className="h-full w-full">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    fontSize={12}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) => String(value)}
                                            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                                        />
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-revenue)"
                                    fill="url(#fillRevenue)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ── div6: Workshop Status Pie Chart ── */}
            <div style={{ gridArea: '2 / 6 / 5 / 9' }}>
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Workshop Status</CardTitle>
                        <CardDescription>Distribution of your workshops</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                        <ChartContainer config={workshopStatusConfig} className="h-full w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={workshopStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    strokeWidth={4}
                                    stroke="hsl(var(--background))"
                                >
                                    <Cell key="active" fill="var(--color-active)" />
                                    <Cell key="pending" fill="var(--color-pending)" />
                                    <Cell key="register" fill="var(--color-register)" />
                                    <Cell key="draft" fill="var(--color-draft)" />
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                                return (
                                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                            {totalPieValue}
                                                        </tspan>
                                                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                                                            Workshops
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                                <ChartLegend content={({ payload }: any) => <ChartLegendContent payload={payload} nameKey="name" />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ── div7: Transactions Table ── */}
            <div style={{ gridArea: '5 / 1 / 9 / 6' }}>
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Recent Transactions</CardTitle>
                                <CardDescription>Latest booking payments</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs gap-1">
                                View All <ArrowUpRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pb-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction</TableHead>
                                    <TableHead>Workshop</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-medium text-xs">{tx.id}</TableCell>
                                        <TableCell className="text-xs">{tx.workshop}</TableCell>
                                        <TableCell className="text-xs">{tx.customer}</TableCell>
                                        <TableCell className="text-right text-xs font-semibold">${tx.amount}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusBadgeVariant(tx.status)} className="text-[10px] capitalize">
                                                {tx.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* ── div8: Workshop Reviews ── */}
            <div style={{ gridArea: '5 / 6 / 9 / 9' }}>
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Workshop Reviews</CardTitle>
                        <CardDescription>Review summary per workshop</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pb-4 space-y-4">
                        {workshopReviews.map((wr) => (
                            <div key={wr.workshop} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{wr.workshop}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-semibold">{wr.avgRating}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Progress value={(wr.avgRating / 5) * 100} className="h-2 flex-1" />
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {wr.totalReviews} reviews
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-600 font-medium">{wr.recent}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* ── div9: Workshop Calendar & Sessions ── */}
            <div style={{ gridArea: '1 / 9 / 5 / 13' }}>
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Workshop Sessions</CardTitle>
                        <CardDescription>Your upcoming session schedule</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pb-4">
                        {/* Calendar */}
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                modifiers={{ hasSession: sessionDates }}
                                modifiersStyles={{
                                    hasSession: {
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        textDecorationColor: 'hsl(142,72%,29%)',
                                    },
                                }}
                                className="rounded-md border"
                            />
                        </div>

                        {/* Week Navigation */}
                        <div className="flex items-center justify-between mt-4 mb-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateWeek(-1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium">{formatWeekRange()}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateWeek(1)}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Session List */}
                        <div className="space-y-2">
                            {filteredSessions.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-4">
                                    No sessions this week
                                </p>
                            ) : (
                                filteredSessions.map((session, i) => (
                                    <div
                                        key={`${session.workshopId}-${i}`}
                                        className="flex items-center gap-3 rounded-lg border p-2.5 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">{session.workshopName}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                {' · '}{session.time}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] shrink-0">
                                            {session.slots} slots
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── div10: Notifications ── */}
            <div style={{ gridArea: '5 / 9 / 9 / 13' }}>
                <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Notifications</CardTitle>
                                <CardDescription>System & activity alerts</CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-[10px]">
                                {notifications.filter((n) => !n.read).length} new
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pb-4">
                        <Tabs defaultValue="all">
                            <TabsList className="w-full h-8">
                                <TabsTrigger value="all" className="text-xs flex-1">All</TabsTrigger>
                                <TabsTrigger value="unread" className="text-xs flex-1">Unread</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all" className="mt-3 space-y-2">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
                                            !n.read ? 'bg-primary/5 border border-primary/10' : 'hover:bg-accent/50'
                                        }`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            <NotificationIcon type={n.type} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs leading-relaxed">{n.message}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                                <Clock className="h-2.5 w-2.5" />
                                                {n.time}
                                            </p>
                                        </div>
                                        {!n.read && (
                                            <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                        )}
                                    </div>
                                ))}
                            </TabsContent>
                            <TabsContent value="unread" className="mt-3 space-y-2">
                                {notifications.filter((n) => !n.read).map((n) => (
                                    <div
                                        key={n.id}
                                        className="flex items-start gap-3 rounded-lg p-2.5 bg-primary/5 border border-primary/10"
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            <NotificationIcon type={n.type} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs leading-relaxed">{n.message}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                                <Clock className="h-2.5 w-2.5" />
                                                {n.time}
                                            </p>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

//ALO