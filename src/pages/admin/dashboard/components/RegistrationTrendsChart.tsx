import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RegistrationTrendPoint } from '@/types/adminDashboard';

interface RegistrationTrendsChartProps {
    registrations: RegistrationTrendPoint[];
    regType: 'USER' | 'VENDOR';
    setRegType: (type: 'USER' | 'VENDOR') => void;
}

export function RegistrationTrendsChart({ registrations, regType, setRegType }: RegistrationTrendsChartProps) {
    return (
        <Card className="shadow-lg border-gray-100 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <CardTitle className="text-lg font-bold">Registration Growth</CardTitle>
                    <CardDescription>New {regType.toLowerCase()}s joined system</CardDescription>
                </div>
                <Select value={regType} onValueChange={(v: any) => setRegType(v)}>
                    <SelectTrigger className="w-32 bg-white">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">Users</SelectItem>
                        <SelectItem value="VENDOR">Vendors</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-64 mt-4 flex items-end justify-between gap-2">
                    {Array.isArray(registrations) && registrations.length > 0 ? registrations.map((p, idx) => {
                        const max = Math.max(...registrations.map(r => r.count)) || 1;
                        const height = (p.count / max) * 100;
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-gray-50 rounded-t-lg relative h-full flex flex-col justify-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        className="w-full bg-primary rounded-t-lg group-hover:bg-primary/80 transition-colors"
                                    />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded">
                                        {p.count}
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 rotate-45 md:rotate-0">{p.period}</span>
                            </div>
                        );
                    }) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No data available</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
