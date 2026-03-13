import { Button } from "@/components/common";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { BlockType, BLOCK_TYPES } from "../../type";

// --- Block Type Dropdown ---
type BlockTypeDropdownProps = {
  blockType: BlockType;
  onChange: (type: BlockType) => void;
};

export default function BlockTypeDropdown({ blockType, onChange }: BlockTypeDropdownProps) {
  const currentLabel =
    BLOCK_TYPES.find((b) => b.value === blockType)?.label ?? 'Normal';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 min-w-[150px] justify-start"
          title="Block type"
        >
          <span>{currentLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-[180px]"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        {BLOCK_TYPES.map((bt) => (
          <DropdownMenuItem
            key={bt.value}
            onSelect={() => onChange(bt.value)}
            className={blockType === bt.value ? "bg-accent" : ""}
          >
            {bt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}