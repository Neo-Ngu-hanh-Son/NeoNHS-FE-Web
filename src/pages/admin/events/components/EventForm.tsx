import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Upload, X } from 'lucide-react';
import { TagCombobox } from './TagCombobox';
import { GoogleMapPickerModal } from '@/pages/admin/destinations/components/GoogleMapPickerModal';
import { EVENT_STATUS_OPTIONS } from '../constants';
import { validateImageFile } from '@/utils/cloudinary';
import type { EventResponse, CreateEventRequest, UpdateEventRequest } from '@/types/event';
import BlogEditor from '@/components/blog/BlogEditor';
import { BlogEditorRef, EditorSaveResult } from '@/components/blog/type';

interface EventFormProps {
  mode: 'create' | 'edit';
  initialData?: EventResponse | null;
  onSubmit: (data: CreateEventRequest | UpdateEventRequest, file?: File) => Promise<void>;
  loading: boolean;
}

interface FormData {
  name: string;
  shortDescription: string;
  fullDescription: string;
  startTime: string;
  endTime: string;
  locationName: string;
  latitude: string;
  longitude: string;
  isTicketRequired: boolean;
  price: string;
  maxParticipants: string;
  thumbnailUrl: string;
  tagIds: string[];
  status: string;
}

const emptyForm: FormData = {
  name: '',
  shortDescription: '',
  fullDescription: '',
  startTime: '',
  endTime: '',
  locationName: '',
  latitude: '',
  longitude: '',
  isTicketRequired: false,
  price: '',
  maxParticipants: '',
  thumbnailUrl: '',
  tagIds: [],
  status: 'UPCOMING',
};

function toLocalDateTimeString(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch {
    return '';
  }
}

