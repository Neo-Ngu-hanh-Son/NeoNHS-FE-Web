import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workshopTemplateSchema, type WorkshopTemplateFormData, type WorkshopTemplateResponse } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WTagSelector } from './wtag-selector';
import { ImageUploader } from './image-uploader';
import { formatDuration } from '../utils/formatters';
import { useEffect, useState } from 'react';
import { uploadImageToBackend } from '@/utils/cloudinary';
import { message } from 'antd';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileText, DollarSign, Users, Tags, ImageIcon, Clock, UserMinus, UserPlus } from 'lucide-react';

interface WorkshopTemplateFormProps {
  defaultValues?: WorkshopTemplateResponse;
  onSubmit: (data: WorkshopTemplateFormData) => Promise<void> | void;
  onCancel: () => void;
  isEditing?: boolean;
  submitting?: boolean;
}

export function WorkshopTemplateForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
  submitting = false,
}: WorkshopTemplateFormProps) {
  const [durationDisplay, setDurationDisplay] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<WorkshopTemplateFormData | null>(null);

  // Initialize free mode based on default price
  const [isFreeMode, setIsFreeMode] = useState(defaultValues ? defaultValues.defaultPrice === 0 : false);

  const form = useForm<WorkshopTemplateFormData>({
    resolver: zodResolver(workshopTemplateSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          shortDescription: defaultValues.shortDescription || '',
          fullDescription: defaultValues.fullDescription || '',
          estimatedDuration: defaultValues.estimatedDuration,
          defaultPrice: defaultValues.defaultPrice,
          minParticipants: defaultValues.minParticipants,
          maxParticipants: defaultValues.maxParticipants,
          imageUrls: defaultValues.images.map((img) => img.imageUrl),
          thumbnailIndex: defaultValues.images.findIndex((img) => img.isThumbnail) || 0,
          tagIds: defaultValues.tags.map((tag) => tag.id),
        }
      : {
          name: '',
          shortDescription: '',
          fullDescription: '',
          estimatedDuration: 60,
          defaultPrice: 0,
          minParticipants: 1,
          maxParticipants: 10,
          imageUrls: [],
          thumbnailIndex: 0,
          tagIds: [],
        },
  });

  const watchedDuration = form.watch('estimatedDuration');
  useEffect(() => {
    if (watchedDuration > 0) {
      setDurationDisplay(formatDuration(watchedDuration));
    } else {
      setDurationDisplay('');
    }
  }, [watchedDuration]);

  const handleFormSubmit = (data: WorkshopTemplateFormData) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmUploadAndSubmit = async () => {
    if (!pendingData) return;

    const data = { ...pendingData };
    const hasFiles = data.imageUrls.some((u) => u instanceof File);

    if (hasFiles) {
      setIsUploading(true);
      const hideMsg = message.loading('Đang tải ảnh lên...', 0);
      try {
        const finalUrls: string[] = [];
        for (let i = 0; i < data.imageUrls.length; i++) {
          const item = data.imageUrls[i];
          if (item instanceof File) {
            const url = await uploadImageToBackend(item);
            if (url) finalUrls.push(url.mediaUrl);
          } else {
            finalUrls.push(item as string);
          }
        }
        data.imageUrls = finalUrls;
      } catch (error: any) {
        hideMsg();
        message.error('Lỗi khi tải ảnh lên: ' + error.message);
        setIsUploading(false);
        setShowConfirmModal(false);
        return;
      }
      hideMsg();
      setIsUploading(false);
    }

    try {
      await onSubmit(data);
    } catch {
      // Parent handles error
    }

    if (!submitting) {
      setShowConfirmModal(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        {/* ═══ Two-column grid: left = text, right = media + settings ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ──────── LEFT COLUMN (7/12) ──────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Basic Information */}
            <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Thông Tin Cơ Bản</CardTitle>
                    <CardDescription className="text-xs">Tên và mô tả về workshop của bạn</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên Workshop <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="VD: Workshop Làm Gốm Truyền Thống" {...field} maxLength={255} />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormDescription>Một cái tên rõ ràng, mang tính mô tả</FormDescription>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {field.value?.length ?? 0}/255
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Short Description */}
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô Tả Ngắn</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tóm tắt ngắn hiển thị trên thẻ (tùy chọn)"
                          className="min-h-[80px] resize-none"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormDescription>Xuất hiện trong thẻ &amp; kết quả tìm kiếm</FormDescription>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {field.value?.length ?? 0}/500
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Description */}
                <FormField
                  control={form.control}
                  name="fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô Tả Đầy Đủ</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết: những gì người tham gia sẽ học, hoạt động, tài liệu, v.v."
                          className="min-h-[220px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Hiển thị trên trang chi tiết workshop</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing & Duration */}
            <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Giá & Thời Lượng</CardTitle>
                    <CardDescription className="text-xs">Giá mặc định và thời gian dự kiến</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  {/* Price Mode Selection */}
                  <div>
                    <FormLabel className="mb-3 block">
                      Loại Hình Workshop <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={!isFreeMode ? 'default' : 'outline'}
                        className={!isFreeMode ? 'bg-primary text-white' : 'text-muted-foreground'}
                        onClick={() => {
                          setIsFreeMode(false);
                          if (form.getValues('defaultPrice') === 0) {
                            form.setValue('defaultPrice', 50000);
                          }
                        }}
                      >
                        Thu Phí
                      </Button>
                      <Button
                        type="button"
                        variant={isFreeMode ? 'default' : 'outline'}
                        className={
                          isFreeMode
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'text-emerald-700 hover:text-emerald-800 border-emerald-200'
                        }
                        onClick={() => {
                          setIsFreeMode(true);
                          form.setValue('defaultPrice', 0, { shouldValidate: true });
                        }}
                      >
                        Miễn Phí
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Input (Hidden if Free) */}
                    {!isFreeMode && (
                      <FormField
                        control={form.control}
                        name="defaultPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Giá Mặc Định <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="VD: 100,000"
                                  className="pl-9 pr-14"
                                  value={
                                    field.value || field.value === 0
                                      ? field.value === 0
                                        ? ''
                                        : new Intl.NumberFormat('en-US').format(field.value)
                                      : ''
                                  }
                                  onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, '');
                                    field.onChange(rawValue ? parseInt(rawValue, 10) : 0);
                                  }}
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                  VNĐ
                                </span>
                              </div>
                            </FormControl>
                            <FormDescription>Tối thiểu 1,000 VNĐ</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Duration Input */}
                    <FormField
                      control={form.control}
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Thời Lượng Dự Kiến <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min="1"
                                placeholder="90"
                                className="pl-9 pr-16"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                phút
                              </span>
                            </div>
                          </FormControl>
                          {durationDisplay && (
                            <FormDescription>
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                                <Clock className="w-3 h-3" /> {durationDisplay}
                              </span>
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ──────── RIGHT COLUMN (5/12) ──────── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Images */}
            <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Hình Ảnh</CardTitle>
                    <CardDescription className="text-xs">
                      Tải lên ít nhất một hình. Chọn một hình làm ảnh bìa.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field: imageField }) => (
                    <FormField
                      control={form.control}
                      name="thumbnailIndex"
                      render={({ field: thumbnailField }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploader
                              imageUrls={imageField.value}
                              thumbnailIndex={thumbnailField.value}
                              onChange={(urls, thumbIdx) => {
                                imageField.onChange(urls);
                                thumbnailField.onChange(thumbIdx);
                              }}
                              error={form.formState.errors.imageUrls?.message}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Người Tham Gia</CardTitle>
                    <CardDescription className="text-xs">Số người tối thiểu và tối đa</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tối Thiểu <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserMinus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              placeholder="5"
                              className="pl-9"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tối Đa <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              placeholder="20"
                              className="pl-9"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('maxParticipants') < form.watch('minParticipants') && (
                  <p className="mt-3 text-sm text-red-500 font-medium">Tối đa phải lớn hơn hoặc bằng Tối thiểu</p>
                )}
              </CardContent>
            </Card>

            {/* Categories / Tags */}
            <Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/20 flex items-center justify-center">
                    <Tags className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">Danh Mục</CardTitle>
                    <CardDescription className="text-xs">Chọn ít nhất một thẻ</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <WTagSelector
                          selectedTagIds={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.tagIds?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ─── Actions ─── */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel} size="lg" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={submitting || isUploading}>
            {submitting || isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {isEditing ? 'Đang lưu...' : 'Đang tạo...'}
              </>
            ) : isEditing ? (
              'Lưu Thay Đổi'
            ) : (
              'Tạo Mẫu'
            )}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <AlertDialog
        open={showConfirmModal}
        onOpenChange={(open) => {
          if (!isUploading && !submitting) {
            setShowConfirmModal(open);
          }
        }}
      >
        <AlertDialogContent
          onEscapeKeyDown={(e) => {
            if (isUploading || submitting) e.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{isEditing ? 'Lưu Thay Đổi?' : 'Tạo Mẫu Workshop?'}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                {isEditing
                  ? 'Bạn có chắc chắn muốn lưu những thay đổi này vào mẫu không?'
                  : 'Bạn có chắc chắn muốn tạo mẫu workshop này không?'}
              </p>
              {(isUploading || submitting) && (
                <p className="font-medium text-blue-600 dark:text-blue-500 flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-500" />
                  Vui lòng không đóng cửa sổ này. {isUploading ? 'Đang tải ảnh lên...' : 'Đang lưu dữ liệu mẫu...'}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={isUploading || submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmUploadAndSubmit}
              disabled={isUploading || submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isUploading || submitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isUploading ? 'Đang tải ảnh...' : 'Đang lưu...'}
                </>
              ) : (
                'Xác nhận'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
