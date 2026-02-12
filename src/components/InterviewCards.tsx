import { useState } from 'react';
import { Heart, Coffee, Zap, Star, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  answer: string;
  icon: typeof Heart;
}

interface InterviewCardsProps {
  onComplete: () => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What makes Shams light up a room?",
    answer: "That infectious energy and the smile that can turn any day around",
    icon: Sparkles,
  },
  {
    id: 2,
    question: "Coffee or tea?",
    answer: "Coffee. Always coffee. The darker, the better.",
    icon: Coffee,
  },
  {
    id: 3,
    question: "What's Shams's superpower?",
    answer: "Making everyone feel like they matter, like they belong",
    icon: Zap,
  },
  {
    id: 4,
    question: "In three words?",
    answer: "Authentic. Thoughtful. Unforgettable.",
    icon: Star,
  },
  {
    id: 5,
    question: "What does the world need to know?",
    answer: "That you're valued beyond measure, even when you doubt it",
    icon: Heart,
  },
];

function InterviewCards({ onComplete }: InterviewCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [fadeIn, setFadeIn] = useState(true);

  const handleCardClick = (id: number) => {
    if (!flipped.includes(id)) {
      setFlipped([...flipped, id]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setFadeIn(true);
      }, 300);
    }
  };

  const allAnswered = flipped.length === questions.length;
  const currentQuestion = questions[currentIndex];
  const isFlipped = flipped.includes(currentQuestion.id);
  const Icon = currentQuestion.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-center gap-2">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`h-2 rounded-full transition-all duration-500 ${
                flipped.includes(q.id)
                  ? 'w-12 bg-red-500'
                  : idx === currentIndex
                  ? 'w-8 bg-red-500/50'
                  : 'w-2 bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div
          className={`perspective-1000 transition-opacity duration-300 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            onClick={() => handleCardClick(currentQuestion.id)}
            className={`relative w-full h-96 cursor-pointer transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div
              className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <Icon className="w-16 h-16 text-red-500 mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                {currentQuestion.question}
              </h2>
              <p className="text-gray-400 mt-4 text-sm">Tap to reveal</p>
            </div>

            <div
              className="absolute inset-0 backface-hidden bg-gradient-to-br from-red-900/20 to-gray-900 rounded-2xl border border-red-500/30 shadow-2xl flex items-center justify-center p-8"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <p className="text-xl md:text-2xl text-white text-center leading-relaxed">
                {currentQuestion.answer}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setFadeIn(false);
                setTimeout(() => {
                  setCurrentIndex(currentIndex - 1);
                  setFadeIn(true);
                }, 300);
              }
            }}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>

          {allAnswered ? (
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-500/30"
            >
              ENTER THE STORY
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewCards;
