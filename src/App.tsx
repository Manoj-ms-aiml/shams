import { useState } from 'react';
import PrologueVideo from './components/PrologueVideo';
import NetflixIntro from './components/NetflixIntro';
import InterviewCards from './components/InterviewCards';
import SeasonMenu from './components/SeasonMenu';
import SeasonPlayback from './components/SeasonPlayback';
import FinalScene from './components/FinalScene';

type Stage = 'start' | 'prologue' | 'intro' | 'interview' | 'menu' | 'playback' | 'final';

interface Progress {
  season1: boolean;
  season2: boolean;
  season3: boolean;
  season4: boolean;
}

function App() {
  const [stage, setStage] = useState<Stage>('start');
  const [progress, setProgress] = useState<Progress>({
    season1: false,
    season2: false,
    season3: false,
    season4: false,
  });
  const [currentSeason, setCurrentSeason] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

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

  const handleSeasonSelect = (seasonNum: number) => {
    setCurrentSeason(seasonNum);
    setStage('playback');
  };

  const handleSeasonComplete = (seasonNum: number) => {
    const newProgress = { ...progress };
    if (seasonNum === 1) newProgress.season1 = true;
    if (seasonNum === 2) newProgress.season2 = true;
    if (seasonNum === 3) newProgress.season3 = true;
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
          className="fixed inset-0 flex items-center justify-center cursor-pointer bg-black"
          onClick={handleStart}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">
              Click to Begin
            </h1>
            <p className="text-gray-400 text-sm">A Personal Journey</p>
          </div>
        </div>
      )}

      {stage === 'prologue' && <PrologueVideo onEnd={handlePrologueEnd} />}

      {stage === 'intro' && <NetflixIntro onEnd={handleIntroEnd} />}

      {stage === 'interview' && <InterviewCards onComplete={handleInterviewComplete} />}

      {stage === 'menu' && (
        <SeasonMenu
          progress={progress}
          onSeasonSelect={handleSeasonSelect}
        />
      )}

      {stage === 'playback' && currentSeason && (
        <SeasonPlayback
          season={currentSeason}
          onComplete={() => handleSeasonComplete(currentSeason)}
        />
      )}

      {stage === 'final' && <FinalScene />}
    </div>
  );
}

export default App;
