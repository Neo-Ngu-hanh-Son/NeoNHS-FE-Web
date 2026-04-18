import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Upload, Loader2, AudioLines, AlertTriangle, ImageIcon } from 'lucide-react';
import { Destination, Point } from '../types';
import { PointRequest, PointType } from '@/types/point';
import * as turf from '@turf/turf';
import { NGU_HANH_SON_GEOJSON_POLYGON } from '../constants';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { pointTypeLabel } from '../pointTypeLabels';

function isPointInBoundary(lat: number, lng: number): boolean {
  const point = turf.point([lng, lat]);
  const polygon = turf.polygon(NGU_HANH_SON_GEOJSON_POLYGON);
  return turf.booleanPointInPolygon(point, polygon);
}

interface PointFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPoint: Point | null;
  destinations: Destination[];
  initialDestinationId?: string;
  onSave: (values: PointRequest) => void;
  onOpenMapPicker: () => void;
  previewPos: [number, number] | null;
  onFileUpload: (
    file: File,
    field: string,
    type: 'image' | 'video',
    setFieldValue: (field: string, value: string) => void,
  ) => void;
  uploading: { [key: string]: boolean };
}

const POINT_TYPES = Object.values(PointType);

export function PointFormModal({
  open,
  onOpenChange,
  editingPoint,
  destinations,
  initialDestinationId,
  onSave,
  onOpenMapPicker,
  previewPos,
  onFileUpload,
  uploading,
}: PointFormModalProps) {
  const [formData, setFormData] = useState<Partial<PointRequest>>({
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
    type: 'GENERAL' as PointType,
    orderIndex: 1,
    estTimeSpent: 30,
    thumbnailUrl: '',
    attractionId: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (previewPos) {
      setFormData((prev) => ({
        ...prev,
        latitude: previewPos[0],
        longitude: previewPos[1],
      }));
    }
  }, [previewPos]);

  useEffect(() => {
    if (editingPoint) {
      setFormData({
        name: editingPoint.name,
        description: editingPoint.description,
        latitude: editingPoint.latitude,
        longitude: editingPoint.longitude,
        type: editingPoint.type,
        orderIndex: editingPoint.orderIndex,
        estTimeSpent: editingPoint.estTimeSpent,
        thumbnailUrl: editingPoint.thumbnailUrl,
        attractionId: editingPoint.attractionId || (editingPoint as { attraction?: { id: string } }).attraction?.id || '',
        googlePlaceId: editingPoint.googlePlaceId || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
        type: 'GENERAL' as PointType,
        orderIndex: 1,
        estTimeSpent: 30,
        thumbnailUrl: '',
        attractionId: initialDestinationId || '',
      });
    }
  }, [editingPoint, open, initialDestinationId]);

  const safeFormData = {
    ...formData,
    attractionId: formData.attractionId || '',
    type: formData.type || 'GENERAL',
  };

  const handleChange = (field: keyof PointRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldValue = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const outOfBoundary =
    Boolean(formData.latitude && formData.longitude) &&
    !isPointInBoundary(formData.latitude!, formData.longitude!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude)) {
        message.error('Vị trí nằm ngoài ranh giới quận Ngũ Hành Sơn. Vui lòng chọn lại trên bản đồ.');
        return;
      }
    } catch (error) {
      console.error('Boundary validation error:', error);
    }
    onSave(safeFormData as PointRequest);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] max-w-5xl flex-col gap-0 overflow-hidden border border-slate-200 p-0 shadow-lg dark:border-slate-700">
        <DialogHeader className="shrink-0 space-y-1 border-b border-slate-100 px-6 py-4 text-left dark:border-slate-700">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {editingPoint?.id ? 'Sửa điểm tham quan (POI)' : 'Thêm điểm tham quan (POI)'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Điền thông tin bên trái; chọn vị trí và ảnh đại diện bên phải.
          </DialogDescription>
        </DialogHeader>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 transition-colors ${outOfBoundary
                ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30'
                : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40'
              }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${outOfBoundary
                  ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                }`}
            >
              {outOfBoundary ? <AlertTriangle className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${outOfBoundary ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                {outOfBoundary ? 'Cảnh báo ranh giới' : 'Tọa độ hiện tại'}
              </p>
              <p className={`mt-1 font-mono text-sm font-semibold ${outOfBoundary ? 'text-red-800 dark:text-red-200' : 'text-slate-800 dark:text-slate-100'}`}>
                {Number(formData.latitude || 0).toFixed(6)}, {Number(formData.longitude || 0).toFixed(6)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {outOfBoundary
                  ? 'Điểm nằm ngoài khu vực Ngũ Hành Sơn. Hãy chọn lại vị trí trên bản đồ.'
                  : editingPoint?.googlePlaceId
                    ? `Đã liên kết Google Place ID: ${editingPoint.googlePlaceId}`
                    : 'Chọn vị trí trên bản đồ để cập nhật tọa độ.'}
              </p>
            </div>
          </div>

          <form id="point-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Cột trái: thông tin nhập */}
            <div className="space-y-6 lg:col-span-7">
              <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Thông tin điểm</CardTitle>
                  <CardDescription>Tên, mô tả, điểm đến và phân loại</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="attractionId" className="text-sm font-medium">
                      Điểm đến <span className="text-destructive">*</span>
                    </Label>
                    <Select value={safeFormData.attractionId} onValueChange={(value) => handleChange('attractionId', value)} required>
                      <SelectTrigger id="attractionId" className="h-10 bg-background">
                        <SelectValue placeholder="Chọn điểm đến gắn với POI…" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest.id} value={dest.id}>
                            {dest.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Tên điểm <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      className="h-10"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Ví dụ: Chùa Linh Ứng"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Mô tả / địa chỉ
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Mô tả ngắn hoặc địa chỉ đầy đủ"
                      rows={4}
                      className="min-h-[100px] resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium">
                        Loại điểm
                      </Label>
                      <Select value={safeFormData.type} onValueChange={(value) => handleChange('type', value as PointType)}>
                        <SelectTrigger id="type" className="h-10 bg-background">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                          {POINT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {pointTypeLabel(t)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estTimeSpent" className="text-sm font-medium">
                        Thời gian tham quan (phút)
                      </Label>
                      <Input
                        id="estTimeSpent"
                        type="number"
                        min={5}
                        className="h-10"
                        value={formData.estTimeSpent ?? 30}
                        onChange={(e) => handleChange('estTimeSpent', parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
                <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Tiện ích khác</CardTitle>
                    <CardDescription>Âm thanh lịch sử và ảnh toàn cảnh (sau khi đã lưu điểm)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Âm thanh lịch sử ({editingPoint?.historyAudioCount ?? 0})</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 transition-colors"
                        disabled={!editingPoint?.id}
                        onClick={() => {
                          if (!editingPoint?.id) return;
                          navigate(`/admin/destinations/${editingPoint.id}/audioHistory`, {
                            state: { pointName: formData.name },
                          });
                        }}
                      >
                        <AudioLines className="" />
                        Quản lý âm thanh lịch sử
                      </Button>
                      {!editingPoint?.id && (
                        <p className="text-xs text-muted-foreground">Lưu điểm trước để thêm âm thanh.</p>
                      )}
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ảnh toàn cảnh (360°)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 transition-colors"
                        disabled={!editingPoint?.id}
                        onClick={() => {
                          if (!editingPoint?.id) return;
                          navigate(`/admin/places/${editingPoint.id}/panorama/edit`);
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                        Chỉnh sửa panorama
                      </Button>
                      {!editingPoint?.id && <p className="text-xs text-muted-foreground">Lưu điểm trước để chỉnh panorama.</p>}
                    </div>
                    {formData.googlePlaceId ? (
                      <>
                        <Separator />
                        <p className="break-all text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Google Place ID: {formData.googlePlaceId}
                        </p>
                      </>
                    ) : null}
                  </CardContent>
                </Card>
              </Card>
            </div>

            {/* Cột phải: bản đồ, ảnh, tiện ích */}
            <div className="space-y-6 lg:col-span-5">
              <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Vị trí</CardTitle>
                  <CardDescription>Mở bản đồ để chọn hoặc tinh chỉnh tọa độ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-full border-dashed transition-colors hover:border-primary hover:bg-primary/5"
                    onClick={onOpenMapPicker}
                  >
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    Chọn vị trí trên bản đồ
                  </Button>
                </CardContent>

              </Card>

              <Card className="rounded-2xl border border-slate-100 shadow-sm dark:border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/20">
                      <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Ảnh đại diện</CardTitle>
                      <CardDescription>Tải lên hoặc dán URL ảnh (tối đa 5MB, JPG/PNG)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted/60">
                    {uploading.thumbnailUrl ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Upload className="h-4 w-4 text-primary" />
                    )}
                    <span>{uploading.thumbnailUrl ? 'Đang tải lên…' : 'Chọn ảnh từ máy'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onFileUpload(file, 'thumbnailUrl', 'image', setFieldValue);
                        e.target.value = '';
                      }}
                      disabled={uploading.thumbnailUrl}
                    />
                  </label>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl" className="text-xs text-muted-foreground">
                      Hoặc URL ảnh
                    </Label>
                    <Input
                      id="thumbnailUrl"
                      className="h-9 bg-background"
                      value={formData.thumbnailUrl || ''}
                      onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                      placeholder="https://…"
                    />
                  </div>
                  {formData.thumbnailUrl ? (
                    <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600">
                      <img src={formData.thumbnailUrl} alt="Xem trước ảnh đại diện" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-muted/30 text-center dark:border-slate-700">
                      <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                      <p className="text-xs text-muted-foreground">Chưa có ảnh xem trước</p>
                    </div>
                  )}
                </CardContent>
              </Card>


            </div>
          </form>
        </div>

        <DialogFooter className="shrink-0 flex-col gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end dark:border-slate-700">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Hủy
          </Button>
          <Button
            type="submit"
            form="point-form"
            className="w-full sm:w-auto"
            disabled={uploading.thumbnailUrl || uploading.historyAudioUrl || !safeFormData.attractionId}
          >
            {editingPoint?.id ? 'Cập nhật điểm' : 'Tạo điểm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
