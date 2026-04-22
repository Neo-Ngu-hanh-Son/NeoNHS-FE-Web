import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { message } from "antd";
import type { EventPointTagRequest, EventPointTagResponse } from "@/types/eventTimeline";
import { Icon } from "@iconify/react";
import html2canvas from "html2canvas";
import { uploadImageToBackend } from "@/utils/cloudinary";

const DEFAULT_TAG_COLOR = "#0f766e";

type VisualIconOption = {
  key: string;
  label: string;
  iconName: string;
  isCustom?: boolean;
};

const QUICK_SWATCHES = [
  "#0f766e",
  "#0d9488",
  "#2563eb",
  "#db2777",
  "#ea580c",
  "#7c3aed",
  "#e11d48",
  "#d97706",
  "#65a30d",
  "#0284c7",
  "#9333ea",
  "#a16207",
  "#4f46e5",
];

const NHS_CULTURAL_ICONS: VisualIconOption[] = [
  { key: "marker", label: "Location", iconName: "mdi:map-marker" },
  { key: "navigation", label: "Navigation", iconName: "mdi:compass" },
  { key: "viewpoint", label: "Viewpoint", iconName: "mdi:binoculars" },
  { key: "trail", label: "Trail", iconName: "mdi:foot-print" },
  { key: "info", label: "Information", iconName: "mdi:information" },
  { key: "parking", label: "Parking", iconName: "mdi:parking" },
  { key: "wc", label: "Restroom", iconName: "mdi:toilet" },
  { key: "food", label: "Food", iconName: "mdi:food" },
  { key: "drink", label: "Drink", iconName: "mdi:cup-water" },
  { key: "ticket", label: "Ticket", iconName: "mdi:ticket" },
  { key: "pagoda", label: "Pagoda", iconName: "mdi:temple-buddhist" },
  { key: "shrine", label: "Shrine", iconName: "mdi:home-variant" },
  { key: "incense", label: "Ritual", iconName: "mdi:fire" },
  { key: "statue", label: "Statue", iconName: "mdi:human-male-height" },
  { key: "history", label: "History", iconName: "mdi:scroll" },
  { key: "mountain", label: "Mountain", iconName: "mdi:mountain" },
  { key: "cave", label: "Cave", iconName: "roentgen:cave" },
  { key: "water", label: "Water", iconName: "mdi:waves" },
  { key: "tree", label: "Nature", iconName: "mdi:pine-tree" },
  { key: "stone", label: "Marble", iconName: "mdi:diamond-stone" },
  { key: "craft", label: "Craft", iconName: "mdi:brush" },
  { key: "photo", label: "Photo Spot", iconName: "mdi:camera" },
  { key: "guide", label: "Guide", iconName: "mdi:account-tie" },
  { key: "shopping", label: "Souvenir", iconName: "mdi:shopping" },
  { key: "festival", label: "Festival", iconName: "mdi:party-popper" },
  { key: "music", label: "Music", iconName: "mdi:music" },
  { key: "live-music", label: "Live Music", iconName: "mdi:microphone" },
  { key: "dance", label: "Performance", iconName: "mdi:human-female-dance" },
  { key: "fireworks", label: "Fireworks", iconName: "mdi:firework" },
  { key: "stage", label: "Stage Event", iconName: "mdi:theater" },
  { key: "lantern", label: "Lantern", iconName: "mingcute:lantern-fill" },
];

interface EventPointTagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: EventPointTagResponse | null;
  onSubmit: (data: EventPointTagRequest) => Promise<boolean>;
}

interface FormData {
  name: string;
  description: string;
}

const emptyForm: FormData = {
  name: "",
  description: "",
};

