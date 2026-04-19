import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { TAG_COLOR_PRESETS } from "./constants";
import { TAG_ICON_OPTIONS } from "./iconOptions";
import { isValidUrl } from "./utils";
import type { TagFormContentProps } from "./types";

export function TagFormContent({
  kind,
  isCreate,
  values,
  errors,
  onFieldChange,
  onNameBlur,
}: TagFormContentProps) {
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const selectedIconOption = TAG_ICON_OPTIONS.find((item) => item.iconUrl === values.iconUrl);

  return (
    <div className="space-y-5 pt-2">
      <div className="space-y-2">
        <Label htmlFor="tag-name" className="text-sm font-medium text-gray-700">
          Tên nhãn <span className="text-red-500">*</span>
        </Label>
        <Input
          id="tag-name"
          placeholder="Ví dụ: Sức khỏe, Nấu ăn…"
          value={values.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          onBlur={onNameBlur}
          maxLength={100}
          className={errors.name ? "border-red-400 focus-visible:ring-red-400" : ""}
        />
        <div className="flex items-center justify-between">
          {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : <span />}
          {kind === "workshop" && <p className="text-xs text-gray-400">{values.name.length}/100</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag-description" className="text-sm font-medium text-gray-700">
          Mô tả
        </Label>
        <Textarea
          id="tag-description"
          placeholder="Mô tả ngắn gọn về nhãn…"
          value={values.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          maxLength={kind === "workshop" ? 255 : 500}
          rows={3}
          className={errors.description ? "border-red-400 focus-visible:ring-red-400" : ""}
        />
        <div className="flex items-center justify-between">
          {errors.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          {kind === "workshop" && (
            <p className="text-xs text-gray-400">{values.description.length}/255</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag-color" className="text-sm font-medium text-gray-700">
          Màu nhãn
        </Label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            id="tag-color-picker"
            type="color"
            value={values.tagColor || "#4caf50"}
            onChange={(e) => onFieldChange("tagColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            id="tag-color"
            placeholder="#4CAF50"
            value={values.tagColor}
            onChange={(e) => onFieldChange("tagColor", e.target.value)}
            maxLength={20}
            className={
              errors.tagColor ? "border-red-400 focus-visible:ring-red-400" : "max-w-[180px]"
            }
          />

          {isCreate && (
            <div className="flex items-center gap-1.5">
              {TAG_COLOR_PRESETS.map((color) => {
                const isSelected = values.tagColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select color ${color}`}
                    title={color}
                    onClick={() => onFieldChange("tagColor", color)}
                    className={`h-6 w-6 rounded-full border transition-colors ${
                      isSelected
                        ? "border-foreground ring-2 ring-offset-1 ring-foreground/20"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          {errors.tagColor ? <p className="text-xs text-red-500">{errors.tagColor}</p> : <span />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag-icon" className="text-sm font-medium text-gray-700">
          URL biểu tượng
        </Label>
        <Input
          id="tag-icon"
          placeholder="https://example.com/icon.png"
          value={values.iconUrl}
          onChange={(e) => onFieldChange("iconUrl", e.target.value)}
          className={errors.iconUrl ? "border-red-400 focus-visible:ring-red-400" : ""}
        />
        {errors.iconUrl && <p className="text-xs text-red-500">{errors.iconUrl}</p>}

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Chọn nhanh biểu tượng Lucide</p>

          <Popover open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full justify-between text-sm font-normal"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  {selectedIconOption ? (
                    <>
                      <selectedIconOption.icon className="h-4 w-4" />
                      {selectedIconOption.label}
                    </>
                  ) : (
                    "Chọn biểu tượng"
                  )}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[360px] p-3" align="start">
              <div className="grid grid-cols-9 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {TAG_ICON_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = values.iconUrl === item.iconUrl;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      title={item.label}
                      aria-label={`Chọn biểu tượng ${item.label}`}
                      onClick={() => {
                        onFieldChange("iconUrl", item.iconUrl);
                        setIsIconPickerOpen(false);
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* {isValidUrl(values.iconUrl) && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-border p-2 bg-muted/40">
            <img
              src={values.iconUrl}
              alt="Tag icon preview"
              className="h-8 w-8 rounded object-cover border border-border"
            />
            <span className="text-xs text-muted-foreground">Icon preview</span>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default TagFormContent;
