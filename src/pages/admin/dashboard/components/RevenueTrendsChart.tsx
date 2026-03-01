import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RevenueTrendPoint } from '@/types/adminDashboard';

interface RevenueTrendsChartProps {
    revenueTrends: RevenueTrendPoint[];
    revenuePeriod: 'MONTHLY' | 'WEEKLY';
    setRevenuePeriod: (period: 'MONTHLY' | 'WEEKLY') => void;
}

export function RevenueTrendsChart({ revenueTrends, revenuePeriod, setRevenuePeriod }: RevenueTrendsChartProps) {
    return (
        <Card className="shadow-lg border-gray-100 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <CardTitle className="text-lg font-bold">Revenue Trends</CardTitle>
                    <CardDescription>Financial overview over time</CardDescription>
                </div>
                <Select value={revenuePeriod} onValueChange={(v: any) => setRevenuePeriod(v)}>
                    <SelectTrigger className="w-32 bg-white">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-64 relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                        <defs>
                            <linearGradient id="gradient-revenue" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"></stop>
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        {Array.isArray(revenueTrends) && revenueTrends.length > 1 ? (
                            <>
                                <path
                                    d={`M ${revenueTrends.map((p, i) => `${(i / (revenueTrends.length - 1)) * 500},${200 - (p.revenue / (Math.max(...revenueTrends.map(x => x.revenue)) || 1)) * 180}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d={`M ${revenueTrends.map((p, i) => `${(i / (revenueTrends.length - 1)) * 500},${200 - (p.revenue / (Math.max(...revenueTrends.map(x => x.revenue)) || 1)) * 180}`).join(' L ')} V 200 H 0 Z`}
                                    fill="url(#gradient-revenue)"
                                />
                            </>
                        ) : null}
                    </svg>
                    <div className="flex justify-between mt-4">
                        {Array.isArray(revenueTrends) && revenueTrends.length > 0 ? revenueTrends.slice(0, 6).map((p, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-gray-400">{p.period}</span>
                        )) : (
                            <div className="w-full text-center text-gray-400 text-sm py-4">No data available</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
