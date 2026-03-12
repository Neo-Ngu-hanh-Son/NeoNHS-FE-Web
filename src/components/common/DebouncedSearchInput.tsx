import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DebouncedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delayMs?: number;
  className?: string;
  inputClassName?: string;
}

export default function DebouncedSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  delayMs = 400,
  className,
  inputClassName,
}: DebouncedSearchInputProps) {
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (draftValue !== value) {
        onChange(draftValue);
      }
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [draftValue, delayMs, onChange, value]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={draftValue}
        onChange={(e) => setDraftValue(e.target.value)}
        className={cn("pl-9", inputClassName)}
        placeholder={placeholder}
      />
    </div>
  );
}
