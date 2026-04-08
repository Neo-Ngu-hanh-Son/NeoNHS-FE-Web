import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import type {
  EventTimelineResponse,
  CreateEventTimelineRequest,
  UpdateEventTimelineRequest,
} from '@/types/eventTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventTimeLineCreationTab from './EventTimeLineCreationTab';
import EventTimeLinePointCreationTab from './EventTimeLinePointCreationTab';
import EventPointTagTab from './EventPointTagTab';

interface EventTimelineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeline?: EventTimelineResponse | null;
  onSubmit: (data: CreateEventTimelineRequest | UpdateEventTimelineRequest) => Promise<boolean>;
  /** Optional: pre-fill date when creating from a specific date tab */
  defaultDate?: string;
  eventStartDate?: string;
  eventEndDate?: string;
}

export interface FormData {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  organizer: string;
  coOrganizer: string;
  destinationName: string;
  destinationAddress: string;
  destinationLatitude: string;
  destinationLongitude: string;
  destinationImageUrl: string;
  destinationMarkerIconUrl: string;
  destinationTagColor: string;
  destinationTagName: string;
  destinationTagDescription: string;
}

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

const toTimeInputValue = (time: string): string => {
  if (!time) return '';
  return time.length >= 5 ? time.slice(0, 5) : time;
};

const buildEventPointPayload = (
  form: FormData,
  existingTagId?: string,
): CreateEventTimelineRequest['eventPoint'] | undefined => {
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

  if (existingTagId) {
    payload.eventPointTagId = existingTagId;
    return payload;
  }

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

export function EventTimelineFormDialog({
  open,
  onOpenChange,
  timeline,
  onSubmit,
  defaultDate,
  eventStartDate,
  eventEndDate,
}: EventTimelineFormDialogProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!timeline;

  useEffect(() => {
    if (timeline) {
      const eventPoint = timeline.eventPoint;
      setForm({
        name: timeline.name || '',
        description: timeline.description || '',
        date: timeline.date || '',
        startTime: toTimeInputValue(timeline.startTime || ''),
        endTime: toTimeInputValue(timeline.endTime || ''),
        organizer: timeline.organizer || '',
        coOrganizer: timeline.coOrganizer || '',
        destinationName: eventPoint?.name || '',
        destinationAddress: eventPoint?.address || '',
        destinationLatitude: eventPoint ? String(eventPoint.latitude) : '',
        destinationLongitude: eventPoint ? String(eventPoint.longitude) : '',
        destinationImageUrl: eventPoint?.imageUrl || '',
        destinationMarkerIconUrl: eventPoint?.eventPointTag?.iconUrl || '',
        destinationTagColor: eventPoint?.eventPointTag?.tagColor || '#0f766e',
        destinationTagName: eventPoint?.eventPointTag?.name || '',
        destinationTagDescription: eventPoint?.eventPointTag?.description || '',
      });
    } else {
      setForm({
        ...emptyForm,
        date: defaultDate || '',
      });
    }
    setErrors({});
  }, [timeline, open, defaultDate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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

    if (eventStartDate && form.date && form.startTime) {
      const eventStartDT = dayjs(eventStartDate);
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

    if (eventEndDate && form.date) {
      const eventEndDT = dayjs(eventEndDate);
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

    if (stage === 'submit' && !isEdit) {
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

  const handleSubmit = async () => {
    if (!validate('submit')) return;
    setLoading(true);

    const eventPoint = buildEventPointPayload(form, timeline?.eventPoint?.eventPointTag?.id);

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

    const success = await onSubmit(data);
    setLoading(false);
    if (success) onOpenChange(false);
  };

  // Timeline creation uses 3 steps: timeline detail, destination point, and visual identity.
  const [step, setStep] = useState<'timeline' | 'point' | 'visual'>('timeline');

  const handleNextStep = () => {
    if (step === 'timeline') {
      if (validate('timeline')) {
        setStep('point');
      }
      return;
    }

    if (step === 'point') {
      setStep('visual');
    }
  };

  const getCurrentStepButton = () => {
    if (step === 'timeline' || step === 'point') {
      return (
        <Button onClick={handleNextStep} disabled={loading}>
          Next
        </Button>
      );
    } else {
      // handleSubmit
      return (
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Update' : 'Create'}
        </Button>
      );
    }
  };

  const clearForm = () => {
    setForm(emptyForm);
    setErrors({});
    setStep('timeline');
  };

  const getBackButton = () => {
    if (step === 'point' || step === 'visual') {
      return (
        <Button variant="outline" onClick={() => setStep(step === 'visual' ? 'point' : 'timeline')} disabled={loading}>
          Back
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline"
          onClick={() => {
            onOpenChange(false);
            clearForm();
          }}
          disabled={loading}
        >
          Cancel
        </Button>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1280px] max-h-[92vh] overflow-y-auto p-4 sm:p-5">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Timeline Entry' : 'Add Timeline Entry'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the timeline entry details.' : 'Create a new timeline entry for this event.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={step} onValueChange={(value) => setStep(value as 'timeline' | 'point' | 'visual')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="timeline"
              disabled={step !== 'timeline'}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              1. Create timeline
            </TabsTrigger>
            <TabsTrigger
              value="point"
              disabled={step !== 'point'}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              2. Set timeline location
            </TabsTrigger>
            <TabsTrigger
              value="visual"
              disabled={step !== 'visual'}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              3. Visual identity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="max-w-screen-sm mx-auto">
            <EventTimeLineCreationTab
              form={form}
              errors={errors}
              eventStartDate={eventStartDate}
              eventEndDate={eventEndDate}
              handleChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="point">
            <EventTimeLinePointCreationTab form={form} errors={errors} handleChange={handleChange} />
          </TabsContent>

          <TabsContent value="visual">
            <EventPointTagTab form={form} errors={errors} handleChange={handleChange} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {getBackButton()}
          {getCurrentStepButton()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
