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
        message.success('Đã ẩn sự kiện thành công');
        await fetchEvent();
      } else {
        message.error(res.message || 'Lỗi khi ẩn sự kiện');
      }
    } catch (err: unknown) {
      message.error('Lỗi khi ẩn sự kiện');
    }
    setShowHide(false);
  };

  const handlePermanentDelete = async () => {
    try {
      const res = await eventService.permanentDeleteEvent(id!);
      if (res.success) {
        message.success('Đã xóa vĩnh viễn sự kiện');
        navigate('/admin/events');
      } else {
        message.error(res.message || 'Lỗi khi xóa vĩnh viễn sự kiện');
      }
    } catch (err: unknown) {
      message.error('Lỗi khi xóa vĩnh viễn sự kiện');
    }
    setShowPermanentDelete(false);
  };

  const handleRestore = async () => {
    try {
      const res = await eventService.restoreEvent(id!);
      if (res.success) {
        message.success('Đã khôi phục sự kiện thành công');
        await fetchEvent();
      } else {
        message.error(res.message || 'Lỗi khi khôi phục sự kiện');
      }
    } catch (err: unknown) {
      message.error('Lỗi khi khôi phục sự kiện');
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
        message.success('Bật yêu cầu vé thành công');
        await fetchEvent();
      } else {
        message.error(res.message || 'Lỗi khi cập nhật sự kiện');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật sự kiện');
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
        message.success('Cập nhật địa điểm thành công');
        await fetchEvent();
      } else {
        message.error(res.message || 'Lỗi khi cập nhật địa điểm');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật địa điểm');
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
          <p className="text-lg font-medium">Không tìm thấy sự kiện</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở lại danh sách
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
                  Đã ẩn
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Sự kiện &gt; {event.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          {isDeleted ? (
            <Button variant="default" onClick={handleRestore}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Khôi phục
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
              onClick={() => setShowHide(true)}
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Ẩn
            </Button>
          )}
          <Button variant="destructive" onClick={() => setShowPermanentDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa vĩnh viễn
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-1.5">
            <Info className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="gallery" className="gap-1.5">
            <ImageIcon className="h-4 w-4" />
            Thư viện
            {event.images && event.images.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-[10px]">
                {event.images.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1.5">
            <CalendarDays className="h-4 w-4" />
            Lịch trình
          </TabsTrigger>
          <TabsTrigger value="points" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            Địa điểm
          </TabsTrigger>
          <TabsTrigger value="point-tags" className="gap-1.5">
            <Tags className="h-4 w-4" />
            Thẻ địa điểm
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-1.5">
            <Ticket className="h-4 w-4" />
            Vé
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
                  <CardTitle>Thông tin sự kiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="Thời gian bắt đầu"
                      value={formatEventDate(event.startTime)}
                    />
                    <InfoItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="Thời gian kết thúc"
                      value={formatEventDate(event.endTime)}
                    />
                    <InfoItem
                      icon={<MapPin className="h-4 w-4" />}
                      label="Địa điểm chính"
                      value={event.locationName || '—'}
                    />
                    <InfoItem
                      icon={<Users className="h-4 w-4" />}
                      label="Số người tham gia"
                      value={`${event.currentEnrolled ?? 0}${event.maxParticipants ? ` / ${event.maxParticipants === 999999 ? 'Không giới hạn' : event.maxParticipants}` : ''}`}
                    />
                    <InfoItem
                      icon={<Ticket className="h-4 w-4" />}
                      label="Yêu cầu vé"
                      value={event.isTicketRequired ? 'Có' : 'Không'}
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
                  <CardTitle>Mô tả sự kiện</CardTitle>
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
                    <p className="text-muted-foreground text-sm italic">Không có mô tả chi tiết</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column — Thumbnail and Map */}
            <div className="space-y-6">
              {event.thumbnailUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ảnh đại diện</CardTitle>
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
                  <CardTitle>Bản đồ khu vực tổ chức sự kiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="aspect-square sm:aspect-video lg:aspect-square rounded-lg overflow-hidden border relative z-0 group cursor-pointer bg-slate-50"
                    onClick={() => !updatingLocation && setMapPickerOpen(true)}
                  >
                    <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white/95 text-sm font-semibold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg text-slate-800 scale-95 group-hover:scale-100">
                        {updatingLocation ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <MapPin className="w-4 h-4 text-indigo-600" />}
                        {updatingLocation ? "Đang cập nhật..." : "Nhấn để chọn vị trí"}
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
                        <p className="font-medium text-sm">Chưa có bản đồ</p>
                        <p className="text-xs mt-1">Nhấp để gắn tọa độ cho địa điểm tổ chức trên bản đồ</p>
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
              <CardTitle>Thư viện ảnh</CardTitle>
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
              <CardTitle>Lịch trình sự kiện</CardTitle>
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
              <CardTitle>Các điểm sự kiện</CardTitle>
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
              <CardTitle>Thẻ đánh dấu hiển thị trên bản đồ điểm sư kiện</CardTitle>
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
                <CardTitle>Loại vé</CardTitle>
              </CardHeader>
              <CardContent>
                <TicketCatalogList eventId={id!} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground pt-10">
                <Ticket className="h-12 w-12 mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold text-foreground">Không yêu cầu vé</h3>
                <p className="mt-2 text-sm max-w-sm mb-6">
                  Sự kiện này được cấu hình không yêu cầu vé. Bạn có thể bật tính năng vé tại đây để bắt đầu thêm các loại vé.
                </p>
                <Button
                  onClick={handleEnableTickets}
                  disabled={updatingTicketReq}
                  className="gap-2"
                >
                  {updatingTicketReq ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
                  Bật yêu cầu vé
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
            <AlertDialogTitle>Ẩn sự kiện</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn ẩn "{event.name}"? Sự kiện sẽ không hiển thị trên trang chủ nhưng có thể khôi phục sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleHide} className="bg-orange-600 text-white hover:bg-orange-700">
              <EyeOff className="mr-2 h-4 w-4" />
              Ẩn sự kiện
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent delete confirmation */}
      <AlertDialog open={showPermanentDelete} onOpenChange={setShowPermanentDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn sự kiện</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                Bạn có chắc chắn muốn <strong>xóa vĩnh viễn</strong> "{event.name}"?
              </span>
              <span className="block text-destructive font-medium">
                ⚠️ Hành động này không thể hoàn tác. Sự kiện và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Map Picker Modal for Quick Update */}
      <GoogleMapPickerModal
        open={mapPickerOpen}
        onOpenChange={setMapPickerOpen}
        initialCoord={event.latitude && event.longitude ? [Number(event.latitude), Number(event.longitude)] : undefined}
        initialName={event.locationName || event.name}
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
