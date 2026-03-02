import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { hotSpotSchema, type HotSpotFormValues } from "../schema";

interface HotSpotFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HotSpotFormValues) => void;
  /** If provided, the modal is in "edit" mode with pre-filled values */
  initialData?: HotSpotFormValues | null;
  /** 0-based index being edited (for display purposes) */
  editIndex?: number | null;
}

const defaultValues: HotSpotFormValues = {
  yaw: 0,
  pitch: 0,
  tooltip: "",
  title: "",
  description: "",
  imageUrl: "",
  orderIndex: 0,
};

export default function HotSpotFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  editIndex,
}: HotSpotFormModalProps) {
  const isEditing = editIndex != null;

  const form = useForm<HotSpotFormValues>({
    resolver: zodResolver(hotSpotSchema),
    defaultValues,
  });

  // Reset form values when modal opens
  useEffect(() => {
    if (open) {
      form.reset(initialData ?? defaultValues);
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: HotSpotFormValues) => {
    onSubmit({
      ...data,
      imageUrl: data.imageUrl?.trim() || "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit Hot Spot #${editIndex! + 1}` : "Add Hot Spot"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            {/* Position */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="yaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Yaw (horizontal angle)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pitch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Pitch (vertical angle)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tooltip */}
            <FormField
              control={form.control}
              name="tooltip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Tooltip <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Short hover label (max 100 chars)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Info panel heading" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full description shown when visitor clicks this hot spot..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order index */}
            <FormField
              control={form.control}
              name="orderIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Order Index</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
