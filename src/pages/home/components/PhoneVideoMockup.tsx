import { useRef, useEffect, useState, useCallback } from 'react';

const VIDEO_SRC =
  'https://res.cloudinary.com/dv1zgaj5y/video/upload/v1776095885/Screen_recording_20260413_225109_gfuaio.mp4';

const POSTER_SRC =
  'https://res.cloudinary.com/dv1zgaj5y/video/upload/so_0/v1776095885/Screen_recording_20260413_225109_gfuaio.jpg';

export function PhoneVideoMockup() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleVideoEnd = useCallback(() => {
    setShowWhiteFlash(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      setShowWhiteFlash(false);
    }, 300);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      return () => video.removeEventListener('ended', handleVideoEnd);
    }
  }, [handleVideoEnd]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  return (
    <div ref={containerRef} className="phone-mockup">
      <div className="phone-mockup-screen relative">
        <video
          ref={videoRef}
          src={isVisible ? VIDEO_SRC : undefined}
          poster={POSTER_SRC}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 bg-white dark:bg-slate-900 transition-opacity duration-150 pointer-events-none ${
            showWhiteFlash ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
}
