import { useNavigate } from 'react-router-dom';
import { EventForm } from './components/EventForm';
import { useCreateEvent } from '@/hooks/useCreateEvent';
import type { CreateEventRequest } from '@/types/event';

export default function EventCreatePage() {
    const navigate = useNavigate();
    const { createEvent, loading } = useCreateEvent();

    const handleSubmit = async (data: CreateEventRequest) => {
        const result = await createEvent(data);
        if (result) {
            navigate('/admin/events');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create Event</h1>
                <p className="text-muted-foreground text-sm mt-1">Create a new event by filling in the details below.</p>
            </div>
            <EventForm mode="create" onSubmit={handleSubmit as any} loading={loading} />
        </div>
    );
}
