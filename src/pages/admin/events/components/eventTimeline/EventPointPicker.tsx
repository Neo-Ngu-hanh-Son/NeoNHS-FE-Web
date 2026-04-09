import { Button } from '@/components';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { EventPointResponse } from '@/types';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

type Props = {
  points: EventPointResponse[];
  onPointSelect: (pointId: string) => void;
  selectedPointId?: string;
};

export default function EventPointPicker({ points, onPointSelect, selectedPointId }: Props) {
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <Popover onOpenChange={setOpenPopover} open={openPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('w-full justify-between font-normal')}
          aria-expanded={openPopover}
        >
          {points.find((p) => p.id === selectedPointId)?.name || 'Select event point...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search event points..." />
          <CommandList>
            <CommandEmpty>No event points found.</CommandEmpty>
            <CommandGroup>
              {points.map((point) => (
                <CommandItem
                  key={point.id}
                  value={point.name} // Command uses this for searching
                  onSelect={() => {
                    onPointSelect(point.id);
                    setOpenPopover(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check className={cn('mr-2 h-4 w-4', point.id === selectedPointId ? 'opacity-100' : 'opacity-0')} />
                  {point.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
