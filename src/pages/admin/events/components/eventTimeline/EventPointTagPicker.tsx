import { Button } from '@/components';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { EventPointTagResponse } from '@/types/eventTimeline';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

type Props = {
  tags: EventPointTagResponse[];
  onTagSelect: (tagId: string) => void;
  selectedTagId?: string;
};

export default function EventPointTagPicker({ tags, onTagSelect, selectedTagId }: Props) {
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
          {tags.find((tag) => tag.id === selectedTagId)?.name || 'Select event point tag...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search event point tags..." />
          <CommandList>
            <CommandEmpty>No event point tags found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name || ''}
                  onSelect={() => {
                    if (!tag.id) return;
                    onTagSelect(tag.id);
                    setOpenPopover(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check className={cn('mr-2 h-4 w-4', tag.id === selectedTagId ? 'opacity-100' : 'opacity-0')} />
                  {tag.name || 'Unnamed tag'}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
