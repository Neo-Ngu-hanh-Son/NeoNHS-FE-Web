import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, MapPin, Upload, X } from 'lucide-react';
import { TagCombobox } from './TagCombobox';
import { MapPickerModal } from './MapPickerModal';
import { EVENT_STATUS_OPTIONS } from '../constants';
import { uploadImageToCloudinary, validateImageFile } from '@/utils/cloudinary';
import type { EventResponse, CreateEventRequest, UpdateEventRequest } from '@/types/event';

interface EventFormProps {
    mode: 'create' | 'edit';
    initialData?: EventResponse | null;
    onSubmit: (data: CreateEventRequest | UpdateEventRequest) => Promise<void>;
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
    const [form, setForm] = useState<FormData>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [mapPickerOpen, setMapPickerOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleMapConfirm = (lat: number, lng: number) => {
        setForm((prev) => ({
            ...prev,
            latitude: String(lat),
            longitude: String(lng),
        }));
    };

    const handleFileUpload = async (file: File) => {
        const validationError = validateImageFile(file);
        if (validationError) {
            message.error(validationError);
            return;
        }

        setUploading(true);
        try {
            const url = await uploadImageToCloudinary(file);
            if (url) {
                handleChange('thumbnailUrl', url);
                message.success('Image uploaded successfully!');
            } else {
                message.error('Image upload failed.');
            }
        } catch (error) {
            message.error('Image upload error.');
        } finally {
            setUploading(false);
        }
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

        if (!form.name.trim()) e.name = 'Event name is required';
        else if (form.name.length > 255) e.name = 'Max 255 characters';

        if (form.shortDescription.length > 255) e.shortDescription = 'Max 255 characters';
        if (form.locationName.length > 255) e.locationName = 'Max 255 characters';

        if (!form.startTime) e.startTime = 'Start time is required';
        else if (mode === 'create' && new Date(form.startTime) < now) e.startTime = 'Must be present or future';

        if (!form.endTime) e.endTime = 'End time is required';
        else if (mode === 'create' && new Date(form.endTime) <= now) e.endTime = 'Must be in the future';

        if (form.startTime && form.endTime && new Date(form.endTime) <= new Date(form.startTime)) {
            e.endTime = 'End time must be after start time';
        }

        if (mode === 'create' && !form.thumbnailUrl.trim()) {
            e.thumbnailUrl = 'Thumbnail is required';
        }
        if (form.thumbnailUrl && form.thumbnailUrl.length > 255) e.thumbnailUrl = 'Max 255 characters';

        if (form.price && Number(form.price) < 0) e.price = 'Must be ≥ 0';
        if (form.maxParticipants) {
            const mp = Number(form.maxParticipants);
            if (mp <= 0 || !Number.isInteger(mp)) e.maxParticipants = 'Must be a positive integer';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const data: CreateEventRequest | UpdateEventRequest = {
            name: form.name.trim(),
            shortDescription: form.shortDescription.trim() || undefined,
            fullDescription: form.fullDescription.trim() || undefined,
            startTime: new Date(form.startTime).toISOString(),
            endTime: new Date(form.endTime).toISOString(),
            locationName: form.locationName.trim() || undefined,
            latitude: form.latitude.trim() || undefined,
            longitude: form.longitude.trim() || undefined,
            isTicketRequired: form.isTicketRequired,
            price: form.price ? Number(form.price) : undefined,
            maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
            thumbnailUrl: form.thumbnailUrl.trim() || undefined,
            tagIds: form.tagIds.length > 0 ? form.tagIds : undefined,
        };

        if (mode === 'edit') {
            (data as UpdateEventRequest).status = form.status as any;
        }

        await onSubmit(data);
    };

    const mapInitialPos = form.latitude && form.longitude
        ? { lat: Number(form.latitude), lng: Number(form.longitude) }
        : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Event Name *</Label>
                            <Input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter event name" maxLength={255} />
                            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="shortDescription">Short Description <span className="text-muted-foreground font-normal">({form.shortDescription.length}/255)</span></Label>
                            <Input id="shortDescription" value={form.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} placeholder="Brief description for card display" maxLength={255} />
                            {errors.shortDescription && <p className="text-xs text-destructive mt-1">{errors.shortDescription}</p>}
                        </div>
                        <div>
                            <Label htmlFor="fullDescription">Full Description</Label>
                            <Textarea id="fullDescription" value={form.fullDescription} onChange={(e) => handleChange('fullDescription', e.target.value)} placeholder="Detailed description..." className="min-h-[200px]" />
                        </div>
                    </CardContent>
                </Card>

                {/* Time & Location */}
                <Card>
                    <CardHeader><CardTitle>Time & Location</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startTime">Start Time *</Label>
                                <Input id="startTime" type="datetime-local" value={form.startTime} onChange={(e) => handleChange('startTime', e.target.value)} />
                                {errors.startTime && <p className="text-xs text-destructive mt-1">{errors.startTime}</p>}
                            </div>
                            <div>
                                <Label htmlFor="endTime">End Time *</Label>
                                <Input id="endTime" type="datetime-local" value={form.endTime} onChange={(e) => handleChange('endTime', e.target.value)} />
                                {errors.endTime && <p className="text-xs text-destructive mt-1">{errors.endTime}</p>}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <Label htmlFor="locationName">Location Name</Label>
                            <Input id="locationName" value={form.locationName} onChange={(e) => handleChange('locationName', e.target.value)} placeholder="e.g. Ngu Hanh Son District" maxLength={255} />
                            {errors.locationName && <p className="text-xs text-destructive mt-1">{errors.locationName}</p>}
                        </div>

                        {/* Map Picker */}
                        <div>
                            <Label>Coordinates</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMapPickerOpen(true)}
                                >
                                    <MapPin className="h-4 w-4 mr-1" />
                                    Pick on Map
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
                            {/* Hidden manual inputs, accessible via clicking coordinates */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <Label htmlFor="latitude" className="text-xs text-muted-foreground">Latitude</Label>
                                    <Input
                                        id="latitude" type="number" step="any"
                                        value={form.latitude}
                                        onChange={(e) => handleChange('latitude', e.target.value)}
                                        placeholder="16.0028"
                                        className="h-8 text-xs"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="longitude" className="text-xs text-muted-foreground">Longitude</Label>
                                    <Input
                                        id="longitude" type="number" step="any"
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

                {/* Tickets & Pricing */}
                <Card>
                    <CardHeader><CardTitle>Tickets & Pricing</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Switch id="isTicketRequired" checked={form.isTicketRequired} onCheckedChange={(v) => handleChange('isTicketRequired', v)} />
                            <Label htmlFor="isTicketRequired">Ticket Required</Label>
                        </div>
                        {form.isTicketRequired && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price (VND)</Label>
                                    <Input id="price" type="number" min={0} value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="50000" />
                                    {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="maxParticipants">Max Participants</Label>
                                    <Input id="maxParticipants" type="number" min={1} value={form.maxParticipants} onChange={(e) => handleChange('maxParticipants', e.target.value)} placeholder="100" />
                                    {errors.maxParticipants && <p className="text-xs text-destructive mt-1">{errors.maxParticipants}</p>}
                                </div>
                            </div>
                        )}
                        {!form.isTicketRequired && (
                            <div>
                                <Label htmlFor="maxParticipants">Max Participants</Label>
                                <Input id="maxParticipants" type="number" min={1} value={form.maxParticipants} onChange={(e) => handleChange('maxParticipants', e.target.value)} placeholder="100" />
                                {errors.maxParticipants && <p className="text-xs text-destructive mt-1">{errors.maxParticipants}</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
                {/* Status (edit only) */}
                {mode === 'edit' && (
                    <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent>
                            <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {EVENT_STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                )}

                {/* Thumbnail */}
                <Card>
                    <CardHeader><CardTitle>Thumbnail {mode === 'create' && '*'}</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {form.thumbnailUrl ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border group">
                                <img src={form.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleChange('thumbnailUrl', '')}
                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
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
                                            <span className="text-xs">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 mb-1" />
                                            <span className="text-xs">Click or drag to upload</span>
                                            <span className="text-[10px] text-muted-foreground/60 mt-0.5">JPG, PNG, GIF, WebP (max 5MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file);
                                e.target.value = ''; // Reset so same file can be selected again
                            }}
                        />

                        {/* Or enter URL manually */}
                        <div>
                            <Label className="text-xs text-muted-foreground">Or enter URL</Label>
                            <Input
                                value={form.thumbnailUrl}
                                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                                placeholder="https://..."
                                className="h-8 text-xs"
                            />
                        </div>
                        {errors.thumbnailUrl && <p className="text-xs text-destructive">{errors.thumbnailUrl}</p>}
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                    <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
                    <CardContent>
                        <TagCombobox selectedTagIds={form.tagIds} onChange={(ids) => handleChange('tagIds', ids)} />
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <div className="lg:col-span-3 flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === 'create' ? 'Create Event' : 'Update Event'}
                </Button>
            </div>

            {/* Map Picker Modal */}
            <MapPickerModal
                open={mapPickerOpen}
                onOpenChange={setMapPickerOpen}
                initialPosition={mapInitialPos}
                onConfirm={handleMapConfirm}
            />
        </div>
    );
}
