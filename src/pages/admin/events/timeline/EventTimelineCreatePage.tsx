import { useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { message } from 'antd';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useEvent, useEventTimelines } from '@/hooks/event';
import type { CreateEventTimelineRequest } from '@/types/eventTimeline';
import type { EventPointTagTabHandle } from '../components/eventTimeline/EventPointTagTab';
import EventTimeLineCreationTab from '../components/eventTimeline/EventTimeLineCreationTab';
import EventTimeLinePointCreationTab from '../components/eventTimeline/EventTimeLinePointCreationTab';
import EventPointTagTab from '../components/eventTimeline/EventPointTagTab';
import { FormData } from '../type';

const emptyForm: FormData = {
  name: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  organizer: '',
  coOrganizer: '',
  destinationName: '',
  destinationAddress: '',
  destinationLatitude: '',
  destinationLongitude: '',
  destinationImageUrl: '',
  destinationMarkerIconUrl: '',
  destinationTagColor: '#0f766e',
  destinationTagName: '',
  destinationTagDescription: '',
  eventPointId: '',
  eventPointTagId: '',
};

const toApiTime = (time: string): string => (time.length === 5 ? `${time}:00` : time);

const summaryValue = (value: string): string => (value.trim() ? value.trim() : 'Không có');

const buildEventPointPayload = (form: FormData): CreateEventTimelineRequest['eventPoint'] | undefined => {
  const name = form.destinationName.trim();
  const latitudeRaw = form.destinationLatitude.trim();
  const longitudeRaw = form.destinationLongitude.trim();
  const pointId = form.eventPointId.trim() || null;

  if (!name || !latitudeRaw || !longitudeRaw) {
    return undefined;
  }

  const latitude = Number.parseFloat(latitudeRaw);
  const longitude = Number.parseFloat(longitudeRaw);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return undefined;
  }

  const payload: NonNullable<CreateEventTimelineRequest['eventPoint']> = {
    name,
    latitude,
    longitude,
    id: pointId,
  };

  const address = form.destinationAddress.trim();
  if (address) payload.address = address;

  const imageUrl = form.destinationImageUrl.trim();
  if (imageUrl) payload.imageUrl = imageUrl;

  const markerIconUrl = form.destinationMarkerIconUrl.trim();
  const tagColor = form.destinationTagColor.trim();
  const tagName = form.destinationTagName.trim();
  const tagId = form.eventPointTagId.trim() || null;
  const tagDescription = tagName;
  if (markerIconUrl || tagColor || tagName) {
    payload.eventPointTagId = tagId;
    payload.eventPointTagRequest = {
      id: tagId,
      ...(tagName ? { name: tagName } : {}),
      ...(tagDescription ? { description: tagDescription } : {}),
      ...(tagColor ? { tagColor } : {}),
      ...(markerIconUrl ? { iconUrl: markerIconUrl } : {}),
    };
  }

  return payload;
};

