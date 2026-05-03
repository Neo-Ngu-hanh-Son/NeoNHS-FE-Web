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
  { key: 'marker', label: 'Vị trí', iconName: 'mdi:map-marker' },
  { key: 'navigation', label: 'Điều hướng', iconName: 'mdi:compass' },
  { key: 'viewpoint', label: 'Điểm ngắm', iconName: 'mdi:binoculars' },
  { key: 'trail', label: 'Lối đi', iconName: 'mdi:foot-print' },
  { key: 'info', label: 'Thông tin', iconName: 'mdi:information' },
  { key: 'parking', label: 'Bãi đỗ xe', iconName: 'mdi:parking' },
  { key: 'wc', label: 'Nhà vệ sinh', iconName: 'mdi:toilet' },
  { key: 'food', label: 'Ẩm thực', iconName: 'mdi:food' },
  { key: 'drink', label: 'Đồ uống', iconName: 'mdi:cup-water' },
  { key: 'ticket', label: 'Vé', iconName: 'mdi:ticket' },
  { key: 'pagoda', label: 'Chùa', iconName: 'mdi:temple-buddhist' },
  { key: 'shrine', label: 'Đền', iconName: 'mdi:home-variant' },
  { key: 'incense', label: 'Nghi lễ', iconName: 'mdi:fire' },
  { key: 'statue', label: 'Tượng', iconName: 'mdi:human-male-height' },
  { key: 'history', label: 'Lịch sử', iconName: 'mdi:scroll' },
  { key: 'mountain', label: 'Núi', iconName: 'mdi:mountain' },
  { key: 'cave', label: 'Hang động', iconName: 'roentgen:cave' },
  { key: 'water', label: 'Nước', iconName: 'mdi:waves' },
  { key: 'tree', label: 'Thiên nhiên', iconName: 'mdi:pine-tree' },
  { key: 'stone', label: 'Đá cẩm thạch', iconName: 'mdi:diamond-stone' },
  { key: 'craft', label: 'Thủ công', iconName: 'mdi:brush' },
  { key: 'photo', label: 'Góc chụp ảnh', iconName: 'mdi:camera' },
  { key: 'guide', label: 'Hướng dẫn', iconName: 'mdi:account-tie' },
  { key: 'shopping', label: 'Lưu niệm', iconName: 'mdi:shopping' },
  { key: 'festival', label: 'Lễ hội', iconName: 'mdi:party-popper' },
  { key: 'music', label: 'Âm nhạc', iconName: 'mdi:music' },
  { key: 'live-music', label: 'Nhạc sống', iconName: 'mdi:microphone' },
  { key: 'dance', label: 'Biểu diễn', iconName: 'mdi:human-female-dance' },
  { key: 'fireworks', label: 'Pháo hoa', iconName: 'mdi:firework' },
  { key: 'stage', label: 'Sân khấu', iconName: 'mdi:theater' },
  { key: 'lantern', label: 'Đèn lồng', iconName: 'mingcute:lantern-fill' },
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
      label: form.destinationTagName.trim() || 'Biểu tượng hiện tại',
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
        message.error(`Không thể tải các thẻ điểm sự kiện đã có: ${(error as Error).message}`);
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
      message.error('Chỉ hỗ trợ file .svg và .png.');
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
      label: 'Tải lên tùy chỉnh',
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
      message.warning('Đang tạo biểu tượng. Vui lòng đợi.');
      return null;
    }

    setIsProcessing(true);

    try {
      const iconUrl = await buildMarkerPng();

      if (!iconUrl) {
        message.error('Tạo biểu tượng thất bại.');
        return null;
      }

      return iconUrl;
    } catch {
      message.error('Lỗi khi tạo biểu tượng.');
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
        label: tag.name || 'Thẻ hiện có',
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
        <h3 className="text-sm font-semibold">Thẻ cho điểm sự kiện</h3>
      </div>

      <div className="space-y-1">
        <Label>Sử dụng lại thẻ hiện có</Label>
        <EventPointTagPicker
          tags={existingTags}
          selectedTagId={selectedExistingTagId}
          onTagSelect={handleSelectExistingTag}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ICON SELECTION */}
        <section className="space-y-3 border-r xl:pr-4">
          <Label>Biểu tượng</Label>

          <input
            ref={customUploadInputRef}
            type="file"
            accept=".svg,.png"
            className="hidden"
            onChange={(e) => handleUploadIcon(e.target.files?.[0])}
          />

          <Button onClick={handleSelectCustomUpload} variant="outline">
            Tải lên biểu tượng tùy chỉnh
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
            <Label htmlFor="timeline-tag-name">Tên thẻ *</Label>
            <Input
              id="timeline-tag-name"
              value={form.destinationTagName}
              onChange={(e) => {
                handleChange('destinationTagName', e.target.value);
                setSelectedExistingTagId(undefined);
                handleChange('eventPointTagId', '');
              }}
              placeholder="VD: Dân gian, Hoạt động, Điêu khắc đá cẩm thạch"
            />
            {errors.destinationTagName && <p className="text-xs text-destructive">{errors.destinationTagName}</p>}
          </div>

          <Label>Màu sắc</Label>

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
          <Label>Xem trước</Label>

          <div className="p-8 border rounded flex flex-col items-center">
            <div ref={markerPreviewRef}>
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: tagColor }}
              >
                {markerIcon}
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">Việc tải ảnh lên sẽ được chạy ở nền</p>
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
