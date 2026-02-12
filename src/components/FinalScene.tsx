import { useEffect, useState, useRef } from 'react';

function FinalScene() {
  const [stage, setStage] = useState<'bloom' | 'message' | 'fade'>('bloom');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(err => {
        console.warn('Audio playback blocked:', err);
      });
    }

    const bloomTimer = setTimeout(() => {
      setStage('message');
    }, 2000);

    const fadeTimer = setTimeout(() => {
      setStage('fade');
    }, 12000);

    return () => {
      clearTimeout(bloomTimer);
      clearTimeout(fadeTimer);
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/finale.mp3" type="audio/mpeg" />
      </audio>

      <div
        className={`absolute inset-0 transition-all duration-2000 ${
          stage === 'bloom' ? 'blur-lg' : stage === 'message' ? 'blur-0' : 'blur-sm'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-2000 ${
            stage === 'message' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="max-w-4xl px-8 text-center">
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
              }}
            >
              YOU'RE NOT ALONE.
            </h1>
            <h2
              className="text-4xl md:text-6xl font-bold text-white/90"
              style={{
                textShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
              }}
            >
              NEVER WERE.
            </h2>
          </div>
        </div>

        <div
          className={`absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent transition-opacity duration-3000 ${
            stage === 'bloom' ? 'opacity-100 scale-150' : 'opacity-0 scale-100'
          }`}
          style={{
            transform: stage === 'bloom' ? 'scale(1.5)' : 'scale(1)',
            transition: 'all 3s ease-out',
          }}
        />
      </div>

      <div
        className={`absolute inset-0 bg-black transition-opacity duration-5000 ${
          stage === 'fade' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) translateX(15px) scale(1.5);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default FinalScene;
