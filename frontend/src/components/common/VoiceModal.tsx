import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { aiService } from '../../services/aiService';

export const VoiceModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, createTask } = useTasks();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [browserSupported, setBrowserSupported] = useState(true);
  const [parsedPreview, setParsedPreview] = useState<{
    title: string;
    priority: string;
    due_date: string | null;
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isVoiceModalOpen) {
      stopListening();
      setTranscript('');
      setParsedPreview(null);
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
        setTranscript(currentTranscript);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      startListening();
    } catch {
      setBrowserSupported(false);
    }

    return () => {
      stopListening();
    };
  }, [isVoiceModalOpen]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  };

  const handleParse = async () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    try {
      const parsed = await aiService.parseNaturalLanguageTask(transcript);
      setParsedPreview({
        title: parsed.title,
        priority: parsed.priority,
        due_date: parsed.due_date,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmCreate = async () => {
    if (!parsedPreview) return;
    try {
      await createTask({
        title: parsedPreview.title,
        priority: parsedPreview.priority as any,
        due_at: parsedPreview.due_date,
      });
      setIsVoiceModalOpen(false);
    } catch (err) {
      console.error('Failed to create voice task:', err);
    }
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Voice Task Assistant</h3>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Microphone Pulse Circle */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-indigo-500/20 animate-ping" />
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
              }`}
            >
              {isListening ? <Mic className="h-8 w-8 animate-pulse" /> : <MicOff className="h-8 w-8" />}
            </button>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">
            {isListening ? 'Listening... Speak your task clearly' : 'Click to start voice recording'}
          </p>
        </div>

        {/* Transcript Input / Edit */}
        <div className="space-y-3">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Recognized Speech / Edit Text
          </label>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder='Try: "Schedule marketing presentation for tomorrow with urgent priority"'
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
          />

          {!browserSupported && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              Note: Speech recognition is not supported in this browser. You can type commands directly above.
            </p>
          )}

          {/* Parsed Preview Card */}
          {parsedPreview && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs space-y-1.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Proposed Task:</span>
              </div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{parsedPreview.title}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>Priority: <strong className="capitalize">{parsedPreview.priority}</strong></span>
                {parsedPreview.due_date && <span>Due: <strong>{new Date(parsedPreview.due_date).toLocaleDateString()}</strong></span>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {!parsedPreview ? (
              <button
                type="button"
                onClick={handleParse}
                disabled={processing || !transcript.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <span>{processing ? 'Analyzing...' : 'Parse Command'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmCreate}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Confirm & Create</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
