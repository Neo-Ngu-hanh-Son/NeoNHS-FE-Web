import { useEffect, useMemo, useState } from 'react';
import { adminPanoramaService } from '@/services/api/panoramaService';
import type { LinkingPanoramaItemResponse, LinkingPanoramaResponse } from '@/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface LinkingPanoramaComboboxProps {
  currentPanoramaId: string | null;
  value: string;
  onChange: (panoramaId: string) => void;
  disabled?: boolean;
}

interface LinkingPanoramaOption extends LinkingPanoramaItemResponse {
  pointName: string;
  pointId: string;
  searchValue: string;
}

interface LinkingPanoramaGroup {
  value: string;
  pointName: string;
  items: LinkingPanoramaOption[];
}

export default function LinkingPanoramaCombobox({
  currentPanoramaId,
  value,
  onChange,
  disabled = false,
}: LinkingPanoramaComboboxProps) {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<LinkingPanoramaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<LinkingPanoramaOption | null>(null);

  // Fetch linking panoramas
  useEffect(() => {
    if (!currentPanoramaId) {
      setGroups([]);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await adminPanoramaService.getLinkingPanoramas(currentPanoramaId);
        if (!cancelled) {
          setGroups(data);
        }
      } catch (error) {
        if (!cancelled) {
          setGroups([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [currentPanoramaId]);

  // Transform raw data into grouped options
  const comboboxGroups = useMemo<LinkingPanoramaGroup[]>(() => {
    return groups
      .map((group) => {
        const panoramas = Array.isArray(group.panoramas) ? group.panoramas : [];

        const options = panoramas
          .filter((panorama) => panorama?.id && panorama.id !== currentPanoramaId)
          .map((panorama) => ({
            ...panorama,
            pointName: group.pointName ?? '',
            pointId: group.pointId ?? '',
            searchValue: `${panorama.title ?? ''} ${group.pointName ?? ''}`.trim(),
          }));

        return {
          value: group.pointId || group.pointName || 'unknown-point',
          pointName: group.pointName || 'Điểm chưa đặt tên',
          items: options,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, currentPanoramaId]);

  const allOptions = useMemo(() => comboboxGroups.flatMap((group) => group.items), [comboboxGroups]);

  const selectedOption = useMemo(() => allOptions.find((option) => option.id === value) ?? null, [allOptions, value]);

  const isDisabled = disabled || loading || !currentPanoramaId;

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isDisabled}
            className={cn('w-full justify-between font-normal', !selectedOption && 'text-muted-foreground')}
          >
            {selectedOption ? selectedOption.title : 'Tìm theo tên panorama hoặc điểm đến'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        {/* Note: overflow-visible is required so the absolute preview image isn't clipped */}
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 overflow-visible relative" align="start">
          <Command>
            <CommandInput placeholder="Tìm panorama..." />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                {loading ? 'Đang tải danh sách panorama...' : 'Không tìm thấy panorama phù hợp.'}
              </CommandEmpty>

              {comboboxGroups.map((group, index) => (
                <div key={group.value}>
                  <CommandGroup heading={group.pointName}>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.searchValue} // Used by Command for filtering
                        onSelect={() => {
                          onChange(item.id);
                          setOpen(false);
                          setHoveredOption(null); // Clear preview on select
                        }}
                        onMouseEnter={() => setHoveredOption(item)}
                        onMouseLeave={() => setHoveredOption(null)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn('mr-2 h-4 w-4 shrink-0', value === item.id ? 'opacity-100' : 'opacity-0')}
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.pointName}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {index < comboboxGroups.length - 1 && <CommandSeparator />}
                </div>
              ))}
            </CommandList>
          </Command>

          {/* Side Image Preview */}
          {hoveredOption && (
            <div className="pointer-events-none absolute top-0 left-[calc(100%+0.5rem)] w-56 animate-in fade-in zoom-in-95 rounded-lg border bg-popover p-2 shadow-lg z-50">
              <img
                src={hoveredOption.panoramaImageUrl}
                alt={hoveredOption.title}
                className="h-28 w-full rounded-md object-cover bg-muted"
              />
              <p className="mt-2 truncate text-xs font-medium">{hoveredOption.title}</p>
              <p className="text-[11px] text-muted-foreground">{hoveredOption.pointName}</p>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Helper / Status Messages */}
      {!currentPanoramaId && (
        <p className="text-xs text-muted-foreground">Vui lòng lưu panorama hiện tại trước khi tạo hotspot dạng LINK.</p>
      )}
    </div>
  );
}
