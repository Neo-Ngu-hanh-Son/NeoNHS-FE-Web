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
import { Column } from '@ant-design/charts';
import type { RevenueFilter, RevenuePoint } from '../types';

interface RevenueOverviewCardProps {
    revenueFilter: RevenueFilter;
    onRevenueFilterChange: (value: RevenueFilter) => void;
    revenueData: RevenuePoint[];
}

export function RevenueOverviewCard({
    revenueFilter,
    onRevenueFilterChange,
    revenueData,
}: RevenueOverviewCardProps) {
    const config = {
        data: revenueData,
        xField: 'name',
        yField: 'revenue',
        style: {
            maxWidth: 50,
        },
        
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base">Revenue Overview</CardTitle>
                    <CardDescription>Track your earnings over time</CardDescription>
                </div>
                <Select value={revenueFilter} onValueChange={(v) => onRevenueFilterChange(v as RevenueFilter)}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <div className="h-full w-full min-h-[200px]">
                    <Column {...config} />
                </div>
            </CardContent>
        </Card>
    );
}
