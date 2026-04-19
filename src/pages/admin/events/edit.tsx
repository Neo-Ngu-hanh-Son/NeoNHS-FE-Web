import { useParams, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { EventForm } from './components/EventForm';
import { useEvent, useUpdateEvent } from '@/hooks/event';
import type { UpdateEventRequest } from '@/types/event';

export default function EventEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { event, loading: fetchLoading } = useEvent(id!);
    const { updateEvent, loading: submitLoading } = useUpdateEvent();

    const handleSubmit = async (data: UpdateEventRequest, file?: File) => {
        const result = await updateEvent(id!, data, file);
        if (result) {
            navigate(`/admin/events/${id}`);
        }
    };

    if (fetchLoading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-80" />
                        <Skeleton className="h-48" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-48" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Event</h1>
                <p className="text-muted-foreground text-sm mt-1">Update the event details below.</p>
            </div>
            <EventForm mode="edit" initialData={event} onSubmit={handleSubmit as any} loading={submitLoading} />
        </div>
    );
}
