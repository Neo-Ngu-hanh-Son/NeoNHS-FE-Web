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
import { Badge } from '@/components/ui/badge';
import { Info, MapPin, Upload, Loader2 } from 'lucide-react';
import { Destination } from '../types';
import { AttractionRequest } from '@/types/attraction';

interface DestinationFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingDestination: Destination | null;
    onSave: (values: AttractionRequest) => void;
    onOpenMapPicker: () => void;
    previewPos: [number, number] | null;
    onFileUpload: (file: File, field: string, type: 'image' | 'video', setFieldValue: (field: string, value: string) => void) => void;
    uploading: { [key: string]: boolean };
}

export function DestinationFormModal({
    open,
    onOpenChange,
    editingDestination,
    onSave,
    onOpenMapPicker,
    previewPos,
    onFileUpload,
    uploading,
}: DestinationFormModalProps) {
    const [formData, setFormData] = useState<Partial<AttractionRequest>>({
        name: '',
        address: '',
        description: '',
        latitude: 0,
        longitude: 0,
        status: 'OPEN',
        openHour: '08:00',
        closeHour: '17:00',
        thumbnailUrl: '',
        isActive: true,
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
        if (editingDestination) {
            setFormData({
                name: editingDestination.name,
                address: editingDestination.address,
                description: editingDestination.description,
                latitude: editingDestination.latitude,
                longitude: editingDestination.longitude,
                status: editingDestination.status,
                openHour: editingDestination.openHour,
                closeHour: editingDestination.closeHour,
                thumbnailUrl: editingDestination.thumbnailUrl,
                isActive: editingDestination.isActive,
            });
        } else {
            setFormData({
                name: '',
                address: '',
                description: '',
                latitude: 0,
                longitude: 0,
                status: 'OPEN',
                openHour: '08:00',
                closeHour: '17:00',
                thumbnailUrl: '',
                isActive: true,
            });
        }
    }, [editingDestination, open]);

    const handleChange = (field: keyof AttractionRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const setFieldValue = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as AttractionRequest);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingDestination ? 'Edit Destination' : 'Add New Destination'}</DialogTitle>
                </DialogHeader>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-3 mt-2">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-primary">Coordinate Selection</h4>
                        <p className="text-xs text-muted-foreground">
                            You can manually enter coordinates or use the map picker below.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name">Destination Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Enter destination name"
                                required
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Enter physical address"
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Brief overview of this location"
                                rows={3}
                            />
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
                            {previewPos && <Badge variant="secondary" className="bg-blue-100 text-blue-700">Location selected</Badge>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Open</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    <SelectItem value="TEMPORARILY_CLOSED">Temporarily Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="openHour">Open Hour</Label>
                                <Input
                                    id="openHour"
                                    type="time"
                                    value={formData.openHour || ''}
                                    onChange={(e) => handleChange('openHour', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closeHour">Close Hour</Label>
                                <Input
                                    id="closeHour"
                                    type="time"
                                    value={formData.closeHour || ''}
                                    onChange={(e) => handleChange('closeHour', e.target.value)}
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
                                    <span className="text-xs text-muted-foreground italic">Or enter URL manually below</span>
                                </div>
                                <Input
                                    id="thumbnailUrl"
                                    value={formData.thumbnailUrl}
                                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.thumbnailUrl && (
                                    <div className="mt-1 relative w-32 h-20 group">
                                        <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover rounded-md border shadow-sm" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={uploading['thumbnailUrl']}>
                            {editingDestination ? 'Save Changes' : 'Add Destination'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
