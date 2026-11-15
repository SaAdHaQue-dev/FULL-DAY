import React, { useState } from 'react';
import {
  ChevronLeft,
  Settings,
  Heart,
  Volume2,
  Mic,
  MicOff,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();

  // Mode: 'translate' or 'speak'
  const [mode, setMode] = useState<'translate' | 'speak'>('translate');

  // Translation practice state
  const availableWords = ['How', 'are', 'you', '?'];
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Speaking practice state
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [speakSuccess, setSpeakSuccess] = useState(false);

  const handleWordClick = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
    setIsAnswerChecked(false);
  };

  const handleCheckAnswer = () => {
    const answer = selectedWords.join(' ');
    if (answer === 'How are you ?' || answer === 'How are you') {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
    setIsAnswerChecked(true);
  };

  const handleToggleSpeak = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Mock for browser without speech API
      setIsListening(true);
      setTimeout(() => {
        setSpokenText('Good morning!');
        setIsListening(false);
        setSpeakSuccess(true);
      }, 1500);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';

      if (!isListening) {
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpokenText(transcript);
          setIsListening(false);
          if (transcript.toLowerCase().includes('good morning')) {
            setSpeakSuccess(true);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 min-h-[640px] flex flex-col justify-between">
      <div>
        {/* Top Header: Back, Mode Switcher, Hearts */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#1E1B2E] hover:bg-[#EDE8F5] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Mode Pill Toggle (Lesson vs Speak) */}
          <div className="inline-flex rounded-full bg-[#F4F3F8] p-1">
            <button
              onClick={() => setMode('translate')}
              className={`rounded-full px-4 py-1 text-xs font-bold transition-all ${
                mode === 'translate'
                  ? 'bg-white text-[#6C5CE7] shadow-xs'
                  : 'text-[#8B88A0] hover:text-[#1E1B2E]'
              }`}
            >
              Lesson
            </button>
            <button
              onClick={() => setMode('speak')}
              className={`rounded-full px-4 py-1 text-xs font-bold transition-all ${
                mode === 'speak'
                  ? 'bg-white text-[#6C5CE7] shadow-xs'
                  : 'text-[#8B88A0] hover:text-[#1E1B2E]'
              }`}
            >
              Speak
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-[#FF5E8E]">
            <Heart className="h-4 w-4 fill-[#FF5E8E]" />
            <span>5</span>
          </div>
        </div>

        {/* Progress Bar (matching top-right screen: 3/10) */}
        <div className="flex items-center gap-2 my-2">
          <span className="text-[11px] font-bold text-[#8B88A0]">
            {mode === 'translate' ? '3/10' : '2/10'}
          </span>
          <div className="flex-1 h-2 rounded-full bg-[#F0EFFF] overflow-hidden">
            <div
              style={{ width: mode === 'translate' ? '30%' : '20%' }}
              className="h-full rounded-full bg-[#6C5CE7] transition-all duration-300"
            />
          </div>
        </div>

        {/* MODE 1: TRANSLATE THIS SENTENCE (Screen Top Right) */}
        {mode === 'translate' && (
          <div className="space-y-5 pt-3">
            <div>
              <h2 className="text-base font-black text-[#1E1B2E] tracking-tight">
                Translate this sentence
              </h2>
            </div>

            {/* Character & Speech Bubble Card */}
            <div className="rounded-[28px] bg-[#F8F9FE] p-6 border border-[#EDE8F5] flex items-center gap-4">
              {/* Cute Boy Character Illustration */}
              <div className="shrink-0">
                <svg width="85" height="85" viewBox="0 0 100 100" fill="none">
                  {/* Hair */}
                  <path d="M30 40 C25 20, 75 15, 75 40 C75 55, 68 60, 68 65 Z" fill="#4A3427" />
                  {/* Face */}
                  <circle cx="50" cy="48" r="20" fill="#FFDFC4" />
                  {/* Hair Tuft */}
                  <path d="M35 35 Q50 25 65 35" stroke="#4A3427" strokeWidth="6" strokeLinecap="round" />
                  {/* Eyes & Smile */}
                  <circle cx="44" cy="46" r="2" fill="#4A3427" />
                  <circle cx="56" cy="46" r="2" fill="#4A3427" />
                  <path d="M47 54 Q50 57 53 54" stroke="#4A3427" strokeWidth="2" strokeLinecap="round" />
                  {/* Cheeks */}
                  <circle cx="41" cy="50" r="2.5" fill="#FF9A9A" opacity="0.6" />
                  <circle cx="59" cy="50" r="2.5" fill="#FF9A9A" opacity="0.6" />
                  {/* Shirt */}
                  <path d="M28 95 C28 72, 72 72, 72 95 Z" fill="#E86C45" />
                  {/* Coffee Cup */}
                  <rect x="58" y="72" width="14" height="18" rx="3" fill="#FFFFFF" />
                  <ellipse cx="65" cy="72" rx="7" ry="2" fill="#E2DDD5" />
                </svg>
              </div>

              {/* Speech Bubble */}
              <div className="relative rounded-2xl bg-white px-4 py-3 shadow-xs border border-[#EDE8F5] flex items-center gap-2">
                <button
                  type="button"
                  title="Play audio"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0EFFF] text-[#6C5CE7] hover:scale-105 active:scale-95 transition-transform"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <span className="text-sm font-extrabold text-[#1E1B2E]">
                  ¿Cómo estás?
                </span>
              </div>
            </div>

            {/* Answer Display Boxes */}
            <div className="min-h-14 rounded-2xl border-2 border-dashed border-[#EDE8F5] p-2 flex flex-wrap items-center justify-center gap-2 bg-[#FCFBFF]">
              {selectedWords.length === 0 ? (
                <span className="text-xs font-semibold text-[#A09CB0]">
                  Tap words below to build your translation
                </span>
              ) : (
                selectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWordClick(word)}
                    className="rounded-xl bg-[#6C5CE7] px-4 py-2 text-xs font-bold text-white shadow-xs animate-in zoom-in-95"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {/* Available Word Bank */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {availableWords.map((word) => {
                const isSelected = selectedWords.includes(word);
                return (
                  <button
                    key={word}
                    disabled={isSelected}
                    onClick={() => handleWordClick(word)}
                    className={`rounded-2xl border px-5 py-2.5 text-xs font-extrabold transition-all ${
                      isSelected
                        ? 'border-transparent bg-[#F4F3F8] text-[#C4C0D0] cursor-not-allowed'
                        : 'border-[#EDE8F5] bg-white text-[#1E1B2E] shadow-2xs hover:border-[#6C5CE7] hover:text-[#6C5CE7] active:scale-95'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Feedback message if checked */}
            {isAnswerChecked && (
              <div
                className={`rounded-2xl p-3.5 text-center text-xs font-extrabold animate-in fade-in ${
                  isAnswerCorrect
                    ? 'bg-[#E8F8F0] text-[#16A34A] border border-[#D1F2DE]'
                    : 'bg-[#FFEBF3] text-[#E02475] border border-[#FFD6E5]'
                }`}
              >
                {isAnswerCorrect
                  ? '🎉 Amazing! That is correct (+15 XP)'
                  : 'Not quite! Try: How are you?'}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: SPEAK THIS SENTENCE (Screen Middle Right) */}
        {mode === 'speak' && (
          <div className="space-y-6 pt-4 text-center">
            <div>
              <p className="text-xs font-semibold text-[#8B88A0] uppercase tracking-wider">
                Pronunciation
              </p>
              <h2 className="text-base font-black text-[#1E1B2E] tracking-tight mt-1">
                Speak this sentence
              </h2>
            </div>

            <div className="my-6">
              <span className="text-2xl font-black text-[#1E1B2E] tracking-tight">
                Good morning!
              </span>
            </div>

            {/* Large Pulsing Purple Microphone Button (matching screenshot) */}
            <div className="flex justify-center my-8">
              <div className="relative flex items-center justify-center">
                {/* Outer concentric rings */}
                <div
                  className={`absolute h-36 w-36 rounded-full bg-[#6C5CE7]/10 transition-all ${
                    isListening ? 'animate-ping' : ''
                  }`}
                />
                <div className="absolute h-28 w-28 rounded-full bg-[#6C5CE7]/20" />
                <button
                  onClick={handleToggleSpeak}
                  className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#6C5CE7] text-white shadow-xl shadow-[#6C5CE7]/30 hover:scale-105 active:scale-95 transition-transform"
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8 animate-pulse" />
                  ) : (
                    <Mic className="h-8 w-8 stroke-[2.2]" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs font-bold text-[#8B88A0]">
              {isListening ? 'Listening... Speak now!' : 'Tap the mic and speak'}
            </p>

            {spokenText && (
              <div className="rounded-2xl bg-[#F8F9FE] p-3 text-xs font-bold text-[#1E1B2E] border border-[#EDE8F5]">
                You said: "{spokenText}"
              </div>
            )}

            {speakSuccess && (
              <div className="rounded-2xl bg-[#E8F8F0] p-3 text-xs font-extrabold text-[#16A34A] border border-[#D1F2DE]">
                ✨ Perfect pronunciation! (+20 XP)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Button: Check / Continue */}
      <div className="pt-4 border-t border-[#EDE8F5]">
        {mode === 'translate' ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedWords.length === 0}
            className={`w-full rounded-2xl py-3.5 text-xs font-black shadow-md transition-all active:scale-98 ${
              selectedWords.length === 0
                ? 'bg-[#E4E0FA] text-[#A09CB0] cursor-not-allowed'
                : 'bg-[#6C5CE7] text-white shadow-[#6C5CE7]/25 hover:bg-[#5B4BC4]'
            }`}
          >
            Check
          </button>
        ) : (
          <button
            onClick={() => {
              setSpokenText('');
              setSpeakSuccess(false);
            }}
            className="w-full rounded-2xl bg-[#6C5CE7] py-3.5 text-xs font-black text-white shadow-md shadow-[#6C5CE7]/25 hover:bg-[#5B4BC4] active:scale-98 transition-all"
          >
            {speakSuccess ? 'Next Sentence →' : 'Try Again'}
          </button>
        )}
      </div>
    </div>
  );
};
