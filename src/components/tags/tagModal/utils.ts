import type { TagResponse } from "@/types/tag";
import type { TagFormValues } from "./types";

export function isValidUrl(value: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function toFormValues(tag: TagResponse | null): TagFormValues {
  return {
    name: tag?.name ?? "",
    description: tag?.description ?? "",
    tagColor: tag?.tagColor ?? "#4caf50",
    iconUrl: tag?.iconUrl ?? "",
  };
}
