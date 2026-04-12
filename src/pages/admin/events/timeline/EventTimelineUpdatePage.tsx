import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import type { EventTimelineResponse, UpdateEventTimelineRequest } from '@/types/eventTimeline';
import type { EventPointTagTabHandle } from '../components/eventTimeline/EventPointTagTab';
import EventTimeLineCreationTab from '../components/eventTimeline/EventTimeLineCreationTab';
import EventTimeLinePointCreationTab from '../components/eventTimeline/EventTimeLinePointCreationTab';
import EventPointTagTab from '../components/eventTimeline/EventPointTagTab';
import { FormData } from '../type';

const DEFAULT_TAG_COLOR = '#0f766e';

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
  destinationTagColor: DEFAULT_TAG_COLOR,
  destinationTagName: '',
  destinationTagDescription: '',
  eventPointId: '',
  eventPointTagId: '',
};

const toApiTime = (time: string): string => (time.length === 5 ? `${time}:00` : time);

const toInputTime = (time?: string): string => {
  if (!time) return '';
  return time.length >= 5 ? time.slice(0, 5) : time;
};

const summaryValue = (value: string): string => (value.trim() ? value.trim() : 'Not provided');

const buildEventPointPayload = (form: FormData): UpdateEventTimelineRequest['eventPoint'] | undefined => {
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

  const payload: NonNullable<UpdateEventTimelineRequest['eventPoint']> = {
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

const mapTimelineToForm = (timeline: EventTimelineResponse): FormData => {
  const point = timeline.eventPoint;
  const pointTag = point?.eventPointTag;

  return {
    ...emptyForm,
    name: timeline.name || '',
    description: timeline.description || '',
    date: timeline.date || '',
    startTime: toInputTime(timeline.startTime),
    endTime: toInputTime(timeline.endTime),
    organizer: timeline.organizer || '',
    coOrganizer: timeline.coOrganizer || '',
    destinationName: point?.name || '',
    destinationAddress: point?.address || '',
    destinationLatitude: point?.latitude != null ? String(point.latitude) : '',
    destinationLongitude: point?.longitude != null ? String(point.longitude) : '',
    destinationImageUrl: point?.imageUrl || '',
    destinationMarkerIconUrl: pointTag?.iconUrl || '',
    destinationTagColor: pointTag?.tagColor || DEFAULT_TAG_COLOR,
    destinationTagName: pointTag?.name || '',
    destinationTagDescription: pointTag?.description || '',
    eventPointId: point?.id || '',
    eventPointTagId: pointTag?.id || '',
  };
};

export default function EventTimelineUpdatePage() {
  const { id, timelineId } = useParams<{ id: string; timelineId: string }>();
  const navigate = useNavigate();

  const eventId = id || '';
  const currentTimelineId = timelineId || '';

  const { event, loading: eventLoading } = useEvent(eventId);
  const { updateTimeline, fetchTimelineById } = useEventTimelines(eventId, false);

  const [step, setStep] = useState<'timeline' | 'point' | 'visual'>('timeline');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isMarkerUploading, setIsMarkerUploading] = useState(false);
  const [markerUploadError, setMarkerUploadError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const markerUploaderRef = useRef<EventPointTagTabHandle | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTimeline() {
      if (!eventId || !currentTimelineId) {
        if (mounted) setInitializing(false);
        return;
      }

      const timeline = await fetchTimelineById(currentTimelineId);
      if (!mounted) return;

      if (!timeline) {
        setInitializing(false);
        message.error('Timeline entry not found.');
        navigate(`/admin/events/${eventId}?tab=timeline`, { replace: true });
        return;
      }

      setForm(mapTimelineToForm(timeline));
      setInitializing(false);
    }

    void loadTimeline();

    return () => {
      mounted = false;
    };
  }, [eventId, currentTimelineId, fetchTimelineById, navigate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (stage: 'timeline' | 'submit' = 'submit'): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.startTime) newErrors.startTime = 'Start time is required';
    if (!form.endTime) newErrors.endTime = 'End time is required';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (form.organizer && form.organizer.length > 100) {
      newErrors.organizer = 'Organizer name must be less than 100 characters';
    }
    if (form.coOrganizer && form.coOrganizer.length > 100) {
      newErrors.coOrganizer = 'Co-organizer name must be less than 100 characters';
    }

    if (event?.startTime && form.date && form.startTime) {
      const eventStartDT = dayjs(event.startTime);
      const minDate = eventStartDT.format('YYYY-MM-DD');
      if (form.date < minDate) {
        newErrors.date = `Date must be at or after ${minDate}`;
      } else if (form.date === minDate) {
        const minTime = eventStartDT.format('HH:mm');
        if (form.startTime < minTime) {
          newErrors.startTime = `Must be at or after ${minTime} on the start date`;
        }
      }
    }

    if (event?.endTime && form.date) {
      const eventEndDT = dayjs(event.endTime);
      const maxDate = eventEndDT.format('YYYY-MM-DD');
      if (form.date > maxDate) {
        newErrors.date = `Date must be at or before ${maxDate}`;
      } else if (form.date === maxDate && form.endTime) {
        const maxTime = eventEndDT.format('HH:mm');
        if (form.endTime > maxTime) {
          newErrors.endTime = `Must be at or before ${maxTime} on the end date`;
        }
      }
    }

    if (stage === 'submit') {
      if (!form.destinationName.trim()) {
        newErrors.destinationName = 'Destination name is required';
      }

      if (!form.destinationLatitude.trim()) {
        newErrors.destinationLatitude = 'Latitude is required';
      } else if (!Number.isFinite(Number.parseFloat(form.destinationLatitude))) {
        newErrors.destinationLatitude = 'Latitude must be a valid number';
      }

      if (!form.destinationLongitude.trim()) {
        newErrors.destinationLongitude = 'Longitude is required';
      } else if (!Number.isFinite(Number.parseFloat(form.destinationLongitude))) {
        newErrors.destinationLongitude = 'Longitude must be a valid number';
      }

      if (!form.destinationTagName.trim()) {
        newErrors.destinationTagName = 'Tag name is required';
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

    const data: UpdateEventTimelineRequest = {
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

    const success = await updateTimeline(currentTimelineId, data);
    setLoading(false);

    if (success) {
      navigate(`/admin/events/${eventId}?tab=timeline`);
    }
  };

  const uploadMarkerInBackground = async (): Promise<void> => {
    if (!markerUploaderRef.current) {
      setMarkerUploadError('Unable to initialize marker upload. Please try again.');
      return;
    }

    setIsMarkerUploading(true);
    setMarkerUploadError(null);

    const iconUrl = await markerUploaderRef.current.generateMarkerIcon();

    if (!iconUrl) {
      setMarkerUploadError('Unable to generate and upload marker icon. Please retry.');
      setErrors((prev) => ({
        ...prev,
        destinationMarkerIconUrl: 'Failed to upload marker icon. Please try again.',
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
        message.warning('Please enter a required tag name before updating.');
      }
      return;
    }

    setConfirmOpen(true);
    void uploadMarkerInBackground();
  };

  const handleFinalConfirm = async () => {
    if (isMarkerUploading) {
      message.info('Marker is still uploading. Please wait.');
      return;
    }

    if (markerUploadError || !form.destinationMarkerIconUrl.trim()) {
      message.warning('Marker upload is not ready. Please retry before final confirmation.');
      return;
    }

    await submitTimeline();
  };

  if (!eventId || !currentTimelineId) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted-foreground">Invalid event id or timeline id.</p>
      </div>
    );
  }

  if (eventLoading || initializing) {
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
          <h1 className="text-2xl font-bold">Update Timeline Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {event ? `Event: ${event.name}` : 'Update this timeline entry.'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/admin/events/${eventId}?tab=timeline`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
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
                1. Update event timeline
              </TabsTrigger>
              <TabsTrigger
                value="point"
                disabled={step !== 'point'}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                2. Set event timeline location
              </TabsTrigger>
              <TabsTrigger
                value="visual"
                disabled={step !== 'visual'}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                3. Visual identity
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
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/events/${eventId}?tab=timeline`)}
                disabled={loading}
              >
                Cancel
              </Button>
            )}

            {step === 'timeline' || step === 'point' ? (
              <Button onClick={handleNextStep} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Final Confirmation</AlertDialogTitle>
            <AlertDialogDescription>Review all information below before final update.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className={`rounded-md border p-3 ${isMarkerUploading ? 'opacity-60' : ''}`}>
              <p className="text-sm font-medium">Marker Upload Status</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isMarkerUploading
                  ? 'Uploading marker icon in the background...'
                  : markerUploadError
                    ? markerUploadError
                    : 'Marker icon uploaded successfully and ready for final update.'}
              </p>
            </div>

            <div className="max-h-[360px] overflow-auto rounded-md border bg-muted/20 p-4 space-y-4">
              <section className="space-y-2">
                <p className="text-sm font-semibold">Timeline Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Timeline name" value={summaryValue(form.name)} />
                  <SummaryItem label="Date" value={summaryValue(form.date)} />
                  <SummaryItem label="Start time" value={summaryValue(form.startTime)} />
                  <SummaryItem label="End time" value={summaryValue(form.endTime)} />
                  <SummaryItem label="Description" value={summaryValue(form.description)} />
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold">People</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Organizer" value={summaryValue(form.organizer)} />
                  <SummaryItem label="Co-organizer" value={summaryValue(form.coOrganizer)} />
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold">Location</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Destination name" value={summaryValue(form.destinationName)} />
                  <SummaryItem label="Address" value={summaryValue(form.destinationAddress)} />
                  <SummaryItem label="Latitude" value={summaryValue(form.destinationLatitude)} />
                  <SummaryItem label="Longitude" value={summaryValue(form.destinationLongitude)} />
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold">Tag Visual Identity</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SummaryItem label="Tag name" value={summaryValue(form.destinationTagName)} />
                  <SummaryItem label="Tag color" value={summaryValue(form.destinationTagColor)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground mb-2">Destination image</p>
                    {form.destinationImageUrl.trim() ? (
                      <img
                        src={form.destinationImageUrl}
                        alt="Destination preview"
                        className="h-24 w-full object-cover rounded"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">No destination image</p>
                    )}
                  </div>

                  <div className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground mb-2">Marker preview</p>
                    {form.destinationMarkerIconUrl.trim() ? (
                      <div className="h-24 flex items-center justify-center">
                        <img
                          src={form.destinationMarkerIconUrl}
                          alt="Marker preview"
                          className="h-14 w-14 object-contain"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Marker will appear after upload</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading || isMarkerUploading}>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleFinalConfirm();
              }}
              disabled={loading || isMarkerUploading || !!markerUploadError || !form.destinationMarkerIconUrl.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Final Confirm Update
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
