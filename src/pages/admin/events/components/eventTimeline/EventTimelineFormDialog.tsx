import { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import EventPointTagTab, { type EventPointTagTabHandle } from './EventPointTagTab';

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

const summaryValue = (value: string): string => (value.trim() ? value.trim() : 'Not provided');

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
  const tagName = form.destinationTagName.trim();
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isMarkerUploading, setIsMarkerUploading] = useState(false);
  const [markerUploadError, setMarkerUploadError] = useState<string | null>(null);
  const markerUploaderRef = useRef<EventPointTagTabHandle | null>(null);
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

      if (!form.destinationTagName.trim()) {
        newErrors.destinationTagName = 'Tag name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitTimeline = async () => {
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

  const uploadMarkerInBackground = async (): Promise<void> => {
    if (isEdit) return;
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

  const handleCreateRequest = async () => {
    if (!validate('submit')) {
      if (!form.destinationTagName.trim()) {
        message.warning('Please enter a required tag name before creating.');
      }
      return;
    }

    if (isEdit) {
      await submitTimeline();
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
        <Button onClick={handleCreateRequest} disabled={loading}>
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
    setConfirmOpen(false);
    setIsMarkerUploading(false);
    setMarkerUploadError(null);
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
            <EventPointTagTab ref={markerUploaderRef} form={form} errors={errors} handleChange={handleChange} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {getBackButton()}
          {getCurrentStepButton()}
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Final Confirmation</AlertDialogTitle>
            <AlertDialogDescription>Review all information below before final creation.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className={`rounded-md border p-3 ${isMarkerUploading ? 'opacity-60' : ''}`}>
              <p className="text-sm font-medium">Marker Upload Status</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isMarkerUploading
                  ? 'Uploading marker icon in the background...'
                  : markerUploadError
                    ? markerUploadError
                    : 'Marker icon uploaded successfully and ready for final creation.'}
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
              Final Confirm Creation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
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
