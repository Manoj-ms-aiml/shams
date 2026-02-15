import { useEffect, useRef } from 'react';
import { resolveMediaPath } from '../utils/media';

function FinalScene() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.75;
    audio.play().catch((err) => {
      console.warn('Audio playback blocked:', err);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <audio ref={audioRef} preload="auto">
        <source src={resolveMediaPath('audio/finale.mp3')} type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 bg-gradient-to-br from-[#05120f] via-[#0a1815] to-[#170d13]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(82,255,189,0.16),transparent_45%)]" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(110deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 11px)',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="friend-stage relative h-64 w-72 sm:h-72 sm:w-96">
          <div className="friend-floor-glow" />

          <div className="friend-person friend-left">
            <span className="friend-head" />
            <span className="friend-body" />
          </div>

          <div className="friend-person friend-right">
            <span className="friend-head" />
            <span className="friend-body" />
          </div>
        </div>

        <p className="mt-8 text-sm tracking-[0.24em] text-emerald-200/75">TRUE FRIENDSHIP LASTS</p>
        <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-white sm:text-4xl">
          Real friends stay, no matter what.
        </h1>
      </div>

      <style>{`
        .friend-stage {
          animation: crowd-energy 2.8s ease-in-out infinite;
        }

        .friend-floor-glow {
          position: absolute;
          left: 50%;
          bottom: 10px;
          width: 230px;
          height: 90px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: radial-gradient(circle, rgba(90, 255, 189, 0.34), rgba(0, 0, 0, 0) 68%);
          filter: blur(2px);
        }

        .friend-person {
          position: absolute;
          bottom: 16px;
          width: 96px;
          height: 182px;
        }

        .friend-left {
          left: 46px;
          transform-origin: right bottom;
          animation: friend-dance-left 2.75s cubic-bezier(0.22, 0.88, 0.2, 1) infinite;
        }

        .friend-right {
          right: 46px;
          transform-origin: left bottom;
          animation: friend-dance-right 3.15s cubic-bezier(0.22, 0.88, 0.2, 1) infinite;
          animation-delay: 0.18s;
        }

        .friend-head {
          position: absolute;
          left: 50%;
          top: 0;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(247, 231, 212, 0.96), rgba(215, 192, 165, 0.96));
        }

        .friend-body {
          position: absolute;
          left: 50%;
          top: 30px;
          width: 78px;
          height: 130px;
          border-radius: 34px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, rgba(33, 183, 124, 0.94), rgba(16, 116, 79, 0.96));
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.14);
        }

        @keyframes crowd-energy {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes friend-dance-left {
          0%, 100% {
            transform: translateX(0) rotate(-2deg);
          }
          16% {
            transform: translateX(-4px) rotate(-6deg);
          }
          34% {
            transform: translateX(5px) rotate(2deg);
          }
          52% {
            transform: translateX(-2px) rotate(-4deg);
          }
          75% {
            transform: translateX(7px) rotate(5deg);
          }
          88% {
            transform: translateX(2px) rotate(0deg);
          }
        }

        @keyframes friend-dance-right {
          0%, 100% {
            transform: translateX(0) rotate(3deg);
          }
          22% {
            transform: translateX(4px) rotate(7deg);
          }
          38% {
            transform: translateX(-5px) rotate(1deg);
          }
          58% {
            transform: translateX(3px) rotate(5deg);
          }
          74% {
            transform: translateX(-6px) rotate(-1deg);
          }
          90% {
            transform: translateX(-1px) rotate(2deg);
          }
        }

      `}</style>
    </div>
  );
}

export default FinalScene;
