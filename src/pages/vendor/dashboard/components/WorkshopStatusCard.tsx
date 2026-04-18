import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Pie } from '@ant-design/charts';
import { PieChart } from 'lucide-react';
import type { WorkshopStatusPoint } from '../types';

const STATUS_LABEL_VI: Record<WorkshopStatusPoint['name'], string> = {
    Active: 'Hoạt động',
    Pending: 'Chờ duyệt',
    Register: 'Đăng ký',
    Draft: 'Bản nháp',
};

interface WorkshopStatusCardProps {
    data: WorkshopStatusPoint[];
}

export function WorkshopStatusCard({ data }: WorkshopStatusCardProps) {
    const pieData = data
        .filter((d) => d.value > 0)
        .map((d) => ({ type: STATUS_LABEL_VI[d.name] ?? d.name, value: d.value }));

    const hasData = pieData.length > 0;

    const config = {
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        innerRadius: 0.6,
        label: {
            text: 'value',
            style: { fontWeight: 'bold' },
        },
        legend: {
            color: {
                title: false,
                position: 'bottom' as const,
                rowPadding: 5,
                layout: { justifyContent: 'center' },
            },
        },
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Trạng thái workshop</CardTitle>
                <CardDescription>Phân bổ mẫu workshop của bạn</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <div className="h-full w-full min-h-[200px] flex items-center justify-center">
                    {hasData ? (
                        <div className="h-full w-full">
                            <Pie {...config} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm py-8">
                            <PieChart className="w-8 h-8 opacity-30" />
                            <p>Chưa có dữ liệu workshop</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
