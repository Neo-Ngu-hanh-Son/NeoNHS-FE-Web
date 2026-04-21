import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { message } from 'antd';
import { Icon } from '@iconify/react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useEventTimelines } from '@/hooks/event';
import { uploadImageToBackend } from '@/utils/cloudinary';
import { EventPointTagResponse } from '@/types/eventTimeline';
import { FormData } from '../../type';
import EventPointTagPicker from './EventPointTagPicker';

type Props = {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  handleChange: (field: keyof FormData, value: string) => void;
  eventId: string;
};

type VisualIconOption = {
  key: string;
  label: string;
  iconName: string; // iconify name OR blob url
  isCustom?: boolean;
};

const DEFAULT_TAG_COLOR = '#0f766e';

const QUICK_SWATCHES = [
  // --- Your Originals ---
  '#0f766e',
  '#0d9488',
  '#2563eb',
  '#db2777',
  '#ea580c',
  '#7c3aed',

  // --- The New Diverse Additions ---
  '#e11d48', // Vibrant Red (Festival/Spirit)
  '#d97706', // Rich Amber (Golden/Monastery)
  '#65a30d', // Fresh Green (Nature/Bamboo)
  '#0284c7', // Bright Cyan (Sky/Water)
  '#9333ea', // Deep Orchid (Cultural/Silk)
  '#a16207', // Ochre/Bronze (Ancient Earth)
  '#4f46e5', // Indigo (Traditional Dye)
];
export const NHS_CULTURAL_ICONS: VisualIconOption[] = [
  { key: 'marker', label: 'Location', iconName: 'mdi:map-marker' },
  { key: 'navigation', label: 'Navigation', iconName: 'mdi:compass' },
  { key: 'viewpoint', label: 'Viewpoint', iconName: 'mdi:binoculars' },
  { key: 'trail', label: 'Trail', iconName: 'mdi:foot-print' },
  { key: 'info', label: 'Information', iconName: 'mdi:information' },
  { key: 'parking', label: 'Parking', iconName: 'mdi:parking' },
  { key: 'wc', label: 'Restroom', iconName: 'mdi:toilet' },
  { key: 'food', label: 'Food', iconName: 'mdi:food' },
  { key: 'drink', label: 'Drink', iconName: 'mdi:cup-water' },
  { key: 'ticket', label: 'Ticket', iconName: 'mdi:ticket' },
  { key: 'pagoda', label: 'Pagoda', iconName: 'mdi:temple-buddhist' },
  { key: 'shrine', label: 'Shrine', iconName: 'mdi:home-variant' },
  { key: 'incense', label: 'Ritual', iconName: 'mdi:fire' },
  { key: 'statue', label: 'Statue', iconName: 'mdi:human-male-height' },
  { key: 'history', label: 'History', iconName: 'mdi:scroll' },
  { key: 'mountain', label: 'Mountain', iconName: 'mdi:mountain' },
  { key: 'cave', label: 'Cave', iconName: 'roentgen:cave' },
  { key: 'water', label: 'Water', iconName: 'mdi:waves' },
  { key: 'tree', label: 'Nature', iconName: 'mdi:pine-tree' },
  { key: 'stone', label: 'Marble', iconName: 'mdi:diamond-stone' },
  { key: 'craft', label: 'Craft', iconName: 'mdi:brush' },
  { key: 'photo', label: 'Photo Spot', iconName: 'mdi:camera' },
  { key: 'guide', label: 'Guide', iconName: 'mdi:account-tie' },
  { key: 'shopping', label: 'Souvenir', iconName: 'mdi:shopping' },
  { key: 'festival', label: 'Festival', iconName: 'mdi:party-popper' },
  { key: 'music', label: 'Music', iconName: 'mdi:music' },
  { key: 'live-music', label: 'Live Music', iconName: 'mdi:microphone' },
  { key: 'dance', label: 'Performance', iconName: 'mdi:human-female-dance' },
  { key: 'fireworks', label: 'Fireworks', iconName: 'mdi:firework' },
  { key: 'stage', label: 'Stage Event', iconName: 'mdi:theater' },
  { key: 'lantern', label: 'Lantern', iconName: 'mingcute:lantern-fill' },
];

