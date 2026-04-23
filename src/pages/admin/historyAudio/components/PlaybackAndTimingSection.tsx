import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, WandSparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ForcedAlignmentWord } from '../types';

interface PlaybackAndTimingSectionProps {
  audioUrl: string;
  currentTime: number;
  alignedWords: ForcedAlignmentWord[];
  activeWordIndex: number;
  aligningWords: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onGenerateWordTiming: () => void;
  showGenerateWordTimingButton?: boolean;
}

export default function PlaybackAndTimingSection({
  audioUrl,
  currentTime,
  alignedWords,
  activeWordIndex,
  aligningWords,
  audioRef,
  onGenerateWordTiming,
  showGenerateWordTimingButton = true,
}: PlaybackAndTimingSectionProps) {
  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} controls className="w-full" />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {currentTime.toFixed(2)} giây
      </div>

      {showGenerateWordTimingButton ? (
        <Button variant="outline" onClick={onGenerateWordTiming} disabled={aligningWords}>
          {aligningWords ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <WandSparkles className="mr-2 h-4 w-4" />
          )}
          Tạo lời thoại
        </Button>
      ) : null}

      {alignedWords.length > 0 && (
        <div className="max-h-[260px] overflow-y-auto rounded-lg border bg-muted/20 p-3">
          <div className="flex flex-wrap gap-x-1 gap-y-2 leading-7">
            {alignedWords.map((word, index) => {
              const isActive = word.text.trim().length > 0 && index === activeWordIndex;
              return (
                <span
                  key={`${word.start}-${word.end}-${index}`}
                  className={cn(
                    'inline-flex items-center rounded py-0.5 transition-colors',
                    isActive ? 'bg-emerald-200 text-emerald-900' : 'bg-transparent',
                  )}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
