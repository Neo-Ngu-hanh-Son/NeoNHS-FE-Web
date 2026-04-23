import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hotSpotSchema, type HotSpotFormValues } from '../schema';
import LinkingPanoramaCombobox from './LinkingPanoramaCombobox';

interface HotSpotFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HotSpotFormValues) => void;
  /** If provided, the modal is in "edit" mode with pre-filled values */
  initialData?: HotSpotFormValues | null;
  /** 0-based index being edited (for display purposes) */
  editIndex?: number | null;
  currentPanoramaId: string | null;
}

const defaultValues: HotSpotFormValues = {
  yaw: 0,
  pitch: 0,
  tooltip: '',
  title: '',
  description: '',
  imageUrl: '',
  orderIndex: 0,
  type: 'INFO',
  targetPanoramaId: '',
};

export default function HotSpotFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  editIndex,
  currentPanoramaId,
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
      imageUrl: data.imageUrl?.trim() || '',
      tooltip: data.tooltip?.trim() || data.title.trim().slice(0, 100), // Fallback tooltip to truncated title if empty
      targetPanoramaId: data.type === 'LINK' ? data.targetPanoramaId : '', // Clear targetPanoramaId if not LINK
    });
    onClose();
  };

  const currentType = form.watch('type');

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg overflow-visible">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Sửa điểm nóng #${editIndex! + 1}` : 'Thêm điểm nóng'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            {/* 1. Type Selector (Moved to Top) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Loại hotspot <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại hotspot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INFO">INFO - Điểm thông tin</SelectItem>
                        <SelectItem value="LINK">LINK - Chuyển panorama</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden Position Fields (Yaw & Pitch) */}
            <div className="hidden">
              <FormField
                control={form.control}
                name="yaw"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pitch"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* 2. Common Required Fields (Title) */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    Tiêu đề <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề hiển thị..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 3. LINK Specific Fields */}
            {currentType === 'LINK' && (
              <FormField
                control={form.control}
                name="targetPanoramaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Panorama đích <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <LinkingPanoramaCombobox
                        currentPanoramaId={currentPanoramaId}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 4. INFO Specific Fields */}
            {currentType === 'INFO' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <FormField
                  control={form.control}
                  name="tooltip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Chú thích (tooltip)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhãn ngắn khi di chuột (tối đa 100 ký tự)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nội dung đầy đủ hiển thị khi khách chọn điểm nóng này…"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">URL ảnh (tùy chọn)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Thứ tự hiển thị</FormLabel>
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
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">{isEditing ? 'Cập nhật' : 'Thêm'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
