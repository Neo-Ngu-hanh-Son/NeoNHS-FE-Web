import { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { message } from 'antd';
import { Icon } from '@iconify/react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { uploadImageToCloudinary } from '@/utils/cloudinary';
import type { FormData } from './EventTimelineFormDialog';

type Props = {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  handleChange: (field: keyof FormData, value: string) => void;
};

type VisualIconOption = {
  key: string;
  label: string;
  iconName: string; // iconify name OR blob url
  isCustom?: boolean;
};

const DEFAULT_TAG_COLOR = '#0f766e';

const QUICK_SWATCHES = ['#0f766e', '#0d9488', '#2563eb', '#db2777', '#ea580c', '#7c3aed'];

const NHS_CULTURAL_ICONS: VisualIconOption[] = [
  { key: 'pagoda', label: 'Pagoda', iconName: 'mdi:temple-buddhist' },
  { key: 'incense', label: 'Ritual', iconName: 'mdi:fire' },
  { key: 'mountain', label: 'Mountain', iconName: 'mdi:mountain' },
  { key: 'water', label: 'Water', iconName: 'mdi:waves' },
  { key: 'stone', label: 'Marble', iconName: 'mdi:diamond-stone' },
  { key: 'tree', label: 'Nature', iconName: 'mdi:pine-tree' },
  { key: 'history', label: 'History', iconName: 'mdi:scroll' },
  { key: 'art', label: 'Craft', iconName: 'mdi:brush' },
  { key: 'view', label: 'Viewpoint', iconName: 'mdi:binoculars' },
  { key: 'trail', label: 'Trail', iconName: 'mdi:foot-print' },
  { key: 'culture', label: 'Experience', iconName: 'mdi:account' },
  { key: 'marker', label: 'Marker', iconName: 'mdi:map-marker' },
];

export default function EventPointTagTab({ form, errors, handleChange }: Props) {
  const markerPreviewRef = useRef<HTMLDivElement>(null);
  const customUploadInputRef = useRef<HTMLInputElement>(null);

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedIconUrl, setGeneratedIconUrl] = useState(form.destinationMarkerIconUrl || '');
  const [customUploadUrl, setCustomUploadUrl] = useState<string | null>(null);
  const [tagColor, setTagColor] = useState(form.destinationTagColor || DEFAULT_TAG_COLOR);

  const [selectedIcon, setSelectedIcon] = useState<VisualIconOption>(NHS_CULTURAL_ICONS[0]);

  useEffect(() => {
    setTagColor(form.destinationTagColor || DEFAULT_TAG_COLOR);
    setGeneratedIconUrl(form.destinationMarkerIconUrl || '');
  }, [form.destinationMarkerIconUrl, form.destinationTagColor]);

  useEffect(() => {
    return () => {
      if (customUploadUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(customUploadUrl);
      }
    };
  }, [customUploadUrl]);

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

    return uploadImageToCloudinary(blob);
  };

  const handleReviewCreate = async () => {
    setIsProcessing(true);

    try {
      const iconUrl = await buildMarkerPng();

      if (!iconUrl) {
        message.error('Failed to generate marker.');
        return;
      }

      setGeneratedIconUrl(iconUrl);
      setIsReviewDialogOpen(true);
    } catch {
      message.error('Error generating marker.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalConfirm = () => {
    if (!generatedIconUrl) {
      message.error('Generate marker first.');
      return;
    }

    handleChange('destinationMarkerIconUrl', generatedIconUrl);
    handleChange('destinationTagColor', tagColor);

    setIsReviewDialogOpen(false);
    message.success('Tag created.');
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="border-b pb-2">
        <h3 className="text-sm font-semibold">Marker Tag</h3>
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
            Upload Icon
          </Button>

          <div className="grid grid-cols-6 gap-2">
            {NHS_CULTURAL_ICONS.map((item) => {
              const isActive = selectedIcon.key === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedIcon(item)}
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
          <Label>Color</Label>

          <div className="flex gap-2 flex-wrap">
            {QUICK_SWATCHES.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className="h-8 w-8 rounded-full"
                onClick={() => setTagColor(color)}
              />
            ))}

            <input type="color" value={tagColor} onChange={(e) => setTagColor(e.target.value)} />
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

            <Button className="mt-4" onClick={handleReviewCreate}>
              Generate
            </Button>
          </div>
        </section>
      </div>

      {/* DIALOG */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>Review marker</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center">
            {generatedIconUrl && <img src={generatedIconUrl} className="h-16 w-16" />}
          </div>

          <DialogFooter>
            <Button onClick={handleFinalConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
