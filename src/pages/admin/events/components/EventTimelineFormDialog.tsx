import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import type {
    EventTimelineResponse,
    CreateEventTimelineRequest,
    UpdateEventTimelineRequest,
} from '@/types/eventTimeline';

interface EventTimelineFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    timeline?: EventTimelineResponse | null;
    onSubmit: (data: CreateEventTimelineRequest | UpdateEventTimelineRequest) => Promise<boolean>;
    /** Optional: pre-fill date when creating from a specific date tab */
    defaultDate?: string;
}

interface FormData {
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    organizer: string;
    location: string;
}

const emptyForm: FormData = {
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    organizer: '',
    location: '',
};

export function EventTimelineFormDialog({ open, onOpenChange, timeline, onSubmit, defaultDate }: EventTimelineFormDialogProps) {
    const [form, setForm] = useState<FormData>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const isEdit = !!timeline;

    useEffect(() => {
        if (timeline) {
            setForm({
                name: timeline.name || '',
                description: timeline.description || '',
                date: timeline.date || '',
                startTime: timeline.startTime || '',
                endTime: timeline.endTime || '',
                organizer: timeline.organizer || '',
                location: timeline.location || '',
            });
        } else {
            setForm({
                ...emptyForm,
                date: defaultDate || '',
            });
        }
        setErrors({});
    }, [timeline, open, defaultDate]);

    const handleChange = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.date) newErrors.date = 'Date is required';
        if (!form.startTime) newErrors.startTime = 'Start time is required';
        if (!form.endTime) newErrors.endTime = 'End time is required';
        if (form.startTime && form.endTime && form.startTime >= form.endTime) {
            newErrors.endTime = 'End time must be after start time';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        const data: CreateEventTimelineRequest = {
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            organizer: form.organizer.trim() || undefined,
            location: form.location.trim() || undefined,
        };

        const success = await onSubmit(data);
        setLoading(false);
        if (success) onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Timeline Entry' : 'Add Timeline Entry'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update the timeline entry details.' : 'Create a new timeline entry for this event.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <Label htmlFor="tl-name">Name *</Label>
                        <Input
                            id="tl-name"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. Opening Ceremony"
                        />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="tl-date">Date *</Label>
                        <Input
                            id="tl-date"
                            type="date"
                            value={form.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                        />
                        {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="tl-startTime">Start Time *</Label>
                            <Input
                                id="tl-startTime"
                                type="time"
                                value={form.startTime}
                                onChange={(e) => handleChange('startTime', e.target.value)}
                            />
                            {errors.startTime && <p className="text-xs text-destructive mt-1">{errors.startTime}</p>}
                        </div>
                        <div>
                            <Label htmlFor="tl-endTime">End Time *</Label>
                            <Input
                                id="tl-endTime"
                                type="time"
                                value={form.endTime}
                                onChange={(e) => handleChange('endTime', e.target.value)}
                            />
                            {errors.endTime && <p className="text-xs text-destructive mt-1">{errors.endTime}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="tl-location">Location</Label>
                        <Input
                            id="tl-location"
                            value={form.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            placeholder="e.g. Main Hall, Chùa Quán Thế Âm"
                        />
                    </div>

                    <div>
                        <Label htmlFor="tl-organizer">Organizer</Label>
                        <Input
                            id="tl-organizer"
                            value={form.organizer}
                            onChange={(e) => handleChange('organizer', e.target.value)}
                            placeholder="e.g. UBND TP Đà Nẵng"
                        />
                    </div>

                    <div>
                        <Label htmlFor="tl-desc">Description</Label>
                        <Textarea
                            id="tl-desc"
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Brief description of this activity..."
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
