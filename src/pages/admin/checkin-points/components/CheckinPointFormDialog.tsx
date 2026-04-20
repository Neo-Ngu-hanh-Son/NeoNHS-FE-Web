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
  pointId: z.string().min(1, "Vui lòng chọn địa điểm chính"),
  name: z.string().trim().min(1, "Tên không được để trống").max(255, "Tên không được vượt quá 255 ký tự"),
  description: z.string(),
  position: z.string().max(255, "Vị trí không được vượt quá 255 ký tự"),
  thumbnailUrl: z.string().max(255, "Đường dẫn ảnh không được vượt quá 255 ký tự"),
  isActive: z.boolean(),
  qrCode: z.string().max(255, "Mã QR không được vượt quá 255 ký tự"),
  longitude: z
    .number()
    .min(-180, "Kinh độ phải từ -180 đến 180")
    .max(180, "Kinh độ phải từ -180 đến 180")
    .optional(),
  latitude: z
    .number()
    .min(-90, "Vĩ độ phải từ -90 đến 90")
    .max(90, "Vĩ độ phải từ -90 đến 90")
    .optional(),
  rewardPoints: z.number().min(10, "Điểm thưởng phải từ 10 trở lên"),
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
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === "create" ? "Tạo điểm Check-in mới" : "Chỉnh sửa điểm Check-in"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Điểm check-in phải thuộc một địa điểm chính. Vui lòng chọn địa điểm chính trước khi điền thông tin và tọa độ.
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
                      <FormLabel className="text-slate-900 dark:text-white">Địa điểm chính *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                            <SelectValue placeholder="Chọn địa điểm chính" />
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
                      <FormLabel className="text-slate-900 dark:text-white">Tên điểm *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ví dụ: Cổng chính" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
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
                      <FormLabel className="text-slate-900 dark:text-white">Mô tả</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" placeholder="Chi tiết vị trí..." />
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
                        <FormLabel className="text-slate-900 dark:text-white">Vị trí chèn</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ví dụ: Lối vào cửa Bắc" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
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
                        <FormLabel className="text-slate-900 dark:text-white">Mã QR</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CHECKIN_001" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
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
                        <FormLabel className="text-slate-900 dark:text-white">Điểm thưởng</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={10}
                            value={field.value ?? ""}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
                        <FormLabel className="mb-2 block text-slate-900 dark:text-white">Trạng thái hoạt động</FormLabel>
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
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5 mt-2 md:mt-0">
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-base font-semibold text-slate-900 dark:text-white">Tọa độ trên bản đồ</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenMapPicker(true)}
                      className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm"
                    >
                      <MapPin className="mr-1.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Chọn từ bản đồ
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-900 dark:text-white">Vĩ độ (Latitude)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="16.047"
                              value={field.value ?? ""}
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
                          <FormLabel className="text-slate-900 dark:text-white">Kinh độ (Longitude)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="108.246"
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <LocateFixed className="h-4 w-4 text-primary" />
                      <span>Đã chọn: <strong className="font-mono">{currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}</strong></span>
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 dark:text-white">Ảnh thu nhỏ</FormLabel>
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
            <Button variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm" onClick={() => onOpenChange(false)} disabled={loading}>
              Hủy
            </Button>
            <Button className="bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors" onClick={form.handleSubmit(handleFormSubmit)} disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Đang tạo..."
                  : "Đang lưu..."
                : mode === "create"
                  ? "Tạo điểm Check-in"
                  : "Lưu thay đổi"}
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
            "Nhấn vào bản đồ để chọn tọa độ điểm check-in. Điểm đánh dấu màu đỏ là địa điểm chính, điểm màu xanh là vị trí bạn đang chọn.",
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
