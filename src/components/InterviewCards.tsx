import { Shield, Circle, Skull, Square, Triangle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { resolveMediaPath } from '../utils/media';

interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

interface InterviewCardsProps {
  onComplete: () => void;
}

const PASS_SCORE = 5;
const AUTO_ADVANCE_MS = 3000;
type QuizPhase = 'rules' | 'quiz' | 'result';

const moneyParticles = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  left: 6 + ((index * 5.2) % 88),
  delay: `${(index * 0.16).toFixed(2)}s`,
  duration: `${(2.2 + (index % 4) * 0.35).toFixed(2)}s`,
  rotate: -12 + (index % 6) * 5,
}));

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What makes Shams light up a room?',
    options: [
      'Calm silence and distance',
      'Infectious energy and smile',
      'Strict discipline only',
      'Being the loudest person',
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: 'Coffee or tea?',
    options: ['Tea always', 'Coffee always', 'No hot drinks', 'Only juice'],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "What's Shams's superpower?",
    options: [
      'Winning every argument',
      'Never making mistakes',
      'Making people feel they matter',
      'Talking nonstop',
    ],
    correctIndex: 2,
  },
  {
    id: 4,
    question: 'In three words, Shams is:',
    options: [
      'Authentic, Thoughtful, Unforgettable',
      'Fast, Loud, Restless',
      'Cold, Sharp, Detached',
      'Random, Busy, Quiet',
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    question: 'People come to Shams mostly for:',
    options: [
      'Complex solutions',
      'A feeling of ease and belonging',
      'Competition',
      'Rules and penalties',
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "Shams's impact is best described as:",
    options: [
      'Short and forgettable',
      'Quiet but lasting',
      'Only online',
      'Useful only at work',
    ],
    correctIndex: 1,
  },
  {
    id: 7,
    question: 'What does kindness from Shams feel like?',
    options: [
      'Like pressure',
      'Like performance',
      'Like being seen and heard',
      'Like a test',
    ],
    correctIndex: 2,
  },
  {
    id: 8,
    question: 'Which quality stands out most?',
    options: ['Presence', 'Ego', 'Impatience', 'Indifference'],
    correctIndex: 0,
  },
  {
    id: 9,
    question: 'In Red Light, Green Light, you move when:',
    options: ['Red light appears', 'The guard looks away', 'Green light appears', 'Any time you want'],
    correctIndex: 2,
  },
  {
    id: 10,
    question: 'How many correct answers are needed to enter the story?',
    options: ['3/10', '4/10', '5/10', '8/10'],
    correctIndex: 2,
  },
];

function InterviewCards({ onComplete }: InterviewCardsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>('rules');

  const currentQuestion = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  const hasAnswered = selectedIndex !== null;
  const canPass = score >= PASS_SCORE;
  const moneyFillPercent = Math.max(35, Math.min(96, 35 + score * 5.5));
  const winnings = useMemo(() => score * 1000000, [score]);

  const guardMask = useMemo(() => {
    const sequence = [Circle, Triangle, Square];
    return sequence[currentIndex % sequence.length];
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch((err) => {
      console.warn('Background audio autoplay blocked:', err);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleSelect = (optionIndex: number) => {
    if (hasAnswered || phase !== 'quiz') return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setSelectedIndex(optionIndex);
    setLastCorrect(isCorrect);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (phase !== 'quiz' || !hasAnswered) return;

    const timer = window.setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedIndex(null);
        setLastCorrect(null);
        return;
      }

      setPhase('result');
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [phase, hasAnswered, currentIndex, totalQuestions]);

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setLastCorrect(null);
    setScore(0);
    setPhase('rules');
  };

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setLastCorrect(null);
    setScore(0);
    setPhase('quiz');
  };

  return (
    <div className="fixed inset-0 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#050506] text-white">
      <audio ref={audioRef} preload="auto">
        <source src={resolveMediaPath('audio/background.mp3')} type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-700/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      {phase === 'quiz' && hasAnswered && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            lastCorrect ? 'opacity-100' : 'opacity-100'
          }`}
          style={{
            background: lastCorrect
              ? 'radial-gradient(circle at center, rgba(22, 163, 74, 0.28) 0%, rgba(0,0,0,0) 60%)'
              : 'radial-gradient(circle at center, rgba(220, 38, 38, 0.3) 0%, rgba(0,0,0,0) 60%)',
          }}
        />
      )}

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col px-4 py-5 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6">
        {phase === 'rules' && (
          <div className="flex flex-1 items-start justify-center overflow-y-auto py-2 sm:items-center">
            <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-black/55 p-6 backdrop-blur-md sm:p-8">
              <p className="text-center text-xs tracking-[0.3em] text-red-300">RULE BOOK</p>
              <h2 className="mt-3 text-center text-3xl font-black sm:text-4xl">PLAYER 456 ENTRY TEST</h2>

              <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:text-base">
                <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">1. There are 10 questions.</div>
                <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">2. Each question has 4 answers.</div>
                <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">3. One attempt only. Wrong answer does not reveal the right one.</div>
                <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">4. Guard gives O for correct and X for wrong.</div>
                <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4 font-semibold">5. Score at least 5/10 to enter the story.</div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-zinc-300">
                <Circle className="h-5 w-5" />
                <Triangle className="h-5 w-5" />
                <Square className="h-5 w-5" />
              </div>

              <button
                type="button"
                onClick={handleStartQuiz}
                className="mt-7 w-full rounded-xl bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200 sm:text-base"
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {phase === 'quiz' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-4 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur">
              <p className="text-center text-xs tracking-[0.28em] text-red-300/90">
                RED LIGHT GREEN LIGHT QUIZ
              </p>
              <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                <span>
                  Question {Math.min(currentIndex + 1, totalQuestions)} / {totalQuestions}
                </span>
                <span className="font-semibold text-emerald-300">Score: {score}</span>
              </div>
              <div className="mt-3 flex gap-1.5">
                {quizQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`h-1.5 flex-1 rounded-full ${
                      idx < currentIndex
                        ? 'bg-red-500'
                        : idx === currentIndex
                        ? 'bg-white/70'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
              <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-900/90 to-black/80 p-5 sm:p-6">
                <h2 className="text-xl font-bold leading-tight sm:text-3xl">{currentQuestion.question}</h2>
                <p className="mt-2 text-sm text-zinc-400">Choose one option.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option, idx) => {
                  const selected = selectedIndex === idx;
                  const selectedCorrect = selected && lastCorrect;
                  const selectedWrong = selected && lastCorrect === false;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(idx)}
                      disabled={hasAnswered}
                      className={`min-h-20 rounded-xl border p-4 text-left text-base transition-all ${
                        selectedCorrect
                          ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                          : selectedWrong
                          ? 'border-red-400 bg-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                          : 'border-white/15 bg-white/[0.04] hover:border-white/35 hover:bg-white/[0.08]'
                      } ${hasAnswered && !selected ? 'opacity-70' : ''}`}
                    >
                      <span className="text-white/90">{option}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto rounded-2xl border border-white/15 bg-black/45 p-4">
                {hasAnswered ? (
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-3" style={{ animation: 'guard-arrive 420ms cubic-bezier(0.2, 0.9, 0.2, 1)' }}>
                      <div className="relative">
                        <div className="h-14 w-14 rounded-full bg-[#c61b2b] shadow-[0_0_20px_rgba(198,27,43,0.45)]" />
                        <Shield className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-black" />
                        {(() => {
                          const MaskIcon = guardMask;
                          return (
                            <MaskIcon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white" />
                          );
                        })()}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Guard Verdict</p>
                        <p
                          className={`text-3xl font-black ${
                            lastCorrect ? 'text-emerald-400' : 'text-red-400'
                          }`}
                          style={{ animation: 'guard-mark-pop 360ms ease-out' }}
                        >
                          {lastCorrect ? 'O' : 'X'}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300">
                      {currentIndex === totalQuestions - 1
                        ? 'Finalizing results...'
                        : 'Moving to next question...'}
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-sm text-zinc-400">
                    One shot per question. Wrong answer does not reveal the right one.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="relative flex flex-1 items-center justify-center">
            {!canPass && (
              <div className="elimination-overlay pointer-events-none absolute inset-0">
                <div className="elimination-slash elimination-slash-a" />
                <div className="elimination-slash elimination-slash-b" />
                <div className="elimination-slash elimination-slash-c" />
                <div className="elimination-stain elimination-stain-a" />
                <div className="elimination-stain elimination-stain-b" />
                <div className="elimination-stain elimination-stain-c" />
                <div className="elimination-stain elimination-stain-d" />
              </div>
            )}

            <div className={`relative z-10 w-full max-w-3xl rounded-3xl border p-6 text-center backdrop-blur ${canPass ? 'border-emerald-400/40 bg-black/50' : 'border-red-400/40 bg-black/45'}`}>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">Final Verdict</p>
              <h2 className={`mt-3 text-3xl font-black sm:text-5xl ${canPass ? 'quiz-pass-title' : 'quiz-fail-title'}`}>
                {canPass ? 'PLAYER 456 SAVED' : 'PLAYER 456 HAS BEEN ELIMINATED'}
              </h2>

              <div className="mt-4 text-zinc-200">
                Score: <span className="font-bold">{score}/{totalQuestions}</span>
              </div>

              {canPass ? (
                <div className="mt-6">
                  <div className="money-tank mx-auto">
                    <div className="money-fill" style={{ height: `${moneyFillPercent}%` }} />
                    <div className="money-glass-glow" />
                    {moneyParticles.map((particle) => (
                      <span
                        key={particle.id}
                        className="money-bill"
                        style={{
                          left: `${particle.left}%`,
                          animationDelay: particle.delay,
                          animationDuration: particle.duration,
                          transform: `rotate(${particle.rotate}deg)`,
                        }}
                      >
                        $
                      </span>
                    ))}
                    <p className="money-amount">${winnings.toLocaleString()}</p>
                  </div>
                  <p className="mt-4 text-emerald-300">Green light. Entry approved.</p>
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center">
                  <Skull className="h-16 w-16 text-red-200" style={{ animation: 'skull-pulse 1.3s ease-in-out infinite' }} />
                  <p className="mt-3 text-red-100">Red light. Session terminated.</p>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                {canPass && (
                  <button
                    type="button"
                    onClick={onComplete}
                    className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black transition hover:bg-emerald-400"
                  >
                    ENTER THE STORY
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Retry Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewCards;
