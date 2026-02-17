import { useEffect, useState } from 'react';
import { resolveMediaPath } from '../utils/media';

interface NetflixIntroProps {
  onEnd: () => void;
}

type IntroStage = 'fade-in' | 'glow' | 'slash-1' | 'slash-2' | 'slash-3' | 'fade-out';

const STAGE_ORDER: IntroStage[] = ['fade-in', 'glow', 'slash-1', 'slash-2', 'slash-3', 'fade-out'];

function NetflixIntro({ onEnd }: NetflixIntroProps) {
  const [stage, setStage] = useState<IntroStage>('fade-in');

  const isAtLeastStage = (target: IntroStage) => {
    return STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf(target);
  };

  const getStageScale = () => {
    if (stage === 'fade-in') return 0.92;
    if (stage === 'glow') return 1;
    if (stage === 'slash-1') return 1.08;
    if (stage === 'slash-2') return 1.19;
    if (stage === 'slash-3') return 1.32;
    return 1.42;
  };

  useEffect(() => {
    const MIN_INTRO_MS = 6000;
    const audio = new Audio(resolveMediaPath('audio/tudum.mp3'));
    audio.volume = 0.7;
    let fadeOutTimer: ReturnType<typeof setTimeout> | undefined;
    let endTransitionTimer: ReturnType<typeof setTimeout> | undefined;
    let hasAudioEnded = false;
    let hasMinDurationElapsed = false;

    const scheduleFadeOut = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
      }

      if (fadeOutTimer) {
        clearTimeout(fadeOutTimer);
      }

      const msUntilFadeOut = Math.max(audio.duration * 1000 - 600, MIN_INTRO_MS - 600);
      fadeOutTimer = setTimeout(() => {
        setStage('fade-out');
      }, msUntilFadeOut);
    };

    const tryCompleteIntro = () => {
      if (!hasAudioEnded || !hasMinDurationElapsed) {
        return;
      }

      setStage('fade-out');
      endTransitionTimer = setTimeout(onEnd, 250);
    };

    const handleEnded = () => {
      hasAudioEnded = true;
      tryCompleteIntro();
    };

    audio.addEventListener('loadedmetadata', scheduleFadeOut);
    audio.addEventListener('ended', handleEnded);

    fadeOutTimer = setTimeout(() => {
      setStage('fade-out');
    }, MIN_INTRO_MS - 600);

    const minDurationTimer = setTimeout(() => {
      hasMinDurationElapsed = true;
      tryCompleteIntro();
    }, MIN_INTRO_MS);

    audio.play().catch((err) => {
      console.warn('Audio autoplay blocked:', err);
      hasAudioEnded = true;
      tryCompleteIntro();
    });

    const fadeInTimer = setTimeout(() => {
      setStage('glow');
    }, 620);

    const slash1Timer = setTimeout(() => {
      setStage('slash-1');
    }, 1850);

    const slash2Timer = setTimeout(() => {
      setStage('slash-2');
    }, 2750);

    const slash3Timer = setTimeout(() => {
      setStage('slash-3');
    }, 3600);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(slash1Timer);
      clearTimeout(slash2Timer);
      clearTimeout(slash3Timer);
      if (fadeOutTimer) {
        clearTimeout(fadeOutTimer);
      }
      clearTimeout(minDurationTimer);
      if (endTransitionTimer) {
        clearTimeout(endTransitionTimer);
      }
      audio.removeEventListener('loadedmetadata', scheduleFadeOut);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [onEnd]);

  return (
    <div className="intro-horror-shell fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="intro-beam intro-beam-left" />
      <div className="intro-beam intro-beam-right" />
      <div className="intro-vignette" />
      <div className="intro-grain" />

      <div
        className={`relative text-center transition-all duration-700 ${
          stage === 'fade-in'
            ? 'opacity-0 scale-95'
            : stage === 'glow' || isAtLeastStage('slash-1')
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-105'
        } ${isAtLeastStage('glow') ? 'intro-cinematic-zoom' : ''} ${
          isAtLeastStage('slash-3') ? 'intro-ultra-zoom' : ''
        }`}
        style={{
          transform: `scale(${getStageScale()})`,
        }}
      >
        <div className={`intro-impact-flash ${isAtLeastStage('slash-1') ? 'intro-impact-flash-1' : ''} ${isAtLeastStage('slash-2') ? 'intro-impact-flash-2' : ''} ${isAtLeastStage('slash-3') ? 'intro-impact-flash-3' : ''}`} />
        <div className={`intro-shockwave intro-shockwave-one ${isAtLeastStage('slash-1') ? 'intro-shockwave-active' : ''}`} />
        <div className={`intro-shockwave intro-shockwave-two ${isAtLeastStage('slash-2') ? 'intro-shockwave-active' : ''}`} />
        <div className={`intro-shockwave intro-shockwave-three ${isAtLeastStage('slash-3') ? 'intro-shockwave-active' : ''}`} />

        <div
          className={`intro-lockup ${
            isAtLeastStage('slash-1') ? 'intro-lockup-hit-1' : ''
          } ${isAtLeastStage('slash-2') ? 'intro-lockup-hit-2' : ''} ${
            isAtLeastStage('slash-3') ? 'intro-lockup-hit-3' : ''
          }`}
        >
          <p className="intro-classification">FILE 456 // FRONT MAN ARCHIVE</p>
          <h1
            className={`shams-cinematic-logo transition-all duration-500 ${
              stage === 'glow' || isAtLeastStage('slash-1') ? 'shams-cinematic-logo-glow' : ''
            } ${isAtLeastStage('slash-1') ? 'shams-cinematic-logo-slashed' : ''}`}
          >
            <span className="logo-main">SHAMS</span>
            <span className="logo-sub">ORIGINALS</span>
          </h1>
          <div className="intro-divider" />
          <p className="intro-tagline">One step in. No way out.</p>
          <div className="intro-symbol-row" aria-hidden="true">
            <span>O</span>
            <span>/\</span>
            <span>[]</span>
          </div>

          <div className="intro-crack-layer" aria-hidden="true">
            <span className={`intro-crack intro-crack-a ${isAtLeastStage('slash-1') ? 'intro-crack-active' : ''}`} />
            <span className={`intro-crack intro-crack-b ${isAtLeastStage('slash-2') ? 'intro-crack-active' : ''}`} />
            <span className={`intro-crack intro-crack-c ${isAtLeastStage('slash-3') ? 'intro-crack-active' : ''}`} />
          </div>
        </div>

      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            stage === 'glow' || isAtLeastStage('slash-1') ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(218, 29, 62, 0.14) 0%, rgba(7, 7, 9, 0) 68%)',
          }}
        />
        <div className={`intro-aftershock ${isAtLeastStage('slash-3') ? 'intro-aftershock-active' : ''}`} />
      </div>
    </div>
  );
}

export default NetflixIntro;
