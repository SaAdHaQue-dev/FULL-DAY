import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Check } from 'lucide-react';
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

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setBrowserSupported(false);
    }
  }, [isVoiceModalOpen]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // ignore
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-[28px] border border-[#EDE8F5] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#EDE8F5] pb-3">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-[#6C5CE7]" />
            <h3 className="font-black text-[#1E1B2E]">Voice Task Assistant</h3>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="rounded-full p-1.5 text-[#8B88A0] hover:bg-[#F4F3F8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Microphone Pulse Circle */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-[#6C5CE7]/20 animate-ping" />
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95 ${
                isListening
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                  : 'bg-[#6C5CE7] hover:bg-[#5B4BC4] shadow-[#6C5CE7]/30'
              }`}
            >
              {isListening ? <Mic className="h-8 w-8 animate-pulse" /> : <MicOff className="h-8 w-8" />}
            </button>
          </div>
          <p className="mt-4 text-xs font-bold text-[#8B88A0]">
            {isListening ? 'Listening... Speak your task clearly' : 'Click to start voice recording'}
          </p>
        </div>

        {/* Transcript Input / Edit */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B88A0]">
            Recognized Speech / Edit Text
          </label>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder='Try: "Schedule meeting tomorrow with urgent priority"'
            className="w-full rounded-2xl border border-[#EDE8F5] bg-[#F8F9FE] p-3 text-xs text-[#1E1B2E] focus:outline-hidden focus:border-[#6C5CE7]"
          />

          {!browserSupported && (
            <p className="text-[11px] text-amber-600">
              Note: Speech recognition is not supported in this browser. You can type commands directly above.
            </p>
          )}

          {/* Parsed Preview Card */}
          {parsedPreview && (
            <div className="rounded-2xl border border-[#E4E0FA] bg-[#F0EFFF] p-3.5 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#6C5CE7]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Proposed Task:</span>
              </div>
              <p className="font-extrabold text-[#1E1B2E]">{parsedPreview.title}</p>
              <div className="flex items-center gap-3 text-[11px] text-[#8B88A0]">
                <span>Priority: <strong className="capitalize text-[#1E1B2E]">{parsedPreview.priority}</strong></span>
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
                className="flex items-center gap-1.5 rounded-full bg-[#6C5CE7] px-5 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#5B4BC4] disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{processing ? 'Analyzing...' : 'Parse with AI'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmCreate}
                className="flex items-center gap-1.5 rounded-full bg-[#6C5CE7] px-5 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#5B4BC4]"
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>Save to Tasks</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
