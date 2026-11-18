import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  CheckCircle2,
  Sliders,
  Flame,
  Award,
} from 'lucide-react';
import {
  ambientSoundService,
  SoundType,
  SOUND_PRESETS,
} from '../../services/ambientSoundService';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({ isOpen, onClose }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSound, setSelectedSound] = useState<SoundType>('birds');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [showSoundPicker, setShowSoundPicker] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Sync volume with service on mount
  useEffect(() => {
    setVolume(Math.round(ambientSoundService.getVolume() * 100));
    setIsMuted(ambientSoundService.getIsMuted());
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Session Completed!
      setIsRunning(false);
      ambientSoundService.stop();
      ambientSoundService.playCompletionBell();
      setSessionCompleted(true);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Audio Playback Synchronization with Timer
  useEffect(() => {
    if (isRunning) {
      if (selectedSound !== 'none' && !isMuted) {
        ambientSoundService.startSound(selectedSound);
      } else {
        ambientSoundService.stop();
      }
    } else {
      ambientSoundService.stop();
    }
  }, [isRunning, selectedSound, isMuted]);

  // Handle closing modal
  const handleClose = () => {
    ambientSoundService.stop();
    setIsRunning(false);
    onClose();
  };

  const handleStartPause = () => {
    if (sessionCompleted) {
      setSessionCompleted(false);
      setTimeLeft(selectedDuration);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    ambientSoundService.stop();
    setTimeLeft(selectedDuration);
    setSessionCompleted(false);
  };

  const handleSelectDuration = (seconds: number) => {
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    ambientSoundService.stop();
    setSessionCompleted(false);
  };

  const handleSelectSound = (soundId: SoundType) => {
    setSelectedSound(soundId);
    if (isRunning) {
      if (soundId === 'none') {
        ambientSoundService.stop();
      } else {
        ambientSoundService.startSound(soundId);
      }
    }
  };

  const handleToggleMute = () => {
    const muted = ambientSoundService.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    ambientSoundService.setVolume(newVol / 100);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Progress percentage for circular ring
  const progressPercent =
    selectedDuration > 0 ? ((selectedDuration - timeLeft) / selectedDuration) * 100 : 0;

  const currentPreset = SOUND_PRESETS.find((p) => p.id === selectedSound) || SOUND_PRESETS[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl border border-[#EDE8F5] relative overflow-hidden flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE8F5]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0EFFF] text-[#6C5CE7]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1E1B2E]">Focus Timer</h3>
              <p className="text-[10px] text-[#8B88A0] font-semibold">Ambient Flow Session</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F3F8] text-[#8B88A0] hover:text-[#1E1B2E] hover:bg-[#EDE8F5] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Duration Segmented Pills */}
        <div className="flex items-center justify-center gap-1.5 my-4 bg-[#F8F9FE] p-1.5 rounded-2xl border border-[#EDE8F5]">
          {[
            { label: '25m Flow', secs: 25 * 60 },
            { label: '15m Sprint', secs: 15 * 60 },
            { label: '45m Deep', secs: 45 * 60 },
            { label: '5m Rest', secs: 5 * 60 },
          ].map((item) => (
            <button
              key={item.secs}
              onClick={() => handleSelectDuration(item.secs)}
              className={`flex-1 rounded-xl py-1.5 text-[11px] font-black transition-all ${
                selectedDuration === item.secs
                  ? 'bg-[#6C5CE7] text-white shadow-xs scale-102'
                  : 'text-[#8B88A0] hover:text-[#1E1B2E]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Circular Progress & Big Digital Timer */}
        <div className="flex flex-col items-center justify-center my-3 relative">
          <div className="relative flex items-center justify-center w-52 h-52">
            {/* SVG Circular Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="#F0EFFF"
                strokeWidth="7"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="#6C5CE7"
                strokeWidth="7"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-4xl font-black text-[#1E1B2E] tracking-tight font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-bold text-[#8B88A0] uppercase tracking-wider mt-1">
                {isRunning ? 'Flow in Progress' : 'Ready to Start'}
              </span>

              {/* Sound status pill */}
              <div className="mt-2 flex items-center gap-1.5 rounded-full bg-[#F4F3F8] px-2.5 py-0.5 text-[10px] font-bold text-[#6C5CE7]">
                <span>{currentPreset.icon}</span>
                <span>{isMuted || selectedSound === 'none' ? 'Muted' : currentPreset.name}</span>
                {isRunning && !isMuted && selectedSound !== 'none' && (
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className="h-1.5 w-0.5 rounded-full bg-[#6C5CE7] animate-pulse" />
                    <span className="h-2.5 w-0.5 rounded-full bg-[#6C5CE7] animate-pulse delay-75" />
                    <span className="h-1.5 w-0.5 rounded-full bg-[#6C5CE7] animate-pulse delay-150" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Soundscape Controller Card */}
        <div className="rounded-2xl bg-[#F8F9FE] p-3.5 border border-[#EDE8F5] my-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentPreset.icon}</span>
              <div>
                <p className="text-xs font-black text-[#1E1B2E]">
                  {currentPreset.name}
                </p>
                <p className="text-[10px] text-[#8B88A0] font-medium leading-none">
                  {currentPreset.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Selector Dropdown Toggle */}
              <button
                type="button"
                onClick={() => setShowSoundPicker(!showSoundPicker)}
                className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-[#6C5CE7] border border-[#EDE8F5] shadow-2xs hover:bg-[#FAF9FF]"
              >
                Change
              </button>

              {/* Mute / Unmute Button */}
              <button
                type="button"
                onClick={handleToggleMute}
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  isMuted || selectedSound === 'none'
                    ? 'bg-[#FFEBF3] text-[#FF5E8E]'
                    : 'bg-[#E8F8F0] text-[#20C997]'
                }`}
              >
                {isMuted || selectedSound === 'none' ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Sound Presets Expanded Picker */}
          {showSoundPicker && (
            <div className="pt-2 border-t border-[#EDE8F5] grid grid-cols-2 gap-1.5 animate-in fade-in">
              {SOUND_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    handleSelectSound(preset.id);
                    setShowSoundPicker(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl p-2 text-left transition-all ${
                    selectedSound === preset.id
                      ? 'bg-[#6C5CE7] text-white shadow-2xs font-extrabold'
                      : 'bg-white text-[#1E1B2E] border border-[#EDE8F5] hover:border-[#6C5CE7]/40 font-bold'
                  }`}
                >
                  <span className="text-base">{preset.icon}</span>
                  <span className="text-[11px] truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Volume Slider */}
          <div className="flex items-center gap-2 pt-1">
            <Volume2 className="h-3.5 w-3.5 text-[#8B88A0] shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-[#EDE8F5] rounded-lg appearance-none cursor-pointer accent-[#6C5CE7]"
            />
            <span className="text-[10px] font-bold text-[#8B88A0] w-7 text-right">
              {isMuted ? '0%' : `${volume}%`}
            </span>
          </div>
        </div>

        {/* Session Finished Notification */}
        {sessionCompleted && (
          <div className="rounded-2xl bg-[#E8F8F0] p-3 text-center text-xs font-black text-[#16A34A] border border-[#D1F2DE] animate-in zoom-in-95 my-2 flex items-center justify-center gap-2">
            <Award className="h-4 w-4" />
            <span>🎉 Session complete! You focused for {selectedDuration / 60}m (+50 XP)</span>
          </div>
        )}

        {/* Bottom Play / Pause / Reset Controls */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#EDE8F5]">
          <button
            onClick={handleStartPause}
            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black text-white shadow-md transition-all active:scale-98 ${
              isRunning
                ? 'bg-[#FFAE33] hover:bg-[#E89922] shadow-[#FFAE33]/30 text-[#1E1B2E]'
                : 'bg-[#6C5CE7] hover:bg-[#5B4BC4] shadow-[#6C5CE7]/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>{sessionCompleted ? 'Start Another Session' : 'Start Focus Flow'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Reset Timer"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F3F8] text-[#8B88A0] hover:text-[#1E1B2E] hover:bg-[#EDE8F5] transition-colors shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