export interface EventPointTagTabHandle {
  generateMarkerIcon: () => Promise<string | null>;
}

const EventPointTagTab = forwardRef<EventPointTagTabHandle, Props>(function EventPointTagTab(
  { form, errors, handleChange, eventId }: Props,
  ref,
) {
  const markerPreviewRef = useRef<HTMLDivElement>(null);
  const customUploadInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [customUploadUrl, setCustomUploadUrl] = useState<string | null>(null);
  const [tagColor, setTagColor] = useState(form.destinationTagColor || DEFAULT_TAG_COLOR);
  const [existingTags, setExistingTags] = useState<EventPointTagResponse[]>([]);
  const [selectedExistingTagId, setSelectedExistingTagId] = useState<string>();

  const [selectedIcon, setSelectedIcon] = useState<VisualIconOption>(NHS_CULTURAL_ICONS[0]);
  const { fetchEventPointTags } = useEventTimelines(eventId, false);

  useEffect(() => {
    setTagColor(form.destinationTagColor || DEFAULT_TAG_COLOR);
  }, [form.destinationTagColor]);

  useEffect(() => {
    const tagId = form.eventPointTagId.trim();
    setSelectedExistingTagId(tagId || undefined);
  }, [form.eventPointTagId]);

  useEffect(() => {
    const existingIconUrl = form.destinationMarkerIconUrl.trim();
    if (!existingIconUrl) return;

    setSelectedIcon({
      key: form.eventPointTagId.trim() ? `existing-${form.eventPointTagId}` : 'current-marker-icon',
      label: form.destinationTagName.trim() || 'Current marker',
      iconName: existingIconUrl,
      isCustom: true,
    });
    setCustomUploadUrl(existingIconUrl);
  }, [form.destinationMarkerIconUrl, form.destinationTagName, form.eventPointTagId]);

  useEffect(() => {
    return () => {
      if (customUploadUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(customUploadUrl);
      }
    };
  }, [customUploadUrl]);

  useEffect(() => {
    async function fetchPreviouslyUsedTags() {
      try {
        const result = await fetchEventPointTags();
        setExistingTags(result);
      } catch (error: unknown) {
        message.error(`Failed to fetch existing event point tags: ${(error as Error).message}`);
      }
    }

    fetchPreviouslyUsedTags();
  }, [fetchEventPointTags]);

  const markerIcon = useMemo(() => {
    if (selectedIcon.isCustom) {
      return <img src={selectedIcon.iconName} className="h-8 w-8 object-contain" />;
    }

    return <Icon icon={selectedIcon.iconName} width={32} height={32} style={{ color: 'white' }} />;
  }, [selectedIcon]);

  const handleSelectCustomUpload = () => {
    customUploadInputRef.current?.click();
  };

  const handleUploadIcon = (file: File | undefined) => {
    if (!file) return;

    const isValidType = file.type === 'image/svg+xml' || file.type === 'image/png';

    if (!isValidType) {
      message.error('Only .svg and .png files are supported.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    if (customUploadUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(customUploadUrl);
    }

    setSelectedExistingTagId(undefined);
    handleChange('eventPointTagId', '');
    setCustomUploadUrl(objectUrl);

    setSelectedIcon({
      key: 'custom-upload',
      label: 'Custom Upload',
      iconName: objectUrl,
      isCustom: true,
    });
  };

  const buildMarkerPng = async (): Promise<string | null> => {
    if (!markerPreviewRef.current) return null;

    const canvas = await html2canvas(markerPreviewRef.current, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((value) => resolve(value), 'image/png');
    });

    if (!blob) return null;

    const result = await uploadImageToBackend(blob);
    return result?.mediaUrl ?? null;
  };

  const generateMarkerIcon = async (): Promise<string | null> => {
    if (isProcessing) {
      message.warning('Marker generation is in progress. Please wait.');
      return null;
    }

    setIsProcessing(true);

    try {
      const iconUrl = await buildMarkerPng();

      if (!iconUrl) {
        message.error('Failed to generate marker.');
        return null;
      }

      return iconUrl;
    } catch {
      message.error('Error generating marker.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  useImperativeHandle(ref, () => ({
    generateMarkerIcon,
  }));

  const handleTagColorChange = (value: string, preserveExistingTagId = false) => {
    setTagColor(value);
    handleChange('destinationTagColor', value);

    if (!preserveExistingTagId) {
      setSelectedExistingTagId(undefined);
      handleChange('eventPointTagId', '');
    }
  };

  const applyTagToForm = (tag: EventPointTagResponse) => {
    handleChange('eventPointTagId', tag.id || '');
    handleChange('destinationTagName', tag.name || '');
    handleChange('destinationTagDescription', tag.description || '');

    const color = tag.tagColor || DEFAULT_TAG_COLOR;
    handleTagColorChange(color, true);

    if (tag.iconUrl) {
      setSelectedIcon({
        key: `existing-${tag.id || 'tag'}`,
        label: tag.name || 'Existing tag',
        iconName: tag.iconUrl,
        isCustom: true,
      });
      setCustomUploadUrl(tag.iconUrl);
      handleChange('destinationMarkerIconUrl', tag.iconUrl);
      return;
    }

    handleChange('destinationMarkerIconUrl', '');
  };

  const handleSelectExistingTag = (tagId: string) => {
    const tag = existingTags.find((item) => item.id === tagId);
    if (!tag) return;

    setSelectedExistingTagId(tagId);
    applyTagToForm(tag);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="border-b pb-2">
        <h3 className="text-sm font-semibold">Marker Tag</h3>
      </div>

      <div className="space-y-1">
        <Label>Reusing existing event point tags</Label>
        <EventPointTagPicker
          tags={existingTags}
          selectedTagId={selectedExistingTagId}
          onTagSelect={handleSelectExistingTag}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ICON SELECTION */}
        <section className="space-y-3 border-r xl:pr-4">
          <Label>Icon</Label>

          <input
            ref={customUploadInputRef}
            type="file"
            accept=".svg,.png"
            className="hidden"
            onChange={(e) => handleUploadIcon(e.target.files?.[0])}
          />

          <Button onClick={handleSelectCustomUpload} variant="outline">
            Upload Custom Icon
          </Button>

          <div className="grid grid-cols-6 gap-2">
            {NHS_CULTURAL_ICONS.map((item) => {
              const isActive = selectedIcon.key === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setSelectedIcon(item);
                    setSelectedExistingTagId(undefined);
                    handleChange('eventPointTagId', '');
                  }}
                  className={`h-12 w-12 border rounded flex items-center justify-center ${
                    isActive ? 'border-primary ring-1 ring-primary' : ''
                  }`}
                >
                  <Icon icon={item.iconName} width={20} height={20} />
                </button>
              );
            })}
          </div>
        </section>

        {/* COLOR */}
        <section className="space-y-3 xl:border-r xl:pl-4">
          <div className="space-y-1 mr-4">
            <Label htmlFor="timeline-tag-name">Tag Name *</Label>
            <Input
              id="timeline-tag-name"
              value={form.destinationTagName}
              onChange={(e) => {
                handleChange('destinationTagName', e.target.value);
                setSelectedExistingTagId(undefined);
                handleChange('eventPointTagId', '');
              }}
              placeholder="e.g. Folk Lore, Activity, Marbel Carving"
            />
            {errors.destinationTagName && <p className="text-xs text-destructive">{errors.destinationTagName}</p>}
          </div>

          <Label>Color</Label>

          <div className="flex gap-2 flex-wrap">
            {QUICK_SWATCHES.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className="h-8 w-8 rounded-full"
                onClick={() => handleTagColorChange(color)}
              />
            ))}

            <input type="color" value={tagColor} onChange={(e) => handleTagColorChange(e.target.value)} />
          </div>
        </section>

        {/* PREVIEW */}
        <section className="space-y-3">
          <Label>Preview</Label>

          <div className="p-8 border rounded flex flex-col items-center">
            <div ref={markerPreviewRef}>
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: tagColor }}
              >
                {markerIcon}
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Marker upload will run automatically during final creation confirmation.
            </p>
            {errors.destinationMarkerIconUrl && (
              <p className="text-xs text-destructive mt-2">{errors.destinationMarkerIconUrl}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
});

export default EventPointTagTab;
