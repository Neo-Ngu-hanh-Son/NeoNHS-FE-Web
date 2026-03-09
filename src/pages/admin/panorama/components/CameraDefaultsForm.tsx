import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, RotateCcw } from "lucide-react";

interface CameraDefaultsFormProps {
  /** Whether the admin has explicitly set a custom default view */
  hasCustomView: boolean;
  /** Trigger view-selection mode in the panorama preview */
  onSetDefaultView: () => void;
  /** Reset to the default center view (0, 0) */
  onResetView: () => void;
  /** Whether the panorama image URL has been set (needed to enable the button) */
  hasImage: boolean;
}

export default function CameraDefaultsForm({
  hasCustomView,
  onSetDefaultView,
  onResetView,
  hasImage,
}: CameraDefaultsFormProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold">Default Starting View</h2>
        {hasCustomView ? (
          <Badge variant="default" className="font-normal text-xs">
            Custom view set
          </Badge>
        ) : (
          <p className="text-xs text-muted-foreground italic">Using default center view</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Choose the first angle visitors see when they open this panorama.
        </p>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={!hasImage}
            onClick={onSetDefaultView}
          >
            <Camera className="h-4 w-4" />
            {hasCustomView ? "Change Starting View" : "Set Starting View"}
          </Button>

          {hasCustomView && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              onClick={onResetView}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
