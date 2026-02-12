import { useState } from 'react';
import { Lock, Play } from 'lucide-react';

interface Progress {
  season1: boolean;
  season2: boolean;
  season3: boolean;
  season4: boolean;
}

interface SeasonMenuProps {
  progress: Progress;
  onSeasonSelect: (season: number) => void;
}

interface Season {
  number: number;
  title: string;
  description: string;
}

const seasons: Season[] = [
  {
    number: 1,
    title: "THE FOUNDATION",
    description: "The person everyone knows",
  },
  {
    number: 2,
    title: "THE JOURNEY",
    description: "Growth through challenges",
  },
  {
    number: 3,
    title: "THE IMPACT",
    description: "Touching lives along the way",
  },
  {
    number: 4,
    title: "THE TRUTH",
    description: "What matters most",
  },
];

function SeasonMenu({ progress, onSeasonSelect }: SeasonMenuProps) {
  const [shaking, setShaking] = useState<number | null>(null);

  const isUnlocked = (seasonNum: number): boolean => {
    if (seasonNum === 1) return true;
    if (seasonNum === 2) return progress.season1;
    if (seasonNum === 3) return progress.season2;
    if (seasonNum === 4) return progress.season3;
    return false;
  };

  const handleSeasonClick = (seasonNum: number) => {
    if (isUnlocked(seasonNum)) {
      onSeasonSelect(seasonNum);
    } else {
      setShaking(seasonNum);
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKrj8LNkHQU2kdfy0HgsBS1+zPLaizsKElyx6OyvWBUIQ5zd8sFuJAUuhc/y24k2CBlpu+znn04MDlCp4/C0ZB0FNpHX8tB4LAUtfszy2Ik3CBtpvfDknE4MDlCp4/CzZB0FNpHX8s94LQUtfszy2Ik2CBlpu+znn04MDlCp4/CzZB0FNpHX8s94LAUtfszy2Ik3CBtpvfDknE4MDlCp4/CzZB0FNpHX8s94LAUtfszyxV');
      audio.volume = 0.3;
      audio.play().catch(() => {});
      setTimeout(() => setShaking(null), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-red-500/5 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            SELECT SEASON
          </h1>
          <p className="text-gray-400 text-lg">
            Complete each season to unlock the next chapter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasons.map((season) => {
            const unlocked = isUnlocked(season.number);
            const isShaking = shaking === season.number;

            return (
              <div
                key={season.number}
                onClick={() => handleSeasonClick(season.number)}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isShaking ? 'animate-shake' : ''
                } ${
                  unlocked
                    ? 'hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div
                  className={`relative h-64 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    unlocked
                      ? 'border-red-500/50 bg-gradient-to-br from-gray-800 to-gray-900'
                      : 'border-gray-700 bg-gradient-to-br from-gray-900 to-black'
                  }`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    {!unlocked && (
                      <Lock className="w-12 h-12 text-gray-600 mb-4" />
                    )}

                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">
                        SEASON {season.number}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      {season.title}
                    </h3>

                    <p className="text-gray-400 text-lg">
                      {season.description}
                    </p>

                    {unlocked && (
                      <div className="mt-6 flex items-center gap-2 text-red-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 fill-current" />
                        <span>PLAY</span>
                      </div>
                    )}
                  </div>

                  {unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SeasonMenu;
