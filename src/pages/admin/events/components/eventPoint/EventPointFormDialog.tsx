import { useEffect, useMemo, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DragImageUploader from '@/components/common/DragImageUploader';
import { MapPickerModal } from '@/pages/admin/events/components/MapPickerModal';
import type { EventPointRequest, EventPointResponse, EventPointTagResponse } from '@/types/eventTimeline';

interface EventPointFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  point?: EventPointResponse | null;
  tags: EventPointTagResponse[];
  onSubmit: (data: EventPointRequest) => Promise<boolean>;
}

interface FormData {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  eventPointTagId: string;
}

const NO_TAG_VALUE = '__no_tag__';

const emptyForm: FormData = {
  name: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  imageUrl: '',
  eventPointTagId: NO_TAG_VALUE,
};

function resolveImageUrl(point?: EventPointResponse | null): string {
  if (!point) return '';

  if (point.imageUrl) {
    return point.imageUrl;
  }

  const imageList = point.imageList;
  if (!imageList) {
    return '';
  }

  const trimmed = imageList.trim();

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
        return parsed[0];
      }
    } catch {
      return '';
    }
  }

  if (trimmed.includes(',')) {
    return trimmed.split(',')[0].trim();
  }

  return trimmed;
}

export function EventPointFormDialog({ open, onOpenChange, point, tags, onSubmit }: EventPointFormDialogProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const isEdit = !!point;

  useEffect(() => {
    if (point) {
      setForm({
        name: point.name || '',
        description: point.description || '',
        address: point.address || '',
        latitude: String(point.latitude),
        longitude: String(point.longitude),
        imageUrl: resolveImageUrl(point),
        eventPointTagId: point.eventPointTag?.id || NO_TAG_VALUE,
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
  }, [point, open]);

  const mapInitialPosition = useMemo(() => {
    const lat = Number.parseFloat(form.latitude);
    const lng = Number.parseFloat(form.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  }, [form.latitude, form.longitude]);

  const availableTags = useMemo(() => tags.filter((tag) => !!tag.id), [tags]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Point name is required';
    }

    const latitude = Number.parseFloat(form.latitude);
    const longitude = Number.parseFloat(form.longitude);

    if (!form.latitude.trim()) {
      nextErrors.latitude = 'Latitude is required';
    } else if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      nextErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (!form.longitude.trim()) {
      nextErrors.longitude = 'Longitude is required';
    } else if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      nextErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const payload: EventPointRequest = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      address: form.address.trim() || undefined,
      latitude: Number.parseFloat(form.latitude),
      longitude: Number.parseFloat(form.longitude),
      imageUrl: form.imageUrl.trim() || undefined,
      eventPointTagId: form.eventPointTagId === NO_TAG_VALUE ? null : form.eventPointTagId,
    };

    const success = await onSubmit(payload);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Event Point' : 'Add Event Point'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the selected event point details.'
                : 'Create a reusable event point for event timelines.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="event-point-name">Name *</Label>
              <Input
                id="event-point-name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Main Stage"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="event-point-description">Description</Label>
              <Textarea
                id="event-point-description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Short details about this point"
              />
            </div>

            <div>
              <Label htmlFor="event-point-tag">Point Tag</Label>
              <Select value={form.eventPointTagId} onValueChange={(value) => handleChange('eventPointTagId', value)}>
                <SelectTrigger id="event-point-tag">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_TAG_VALUE}>No tag</SelectItem>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id!}>
                      {tag.name || 'Unnamed tag'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event-point-address">Address</Label>
              <Input
                id="event-point-address"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. Ngu Hanh Son, Da Nang"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="event-point-latitude">Latitude *</Label>
                <Input
                  id="event-point-latitude"
                  value={form.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  placeholder="15.998600"
                />
                {errors.latitude && <p className="text-xs text-destructive mt-1">{errors.latitude}</p>}
              </div>
              <div>
                <Label htmlFor="event-point-longitude">Longitude *</Label>
                <Input
                  id="event-point-longitude"
                  value={form.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  placeholder="108.261800"
                />
                {errors.longitude && <p className="text-xs text-destructive mt-1">{errors.longitude}</p>}
              </div>
            </div>

            <div className="rounded-md border p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Pick coordinates on map</p>
                <p className="text-xs text-muted-foreground">Use map picker for precise location selection.</p>
              </div>
              <Button type="button" variant="outline" onClick={() => setMapOpen(true)}>
                <MapPin className="h-4 w-4 mr-1" />
                Open Map Picker
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                Lat: {form.latitude || '—'}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                Lng: {form.longitude || '—'}
              </Badge>
            </div>

            <div>
              <Label>Point Image</Label>
              <div className="mt-1">
                <DragImageUploader
                  value={form.imageUrl}
                  onUpload={(url) => handleChange('imageUrl', url)}
                  onError={(errorMessage) => message.error(errorMessage)}
                  minHeight={140}
                  imageClassName="!w-auto max-w-[260px] mx-auto"
                  placeholder="Upload event point image"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MapPickerModal
        open={mapOpen}
        onOpenChange={setMapOpen}
        initialPosition={mapInitialPosition}
        onConfirm={(lat, lng) => {
          handleChange('latitude', String(lat));
          handleChange('longitude', String(lng));
        }}
      />
    </>
  );
}
