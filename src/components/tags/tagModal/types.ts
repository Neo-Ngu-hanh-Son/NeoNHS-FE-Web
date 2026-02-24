import type { TagResponse } from "@/types/tag";

export interface TagFormValues {
  name: string;
  description: string;
  tagColor: string;
  iconUrl: string;
}

export interface TagFormErrors {
  name?: string;
  description?: string;
  tagColor?: string;
  iconUrl?: string;
}

export interface TagFormContentProps {
  kind: "event" | "workshop";
  isCreate: boolean;
  values: TagFormValues;
  errors: TagFormErrors;
  onFieldChange: (field: keyof TagFormValues, value: string) => void;
  onNameBlur: () => void;
}

export interface TagConfirmationContentProps {
  kind: "event" | "workshop";
  mode: "delete" | "restore";
  subtitle: string;
  tag: TagResponse;
}
