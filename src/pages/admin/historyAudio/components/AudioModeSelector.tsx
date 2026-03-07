import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AudioModeSelectorProps {
  currentMode: "generate" | "upload" | null;
  onChooseGenerate: () => void;
  onChooseUpload: () => void;
}

export default function AudioModeSelector({
  currentMode,
  onChooseGenerate,
  onChooseUpload,
}: AudioModeSelectorProps) {
  const handleValueChange = (value: string) => {
    if (value === "generate") {
      onChooseGenerate();
      return;
    }
    if (value === "upload") {
      onChooseUpload();
    }
  };

  return (
    <div className="mb-6">
      <Tabs value={currentMode ?? ""} onValueChange={handleValueChange}>
        <TabsList className="grid h-auto w-full grid-cols-1 gap-1 p-1 md:grid-cols-2">
          <TabsTrigger value="generate" className="py-2">
            Generate Audio From Text (AI)
          </TabsTrigger>
          <TabsTrigger value="upload" className="py-2">
            Upload History Audio And Script
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
