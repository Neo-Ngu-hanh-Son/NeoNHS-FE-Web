import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Upload, Loader2, AudioLines, AlertTriangle } from 'lucide-react';
import { Destination, Point } from '../types';
import { PointRequest, PointType } from '@/types/point';
import * as turf from '@turf/turf';
import { NGU_HANH_SON_GEOJSON_POLYGON } from '../constants';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

// ─── Turf Point-in-Polygon Check ───
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
        attractionId: editingPoint.attractionId || (editingPoint as any).attraction?.id || '',
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
      });
    }
  }, [editingPoint, open]);

  const safeFormData = {
    ...formData,
    attractionId: formData.attractionId || '',
    type: formData.type || 'GENERAL',
  };

  const handleChange = (field: keyof PointRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldValue = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate boundary
    try {
      if (formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude)) {
        message.error('Vị trí này nằm ngoài ranh giới Ngũ Hành Sơn. Vui lòng kiểm tra lại tọa độ.');
        return;
      }
    } catch (error) {
      console.error('Boundary validation error:', error);
      // If validation fails due to data error, we log it but don't block the user
    }
    // Validate boundary
    try {
      if (formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude)) {
        message.error('This location is outside the boundary of Ngũ Hành Sơn.Please check the coordinates again.');
        return;
      }
    } catch (error) {
      console.error('Boundary validation error:', error);
      // If validation fails due to data error, we log it but don't block the user
    }

    onSave(safeFormData as PointRequest);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 text-gray-900 border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 bg-white shrink-0">
          <DialogTitle className="text-xl font-bold">
            {editingPoint?.id ? 'Edit Point of Interest' : 'Add New Point of Interest'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <div
            className={`border rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-sm group transition-colors ${formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude) ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}
          >
            <div
              className={`p-3 bg-white rounded-xl shadow-sm group-hover:scale-105 transition-transform ${formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude) ? 'text-red-500' : 'text-primary'}`}
            >
              {formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude) ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h4
                className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude) ? 'text-red-500' : 'text-cyan-500'}`}
              >
                {formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude)
                  ? 'Boundary Violation'
                  : 'Geocoded Metadata'}
              </h4>
              <p
                className={`text-sm font-bold ${formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude) ? 'text-red-700' : 'text-slate-700'}`}
              >
                {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
              </p>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[400px]">
                {formData.latitude && formData.longitude && !isPointInBoundary(formData.latitude, formData.longitude)
                  ? 'WARNING: This location is outside the district boundary!'
                  : editingPoint?.googlePlaceId
                    ? `Linked to Google Place ID: ${editingPoint.googlePlaceId}`
                    : 'Visual Projection via Map Hub'}
              </p>
            </div>
          </div>

          <form id="point-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 group transition-all"
                  onClick={onOpenMapPicker}
                >
                  <MapPin className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                  Locate on Interactive Map
                </Button>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="attractionId" className="text-sm font-bold text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Target Destination <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={safeFormData.attractionId}
                  onValueChange={(value) => handleChange('attractionId', value)}
                  required
                >
                  <SelectTrigger className="h-11 border-primary/20 bg-primary/5 focus:ring-primary/20">
                    <SelectValue placeholder="Select destination for this point..." />
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

              <div className="col-span-2 space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Point Name
                </Label>
                <Input
                  id="name"
                  className="h-11"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Linh Ung Pagoda"
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Short Description / Address
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Provide a brief description or the full address"
                  rows={2}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="historyAudioUrl">History & Audios ({editingPoint?.historyAudioCount || 0})</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={!editingPoint?.id}
                    onClick={() => {
                      if (!editingPoint?.id) return;
                      navigate(`/admin/destinations/${editingPoint.id}/audioHistory`, {
                        state: { pointName: formData.name },
                      });
                    }}
                  >
                    <AudioLines className="w-4 h-4" />
                    Manage History Audios
                  </Button>

                  {!editingPoint?.id && (
                    <p className="text-xs text-muted-foreground">Save this point first to manage history audio.</p>
                  )}
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="historyAudioUrl">Manage Panorama</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-3"
                    disabled={!editingPoint?.id}
                    onClick={() => {
                      if (!editingPoint?.id) return;
                      navigate(`/admin/places/${editingPoint.id}/panorama/edit`);
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    Edit Panorama
                  </Button>
                  {!editingPoint?.id && (
                    <p className="text-xs text-muted-foreground">Save this point first to manage panorama.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold">
                  Point Category
                </Label>
                <Select value={safeFormData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PointType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="estTimeSpent" className="text-sm font-semibold">
                  Est. Visit (Min)
                </Label>
                <Input
                  id="estTimeSpent"
                  type="number"
                  min={5}
                  className="h-11 w-full lg:w-1/2"
                  value={formData.estTimeSpent}
                  onChange={(e) => handleChange('estTimeSpent', parseInt(e.target.value))}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-sm font-semibold">
                  Visual Representation
                </Label>
                <div className="flex flex-col gap-4 p-4 border rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 hover:border-primary/30 transition-all text-sm font-medium">
                      {uploading['thumbnailUrl'] ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <Upload className="w-4 h-4 text-primary" />
                      )}
                      <span>{uploading['thumbnailUrl'] ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onFileUpload(file, 'thumbnailUrl', 'image', setFieldValue);
                        }}
                        disabled={uploading['thumbnailUrl']}
                      />
                    </label>
                    <p className="text-[11px] text-muted-foreground italic">MAX 5MB - JPG, PNG</p>
                  </div>
                  <Input
                    id="thumbnailUrl"
                    className="bg-white"
                    value={formData.thumbnailUrl}
                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                    placeholder="Or paste direct image URL"
                  />
                  {formData.thumbnailUrl && (
                    <div className="mt-2 relative group w-full aspect-video rounded-xl overflow-hidden border shadow-inner">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>

              {formData.googlePlaceId && (
                <div className="col-span-2 pt-2 px-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span>Linked to Google Place ID: {formData.googlePlaceId}</span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t gap-3 bg-white shrink-0">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="px-6">
            Cancel
          </Button>
          <Button
            type="submit"
            form="point-form"
            className="px-8 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
            disabled={uploading['thumbnailUrl'] || uploading['historyAudioUrl'] || !safeFormData.attractionId}
          >
            {editingPoint?.id ? 'Update Point' : 'Create Point'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
