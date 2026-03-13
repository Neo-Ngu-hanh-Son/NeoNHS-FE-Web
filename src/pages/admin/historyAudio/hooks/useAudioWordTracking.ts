import { useCallback, useEffect, useRef, useState } from "react";
import type { ForcedAlignmentWord } from "../types";

interface UseAudioWordTrackingParams {
  alignedWords: ForcedAlignmentWord[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function useAudioWordTracking({
  alignedWords,
  audioRef,
}: UseAudioWordTrackingParams) {
  const pointerRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);

  const stopTracking = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const getPointerAtTime = useCallback(
    (time: number) => {
      let left = 0;
      let right = alignedWords.length - 1;
      let result = 0;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (alignedWords[mid].start <= time) {
          result = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      return result;
    },
    [alignedWords],
  );

  const updateActive = useCallback(
    (pointer: number) => {
      const isWhitespace = alignedWords[pointer]?.text.trim().length === 0;
      setActiveWordIndex(isWhitespace ? -1 : pointer);
    },
    [alignedWords],
  );

  const trackAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || alignedWords.length === 0) {
      rafRef.current = null;
      return;
    }

    const time = audio.currentTime;
    setCurrentTime(time);

    let pointer = pointerRef.current;

    if (pointer >= alignedWords.length) {
      pointer = alignedWords.length - 1;
    }

    if (time < alignedWords[pointer].start) {
      pointer = getPointerAtTime(time);
    } else {
      while (pointer < alignedWords.length - 1 && time >= alignedWords[pointer + 1].start) {
        pointer++;
      }
    }

    if (pointer !== pointerRef.current) {
      pointerRef.current = pointer;
      updateActive(pointer);
    }

    rafRef.current = requestAnimationFrame(trackAudio);
  }, [alignedWords, audioRef, getPointerAtTime, updateActive]);

  const resetTracking = useCallback(() => {
    pointerRef.current = 0;
    setActiveWordIndex(-1);
    setCurrentTime(0);
    stopTracking();
  }, [stopTracking]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || alignedWords.length === 0) return;

    const startTracking = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(trackAudio);
      }
    };

    const onPause = () => stopTracking();
    const onEnded = () => stopTracking();

    const onSeeked = () => {
      const time = audio.currentTime;
      const pointer = getPointerAtTime(time);
      pointerRef.current = pointer;
      updateActive(pointer);
      setCurrentTime(time);
    };

    audio.addEventListener("play", startTracking);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("seeked", onSeeked);

    if (!audio.paused) {
      startTracking();
    }

    return () => {
      audio.removeEventListener("play", startTracking);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("seeked", onSeeked);
      stopTracking();
    };
  }, [alignedWords, audioRef, getPointerAtTime, stopTracking, trackAudio, updateActive]);

  return {
    activeWordIndex,
    currentTime,
    resetTracking,
  };
}
