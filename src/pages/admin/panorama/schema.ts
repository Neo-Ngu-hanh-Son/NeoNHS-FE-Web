import { z } from "zod";

export const hotSpotSchema = z.object({
  yaw: z.number().min(-180, "Yaw must be between -180 and 180")
    .max(180, "Yaw must be between -180 and 180"),
  pitch: z.number().min(-90, "Pitch must be between -90 and 90")
    .max(90, "Pitch must be between -90 and 90"),
  tooltip: z
    .string()
    .min(1, "Tooltip is required")
    .max(100, "Max 100 characters"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Max 255 characters"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  orderIndex: z.number().optional(),
});

export const panoramaFormSchema = z.object({
  panoramaImageUrl: z
    .string()
    .min(1, "Panorama image URL is required")
    .url("Must be a valid URL"),
  defaultYaw: z.number().default(0),
  defaultPitch: z.number().default(0),
  hotSpots: z.array(hotSpotSchema).default([]),
});

export type PanoramaFormValues = z.infer<typeof panoramaFormSchema>;
export type HotSpotFormValues = z.infer<typeof hotSpotSchema>;
