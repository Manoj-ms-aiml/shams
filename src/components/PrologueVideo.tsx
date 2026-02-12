import { useEffect, useRef, useState } from 'react';

interface PrologueVideoProps {
  onEnd: () => void;
}

function PrologueVideo({ onEnd }: PrologueVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(err => {
      console.warn('Video autoplay blocked:', err);
    });

    const handleTimeUpdate = () => {
      if (video.currentTime >= 3) {
        setCanSkip(true);
      }

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

  const handleSkip = () => {
    if (canSkip) {
      setFadeOut(true);
      setTimeout(onEnd, 500);
    }
  };

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
        <source src="/videos/prologue.mp4" type="video/mp4" />
      </video>

      {canSkip && (
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300"
        >
          Skip
        </button>
      )}

      <div
        className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 ${
          fadeOut ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default PrologueVideo;
