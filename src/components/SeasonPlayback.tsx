import { ChevronLeft, Circle, Pause, Play, Square, Triangle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import SeasonBackground from './SeasonBackground';
import { seasonData, type Subtitle } from '../data/seasonData';
import { resolveMediaPath } from '../utils/media';

interface SeasonPlaybackProps {
  season: number;
  onBack: () => void;
  onComplete: () => void;
}

interface TimedSubtitle {
  time: number;
  text: string;
}

const resolveTimedSubtitles = (subtitles: Subtitle[]): TimedSubtitle[] => {
  return subtitles
    .map((sub) => ({ time: sub.time, text: sub.text }))
    .sort((a, b) => a.time - b.time);
};

function SeasonPlayback({ season, onBack, onComplete }: SeasonPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const teleprompterRef = useRef<HTMLDivElement>(null);
  const beatLayerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const activeSubtitleIndexRef = useRef<number>(-1);
  const completionTriggeredRef = useRef<boolean>(false);
  const hasAutoStartedRef = useRef<boolean>(false);
  const completionTimeRef = useRef<number>(Infinity);
  const timedSubtitlesRef = useRef<TimedSubtitle[]>([]);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const beatRafRef = useRef<number | null>(null);
  const beatLevelRef = useRef<number>(0);

  const [timedSubtitles, setTimedSubtitles] = useState<TimedSubtitle[]>([]);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const data = seasonData[season];

  const teleprompterLines = useMemo(
    () => timedSubtitles.map((subtitle) => subtitle.text),
    [timedSubtitles],
  );

  const activeGlow = useMemo(() => {
    if (season === 1) return 'rgba(40, 255, 180, 0.6)';
    if (season === 2) return 'rgba(255, 63, 129, 0.62)';
    if (season === 3) return 'rgba(97, 255, 197, 0.62)';
    return 'rgba(255, 55, 118, 0.6)';
  }, [season]);

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '00:00';
    const total = Math.floor(seconds);
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const findActiveIndexByTime = (time: number): number => {
    const subtitles = timedSubtitlesRef.current;
    let resolvedIndex = -1;

    for (let i = 0; i < subtitles.length; i += 1) {
      const subtitle = subtitles[i];
      const nextSubtitle = subtitles[i + 1];
      if (time >= subtitle.time && (!nextSubtitle || time < nextSubtitle.time)) {
        resolvedIndex = i;
        break;
      }
    }

    return resolvedIndex;
  };

  const syncSubtitleAtTime = (time: number) => {
    const resolvedIndex = findActiveIndexByTime(time);
    if (resolvedIndex !== activeSubtitleIndexRef.current) {
      activeSubtitleIndexRef.current = resolvedIndex;
      setActiveSubtitleIndex(resolvedIndex);
    }
  };

  const applyBeatVisual = (intensity: number) => {
    const layer = beatLayerRef.current;
    if (!layer) return;

    const opacity = 0.1 + intensity * 0.6;
    const scale = 1 + intensity * 0.08;
    layer.style.opacity = `${opacity}`;
    layer.style.transform = `scale(${scale})`;
  };

  const stopBeatLoop = () => {
    if (beatRafRef.current !== null) {
      cancelAnimationFrame(beatRafRef.current);
      beatRafRef.current = null;
    }
    beatLevelRef.current = 0;
    applyBeatVisual(0);
  };

  const startBeatLoop = () => {
    const analyser = analyserRef.current;
    if (!analyser || beatRafRef.current !== null) return;

    const frequencies = new Uint8Array(analyser.frequencyBinCount);
    const lowBandLength = Math.max(4, Math.floor(frequencies.length * 0.18));

    const tick = () => {
      analyser.getByteFrequencyData(frequencies);
      let lowBandTotal = 0;
      for (let i = 0; i < lowBandLength; i += 1) {
        lowBandTotal += frequencies[i];
      }

      const rawLevel = lowBandTotal / (lowBandLength * 255);
      const smoothed = beatLevelRef.current * 0.82 + rawLevel * 0.18;
      beatLevelRef.current = smoothed;
      applyBeatVisual(smoothed);
      beatRafRef.current = requestAnimationFrame(tick);
    };

    tick();
  };

  const ensureBeatTracking = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      const context = new AudioContextCtor();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;

      source.connect(analyser);
      analyser.connect(context.destination);

      audioContextRef.current = context;
      sourceNodeRef.current = source;
      analyserRef.current = analyser;
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    startBeatLoop();
  };

  const handleTogglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn('Audio playback blocked:', err);
      });
    } else {
      audio.pause();
    }
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const safeDuration = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : completionTimeRef.current;
    const nextTime = Math.min(audio.currentTime + 5, safeDuration);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    syncSubtitleAtTime(nextTime);
  };

  const handleSkipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Math.max(audio.currentTime - 5, 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    syncSubtitleAtTime(nextTime);
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
    syncSubtitleAtTime(value);
  };

  const handleBackToMenu = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    onBack();
  };

  useEffect(() => {
    timedSubtitlesRef.current = timedSubtitles;
    lineRefs.current = lineRefs.current.slice(0, timedSubtitles.length);
  }, [timedSubtitles]);

  useEffect(() => {
    const container = teleprompterRef.current;
    const activeLine = lineRefs.current[activeSubtitleIndex];
    if (!container || !activeLine || activeSubtitleIndex < 0) return;

    const targetTop = Math.max(
      0,
      activeLine.offsetTop - (container.clientHeight / 2) + (activeLine.clientHeight / 2),
    );

    container.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  }, [activeSubtitleIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !data) return;

    const explicitSubtitles = resolveTimedSubtitles(data.subtitles);
    timedSubtitlesRef.current = explicitSubtitles;
    setTimedSubtitles(explicitSubtitles);
    setActiveSubtitleIndex(-1);
    activeSubtitleIndexRef.current = -1;
    setIsComplete(false);
    setFadeOut(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    hasAutoStartedRef.current = false;
    completionTriggeredRef.current = false;

    const markComplete = () => {
      if (completionTriggeredRef.current) return;
      completionTriggeredRef.current = true;
      setIsComplete(true);
      setFadeOut(true);
      stopBeatLoop();
    };

    const handleLoadedMetadata = () => {
      const lastSubtitle = timedSubtitlesRef.current[timedSubtitlesRef.current.length - 1];
      const fallbackCompletion = (lastSubtitle?.time ?? 0) + 2;
      if (!audio.duration || Number.isNaN(audio.duration)) {
        completionTimeRef.current = fallbackCompletion;
        setDuration(fallbackCompletion);
        return;
      }
      completionTimeRef.current = audio.duration;
      setDuration(audio.duration);
    };

    const handleCanPlay = () => {
      if (hasAutoStartedRef.current) return;
      hasAutoStartedRef.current = true;
      audio.play().catch((err) => {
        console.warn('Audio playback blocked:', err);
      });
    };

    const handlePlay = () => {
      setIsPlaying(true);
      void ensureBeatTracking();
    };

    const handlePause = () => {
      setIsPlaying(false);
      stopBeatLoop();
    };

    const handleTimeUpdate = () => {
      const nextTime = audio.currentTime;
      setCurrentTime(nextTime);
      syncSubtitleAtTime(nextTime);

      if (nextTime >= completionTimeRef.current - 0.02) {
        markComplete();
      }
    };

    const handleEnded = () => {
      markComplete();
      setIsPlaying(false);
      completionTimeoutRef.current = setTimeout(() => {
        onComplete();
      }, 2000);
    };

    audio.currentTime = 0;
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (audio.readyState >= 2) {
      handleCanPlay();
    }
    if (audio.readyState >= 1 && audio.duration > 0) {
      completionTimeRef.current = audio.duration;
      setDuration(audio.duration);
    } else {
      const lastSubtitle = explicitSubtitles[explicitSubtitles.length - 1];
      completionTimeRef.current = (lastSubtitle?.time ?? 0) + 2;
      setDuration((lastSubtitle?.time ?? 0) + 2);
    }

    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
      stopBeatLoop();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.currentTime = 0;

      sourceNodeRef.current?.disconnect();
      analyserRef.current?.disconnect();
      sourceNodeRef.current = null;
      analyserRef.current = null;

      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [season, data, onComplete]);

  if (!data) return null;

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : completionTimeRef.current;
  const sliderMax = Number.isFinite(safeDuration) && safeDuration > 0 ? safeDuration : 0;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <SeasonBackground season={season} fadeOut={fadeOut} />
      <div
        ref={beatLayerRef}
        className="pointer-events-none absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{
          opacity: 0.1,
          background: `radial-gradient(circle at 50% 55%, ${activeGlow} 0%, rgba(0, 0, 0, 0) 56%)`,
          mixBlendMode: 'screen',
        }}
      />

      <audio ref={audioRef} preload="auto">
        <source src={resolveMediaPath(`audio/season${season}.mp3`)} type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 z-10 px-3 py-3 sm:px-6 sm:py-5">
        <div className="squid-stage-shell mx-auto flex h-full w-full max-w-5xl flex-col">
          <div className="squid-glass-panel mb-3 flex items-center gap-3 px-3 py-2 sm:mb-4 sm:px-4 sm:py-3">
            <button
              type="button"
              onClick={handleBackToMenu}
              className="squid-control-chip flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex-1 text-center">
              <p className="text-xs font-semibold tracking-[0.32em] text-emerald-100/70">SEASON {season}</p>
              <h1 className="mt-2 text-xl font-bold text-white sm:text-3xl">{data.title}</h1>
            </div>

            <div className="hidden items-center gap-2 pr-1 sm:flex">
              <span className="squid-symbol-chip"><Circle className="h-3 w-3" /></span>
              <span className="squid-symbol-chip"><Triangle className="h-3 w-3" /></span>
              <span className="squid-symbol-chip"><Square className="h-3 w-3" /></span>
            </div>
          </div>

          <div className="teleprompter-shell squid-glass-panel flex-1 min-h-0">
            <div className="teleprompter-edge teleprompter-edge-top" />
            <div className="teleprompter-edge teleprompter-edge-bottom" />

            <div ref={teleprompterRef} className="teleprompter-track">
              {teleprompterLines.map((line, index) => {
                let stateClass = 'teleprompter-line-future';
                if (index < activeSubtitleIndex) stateClass = 'teleprompter-line-past';
                if (index === activeSubtitleIndex) stateClass = 'teleprompter-line-active';

                return (
                  <p
                    key={`${index}-${line}`}
                    ref={(element) => {
                      lineRefs.current[index] = element;
                    }}
                    className={`teleprompter-line ${stateClass}`}
                  >
                    {line}
                  </p>
                );
              })}
            </div>

          </div>

          <div className="squid-glass-panel mt-3 rounded-2xl p-3 shadow-[0_14px_40px_rgba(2,6,23,0.5)] backdrop-blur-md sm:mt-4 sm:p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-emerald-50/75 sm:text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(sliderMax)}</span>
            </div>

            <input
              type="range"
              min={0}
              max={sliderMax}
              step={0.01}
              value={Math.min(currentTime, sliderMax)}
              onChange={(event) => handleSeek(Number(event.target.value))}
              className="music-slider h-2 w-full cursor-pointer appearance-none rounded-full"
              aria-label="Seek season audio"
              style={
                {
                  '--progress': sliderMax > 0 ? Math.min(currentTime / sliderMax, 1) : 0,
                } as CSSProperties
              }
            />

            <div className="mt-3 flex items-center justify-center gap-3 sm:mt-4 sm:gap-4">
              <button
                type="button"
                onClick={handleSkipBackward}
                className="squid-control-chip h-12 rounded-xl px-5 text-sm font-semibold text-white transition-all active:scale-[0.98] sm:h-14 sm:px-6 sm:text-base"
              >
                -5s
              </button>

              <button
                type="button"
                onClick={handleTogglePlayPause}
                className="squid-primary-chip flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-xl text-slate-950 transition-all hover:scale-[1.02] active:scale-[0.98] sm:h-14 sm:min-w-[140px]"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                <span className="text-sm font-semibold sm:text-base">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={handleSkipForward}
                className="squid-control-chip h-12 rounded-xl px-5 text-sm font-semibold text-white transition-all active:scale-[0.98] sm:h-14 sm:px-6 sm:text-base"
              >
                +5s
              </button>
            </div>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Season {season} Complete
            </h2>
            <p className="text-gray-400 text-lg">
              {season < 4 ? 'Returning to menu...' : 'Preparing finale...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeasonPlayback;
