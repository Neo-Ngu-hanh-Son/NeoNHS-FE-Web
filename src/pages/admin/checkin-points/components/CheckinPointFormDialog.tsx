import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { LocateFixed, MapPin } from "lucide-react";
import DragImageUploader from "@/components/common/DragImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MapPickerModal } from "@/pages/admin/events/components/MapPickerModal";
import type {
  CheckinPointRequest,
  ParentPointOption,
  PointCheckinResponse,
} from "@/types/checkinPoint";

interface CheckinPointFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData: PointCheckinResponse | null;
  parentPoints: ParentPointOption[];
  defaultParentPointId?: string;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CheckinPointRequest) => Promise<void>;
}

const checkinPointSchema = z.object({
  pointId: z.string().min(1, "Parent point is required"),
  name: z.string().trim().min(1, "Name is required").max(255, "Name must be <= 255 characters"),
  description: z.string(),
  position: z.string().max(255, "Position must be <= 255 characters"),
  thumbnailUrl: z.string().max(255, "Thumbnail URL must be <= 255 characters"),
  isActive: z.boolean(),
  qrCode: z.string().max(255, "QR code must be <= 255 characters"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
  rewardPoints: z.number().min(10, "Reward points must be at least 10"),
});

type CheckinPointFormValues = z.infer<typeof checkinPointSchema>;

interface FormState {
  pointId: string;
  name: string;
  description: string;
  position: string;
  thumbnailUrl: string;
  isActive: boolean;
  qrCode: string;
  longitude?: number;
  latitude?: number;
  rewardPoints: number;
}

const createInitialState = (
  initialData: PointCheckinResponse | null,
  defaultParentPointId?: string,
): FormState => ({
  pointId: initialData?.pointId || initialData?.parentPointId || defaultParentPointId || "",
  name: initialData?.name || "",
  description: initialData?.description || "",
  position: initialData?.position || "",
  thumbnailUrl: initialData?.thumbnailUrl || "",
  isActive: initialData?.isActive ?? true,
  qrCode: initialData?.qrCode || "",
  longitude: typeof initialData?.longitude === "number" ? initialData.longitude : undefined,
  latitude: typeof initialData?.latitude === "number" ? initialData.latitude : undefined,
  rewardPoints: typeof initialData?.rewardPoints === "number" ? initialData.rewardPoints : 20,
});

export function CheckinPointFormDialog({
  open,
  mode,
  initialData,
  parentPoints,
  defaultParentPointId,
  loading,
  onOpenChange,
  onSubmit,
}: CheckinPointFormDialogProps) {
  const form = useForm<CheckinPointFormValues>({
    resolver: zodResolver(checkinPointSchema),
    defaultValues: createInitialState(initialData, defaultParentPointId),
  });
  const [openMapPicker, setOpenMapPicker] = useState(false);

  const selectedPointId = useWatch({ control: form.control, name: "pointId" });
  const latitude = useWatch({ control: form.control, name: "latitude" });
  const longitude = useWatch({ control: form.control, name: "longitude" });

  useEffect(() => {
    if (open) {
      form.reset(createInitialState(initialData, defaultParentPointId));
    }
  }, [open, mode, initialData, defaultParentPointId, form]);

  const currentPosition = useMemo(() => {
    if (typeof latitude !== "number" || typeof longitude !== "number") return null;

    return { lat: latitude, lng: longitude };
  }, [latitude, longitude]);

  const selectedParentPoint = useMemo(
    () => parentPoints.find((point) => point.id === selectedPointId),
    [selectedPointId, parentPoints],
  );

  const parentPosition = useMemo(() => {
    if (
      typeof selectedParentPoint?.latitude !== "number" ||
      typeof selectedParentPoint?.longitude !== "number"
    ) {
      return null;
    }

    return {
      lat: selectedParentPoint.latitude,
      lng: selectedParentPoint.longitude,
    };
  }, [selectedParentPoint]);

  useEffect(() => {
    if (!open || mode !== "create" || !parentPosition) return;

    form.setValue("latitude", parentPosition.lat, { shouldValidate: true });
    form.setValue("longitude", parentPosition.lng, { shouldValidate: true });
  }, [open, mode, selectedPointId, parentPosition, form]);

  const handleFormSubmit = async (values: CheckinPointFormValues) => {
    const payload: CheckinPointRequest = {
      pointId: values.pointId,
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      position: values.position.trim() || undefined,
      thumbnailUrl: values.thumbnailUrl.trim() || undefined,
      isActive: values.isActive,
      qrCode: values.qrCode.trim() || undefined,
      longitude: values.longitude,
      latitude: values.latitude,
      rewardPoints: values.rewardPoints,
    };

    await onSubmit(payload);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create Checkin Point" : "Edit Checkin Point"}
            </DialogTitle>
            <DialogDescription>
              Checkin points must belong to a normal point. Select parent point first, then
              configure content and coordinates.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="pointId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Point *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent point" />
                          </SelectTrigger>
                          <SelectContent>
                            {parentPoints.map((point) => (
                              <SelectItem key={point.id} value={point.id}>
                                {point.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Main Gate Check-in" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="North Entrance" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qrCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CHECKIN_MAIN_GATE_001" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rewardPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Points</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={10}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === "" ? undefined : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block">Active</FormLabel>
                        <FormControl>
                          <div className="flex h-10 items-center">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <Label>Location</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenMapPicker(true)}
                    >
                      <MapPin className="mr-1 h-4 w-4" />
                      Pick from map
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="16.047"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === "" ? undefined : Number(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="108.246"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === "" ? undefined : Number(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {currentPosition && (
                    <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <LocateFixed className="h-3.5 w-3.5" />
                      Selected: {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        <DragImageUploader
                          value={field.value}
                          onUpload={(url) => {
                            form.setValue("thumbnailUrl", url, { shouldValidate: true });
                          }}
                          minHeight={150}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(handleFormSubmit)} disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Checkin Point"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MapPickerModal
        open={openMapPicker}
        onOpenChange={setOpenMapPicker}
        initialPosition={currentPosition}
        parentPosition={parentPosition}
        options={{
          helperText:
            "Click anywhere on the map to pick child checkin coordinates. Red marker is parent point, blue marker is selected child point.",
          showParentMarker: true,
          useBlueChildMarker: true,
          childMarkerVisibility: "after-select",
          parentMarkerLabel: selectedParentPoint?.name,
          defaultZoom: 18,
          zoomWhenParentPosition: 18,
          zoomWhenInitialPosition: 18,
          maxZoom: 18,
        }}
        onConfirm={(lat, lng) => {
          form.setValue("latitude", lat, { shouldValidate: true });
          form.setValue("longitude", lng, { shouldValidate: true });
        }}
      />
    </>
  );
}

export default CheckinPointFormDialog;
