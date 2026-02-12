import { useEffect, useState } from 'react';

interface SeasonBackgroundProps {
  season: number;
  fadeOut: boolean;
}

function SeasonBackground({ season, fadeOut }: SeasonBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const particleCount = season === 2 ? 30 : 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [season]);

  const getBackgroundStyle = () => {
    switch (season) {
      case 1:
        return {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        };
      case 2:
        return {
          background: 'linear-gradient(135deg, #2d1b69 0%, #1a0b3d 50%, #0a0520 100%)',
        };
      case 3:
        return {
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        };
      case 4:
        return {
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)',
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
        return 'bg-blue-400/30';
      case 2:
        return 'bg-purple-400/40';
      case 3:
        return 'bg-teal-400/30';
      case 4:
        return 'bg-red-400/20';
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
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${getParticleStyle(season)} blur-sm`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: season === 2 ? '8px' : '6px',
              height: season === 2 ? '8px' : '6px',
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {season === 4 && (
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/80" />
      )}

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
      `}</style>
    </div>
  );
}

export default SeasonBackground;