export function EventPointTagFormDialog({
  open,
  onOpenChange,
  tag,
  onSubmit,
}: EventPointTagFormDialogProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!tag;

  const [tagColor, setTagColor] = useState(DEFAULT_TAG_COLOR);
  const [selectedIcon, setSelectedIcon] = useState<VisualIconOption>(NHS_CULTURAL_ICONS[0]);
  const [customUploadUrl, setCustomUploadUrl] = useState<string | null>(null);

  // To track if we need to regenerate the marker
  const [isMarkerDirty, setIsMarkerDirty] = useState(false);

  const markerPreviewRef = useRef<HTMLDivElement>(null);
  const customUploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (tag) {
        setForm({
          name: tag.name || "",
          description: tag.description || "",
        });
        setTagColor(tag.tagColor || DEFAULT_TAG_COLOR);

        if (tag.iconUrl) {
          setSelectedIcon({
            key: "existing",
            label: "Current icon",
            iconName: tag.iconUrl,
            isCustom: true,
          });
          setCustomUploadUrl(tag.iconUrl);
        } else {
          setSelectedIcon(NHS_CULTURAL_ICONS[0]);
          setCustomUploadUrl(null);
        }
        setIsMarkerDirty(false);
      } else {
        setForm(emptyForm);
        setTagColor(DEFAULT_TAG_COLOR);
        setSelectedIcon(NHS_CULTURAL_ICONS[0]);
        setCustomUploadUrl(null);
        setIsMarkerDirty(true);
      }
      setErrors({});
    }
  }, [tag, open]);

  useEffect(() => {
    return () => {
      if (customUploadUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(customUploadUrl);
      }
    };
  }, [customUploadUrl]);

  const markerIcon = useMemo(() => {
    if (selectedIcon.isCustom) {
      return <img src={selectedIcon.iconName} className="h-8 w-8 object-contain" />;
    }
    return <Icon icon={selectedIcon.iconName} width={32} height={32} style={{ color: "white" }} />;
  }, [selectedIcon]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTagColorChange = (value: string) => {
    setTagColor(value);
    setIsMarkerDirty(true);
  };

  const handleSelectIcon = (item: VisualIconOption) => {
    setSelectedIcon(item);
    setIsMarkerDirty(true);
  };

  const handleSelectCustomUpload = () => {
    customUploadInputRef.current?.click();
  };

  const handleUploadIcon = (file: File | undefined) => {
    if (!file) return;

    const isValidType = file.type === "image/svg+xml" || file.type === "image/png";

    if (!isValidType) {
      message.error("Only .svg and .png files are supported.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    if (customUploadUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(customUploadUrl);
    }

    setCustomUploadUrl(objectUrl);
    setSelectedIcon({
      key: "custom-upload",
      label: "Custom Upload",
      iconName: objectUrl,
      isCustom: true,
    });
    setIsMarkerDirty(true);
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Tag name is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildMarkerPng = async (): Promise<string | null> => {
    if (!markerPreviewRef.current) return null;

    const canvas = await html2canvas(markerPreviewRef.current, {
      backgroundColor: null,
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((value) => resolve(value), "image/png");
    });

    if (!blob) return null;

    const file = new File([blob], `marker-${Date.now()}.png`, { type: "image/png" });
    const url = await uploadImageToBackend(file);
    return url?.mediaUrl ?? "";
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    let finalIconUrl = tag?.iconUrl || undefined;

    if (isMarkerDirty) {
      const url = await buildMarkerPng();
      if (!url) {
        message.error("Error generating marker icon.");
        setLoading(false);
        return;
      }
      finalIconUrl = url;
    }

    const name = form.name.trim();
    const payload: EventPointTagRequest = {
      name,
      description: form.description.trim() || name,
      tagColor: tagColor,
      iconUrl: finalIconUrl,
    };

    const success = await onSubmit(payload);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Point Tag" : "Add Point Tag"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update visual and descriptive information for this tag."
              : "Create a reusable tag for event points."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-point-tag-name">Tag Name *</Label>
                <Input
                  id="event-point-tag-name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Main Stage"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="event-point-tag-description">Description</Label>
                <Textarea
                  id="event-point-tag-description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Optional. If empty, it will default to tag name."
                  rows={3}
                />
              </div>

              <div>
                <Label>Color</Label>
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  {QUICK_SWATCHES.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => handleTagColorChange(swatch)}
                      className={`h-6 w-6 rounded-full border-2 ${
                        tagColor === swatch
                          ? "border-primary ring-2 ring-primary ring-offset-1"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                  <input
                    type="color"
                    value={tagColor}
                    onChange={(e) => handleTagColorChange(e.target.value)}
                    className="h-8 w-8 ml-2 border-0 p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-4">
              <div>
                <Label>Preview</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full shadow-md transition-all duration-300 border-2 border-white"
                    style={{ backgroundColor: tagColor }}
                  >
                    {markerIcon}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {selectedIcon.label}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Icon</Label>
                  <Button onClick={handleSelectCustomUpload} variant="outline" size="sm">
                    Tải lên icon tùy chỉnh
                  </Button>
                  <input
                    type="file"
                    accept=".svg,.png"
                    ref={customUploadInputRef}
                    onChange={(e) => handleUploadIcon(e.target.files?.[0])}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border rounded-md">
                  {customUploadUrl && selectedIcon.key === "custom-upload" && (
                    <button
                      type="button"
                      className="h-10 w-10 border rounded flex items-center justify-center border-primary ring-1 ring-primary"
                    >
                      <img
                        src={customUploadUrl}
                        alt="Custom upload"
                        className="max-h-6 max-w-6 object-contain"
                      />
                    </button>
                  )}
                  {NHS_CULTURAL_ICONS.map((item) => {
                    const isActive = selectedIcon.key === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        title={item.label}
                        onClick={() => handleSelectIcon(item)}
                        className={`h-10 w-10 border rounded flex items-center justify-center ${
                          isActive ? "border-primary ring-1 ring-primary" : ""
                        }`}
                      >
                        <Icon icon={item.iconName} width={20} height={20} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden marker node for html2canvas */}
        <div className="absolute top-[-9999px] left-[-9999px]">
          <div
            ref={markerPreviewRef}
            className="flex items-center justify-center rounded-full"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: tagColor,
              padding: "8px",
            }}
          >
            {markerIcon}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
