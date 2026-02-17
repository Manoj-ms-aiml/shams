import { useEffect, useRef, useState } from 'react';
import { resolveMediaPath } from '../utils/media';

interface PrologueVideoProps {
  onEnd: () => void;
}

function PrologueVideo({ onEnd }: PrologueVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(err => {
      console.warn('Video autoplay blocked:', err);
    });

    const handleTimeUpdate = () => {
      if (video.duration - video.currentTime <= 1) {
        setFadeOut(true);
      }
    };

    const handleEnded = () => {
      setTimeout(onEnd, 500);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnd]);

  return (
    <div className="fixed inset-0 bg-black">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
        playsInline
        preload="auto"
      >
        <source src={resolveMediaPath('videos/prologue.mp4')} type="video/mp4" />
      </video>

      <div
        className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 ${
          fadeOut ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default PrologueVideo;
