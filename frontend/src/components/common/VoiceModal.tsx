import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Check,
  Calendar,
  Clock,
  Flame,
  ArrowRight,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { aiService, AIParsedTask } from '../../services/aiService';

export const VoiceModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, createTask } = useTasks();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [browserSupported, setBrowserSupported] = useState(true);
  const [parsedPreview, setParsedPreview] = useState<AIParsedTask | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  // Initialize and auto-start speech recognition when modal opens
  useEffect(() => {
    if (!isVoiceModalOpen) {
      stopListening();
      setTranscript('');
      setParsedPreview(null);
      setSavedSuccess(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        const trimmed = currentTranscript.trim();
        if (trimmed) {
          setTranscript(trimmed);
          parseSpeechRealtime(trimmed);

          // Reset silence timer for auto-save if enabled
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          if (autoSaveEnabled) {
            silenceTimerRef.current = setTimeout(() => {
              handleAutoSave(trimmed);
            }, 2500); // 2.5 seconds pause triggers auto-store
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // Auto-start listening on open
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        // user interaction required in some browsers
      }
    } catch {
      setBrowserSupported(false);
    }

    return () => {
      stopListening();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isVoiceModalOpen, autoSaveEnabled]);

  const parseSpeechRealtime = async (text: string) => {
    if (!text.trim()) return;
    try {
      const parsed = await aiService.parseNaturalLanguageTask(text);
      setParsedPreview(parsed);
    } catch {
      // fallback
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setSavedSuccess(false);
      } catch {
        // ignore if already started
      }
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  };

  const handleAutoSave = async (text: string) => {
    if (!text.trim() || isSaving || savedSuccess) return;
    await executeSaveTask(text);
  };

  const executeSaveTask = async (customText?: string) => {
    const textToSave = customText || transcript;
    if (!textToSave.trim() || isSaving) return;

    setIsSaving(true);
    stopListening();

    try {
      const parsed = parsedPreview || (await aiService.parseNaturalLanguageTask(textToSave));

      await createTask({
        title: parsed.title,
        description: parsed.description,
        priority: parsed.priority,
        due_at: parsed.due_date,
      });

      setSavedSuccess(true);

      // Play soft confirmation sound
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.36);
        }
      } catch {
        // sound optional
      }
    } catch (err) {
      console.error('Failed to save voice task:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForAnother = () => {
    setTranscript('');
    setParsedPreview(null);
    setSavedSuccess(false);
    startListening();
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-[32px] border border-[#EDE8F5] bg-white p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#EDE8F5] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0EFFF] text-[#6C5CE7]">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1E1B2E]">Voice Task Storing</h3>
              <p className="text-[10px] text-[#8B88A0] font-semibold">Speak & Store Automatically</p>
            </div>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F3F8] text-[#8B88A0] hover:text-[#1E1B2E] hover:bg-[#EDE8F5] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Pulsing Microphone Visual & Live Wave */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="relative flex items-center justify-center">
            {/* Concentric Pulsing Audio Waves */}
            {isListening && (
              <>
                <div className="absolute h-36 w-36 rounded-full bg-[#6C5CE7]/10 animate-ping duration-1000" />
                <div className="absolute h-28 w-28 rounded-full bg-[#6C5CE7]/20" />
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-transform active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-[#FF5E8E] to-[#FF85A8] shadow-rose-500/30'
                  : 'bg-gradient-to-tr from-[#6C5CE7] to-[#8070F8] shadow-[#6C5CE7]/30'
              }`}
            >
              {isListening ? (
                <Mic className="h-8 w-8 animate-pulse" />
              ) : (
                <MicOff className="h-8 w-8" />
              )}
            </button>
          </div>

          <p className="mt-4 text-xs font-black text-[#1E1B2E]">
            {isListening ? (
              <span className="flex items-center justify-center gap-1.5 text-[#6C5CE7]">
                <span>Listening... Speak your task now</span>
                <span className="flex items-center gap-0.5">
                  <span className="h-1.5 w-0.5 rounded-full bg-[#6C5CE7] animate-pulse" />
                  <span className="h-3 w-0.5 rounded-full bg-[#6C5CE7] animate-pulse delay-75" />
                  <span className="h-1.5 w-0.5 rounded-full bg-[#6C5CE7] animate-pulse delay-150" />
                </span>
              </span>
            ) : (
              'Tap microphone to start speaking'
            )}
          </p>

          <p className="text-[10px] text-[#8B88A0] font-medium mt-0.5">
            e.g. "Prepare client proposal tomorrow with urgent priority"
          </p>
        </div>

        {/* Live Speech Recognition Box */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#EDE8F5] bg-[#F8F9FE] p-3.5 min-h-16 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8B88A0]">
              Recognized Speech
            </span>
            <p className="text-xs font-extrabold text-[#1E1B2E] mt-1 break-words">
              {transcript || (
                <span className="text-[#A09CB0] font-normal italic">
                  Your spoken task will appear here in real-time...
                </span>
              )}
            </p>
          </div>

          {!browserSupported && (
            <p className="text-[10px] text-amber-600 font-bold bg-amber-50 p-2 rounded-xl">
              Note: Speech recognition requires Chrome, Edge, or a supported browser with microphone permission.
            </p>
          )}

          {/* Real-time Extracted Task Preview Card */}
          {parsedPreview && !savedSuccess && (
            <div className="rounded-2xl border border-[#E4E0FA] bg-[#F0EFFF] p-3 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-[10px] font-black text-[#6C5CE7]">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Auto-Parsed Task:</span>
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 uppercase tracking-wider ${
                    parsedPreview.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-600'
                      : parsedPreview.priority === 'high'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-white text-[#6C5CE7]'
                  }`}
                >
                  {parsedPreview.priority}
                </span>
              </div>

              <p className="text-xs font-black text-[#1E1B2E] truncate">
                {parsedPreview.title}
              </p>

              {parsedPreview.due_date && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6C5CE7]">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {new Date(parsedPreview.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Success Banner */}
          {savedSuccess && (
            <div className="rounded-2xl bg-[#E8F8F0] p-3 text-center text-xs font-black text-[#16A34A] border border-[#D1F2DE] animate-in zoom-in-95 flex items-center justify-center gap-2">
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Task stored in database successfully! 🎉</span>
            </div>
          )}

          {/* Auto-Save Toggle */}
          <div className="flex items-center justify-between py-1 text-xs px-1">
            <span className="text-[11px] font-bold text-[#8B88A0]">
              Auto-store when I finish speaking
            </span>
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="h-4 w-4 rounded-md accent-[#6C5CE7] cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#EDE8F5] flex items-center gap-2">
            {savedSuccess ? (
              <button
                type="button"
                onClick={handleResetForAnother}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#6C5CE7] py-3 text-xs font-black text-white shadow-md shadow-[#6C5CE7]/25 hover:bg-[#5B4BC4] transition-all"
              >
                <Mic className="h-4 w-4" />
                <span>Speak Another Task</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => executeSaveTask()}
                disabled={isSaving || !transcript.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#6C5CE7] py-3 text-xs font-black text-white shadow-md shadow-[#6C5CE7]/25 hover:bg-[#5B4BC4] disabled:opacity-40 transition-all"
              >
                <Check className="h-4 w-4 stroke-[3]" />
                <span>{isSaving ? 'Storing Task...' : 'Store Task Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
