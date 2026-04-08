import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    ArrowLeft, Pencil, Trash2, RotateCcw, MapPin, Calendar, Users,
    DollarSign, Ticket, EyeOff, Image as ImageIcon, Info, CalendarDays, MoonStar,
} from 'lucide-react';
import { useEvent } from '@/hooks/event';
import { eventService } from '@/services/api/eventService';
import { statusBadgeStyles, statusLabels } from './constants';
import { formatEventDate, formatEventPrice } from './utils';
import { ImageGallery } from './components/ImageGallery';
import { TicketCatalogList } from './components/TicketCatalogList';
import { EventTimelineList } from './components/EventTimelineList';
import { useState } from 'react';

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { event, loading, fetchEvent } = useEvent(id!);
    const [showHide, setShowHide] = useState(false);
    const [showPermanentDelete, setShowPermanentDelete] = useState(false);

    const isDeleted = !!event?.deletedAt;

    const handleHide = async () => {
        try {
            const res = await eventService.deleteEvent(id!);
            if (res.success) {
                message.success('Event hidden successfully');
                await fetchEvent();
            } else {
                message.error(res.message || 'Failed to hide event');
            }
        } catch (err: unknown) {
            message.error('Failed to hide event');
        }
        setShowHide(false);
    };

    const handlePermanentDelete = async () => {
        try {
            const res = await eventService.permanentDeleteEvent(id!);
            if (res.success) {
                message.success('Event permanently deleted');
                navigate('/admin/events');
            } else {
                message.error(res.message || 'Failed to permanently delete event');
            }
        } catch (err: unknown) {
            message.error('Failed to permanently delete event');
        }
        setShowPermanentDelete(false);
    };

    const handleRestore = async () => {
        try {
            const res = await eventService.restoreEvent(id!);
            if (res.success) {
                message.success('Event restored successfully');
                await fetchEvent();
            } else {
                message.error(res.message || 'Failed to restore event');
            }
        } catch (err: unknown) {
            message.error('Failed to restore event');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-10 w-80" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-40" />
                    </div>
                    <div><Skeleton className="h-96" /></div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <p className="text-lg font-medium">Event not found</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/events')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Events
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/events')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold truncate">{event.name}</h1>
                            <Badge variant="outline" className={statusBadgeStyles[event.status]}>
                                {statusLabels[event.status]}
                            </Badge>
                            {isDeleted && (
                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Hidden</Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Events &gt; {event.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />Edit
                    </Button>
                    {isDeleted ? (
                        <Button variant="default" onClick={handleRestore}>
                            <RotateCcw className="mr-2 h-4 w-4" />Restore
                        </Button>
                    ) : (
                        <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => setShowHide(true)}>
                            <EyeOff className="mr-2 h-4 w-4" />Hide
                        </Button>
                    )}
                    <Button variant="destructive" onClick={() => setShowPermanentDelete(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />Permanently Delete
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview" className="gap-1.5">
                        <Info className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="gap-1.5">
                        <ImageIcon className="h-4 w-4" />
                        Gallery
                        {event.images && event.images.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-[10px]">
                                {event.images.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        Timeline
                    </TabsTrigger>
                    <TabsTrigger value="tickets" className="gap-1.5">
                        <Ticket className="h-4 w-4" />
                        Tickets
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Event Info Card */}
                            <Card>
                                <CardHeader><CardTitle>Event Information</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Start Time" value={
                                            <div>
                                                <div>{formatEventDate(event.startTime)}</div>
                                                {event.lunarStartDate && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-normal">
                                                        <MoonStar className="h-3 w-3 shrink-0" />
                                                        <span>{event.lunarStartDate}</span>
                                                    </div>
                                                )}
                                            </div>
                                        } />
                                        <InfoItem icon={<Calendar className="h-4 w-4" />} label="End Time" value={
                                            <div>
                                                <div>{formatEventDate(event.endTime)}</div>
                                                {event.lunarEndDate && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-normal">
                                                        <MoonStar className="h-3 w-3 shrink-0" />
                                                        <span>{event.lunarEndDate}</span>
                                                    </div>
                                                )}
                                            </div>
                                        } />
                                        <InfoItem icon={<MapPin className="h-4 w-4" />} label="Location" value={event.locationName || '—'} />
                                        <InfoItem icon={<DollarSign className="h-4 w-4" />} label="Price" value={formatEventPrice(event.price)} />
                                        <InfoItem icon={<Users className="h-4 w-4" />} label="Enrolled" value={`${event.currentEnrolled ?? 0}${event.maxParticipants ? ` / ${event.maxParticipants}` : ''}`} />
                                        <InfoItem icon={<Ticket className="h-4 w-4" />} label="Ticket Required" value={event.isTicketRequired ? 'Yes' : 'No'} />
                                    </div>

                                    {/* Tags */}
                                    {event.tags && event.tags.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-sm font-medium mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {event.tags.map((tag) => (
                                                    <Badge
                                                        key={tag.id}
                                                        variant="secondary"
                                                        style={tag.tagColor ? { backgroundColor: tag.tagColor + '20', color: tag.tagColor } : undefined}
                                                    >
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Description Card */}
                            <Card>
                                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                                <CardContent>
                                    {event.shortDescription && (
                                        <p className="text-muted-foreground text-sm mb-4">{event.shortDescription}</p>
                                    )}
                                    {event.fullDescription ? (
                                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: event.fullDescription }} />
                                    ) : (
                                        <p className="text-muted-foreground text-sm italic">No description provided</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column — Thumbnail */}
                        <div className="space-y-6">
                            {event.thumbnailUrl && (
                                <Card>
                                    <CardHeader><CardTitle>Thumbnail</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="aspect-video rounded-lg overflow-hidden">
                                            <img src={event.thumbnailUrl} alt={event.name} className="w-full h-full object-cover" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery">
                    <Card>
                        <CardHeader><CardTitle>Image Gallery</CardTitle></CardHeader>
                        <CardContent>
                            <ImageGallery images={event.images || []} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EventTimelineList eventId={id!} eventStartDate={event.startTime} eventEndDate={event.endTime} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tickets Tab */}
                <TabsContent value="tickets">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TicketCatalogList eventId={id!} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Hide (soft-delete) confirmation */}
            <AlertDialog open={showHide} onOpenChange={setShowHide}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hide Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to hide "{event.name}"? The event will be hidden from public view but can be restored later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleHide} className="bg-orange-600 text-white hover:bg-orange-700">
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide Event
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Permanent delete confirmation */}
            <AlertDialog open={showPermanentDelete} onOpenChange={setShowPermanentDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Permanently Delete Event</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <span className="block">
                                Are you sure you want to <strong>permanently delete</strong> "{event.name}"?
                            </span>
                            <span className="block text-destructive font-medium">
                                ⚠️ This action cannot be undone. The event and all associated data will be permanently removed.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePermanentDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Permanently Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="text-sm font-medium">{value}</div>
            </div>
        </div>
    );
}
