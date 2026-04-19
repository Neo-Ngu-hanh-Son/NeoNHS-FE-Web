import { z } from "zod";

export const hotSpotSchema = z.object({
  yaw: z.number().min(-180, "Góc yaw phải từ -180 đến 180")
    .max(180, "Góc yaw phải từ -180 đến 180"),
  pitch: z.number().min(-90, "Góc pitch phải từ -90 đến 90")
    .max(90, "Góc pitch phải từ -90 đến 90"),
  tooltip: z
    .string()
    .min(1, "Vui lòng nhập chú thích (tooltip)")
    .max(100, "Tối đa 100 ký tự"),
  title: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề")
    .max(255, "Tối đa 255 ký tự"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  imageUrl: z.string().url("Phải là URL hợp lệ").optional().or(z.literal("")),
  orderIndex: z.number().optional(),
});

export const panoramaFormSchema = z.object({
  panoramaImageUrl: z
    .string()
    .min(1, "Bắt buộc có URL ảnh panorama")
    .url("Phải là URL hợp lệ"),
  defaultYaw: z.number().default(0),
  defaultPitch: z.number().default(0),
  hotSpots: z.array(hotSpotSchema).default([]),
});

export type PanoramaFormValues = z.infer<typeof panoramaFormSchema>;
export type HotSpotFormValues = z.infer<typeof hotSpotSchema>;
