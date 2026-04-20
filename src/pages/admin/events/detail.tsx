import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  RotateCcw,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Ticket,
  EyeOff,
  Image as ImageIcon,
  Info,
  CalendarDays,
  Tags,
  Loader2,
} from 'lucide-react';
import { useEvent } from '@/hooks/event';
import { eventService } from '@/services/api/eventService';
import { statusBadgeStyles, statusLabels } from './constants';
import { formatEventDate, formatEventPrice } from './utils';
import { ImageGallery } from './components/ImageGallery';
import { TicketCatalogList } from './components/TicketCatalogList';
import { EventTimelineList } from './components/eventTimeline/EventTimelineList';
import { EventPointList } from './components/eventPoint/EventPointList';
import { EventPointTagList } from './components/eventPoint/EventPointTagList';
import { GoogleMapPickerModal } from '@/pages/admin/destinations/components/GoogleMapPickerModal';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { event, loading, fetchEvent } = useEvent(id!);
  const [showHide, setShowHide] = useState(false);
  const [showPermanentDelete, setShowPermanentDelete] = useState(false);
  const [updatingTicketReq, setUpdatingTicketReq] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const tabParam = searchParams.get('tab');
  const defaultTab =
    tabParam === 'timeline' ||
    tabParam === 'gallery' ||
    tabParam === 'tickets' ||
    tabParam === 'points' ||
    tabParam === 'point-tags'
      ? tabParam
      : 'overview';

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

  const handleEnableTickets = async () => {
    if (!event) return;
    setUpdatingTicketReq(true);
    try {
      const data: any = {
        name: event.name,
        shortDescription: event.shortDescription,
        fullDescription: event.fullDescription,
        locationName: event.locationName,
        latitude: event.latitude,
        longitude: event.longitude,
        startTime: event.startTime,
        endTime: event.endTime,
        isTicketRequired: true,
        price: event.price || 0,
        maxParticipants: event.maxParticipants,
        thumbnailUrl: undefined,
        tagIds: event.tags ? event.tags.map((t) => t.id) : [],
        status: event.status,
      };
      const res = await eventService.updateEvent(event.id, data);
      if (res.success) {
        message.success('Enabled ticket requirements successfully');
        await fetchEvent();
      } else {
        message.error(res.message || 'Failed to update event');
      }
    } catch (error) {
      message.error('An error occurred while updating the event');
    } finally {
      setUpdatingTicketReq(false);
    }
  };

  const handleUpdateLocation = async (result: any) => {
    if (!event) return;
    setUpdatingLocation(true);
    try {
      const data: any = {
        name: event.name,
        shortDescription: event.shortDescription,
        fullDescription: event.fullDescription,
        locationName: result.name || result.address || '',
        latitude: String(result.latitude),
        longitude: String(result.longitude),
        startTime: event.startTime,
        endTime: event.endTime,
        isTicketRequired: event.isTicketRequired,
        price: event.price || 0,
        maxParticipants: event.maxParticipants,
        thumbnailUrl: undefined,
        tagIds: event.tags ? event.tags.map((t) => t.id) : [],
        status: event.status,
      };
      const res = await eventService.updateEvent(event.id, data);
      if (res.success) {
        message.success('Location updated successfully');
        await fetchEvent();
      } else {
        message.error(res.message || 'Failed to update location');
      }
    } catch (error) {
      message.error('An error occurred while updating the location');
    } finally {
      setUpdatingLocation(false);
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
          <div>
            <Skeleton className="h-96" />
          </div>
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
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
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  Hidden
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Events &gt; {event.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {isDeleted ? (
            <Button variant="default" onClick={handleRestore}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
              onClick={() => setShowHide(true)}
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Hide
            </Button>
          )}
          <Button variant="destructive" onClick={() => setShowPermanentDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Permanently Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-4">
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
          <TabsTrigger value="points" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            Points
          </TabsTrigger>
          <TabsTrigger value="point-tags" className="gap-1.5">
            <Tags className="h-4 w-4" />
            Point Tags
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
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="Start Time"
                      value={formatEventDate(event.startTime)}
                    />
                    <InfoItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="End Time"
                      value={formatEventDate(event.endTime)}
                    />
                    <InfoItem
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value={event.locationName || '—'}
                    />
                    <InfoItem
                      icon={<DollarSign className="h-4 w-4" />}
                      label="Price"
                      value={formatEventPrice(event.price)}
                    />
                    <InfoItem
                      icon={<Users className="h-4 w-4" />}
                      label="Enrolled"
                      value={`${event.currentEnrolled ?? 0}${event.maxParticipants ? ` / ${event.maxParticipants}` : ''}`}
                    />
                    <InfoItem
                      icon={<Ticket className="h-4 w-4" />}
                      label="Ticket Required"
                      value={event.isTicketRequired ? 'Yes' : 'No'}
                    />
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
                            style={
                              tag.tagColor ? { backgroundColor: tag.tagColor + '20', color: tag.tagColor } : undefined
                            }
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
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.shortDescription && (
                    <p className="text-muted-foreground text-sm mb-4">{event.shortDescription}</p>
                  )}
                  {event.fullDescription ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.fullDescription }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No description provided</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column — Thumbnail and Map */}
            <div className="space-y-6">
              {event.thumbnailUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img src={event.thumbnailUrl} alt={event.name} className="w-full h-full object-cover" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Map Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="aspect-square sm:aspect-video lg:aspect-square rounded-lg overflow-hidden border relative z-0 group cursor-pointer bg-slate-50"
                    onClick={() => !updatingLocation && setMapPickerOpen(true)}
                  >
                    <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white/95 text-sm font-semibold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg text-slate-800 scale-95 group-hover:scale-100">
                        {updatingLocation ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <MapPin className="w-4 h-4 text-indigo-600" />}
                        {updatingLocation ? "Updating..." : "Click to pick location"}
                      </div>
                    </div>
                    {event.latitude && event.longitude ? (
                      <MapContainer
                        center={[Number(event.latitude), Number(event.longitude)]}
                        zoom={16}
                        scrollWheelZoom={false}
                        dragging={false}
                        touchZoom={false}
                        doubleClickZoom={false}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[Number(event.latitude), Number(event.longitude)]} />
                      </MapContainer>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                        <MapPin className="h-10 w-10 mb-3 opacity-20" />
                        <p className="font-medium text-sm">No Location Map</p>
                        <p className="text-xs mt-1">Click to assign a location on the map</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery eventId={id!} images={event.images || []} onImagesChange={fetchEvent} />
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

        {/* Points Tab */}
        <TabsContent value="points">
          <Card>
            <CardHeader>
              <CardTitle>Event Points</CardTitle>
            </CardHeader>
            <CardContent>
              <EventPointList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Point Tags Tab */}
        <TabsContent value="point-tags">
          <Card>
            <CardHeader>
              <CardTitle>Event Point Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <EventPointTagList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          {event.isTicketRequired ? (
            <Card>
              <CardHeader>
                <CardTitle>Ticket Types</CardTitle>
              </CardHeader>
              <CardContent>
                <TicketCatalogList eventId={id!} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground pt-10">
                <Ticket className="h-12 w-12 mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold text-foreground">No Tickets Required</h3>
                <p className="mt-2 text-sm max-w-sm mb-6">
                  This event was configured to not require tickets. You can quickly enable tickets here to start adding ticket varieties.
                </p>
                <Button 
                  onClick={handleEnableTickets} 
                  disabled={updatingTicketReq}
                  className="gap-2"
                >
                  {updatingTicketReq ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
                  Enable Ticket Requirements
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Hide (soft-delete) confirmation */}
      <AlertDialog open={showHide} onOpenChange={setShowHide}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to hide "{event.name}"? The event will be hidden from public view but can be
              restored later.
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
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Map Picker Modal for Quick Update */}
      <GoogleMapPickerModal
        open={mapPickerOpen}
        onOpenChange={setMapPickerOpen}
        initialCoord={event.latitude && event.longitude ? [Number(event.latitude), Number(event.longitude)] : undefined}
        onSelect={handleUpdateLocation}
      />
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
