import { useEffect, useState } from 'react';

interface NetflixIntroProps {
  onEnd: () => void;
}

function NetflixIntro({ onEnd }: NetflixIntroProps) {
  const [stage, setStage] = useState<'fade-in' | 'glow' | 'fade-out'>('fade-in');

  useEffect(() => {
    const audio = new Audio('/audio/tudum.mp3');
    audio.volume = 0.7;

    audio.play().catch(err => {
      console.warn('Audio autoplay blocked:', err);
    });

    const fadeInTimer = setTimeout(() => {
      setStage('glow');
    }, 800);

    const glowTimer = setTimeout(() => {
      setStage('fade-out');
    }, 2000);

    const endTimer = setTimeout(() => {
      onEnd();
    }, 2500);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(glowTimer);
      clearTimeout(endTimer);
      audio.pause();
    };
  }, [onEnd]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div
        className={`relative text-center transition-all duration-700 ${
          stage === 'fade-in'
            ? 'opacity-0 scale-95'
            : stage === 'glow'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-105'
        }`}
      >
        <h1
          className={`text-7xl md:text-9xl font-bold tracking-tight transition-all duration-500 ${
            stage === 'glow' ? 'animate-pulse-red' : ''
          }`}
          style={{
            color: '#E50914',
            textShadow:
              stage === 'glow'
                ? '0 0 40px rgba(229, 9, 20, 0.8), 0 0 80px rgba(229, 9, 20, 0.4)'
                : 'none',
            letterSpacing: stage === 'glow' ? '0.05em' : '0.15em',
          }}
        >
          SHAMS ORIGINALS
        </h1>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            stage === 'glow' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(229, 9, 20, 0.1) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

export default NetflixIntro;
