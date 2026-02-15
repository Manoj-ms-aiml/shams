import { useEffect, useState } from 'react';
import PrologueVideo from './components/PrologueVideo';
import NetflixIntro from './components/NetflixIntro';
import InterviewCards from './components/InterviewCards';
import SeasonMenu from './components/SeasonMenu';
import SeasonPlayback from './components/SeasonPlayback';
import FinalScene from './components/FinalScene';
import {
  SEASON_UNLOCK_CONFIG,
  createInitialUnlockState,
  type LockedSeason,
  type UnlockStateMap,
} from './data/seasonUnlockConfig';

type Stage = 'start' | 'prologue' | 'intro' | 'interview' | 'menu' | 'playback' | 'final';

interface Progress {
  season1: boolean;
  season2: boolean;
  season3: boolean;
  season4: boolean;
}

const STORAGE_KEYS = {
  progress: 'shams.progress.v1',
  unlockState: 'shams.unlockState.v1',
} as const;

const defaultProgress: Progress = {
  season1: false,
  season2: false,
  season3: false,
  season4: false,
};

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const safeSetStorage = (key: string, value: string) => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore write errors (e.g. private mode/quota/security restrictions).
  }
};

const loadProgress = (): Progress => {
  const storage = getStorage();
  if (!storage) return defaultProgress;

  try {
    const raw = storage.getItem(STORAGE_KEYS.progress);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;

    return {
      season1: Boolean(parsed.season1),
      season2: Boolean(parsed.season2),
      season3: Boolean(parsed.season3),
      season4: Boolean(parsed.season4),
    };
  } catch {
    return defaultProgress;
  }
};

const loadUnlockState = (): UnlockStateMap => {
  const fallback = createInitialUnlockState();
  const storage = getStorage();
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(STORAGE_KEYS.unlockState);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<UnlockStateMap>;

    return {
      2: {
        startedAt: typeof parsed?.[2]?.startedAt === 'number' ? parsed[2].startedAt : null,
        unlockedByCode: Boolean(parsed?.[2]?.unlockedByCode),
      },
      3: {
        startedAt: typeof parsed?.[3]?.startedAt === 'number' ? parsed[3].startedAt : null,
        unlockedByCode: Boolean(parsed?.[3]?.unlockedByCode),
      },
      4: {
        startedAt: typeof parsed?.[4]?.startedAt === 'number' ? parsed[4].startedAt : null,
        unlockedByCode: Boolean(parsed?.[4]?.unlockedByCode),
      },
    };
  } catch {
    return fallback;
  }
};

function App() {
  const [stage, setStage] = useState<Stage>('start');
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [currentSeason, setCurrentSeason] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [unlockState, setUnlockState] = useState<UnlockStateMap>(() => loadUnlockState());

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.progress, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.unlockState, JSON.stringify(unlockState));
  }, [unlockState]);

  const handleStart = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setStage('prologue');
    }
  };

  const handlePrologueEnd = () => {
    setStage('intro');
  };

  const handleIntroEnd = () => {
    setStage('interview');
  };

  const handleInterviewComplete = () => {
    setStage('menu');
  };

  const isSeasonTimeUnlocked = (season: LockedSeason): boolean => {
    const currentUnlockState = unlockState[season];
    if (currentUnlockState.unlockedByCode) return true;
    if (!currentUnlockState.startedAt) return false;
    const waitMs = SEASON_UNLOCK_CONFIG[season].waitMs;
    return Date.now() - currentUnlockState.startedAt >= waitMs;
  };

  const isSeasonAccessible = (seasonNum: number): boolean => {
    if (seasonNum === 1) return true;
    if (seasonNum === 2) return progress.season1 && isSeasonTimeUnlocked(2);
    if (seasonNum === 3) return progress.season2 && isSeasonTimeUnlocked(3);
    if (seasonNum === 4) return progress.season3 && isSeasonTimeUnlocked(4);
    return false;
  };

  const startSeasonTimer = (season: LockedSeason) => {
    setUnlockState((prev) => {
      if (prev[season].startedAt || prev[season].unlockedByCode) {
        return prev;
      }

      return {
        ...prev,
        [season]: {
          ...prev[season],
          startedAt: Date.now(),
        },
      };
    });
  };

  const handleSeasonSelect = (seasonNum: number) => {
    if (!isSeasonAccessible(seasonNum)) return;
    setCurrentSeason(seasonNum);
    setStage('playback');
  };

  const handleUnlockWithCode = (seasonNum: LockedSeason, inputCode: string): boolean => {
    const configuredCode = SEASON_UNLOCK_CONFIG[seasonNum].code;
    const isMatch = inputCode.trim().toLowerCase() === configuredCode.trim().toLowerCase();
    if (!isMatch) return false;

    setUnlockState((prev) => ({
      ...prev,
      [seasonNum]: {
        startedAt: prev[seasonNum].startedAt ?? Date.now(),
        unlockedByCode: true,
      },
    }));

    return true;
  };

  const handleSeasonComplete = (seasonNum: number) => {
    const newProgress = { ...progress };
    if (seasonNum === 1) {
      newProgress.season1 = true;
      startSeasonTimer(2);
    }
    if (seasonNum === 2) {
      newProgress.season2 = true;
      startSeasonTimer(3);
    }
    if (seasonNum === 3) {
      newProgress.season3 = true;
      startSeasonTimer(4);
    }
    if (seasonNum === 4) {
      newProgress.season4 = true;
      setProgress(newProgress);
      setStage('final');
      return;
    }
    setProgress(newProgress);
    setStage('menu');
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {stage === 'start' && (
        <div
          className="fixed inset-0 flex items-center justify-center cursor-pointer overflow-hidden bg-black"
          onClick={handleStart}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-700/30 blur-3xl animate-pulse" />
            <div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 10px)',
              }}
            />
          </div>

          <div className="relative z-10 text-center px-6">
            <p className="text-xs sm:text-sm tracking-[0.34em] text-red-300/85 mb-3">
              PLAYER 456 : MR.SHAMS
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight tracking-wide drop-shadow-[0_0_24px_rgba(229,9,20,0.4)]">
              THE GAME HAS
              <span className="block text-red-500 animate-pulse">STARTED</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base text-gray-300/90 animate-pulse">
              Tap anywhere to enter
            </p>
          </div>
        </div>
      )}

      {stage === 'prologue' && <PrologueVideo onEnd={handlePrologueEnd} />}

      {stage === 'intro' && <NetflixIntro onEnd={handleIntroEnd} />}

      {stage === 'interview' && <InterviewCards onComplete={handleInterviewComplete} />}

      {stage === 'menu' && (
        <SeasonMenu
          progress={progress}
          unlockState={unlockState}
          onSeasonSelect={handleSeasonSelect}
          onUnlockWithCode={handleUnlockWithCode}
        />
      )}

      {stage === 'playback' && currentSeason && (
        <SeasonPlayback
          season={currentSeason}
          onBack={() => setStage('menu')}
          onComplete={() => handleSeasonComplete(currentSeason)}
        />
      )}

      {stage === 'final' && <FinalScene />}
    </div>
  );
}

export default App;
