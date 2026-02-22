import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Info, MapPin, Upload, Loader2, AudioLines } from 'lucide-react';
import { Point } from '../types';
import { PointRequest, PointType } from '@/types/point';

interface PointFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingPoint: Point | null;
    onSave: (values: PointRequest) => void;
    onOpenMapPicker: () => void;
    previewPos: [number, number] | null;
    onFileUpload: (file: File, field: string, type: 'image' | 'video', setFieldValue: (field: string, value: string) => void) => void;
    uploading: { [key: string]: boolean };
}

export function PointFormModal({
    open,
    onOpenChange,
    editingPoint,
    onSave,
    onOpenMapPicker,
    previewPos,
    onFileUpload,
    uploading,
}: PointFormModalProps) {
    const [formData, setFormData] = useState<Partial<PointRequest>>({
        name: '',
        description: '',
        history: '',
        historyAudioUrl: '',
        latitude: 0,
        longitude: 0,
        type: 'GENERAL' as PointType,
        orderIndex: 1,
        estTimeSpent: 30,
        thumbnailUrl: '',
    });

    useEffect(() => {
        if (previewPos) {
            setFormData(prev => ({
                ...prev,
                latitude: previewPos[0],
                longitude: previewPos[1]
            }));
        }
    }, [previewPos]);

    useEffect(() => {
        if (editingPoint) {
            setFormData({
                name: editingPoint.name,
                description: editingPoint.description,
                history: editingPoint.history,
                historyAudioUrl: editingPoint.historyAudioUrl,
                latitude: editingPoint.latitude,
                longitude: editingPoint.longitude,
                type: editingPoint.type,
                orderIndex: editingPoint.orderIndex,
                estTimeSpent: editingPoint.estTimeSpent,
                thumbnailUrl: editingPoint.thumbnailUrl,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                history: '',
                historyAudioUrl: '',
                latitude: 0,
                longitude: 0,
                type: 'GENERAL' as PointType,
                orderIndex: 1,
                estTimeSpent: 30,
                thumbnailUrl: '',
            });
        }
    }, [editingPoint, open]);

    const handleChange = (field: keyof PointRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const setFieldValue = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as PointRequest);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingPoint ? 'Edit Point of Interest' : 'Add New Point of Interest'}</DialogTitle>
                </DialogHeader>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-3 mt-2">
                    <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-emerald-800">Coordinate Selection</h4>
                        <p className="text-xs text-emerald-700">
                            Use the map picker button below to select the exact location.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name">Point Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="e.g. Linh Ung Pagoda"
                                required
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description">Short Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Brief description of the POI"
                                rows={2}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="history">Historical Context</Label>
                            <Textarea
                                id="history"
                                value={formData.history}
                                onChange={(e) => handleChange('history', e.target.value)}
                                placeholder="Rich history and background information"
                                rows={4}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="historyAudioUrl">Audio History</Label>
                            <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/20">
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium">
                                        {uploading['historyAudioUrl'] ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        ) : (
                                            <AudioLines className="w-4 h-4 text-primary" />
                                        )}
                                        <span>{uploading['historyAudioUrl'] ? 'Uploading...' : 'Choose Audio'}</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onFileUpload(file, 'historyAudioUrl', 'video', setFieldValue);
                                            }}
                                            disabled={uploading['historyAudioUrl']}
                                        />
                                    </label>
                                </div>
                                <Input
                                    id="historyAudioUrl"
                                    value={formData.historyAudioUrl}
                                    onChange={(e) => handleChange('historyAudioUrl', e.target.value)}
                                    placeholder="Or enter Audio URL"
                                />
                                {formData.historyAudioUrl && (
                                    <audio controls className="w-full mt-2 h-8">
                                        <source src={formData.historyAudioUrl} />
                                    </audio>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="0.000001"
                                value={formData.latitude}
                                onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="0.000001"
                                value={formData.longitude}
                                onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                                required
                            />
                        </div>

                        <div className="col-span-2 flex items-center gap-3">
                            <Button type="button" variant="outline" size="sm" onClick={onOpenMapPicker} className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Open Map Picker
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Point Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => handleChange('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(PointType).map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="orderIndex">Order</Label>
                                <Input
                                    id="orderIndex"
                                    type="number"
                                    min={1}
                                    value={formData.orderIndex}
                                    onChange={(e) => handleChange('orderIndex', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="estTimeSpent">Time (Min)</Label>
                                <Input
                                    id="estTimeSpent"
                                    type="number"
                                    min={5}
                                    value={formData.estTimeSpent}
                                    onChange={(e) => handleChange('estTimeSpent', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="thumbnailUrl">Thumbnail Image</Label>
                            <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/20">
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium">
                                        {uploading['thumbnailUrl'] ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        ) : (
                                            <Upload className="w-4 h-4 text-primary" />
                                        )}
                                        <span>{uploading['thumbnailUrl'] ? 'Uploading...' : 'Choose File'}</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onFileUpload(file, 'thumbnailUrl', 'image', setFieldValue);
                                            }}
                                            disabled={uploading['thumbnailUrl']}
                                        />
                                    </label>
                                </div>
                                <Input
                                    id="thumbnailUrl"
                                    value={formData.thumbnailUrl}
                                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                                    placeholder="Enter Image URL"
                                />
                                {formData.thumbnailUrl && (
                                    <div className="mt-1 w-32 h-20">
                                        <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover rounded-md border shadow-sm" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={uploading['thumbnailUrl'] || uploading['historyAudioUrl']}>
                            {editingPoint ? 'Save Changes' : 'Add Point'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
