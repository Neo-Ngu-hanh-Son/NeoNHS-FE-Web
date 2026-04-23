import { useEffect, useMemo, useRef } from 'react';
import type { ForcedAlignmentWord } from '@/pages/admin/historyAudio/types';
import { useAudioWordTracking } from '@/pages/admin/historyAudio/hooks/useAudioWordTracking';
import TimingSection from '@/pages/admin/historyAudio/components/TimingSection';

interface QuickCreateEntryTimingSectionProps {
  audioUrl?: string;
  script: string;
  words?: ForcedAlignmentWord[];
}

export default function QuickCreateEntryTimingSection({
  audioUrl,
  script,
  words = [],
}: QuickCreateEntryTimingSectionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const alignedWords = useMemo(() => words, [words]);
  const { activeWordIndex, currentTime, resetTracking } = useAudioWordTracking({
    alignedWords,
    audioRef,
  });

  useEffect(() => {
    resetTracking();
  }, [audioUrl, alignedWords, resetTracking]);

  const hasTimingPreview = Boolean(audioUrl && script.trim());
  if (!hasTimingPreview) {
    return null;
  }

  return (
    <TimingSection
      title="Nghe âm thanh và kiểm tra thời điểm (preview)"
      hasAudio={hasTimingPreview}
      audioUrl={audioUrl ?? ''}
      currentTime={currentTime}
      alignedWords={alignedWords}
      activeWordIndex={activeWordIndex}
      aligningWords={false}
      audioRef={audioRef}
      onGenerateWordTiming={() => {}}
      showGenerateWordTimingButton={false}
    />
  );
}
