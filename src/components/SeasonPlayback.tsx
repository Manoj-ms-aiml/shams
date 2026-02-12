import { useEffect, useRef, useState } from 'react';
import SeasonBackground from './SeasonBackground';
import { seasonData } from '../data/seasonData';

interface SeasonPlaybackProps {
  season: number;
  onComplete: () => void;
}

interface Subtitle {
  time: number;
  text: string;
}

function SeasonPlayback({ season, onComplete }: SeasonPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [previousSubtitles, setPreviousSubtitles] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const data = seasonData[season];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !data) return;

    audio.play().catch(err => {
      console.warn('Audio playback blocked:', err);
    });

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;

      const currentSub = data.subtitles.find((sub, idx) => {
        const nextSub = data.subtitles[idx + 1];
        return currentTime >= sub.time && (!nextSub || currentTime < nextSub.time);
      });

      if (currentSub && currentSub.text !== currentSubtitle) {
        if (currentSubtitle) {
          setPreviousSubtitles(prev => [...prev, currentSubtitle].slice(-2));
        }
        setCurrentSubtitle(currentSub.text);
      }

      if (audio.duration - currentTime <= 0.25 && !isComplete) {
        setIsComplete(true);
        setFadeOut(true);
      }
    };

    const handleEnded = () => {
      setTimeout(() => {
        onComplete();
      }, 2000);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [season, data, currentSubtitle, isComplete, onComplete]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <SeasonBackground season={season} fadeOut={fadeOut} />

      <audio ref={audioRef} preload="auto">
        <source src={`/audio/season${season}.mp3`} type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-4">
        <div className="max-w-4xl w-full text-center space-y-3">
          {previousSubtitles.map((sub, idx) => (
            <p
              key={idx}
              className="text-gray-500 text-xl md:text-2xl transition-all duration-500"
              style={{
                opacity: 0.3 - idx * 0.15,
              }}
            >
              {sub}
            </p>
          ))}

          <p
            className="text-white text-2xl md:text-4xl font-medium leading-relaxed transition-all duration-500 animate-fade-in"
            style={{
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            {currentSubtitle}
          </p>
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
