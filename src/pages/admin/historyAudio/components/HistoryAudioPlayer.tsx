import type { ForcedAlignmentWord } from "@/pages/admin/historyAudio/types";
import PlaybackAndTimingSection from "@/pages/admin/historyAudio/components/PlaybackAndTimingSection";

interface HistoryAudioPlayerProps {
  audioUrl: string;
  currentTime: number;
  alignedWords: ForcedAlignmentWord[];
  activeWordIndex: number;
  aligningWords: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onGenerateWordTiming: () => void;
}

export default function HistoryAudioPlayer(props: HistoryAudioPlayerProps) {
  return <PlaybackAndTimingSection {...props} />;
}
