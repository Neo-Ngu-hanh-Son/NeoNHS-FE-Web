import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvent, useEventTimelines } from '@/hooks/event';
import type { CreateEventTimelineRequest } from '@/types/eventTimeline';
import type { FormData } from '../components/eventTimeline/EventTimelineFormDialog';
import EventTimeLineCreationTab from '../components/eventTimeline/EventTimeLineCreationTab';
import EventTimeLinePointCreationTab from '../components/eventTimeline/EventTimeLinePointCreationTab';
import EventPointTagTab from '../components/eventTimeline/EventPointTagTab';

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
};

const toApiTime = (time: string): string => (time.length === 5 ? `${time}:00` : time);

const buildEventPointPayload = (form: FormData): CreateEventTimelineRequest['eventPoint'] | undefined => {
  const name = form.destinationName.trim();
  const latitudeRaw = form.destinationLatitude.trim();
  const longitudeRaw = form.destinationLongitude.trim();

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
  };

  const address = form.destinationAddress.trim();
  if (address) payload.address = address;

  const imageUrl = form.destinationImageUrl.trim();
  if (imageUrl) payload.imageUrl = imageUrl;

  const markerIconUrl = form.destinationMarkerIconUrl.trim();
  const tagColor = form.destinationTagColor.trim();
  const tagName = form.destinationTagName.trim() || name;
  const tagDescription = tagName;
  if (markerIconUrl || tagColor || tagName) {
    payload.eventPointTagRequest = {
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
  const [form, setForm] = useState<FormData>({ ...emptyForm, date: defaultDate });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

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

      if (!form.destinationMarkerIconUrl.trim()) {
        newErrors.destinationMarkerIconUrl = 'Please review and confirm marker visual identity.';
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

  const handleSubmit = async () => {
    if (!validate('submit')) return;

    setLoading(true);
    const eventPoint = buildEventPointPayload(form);

    const data: CreateEventTimelineRequest = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      date: form.date,
      startTime: toApiTime(form.startTime),
      endTime: toApiTime(form.endTime),
      organizer: form.organizer.trim() || undefined,
      coOrganizer: form.coOrganizer.trim() || undefined,
      eventPoint,
    };

    const success = await createTimeline(data);
    setLoading(false);

    if (success) {
      navigate(`/admin/events/${eventId}?tab=timeline`);
    }
  };

  if (!eventId) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted-foreground">Invalid event id.</p>
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
          <h1 className="text-2xl font-bold">Add Timeline Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {event ? `Event: ${event.name}` : 'Create a new timeline entry for this event.'}
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
                1. Create event timeline
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
              <EventTimeLinePointCreationTab form={form} errors={errors} handleChange={handleChange} />
            </TabsContent>

            <TabsContent value="visual" className="mt-4">
              <EventPointTagTab form={form} errors={errors} handleChange={handleChange} />
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
                Create
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