export function EventForm({ mode, initialData, onSubmit, loading }: EventFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        shortDescription: initialData.shortDescription || '',
        fullDescription: initialData.fullDescription || '',
        startTime: toLocalDateTimeString(initialData.startTime),
        endTime: toLocalDateTimeString(initialData.endTime),
        locationName: initialData.locationName || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        isTicketRequired: initialData.isTicketRequired || false,
        price: initialData.price ? String(initialData.price) : '',
        maxParticipants: initialData.maxParticipants ? String(initialData.maxParticipants) : '',
        thumbnailUrl: initialData.thumbnailUrl || '',
        tagIds: initialData.tags?.map((t) => t.id) || [],
        status: initialData.status || 'UPCOMING',
      };
    }
    return emptyForm;
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<BlogEditorRef>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        shortDescription: initialData.shortDescription || '',
        fullDescription: initialData.fullDescription || '',
        startTime: toLocalDateTimeString(initialData.startTime),
        endTime: toLocalDateTimeString(initialData.endTime),
        locationName: initialData.locationName || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        isTicketRequired: initialData.isTicketRequired || false,
        price: initialData.price ? String(initialData.price) : '',
        maxParticipants: initialData.maxParticipants ? String(initialData.maxParticipants) : '',
        thumbnailUrl: initialData.thumbnailUrl || '',
        tagIds: initialData.tags?.map((t) => t.id) || [],
        status: initialData.status || 'UPCOMING',
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleMapLocationSelect = (result: any) => {
    setForm((prev) => ({
      ...prev,
      latitude: String(result.latitude),
      longitude: String(result.longitude),
      locationName: result.name || result.address || '',
    }));
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      message.error(validationError);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    setThumbnailFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    const now = new Date();

    if (form.name.trim()) {
      if (form.name.length > 255) e.name = 'Tối đa 255 ký tự';
    } else {
      e.name = 'Tên sự kiện là bắt buộc';
    }

    if (form.shortDescription.length > 255) e.shortDescription = 'Tối đa 255 ký tự';
    if (form.locationName.length > 255) e.locationName = 'Tối đa 255 ký tự';

    if (!form.startTime) e.startTime = 'Thời gian bắt đầu là bắt buộc';
    else if (mode === 'create' && new Date(form.startTime) < now) e.startTime = 'Phải là hiện tại hoặc tương lai';

    if (!form.endTime) e.endTime = 'Thời gian kết thúc là bắt buộc';
    else if (mode === 'create' && new Date(form.endTime) <= now) e.endTime = 'Phải ở trong tương lai';

    if (form.startTime && form.endTime && new Date(form.endTime) <= new Date(form.startTime)) {
      e.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
    }

    if (!thumbnailFile && !form.thumbnailUrl.trim()) {
      e.thumbnailUrl = 'Ảnh đại diện là bắt buộc';
    }
    if (form.thumbnailUrl && form.thumbnailUrl.length > 255) e.thumbnailUrl = 'Tối đa 255 ký tự';

    // Da bo kiem tra gia vi khong con dung gia co ban
    if (form.maxParticipants) {
      const mp = Number(form.maxParticipants);
      if (mp <= 0 || !Number.isInteger(mp)) e.maxParticipants = 'Phải là số nguyên dương';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEditorSave = async (result: EditorSaveResult) => {
    // Clear previous fullDescription error
    setErrors((prev) => {
      const next = { ...prev };
      delete next.fullDescription;
      return next;
    });

    if (result.charCount > 1000) {
      setErrors((prev) => ({ ...prev, fullDescription: `Mô tả quá dài (${result.charCount}/1000 ký tự)` }));
      return;
    }

    const data: CreateEventRequest | UpdateEventRequest = {
      name: form.name.trim(),
      shortDescription: form.shortDescription.trim() || undefined,
      fullDescription: result.html.trim() || undefined,
      startTime: dayjs(form.startTime).format('YYYY-MM-DDTHH:mm:ss'),
      endTime: dayjs(form.endTime).format('YYYY-MM-DDTHH:mm:ss'),
      locationName: form.locationName.trim() || undefined,
      latitude: form.latitude.trim() || undefined,
      longitude: form.longitude.trim() || undefined,
      isTicketRequired: form.isTicketRequired,
      price: 0, // No longer using base price, prices are in ticket catalog
      maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
      thumbnailUrl: thumbnailFile ? 'placeholder_for_validation' : undefined,
      tagIds: form.tagIds.length > 0 ? form.tagIds : undefined,
      status: mode === 'edit' ? (form.status as any) : undefined,
    };

    await onSubmit(data, thumbnailFile || undefined);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (editorRef.current) {
      editorRef.current.save();
    } else {
      // Du phong khi trinh soan thao chua san sang (hiem khi xay ra)
      const data: CreateEventRequest | UpdateEventRequest = {
        name: form.name.trim(),
        shortDescription: form.shortDescription.trim() || undefined,
        fullDescription: form.fullDescription.trim() || undefined,
        startTime: dayjs(form.startTime).format('YYYY-MM-DDTHH:mm:ss'),
        endTime: dayjs(form.endTime).format('YYYY-MM-DDTHH:mm:ss'),
        locationName: form.locationName.trim() || undefined,
        latitude: form.latitude.trim() || undefined,
        longitude: form.longitude.trim() || undefined,
        isTicketRequired: form.isTicketRequired,
        price: 0,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        thumbnailUrl: thumbnailFile ? 'placeholder_for_validation' : undefined,
        tagIds: form.tagIds.length > 0 ? form.tagIds : undefined,
      };

      if (mode === 'edit') {
        (data as UpdateEventRequest).status = form.status as any;
      }

      await onSubmit(data, thumbnailFile || undefined);
    }
  };

  const mapInitialPos =
    form.latitude && form.longitude ? { lat: Number(form.latitude), lng: Number(form.longitude) } : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cot ben trai */}
      <div className="lg:col-span-2 space-y-6">
        {/* Thong tin co ban */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Tên sự kiện *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nhập tên sự kiện"
                maxLength={255}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="shortDescription">
                Mô tả ngắn{' '}
                <span className="text-muted-foreground font-normal">({form.shortDescription.length}/255)</span>
              </Label>
              <Input
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                placeholder="Mô tả ngắn hiển thị trên thẻ"
                maxLength={255}
              />
              {errors.shortDescription && <p className="text-xs text-destructive mt-1">{errors.shortDescription}</p>}
            </div>
            <div>
              <Label className="mb-2 block">Mô tả chi tiết</Label>
              <div className="border rounded-md overflow-hidden bg-white">
                <BlogEditor
                  ref={editorRef}
                  onSave={handleEditorSave}
                  initialHtml={form.fullDescription}
                  placeholder="Nhập mô tả chi tiết sự kiện..."
                />
              </div>
              {errors.fullDescription && <p className="text-xs text-destructive mt-1">{errors.fullDescription}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Thoi gian va dia diem */}
        <Card>
          <CardHeader>
            <CardTitle>Thời gian & Địa điểm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Thời gian bắt đầu *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
                {errors.startTime && <p className="text-xs text-destructive mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <Label htmlFor="endTime">Thời gian kết thúc *</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
                {errors.endTime && <p className="text-xs text-destructive mt-1">{errors.endTime}</p>}
              </div>
            </div>

            {/* Dia diem */}
            <div>
              <Label htmlFor="locationName">Tên địa điểm</Label>
              <Input
                id="locationName"
                value={form.locationName}
                onChange={(e) => handleChange('locationName', e.target.value)}
                placeholder="VD: Quận Ngũ Hành Sơn"
                maxLength={255}
              />
              {errors.locationName && <p className="text-xs text-destructive mt-1">{errors.locationName}</p>}
            </div>

            {/* Chon ban do */}
            <div>
              <Label>Tọa độ</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setMapPickerOpen(true)}>
                  <MapPin className="h-4 w-4 mr-1" />
                  Chọn trên bản đồ
                </Button>
                {form.latitude && form.longitude && (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs font-mono">
                      {form.latitude}, {form.longitude}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('latitude', '');
                        handleChange('longitude', '');
                      }}
                      className="text-muted-foreground hover:text-foreground p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              {/* Truong nhap tay an, co the dung khi can */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="latitude" className="text-xs text-muted-foreground">
                    Vĩ độ
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    placeholder="16.0028"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-xs text-muted-foreground">
                    Kinh độ
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    placeholder="108.2638"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ve va gia */}
        <Card>
          <CardHeader>
            <CardTitle>Vé & Giá</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                id="isTicketRequired"
                checked={form.isTicketRequired}
                onCheckedChange={(v) => handleChange('isTicketRequired', v)}
              />
              <Label htmlFor="isTicketRequired">Yêu cầu vé</Label>
            </div>
            <div>
              <Label htmlFor="maxParticipants">Giới hạn người tham gia</Label>
              <Input
                id="maxParticipants"
                type="number"
                min={1}
                value={form.maxParticipants}
                onChange={(e) => handleChange('maxParticipants', e.target.value)}
                placeholder="100"
              />
              {errors.maxParticipants && <p className="text-xs text-destructive mt-1">{errors.maxParticipants}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cot ben phai */}
      <div className="space-y-6">
        {/* Trang thai (chi dung khi sua) */}
        {mode === 'edit' && (
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Anh dai dien */}
        <Card>
          <CardHeader>
            <CardTitle>Ảnh đại diện {mode === 'create' && '*'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {thumbnailPreview || form.thumbnailUrl ? (
              <div
                className="relative aspect-video rounded-lg overflow-hidden border group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={thumbnailPreview || form.thumbnailUrl}
                  alt="Anh dai dien"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Nhấp để thay đổi ảnh</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnailPreview('');
                    setThumbnailFile(null);
                    handleChange('thumbnailUrl', '');
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  title="Xóa ảnh"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center text-muted-foreground">
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 mb-1 animate-spin" />
                      <span className="text-xs">Đang tải lên...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-1" />
                      <span className="text-xs">Nhấp hoặc kéo thả để tải ảnh lên</span>
                      <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                        JPG, PNG, GIF, WebP (tối đa 5MB)
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Input file an */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = ''; // Dat lai de co the chon lai cung file
              }}
            />

            {errors.thumbnailUrl && <p className="text-xs text-destructive">{errors.thumbnailUrl}</p>}
          </CardContent>
        </Card>

        {/* The */}
        <Card>
          <CardHeader>
            <CardTitle>Thẻ</CardTitle>
          </CardHeader>
          <CardContent>
            <TagCombobox selectedTagIds={form.tagIds} onChange={(ids) => handleChange('tagIds', ids)} />
          </CardContent>
        </Card>
      </div>

      {/* Chan trang */}
      <div className="lg:col-span-3 flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Tạo sự kiện' : 'Cập nhật sự kiện'}
        </Button>
      </div>

      {/* Hop thoai chon ban do */}
      <GoogleMapPickerModal
        open={mapPickerOpen}
        onOpenChange={setMapPickerOpen}
        initialCoord={mapInitialPos ? [mapInitialPos.lat, mapInitialPos.lng] : undefined}
        onSelect={handleMapLocationSelect}
      />
    </div>
  );
}
