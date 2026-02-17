import { useEffect, useMemo, useState } from 'react';
import { Lock, Play } from 'lucide-react';
import {
  SEASON_UNLOCK_CONFIG,
  type LockedSeason,
  type UnlockStateMap,
} from '../data/seasonUnlockConfig';

interface Progress {
  season1: boolean;
  season2: boolean;
  season3: boolean;
  season4: boolean;
}

interface SeasonMenuProps {
  progress: Progress;
  unlockState: UnlockStateMap;
  onSeasonSelect: (season: number) => void;
  onUnlockWithCode: (season: LockedSeason, inputCode: string) => boolean;
}

interface Season {
  number: number;
  title: string;
  description: string;
}

const seasons: Season[] = [
  {
    number: 1,
    title: "THE QUIET CONSTANT",
    description: "You never notice stability until it's gone.",
  },
  {
    number: 2,
    title: "THE WEIGHT YOU CARRY",
    description: "The one everyone leans on rarely leans anywhere.",
  },
  {
    number: 3,
    title: "WHEN YOU'RE AROUND",
    description: "Nothing changes, yet everything feels lighter.",
  },
  {
    number: 4,
    title: "YOU'RE NOT ALONE",
    description: "Even the strong deserve someone who stays.",
  },
];

const formatRemainingTime = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

function SeasonMenu({
  progress,
  unlockState,
  onSeasonSelect,
  onUnlockWithCode,
}: SeasonMenuProps) {
  const [shaking, setShaking] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [lockedSeasonModal, setLockedSeasonModal] = useState<LockedSeason | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hasPrerequisite = (seasonNum: number): boolean => {
    if (seasonNum === 1) return true;
    if (seasonNum === 2) return progress.season1;
    if (seasonNum === 3) return progress.season2;
    if (seasonNum === 4) return progress.season3;
    return false;
  };

  const getRemainingMs = (seasonNum: LockedSeason): number => {
    const state = unlockState[seasonNum];
    const waitMs = SEASON_UNLOCK_CONFIG[seasonNum].waitMs;
    if (state.unlockedByCode) return 0;
    if (!state.startedAt) return waitMs;
    const remaining = waitMs - (now - state.startedAt);
    return remaining > 0 ? remaining : 0;
  };

  const isUnlocked = (seasonNum: number): boolean => {
    if (seasonNum === 1) return true;
    if (!hasPrerequisite(seasonNum)) return false;
    return getRemainingMs(seasonNum as LockedSeason) === 0;
  };

  const activeSeasonUnlocked = useMemo(() => {
    if (!lockedSeasonModal) return false;
    return isUnlocked(lockedSeasonModal);
  }, [lockedSeasonModal, now, progress, unlockState]);

  useEffect(() => {
    if (lockedSeasonModal && activeSeasonUnlocked) {
      setLockedSeasonModal(null);
      setCodeInput('');
      setCodeError('');
    }
  }, [lockedSeasonModal, activeSeasonUnlocked]);

  const handleSeasonClick = (seasonNum: number) => {
    if (isUnlocked(seasonNum)) {
      onSeasonSelect(seasonNum);
    } else {
      setShaking(seasonNum);
      if (seasonNum > 1) {
        setLockedSeasonModal(seasonNum as LockedSeason);
        setCodeInput('');
        setCodeError('');
      }
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKrj8LNkHQU2kdfy0HgsBS1+zPLaizsKElyx6OyvWBUIQ5zd8sFuJAUuhc/y24k2CBlpu+znn04MDlCp4/C0ZB0FNpHX8tB4LAUtfszy2Ik3CBtpvfDknE4MDlCp4/CzZB0FNpHX8s94LQUtfszy2Ik2CBlpu+znn04MDlCp4/CzZB0FNpHX8s94LAUtfszy2Ik3CBtpvfDknE4MDlCp4/CzZB0FNpHX8s94LAUtfszyxV');
      audio.volume = 0.3;
      audio.play().catch(() => {});
      setTimeout(() => setShaking(null), 500);
    }
  };

  const handleUnlockSubmit = () => {
    if (!lockedSeasonModal) return;
    if (!hasPrerequisite(lockedSeasonModal)) {
      setCodeError(`Complete Season ${lockedSeasonModal - 1} first to start the timer.`);
      return;
    }

    const didUnlock = onUnlockWithCode(lockedSeasonModal, codeInput);
    if (!didUnlock) {
      setCodeError('Incorrect code. Please try again.');
      return;
    }

    const seasonToOpen = lockedSeasonModal;
    setLockedSeasonModal(null);
    setCodeInput('');
    setCodeError('');
    onSeasonSelect(seasonToOpen);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-start md:justify-center p-4 md:p-8 overflow-y-auto">
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

      {lockedSeasonModal && (
        <div className="fixed inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-white">Season {lockedSeasonModal} Locked</h2>
            </div>

            {hasPrerequisite(lockedSeasonModal) ? (
              <>
                <p className="text-gray-300 text-sm mb-2">Timer</p>
                <p className="text-3xl font-mono text-white mb-4">
                  {formatRemainingTime(getRemainingMs(lockedSeasonModal))}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {SEASON_UNLOCK_CONFIG[lockedSeasonModal].contactHint}
                </p>

                <label className="text-gray-300 text-sm block mb-2">Code</label>
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    if (codeError) setCodeError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnlockSubmit();
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-red-500"
                  placeholder="Enter code"
                />
                {codeError && <p className="text-red-400 text-sm mt-2">{codeError}</p>}

                <button
                  onClick={handleUnlockSubmit}
                  className="mt-4 w-full px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Unlock Now
                </button>
              </>
            ) : (
              <p className="text-gray-300 text-sm mb-4">
                Complete Season {lockedSeasonModal - 1} first to start this 1-hour timer.
              </p>
            )}

            <button
              onClick={() => {
                setLockedSeasonModal(null);
                setCodeInput('');
                setCodeError('');
              }}
              className="mt-3 w-full px-4 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeasonMenu;
