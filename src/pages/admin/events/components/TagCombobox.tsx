import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTags } from '@/hooks/useTags';

interface TagComboboxProps {
    selectedTagIds: string[];
    onChange: (tagIds: string[]) => void;
    className?: string;
}

export function TagCombobox({ selectedTagIds, onChange, className }: TagComboboxProps) {
    const [open, setOpen] = useState(false);
    const { tags, loading } = useTags();

    const toggleTag = (tagId: string) => {
        if (selectedTagIds.includes(tagId)) {
            onChange(selectedTagIds.filter((id) => id !== tagId));
        } else {
            onChange([...selectedTagIds, tagId]);
        }
    };

    const removeTag = (tagId: string) => {
        onChange(selectedTagIds.filter((id) => id !== tagId));
    };

    const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));

    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal h-10"
                    >
                        <span className="truncate text-muted-foreground">
                            {selectedTagIds.length > 0
                                ? `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? 's' : ''} selected`
                                : 'Select tags...'}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandList>
                            <CommandEmpty>{loading ? 'Loading...' : 'No tags found.'}</CommandEmpty>
                            <CommandGroup>
                                {tags.map((tag) => (
                                    <CommandItem
                                        key={tag.id}
                                        value={tag.name}
                                        onSelect={() => toggleTag(tag.id)}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedTagIds.includes(tag.id) ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        <span
                                            className="h-3 w-3 rounded-full mr-2 shrink-0"
                                            style={{ backgroundColor: tag.tagColor || '#888' }}
                                        />
                                        {tag.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected tags display */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs gap-1 pr-1"
                            style={tag.tagColor ? { backgroundColor: tag.tagColor + '20', color: tag.tagColor } : undefined}
                        >
                            {tag.name}
                            <button
                                type="button"
                                onClick={() => removeTag(tag.id)}
                                className="ml-0.5 rounded-full hover:bg-black/10 p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
