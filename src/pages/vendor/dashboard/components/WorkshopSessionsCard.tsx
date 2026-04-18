import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import dayjs, { type Dayjs } from 'dayjs';

interface DaySessionItem {
    workshopName: string;
    workshopId: number;
    time: string;
    slots: number;
    date: Date;
}

interface WorkshopSessionsCardProps {
    selectedDate?: Date;
    onDateSelect: (date: Date | undefined) => void;
    sessionDates: Date[];
    selectedDaySessions: DaySessionItem[];
}

export function WorkshopSessionsCard({
    selectedDate,
    onDateSelect,
    sessionDates,
    selectedDaySessions,
}: WorkshopSessionsCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sessionDateSet = useMemo(() => {
        const set = new Set<string>();
        sessionDates.forEach((d) => set.add(dayjs(d).format('YYYY-MM-DD')));
        return set;
    }, [sessionDates]);

    const cellRender = (current: Dayjs) => {
        const dateStr = current.format('YYYY-MM-DD');
        if (sessionDateSet.has(dateStr)) {
            return (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'hsl(142,72%,29%)',
                    }}
                />
            );
        }
        return null;
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Phiên workshop</CardTitle>
                <CardDescription>Nhấn ngày có chấm xanh để xem danh sách phiên trong ngày</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pb-4">
                <ConfigProvider locale={viVN}>
                    <Calendar
                        fullscreen={false}
                        value={selectedDate ? dayjs(selectedDate) : undefined}
                        onSelect={(date) => {
                            const nextDate = date?.toDate();
                            onDateSelect(nextDate);

                            if (!nextDate) {
                                setIsModalOpen(false);
                                return;
                            }

                            const clickedDay = dayjs(nextDate).format('YYYY-MM-DD');
                            setIsModalOpen(sessionDateSet.has(clickedDay));
                        }}
                        fullCellRender={(current) => {
                            const isSelected = selectedDate && current.isSame(dayjs(selectedDate), 'day');
                            return (
                                <div
                                    style={{
                                        position: 'relative',
                                        textAlign: 'center',
                                        padding: '4px 0',
                                        borderRadius: 4,
                                        background: isSelected ? 'hsl(221,83%,53%)' : undefined,
                                        color: isSelected ? '#fff' : undefined,
                                    }}
                                >
                                    {current.date()}
                                    {cellRender(current)}
                                </div>
                            );
                        }}
                    />
                </ConfigProvider>

                <p className="mt-4 border-t pt-3 text-center text-xs text-muted-foreground">
                    {selectedDate
                        ? `Đang chọn: ${new Date(selectedDate).toLocaleDateString('vi-VN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}`
                        : 'Chọn một ngày trên lịch'}
                </p>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base">
                                <CalendarDays className="h-4 w-4" />
                                Phiên trong ngày{' '}
                                {selectedDate
                                    ? new Date(selectedDate).toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })
                                    : 'đã chọn'}
                            </DialogTitle>
                            <DialogDescription>
                                Tổng số phiên: {selectedDaySessions.length}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                            {selectedDaySessions.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    Không có phiên nào trong ngày này.
                                </p>
                            ) : (
                                selectedDaySessions.map((session, index) => (
                                    <div
                                        key={`${session.workshopId}-${session.time}-${index}`}
                                        className="rounded-md border p-3"
                                    >
                                        <div className="mb-1 text-sm font-semibold">
                                            {session.workshopName}
                                        </div>
                                        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                                            <span>{session.time}</span>
                                            <Badge variant="outline">{session.slots} chỗ trống</Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
