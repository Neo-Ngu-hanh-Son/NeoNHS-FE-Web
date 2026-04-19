import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForcedAlignmentWord } from "@/pages/admin/historyAudio/types";
import HistoryAudioPlayer from "./HistoryAudioPlayer";

interface TimingSectionProps {
  hasAudio: boolean;
  audioUrl: string;
  currentTime: number;
  alignedWords: ForcedAlignmentWord[];
  activeWordIndex: number;
  aligningWords: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onGenerateWordTiming: () => void;
}

export default function TimingSection({
  hasAudio,
  audioUrl,
  currentTime,
  alignedWords,
  activeWordIndex,
  aligningWords,
  audioRef,
  onGenerateWordTiming,
}: TimingSectionProps) {
  if (!hasAudio) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. Thời điểm (timing)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Hãy thêm hoặc tạo file âm thanh trước nếu bạn muốn tạo thời điểm theo từng từ.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">3. Thời điểm (timing)</CardTitle>
      </CardHeader>
      <CardContent>
        <HistoryAudioPlayer
          audioUrl={audioUrl}
          currentTime={currentTime}
          alignedWords={alignedWords}
          activeWordIndex={activeWordIndex}
          aligningWords={aligningWords}
          audioRef={audioRef}
          onGenerateWordTiming={onGenerateWordTiming}
        />
      </CardContent>
    </Card>
  );
}
