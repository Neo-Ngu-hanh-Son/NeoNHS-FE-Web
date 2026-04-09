import { Input, Label, Textarea } from '@/components/ui';
import dayjs from 'dayjs';
import { FormData } from '../../type';

type Props = {
  form: {
    name: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    organizer: string;
    coOrganizer: string;
  };
  errors: {
    name?: string;
    description?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    organizer?: string;
    coOrganizer?: string;
  };
  eventStartDate?: string;
  eventEndDate?: string;
  handleChange: (field: keyof FormData, value: string) => void;
};

export default function EventTimeLineCreationTab({ form, errors, eventStartDate, eventEndDate, handleChange }: Props) {
  return (
    <div className="space-y-4 py-2">
      <div className="border-b pb-2">
        <h3 className="text-sm font-semibold">Event Timeline Details</h3>
      </div>
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
          min={eventStartDate ? dayjs(eventStartDate).format('YYYY-MM-DD') : undefined}
          max={eventEndDate ? dayjs(eventEndDate).format('YYYY-MM-DD') : undefined}
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
        <Label htmlFor="tl-organizer">Organizer</Label>
        <Input
          id="tl-organizer"
          value={form.organizer}
          onChange={(e) => handleChange('organizer', e.target.value)}
          placeholder="e.g. UBND TP Đà Nẵng"
        />
        {errors.organizer && <p className="text-xs text-destructive mt-1">{errors.organizer}</p>}
      </div>

      <div>
        <Label htmlFor="tl-co-organizer">Co-organizer</Label>
        <Input
          id="tl-co-organizer"
          value={form.coOrganizer}
          onChange={(e) => handleChange('coOrganizer', e.target.value)}
          placeholder="e.g. NeoNHS Youth Union"
        />
        {errors.coOrganizer && <p className="text-xs text-destructive mt-1">{errors.coOrganizer}</p>}
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
  );
}