export default function EventTimelineCreatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const eventId = id || '';
  const defaultDate = searchParams.get('date') || '';

  const { event, loading: eventLoading } = useEvent(eventId);
  const { createTimeline } = useEventTimelines(eventId);

  const [step, setStep] = useState<'timeline' | 'point' | 'visual'>('timeline');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isMarkerUploading, setIsMarkerUploading] = useState(false);
  const [markerUploadError, setMarkerUploadError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ ...emptyForm, date: defaultDate });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const markerUploaderRef = useRef<EventPointTagTabHandle | null>(null);
  const [newMarkerSelected, setNewMarkerSelected] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (stage: 'timeline' | 'submit' = 'submit'): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập tên';
    if (!form.date) newErrors.date = 'Vui lòng chọn ngày';
    if (!form.startTime) newErrors.startTime = 'Vui lòng chọn thời gian bắt đầu';
    if (!form.endTime) newErrors.endTime = 'Vui lòng chọn thời gian kết thúc';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      newErrors.endTime = 'Vui lòng chọn thời gian kết thúc sau thời gian bắt đầu';
    }

    if (form.organizer && form.organizer.length > 255) {
      newErrors.organizer = 'Tên đơn vị tổ chức không được vượt quá 255 ký tự';
    }
    if (form.coOrganizer && form.coOrganizer.length > 255) {
      newErrors.coOrganizer = 'Tên đơn vị phối hợp không được vượt quá 255 ký tự';
    }

    if (event?.startTime && form.date && form.startTime) {
      const eventStartDT = dayjs(event.startTime);
      const minDate = eventStartDT.format('YYYY-MM-DD');
      if (form.date < minDate) {
        newErrors.date = `Ngày phải từ ngày ${minDate} trở đi`;
      } else if (form.date === minDate) {
        const minTime = eventStartDT.format('HH:mm');
        if (form.startTime < minTime) {
          newErrors.startTime = `Thời gian bắt đầu phải từ ${minTime} trở đi`;
        }
      }
    }

    if (event?.endTime && form.date) {
      const eventEndDT = dayjs(event.endTime);
      const maxDate = eventEndDT.format('YYYY-MM-DD');
      if (form.date > maxDate) {
        newErrors.date = `Ngày phải từ ngày ${maxDate} trở về trước`;
      } else if (form.date === maxDate && form.endTime) {
        const maxTime = eventEndDT.format('HH:mm');
        if (form.endTime > maxTime) {
          newErrors.endTime = `Thời gian bắt đầu phải từ ${maxTime} trở về trước`;
        }
      }
    }

    if (stage === 'submit') {
      if (!form.destinationName.trim()) {
        newErrors.destinationName = 'Tên điểm đến không được để trống';
      }

      if (!form.destinationLatitude.trim()) {
        newErrors.destinationLatitude = 'Tọa độ vĩ độ không được để trống';
      } else if (!Number.isFinite(Number.parseFloat(form.destinationLatitude))) {
        newErrors.destinationLatitude = 'Tọa độ vĩ độ phải là một số hợp lệ';
      }

      if (!form.destinationLongitude.trim()) {
        newErrors.destinationLongitude = 'Tọa độ kinh độ không được để trống';
      } else if (!Number.isFinite(Number.parseFloat(form.destinationLongitude))) {
        newErrors.destinationLongitude = 'Tọa độ kinh độ phải là một số hợp lệ';
      }

      if (!form.destinationTagName.trim()) {
        newErrors.destinationTagName = 'Tên thẻ không được để trống';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 'timeline' && validate('timeline')) {
      setStep('point');
      return;
    }

    if (step === 'point') {
      setStep('visual');
    }
  };

  const submitTimeline = async () => {
    setLoading(true);
    const eventPoint = buildEventPointPayload(form);
    const pointId = form.eventPointId.trim() || null;

    const data: CreateEventTimelineRequest = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      date: form.date,
      startTime: toApiTime(form.startTime),
      endTime: toApiTime(form.endTime),
      organizer: form.organizer.trim() || undefined,
      coOrganizer: form.coOrganizer.trim() || undefined,
      eventPointId: pointId,
      eventPoint,
    };

    const success = await createTimeline(data);
    setLoading(false);

    if (success) {
      navigate(`/admin/events/${eventId}?tab=timeline`);
    }
  };

  const uploadMarkerInBackground = async (): Promise<void> => {
    if (form.eventPointTagId.trim() && form.destinationMarkerIconUrl.trim()) {
      setIsMarkerUploading(false);
      return;
    }

    if (!markerUploaderRef.current) {
      setMarkerUploadError('Không thể khởi tạo tải lên biểu tượng đánh dấu. Vui lòng thử lại.');
      return;
    }

    setIsMarkerUploading(true);
    setMarkerUploadError(null);

    const iconUrl = await markerUploaderRef.current.generateMarkerIcon();

    if (!iconUrl) {
      setMarkerUploadError('Không thể tạo và tải lên biểu tượng đánh dấu. Vui lòng thử lại.');
      setErrors((prev) => ({
        ...prev,
        destinationMarkerIconUrl: 'Không thể tạo và tải lên biểu tượng đánh dấu. Vui lòng thử lại.',
      }));
      setIsMarkerUploading(false);
      return;
    }

    handleChange('destinationMarkerIconUrl', iconUrl);
    setErrors((prev) => ({ ...prev, destinationMarkerIconUrl: undefined }));
    setIsMarkerUploading(false);
  };

  const handleSubmit = async () => {
    if (!validate('submit')) {
      if (!form.destinationTagName.trim()) {
        message.warning('Vui lòng nhập tên thẻ trước khi tạo.');
      }
      return;
    }

    setConfirmOpen(true);
    void uploadMarkerInBackground();
  };

  const handleFinalConfirm = async () => {
    if (isMarkerUploading) {
      message.info('Đang tải ảnh đánh dấu lên. Vui lòng chờ.');
      return;
    }

    if (markerUploadError || !form.destinationMarkerIconUrl.trim()) {
      message.warning('Ảnh đánh dấu chưa được tải lên xong. Vui lòng tải lại trước khi xác nhận.');
      return;
    }

    await submitTimeline();
  };

  if (!eventId) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted-foreground">ID sự kiện không hợp lệ.</p>
      </div>
    );
  }

  if (eventLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[480px] w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Thêm mục dòng thời gian</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {event ? `Sự kiện: ${event.name}` : 'Tạo một mục dòng thời gian mới cho sự kiện.'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/admin/events/${eventId}?tab=timeline`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại Sự kiện
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <Tabs value={step} onValueChange={(v) => setStep(v as 'timeline' | 'point' | 'visual')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                1. Tạo dòng thời gian sự kiện
              </TabsTrigger>
              <TabsTrigger
                value="point"
                disabled={step !== 'point'}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                2. Thêm địa điểm sự kiện
              </TabsTrigger>
              <TabsTrigger
                value="visual"
                disabled={step !== 'visual'}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                3. Tạo thẻ địa điểm
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="max-w-screen-sm mx-auto mt-4">
              <EventTimeLineCreationTab
                form={form}
                errors={errors}
                eventStartDate={event?.startTime}
                eventEndDate={event?.endTime}
                handleChange={handleChange}
              />
            </TabsContent>

            <TabsContent value="point" className="mt-4">
              <EventTimeLinePointCreationTab
                form={form}
                errors={errors}
                handleChange={handleChange}
                eventId={eventId}
              />
            </TabsContent>

            <TabsContent value="visual" className="mt-4">
              <EventPointTagTab
                ref={markerUploaderRef}
                form={form}
                errors={errors}
                handleChange={handleChange}
                eventId={eventId}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-5 flex items-center justify-end gap-2 border-t pt-4">
            {step === 'point' || step === 'visual' ? (
              <Button
                variant="outline"
                onClick={() => setStep(step === 'visual' ? 'point' : 'timeline')}
                disabled={loading}
              >
                Quay lại
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/events/${eventId}?tab=timeline`)}
                disabled={loading}
              >
                Hủy
              </Button>
            )}

            {step === 'timeline' || step === 'point' ? (
              <Button onClick={handleNextStep} disabled={loading}>
                Tiếp tục
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận tạo mục dòng thời gian</AlertDialogTitle>
            <AlertDialogDescription>Xem lại tất cả thông tin dưới đây trước khi tạo.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className={`rounded-md border p-3 ${isMarkerUploading ? 'opacity-60' : ''}`}>
              <p className="text-sm font-medium">Trạng thái tải lên ảnh thẻ điểm sự kiện</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isMarkerUploading
                  ? 'Đang tải ảnh ...'
                  : markerUploadError
                    ? markerUploadError
                    : 'Tải ảnh thẻ điểm sự kiện thành công và sẵn sàng tạo.'}
              </p>
            </div>

            <div className="max-h-[360px] overflow-auto rounded-md border bg-muted/20 p-4 space-y-4">
              <section className="space-y-2">
                <p className="text-sm font-semibold">Chi tiết dòng thời gian</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Tên mục dòng thời gian" value={summaryValue(form.name)} />
                  <SummaryItem label="Ngày" value={summaryValue(form.date)} />
                  <SummaryItem label="Giờ bắt đầu" value={summaryValue(form.startTime)} />
                  <SummaryItem label="Giờ kết thúc" value={summaryValue(form.endTime)} />
                  <SummaryItem label="Mô tả" value={summaryValue(form.description)} />
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold">Người tổ chức</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Đơn vị tổ chức" value={summaryValue(form.organizer)} />
                  <SummaryItem label="Đơn vị đồng tổ chức" value={summaryValue(form.coOrganizer)} />
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold">Địa điểm sự kiện</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Địa điểm tổ chức sự kiện" value={summaryValue(form.destinationName)} />
                  <SummaryItem label="Địa chỉ" value={summaryValue(form.destinationAddress)} />
                  <SummaryItem label="Vĩ độ" value={summaryValue(form.destinationLatitude)} />
                  <SummaryItem label="Kinh độ" value={summaryValue(form.destinationLongitude)} />
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold">Thẻ địa điểm sự kiện</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Tên thẻ địa điểm sự kiện" value={summaryValue(form.destinationTagName)} />
                  <SummaryItem label="Màu thẻ địa điểm sự kiện" value={summaryValue(form.destinationTagColor)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground mb-2">Ảnh địa điểm sự kiện</p>
                    {form.destinationImageUrl.trim() ? (
                      <img
                        src={form.destinationImageUrl}
                        alt="Xem trước ảnh điểm đến"
                        className="h-24 w-full object-cover rounded"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">Không có ảnh điểm đến</p>
                    )}
                  </div>

                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground mb-2">Ảnh đánh dấu điểm đến sự kiện</p>
                    {form.destinationMarkerIconUrl.trim() ? (
                      <div className="h-24 flex items-center justify-center">
                        <img
                          src={form.destinationMarkerIconUrl}
                          alt="Xem trước biểu tượng đánh dấu"
                          className="h-14 w-14 object-contain"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Ảnh đánh dấu điểm đến sự kiện chưa được tải lên.</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading || isMarkerUploading}>Đóng</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleFinalConfirm();
              }}
              disabled={loading || isMarkerUploading || !!markerUploadError || !form.destinationMarkerIconUrl.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận tạo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{value}</p>
    </div>
  );
}
