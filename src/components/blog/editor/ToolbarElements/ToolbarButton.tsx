import { Button } from "@/components/common";
import TooltipWrapper from "@/components/common/TooltipWrapper";

// --- Toolbar Button ---
type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

export default function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <TooltipWrapper content={title}>
      <Button
        variant="outline"
        size={"icon-sm"}
        className={`${isActive ? "!bg-primary/80 !border-primary/80 !text-primary-foreground" : ""}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={title}
      >
        {children}
      </Button>
    </TooltipWrapper>
  );
}
