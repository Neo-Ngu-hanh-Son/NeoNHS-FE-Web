import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Pie } from '@ant-design/charts';
import type { WorkshopStatusPoint } from '../types';

interface WorkshopStatusCardProps {
    data: WorkshopStatusPoint[];
}

export function WorkshopStatusCard({ data }: WorkshopStatusCardProps) {
    const pieData = data.map((d) => ({ type: d.name, value: d.value }));

    const config = {
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        innerRadius: 0.6,
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'bottom' as const,
                rowPadding: 5,
                layout: {
                    justifyContent: 'center'
                }
            },
        },
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Workshop Status</CardTitle>
                <CardDescription>Distribution of your workshops</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <div className="h-full w-full min-h-[200px]">
                    <Pie {...config} />
                </div>
            </CardContent>
        </Card>
    );
}
