import { AlertCircle, Bell, CalendarCheck, Clock, DollarSign, Star } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { NotificationItem } from '../types';

function NotificationIcon({ type }: { type: NotificationItem['type'] }) {
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

interface NotificationsCardProps {
    notifications: NotificationItem[];
}

export function NotificationsCard({ notifications }: NotificationsCardProps) {
    const unread = notifications.filter((n) => !n.read);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Thông báo</CardTitle>
                        <CardDescription>Hệ thống & hoạt động</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                        {unread.length} mới
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pb-4">
                <Tabs defaultValue="all">
                    <TabsList className="w-full h-8">
                        <TabsTrigger value="all" className="text-xs flex-1">
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="text-xs flex-1">
                            Chưa đọc
                        </TabsTrigger>
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
                                {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="unread" className="mt-3 space-y-2">
                        {unread.length === 0 ? (
                            <p className="py-4 text-center text-xs text-muted-foreground">
                                Không có thông báo chưa đọc
                            </p>
                        ) : (
                            unread.map((n) => (
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
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
