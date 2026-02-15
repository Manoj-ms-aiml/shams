import { useEffect, useState } from 'react';

interface SeasonBackgroundProps {
  season: number;
  fadeOut: boolean;
}

function SeasonBackground({ season, fadeOut }: SeasonBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number; size: number }>>([]);
  const [symbols, setSymbols] = useState<Array<{ id: number; x: number; y: number; symbol: 'O' | '△' | '□'; delay: number; duration: number }>>([]);

  useEffect(() => {
    const particleCount = season === 2 ? 34 : 26;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 4 + Math.random() * 7,
    }));
    setParticles(newParticles);

    const symbolSet: Array<'O' | '△' | '□'> = ['O', '△', '□'];
    const newSymbols = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: 4 + Math.random() * 92,
      y: 10 + Math.random() * 80,
      symbol: symbolSet[i % symbolSet.length],
      delay: Math.random() * 2,
      duration: 5 + Math.random() * 4,
    }));
    setSymbols(newSymbols);
  }, [season]);

  const getBackgroundStyle = () => {
    switch (season) {
      case 1:
        return {
          background: 'radial-gradient(circle at 20% 20%, rgba(255, 73, 131, 0.15), transparent 35%), linear-gradient(140deg, #07140f 0%, #0d1f1a 46%, #231024 100%)',
        };
      case 2:
        return {
          background: 'radial-gradient(circle at 75% 18%, rgba(76, 255, 170, 0.14), transparent 34%), linear-gradient(135deg, #0b1d17 0%, #121b1f 50%, #2b1028 100%)',
        };
      case 3:
        return {
          background: 'radial-gradient(circle at 35% 85%, rgba(255, 82, 132, 0.12), transparent 36%), linear-gradient(132deg, #0d1713 0%, #112525 48%, #351232 100%)',
        };
      case 4:
        return {
          background: 'radial-gradient(circle at 50% 10%, rgba(255, 49, 96, 0.2), transparent 46%), linear-gradient(132deg, #050807 0%, #110f13 42%, #2d0d16 100%)',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        };
    }
  };

  const getParticleStyle = (season: number) => {
    switch (season) {
      case 1:
        return 'bg-emerald-300/28';
      case 2:
        return 'bg-fuchsia-300/35';
      case 3:
        return 'bg-emerald-200/25';
      case 4:
        return 'bg-rose-300/24';
      default:
        return 'bg-white/20';
    }
  };

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={getBackgroundStyle()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 9px)',
          mixBlendMode: 'overlay',
          opacity: 0.3,
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${getParticleStyle(season)} blur-sm`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {symbols.map((symbol) => (
          <span
            key={symbol.id}
            className="absolute text-[12px] font-bold tracking-widest text-emerald-100/28"
            style={{
              left: `${symbol.x}%`,
              top: `${symbol.y}%`,
              animation: `symbolDrift ${symbol.duration}s ease-in-out infinite`,
              animationDelay: `${symbol.delay}s`,
            }}
          >
            {symbol.symbol}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/45 to-black/75" />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.7;
          }
        }

        @keyframes symbolDrift {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-18px) translateX(8px) scale(1.08);
            opacity: 0.42;
          }
        }
      `}</style>
    </div>
  );
}

export default SeasonBackground;
