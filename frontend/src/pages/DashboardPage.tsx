import React, { useState } from 'react';
import {
  Flame,
  Menu,
  ChevronRight,
  Target,
  Gift,
  BookOpen,
  Headphones,
  Mic,
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { WeatherWidget } from '../components/weather/WeatherWidget';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { tasks, projects, counts, setIsQuickAddOpen, setIsVoiceModalOpen, setIsAIModalOpen, toggleTaskComplete } = useTasks();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [activeGoalProgress, setActiveGoalProgress] = useState(12);
  const goalTotal = 20;

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const currentHeroTask = pendingTasks[0] || tasks[0] || {
    id: 'hero-1',
    title: 'Spanish for Beginners',
    description: 'Master core conversational phrases and vocabulary',
    time_slot: '35 mins remaining',
  };

  const projectItems = [
    {
      id: 'p-1',
      title: 'Spanish for Beginners',
      flag: '🇪🇸',
      progress: 65,
      color: 'bg-[#FF5E8E]',
      subtitle: '65% Completed',
    },
    {
      id: 'p-2',
      title: 'French Essentials',
      flag: '🇫🇷',
      progress: 40,
      color: 'bg-[#339AF0]',
      subtitle: '40% Completed',
    },
    {
      id: 'p-3',
      title: 'Japanese Basics',
      flag: '🇯🇵',
      progress: 20,
      color: 'bg-[#FFAE33]',
      subtitle: '20% Completed',
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Bar: Menu Hamburger & Streak Flame Badge */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button
          onClick={() => navigate('/profile')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#1E1B2E] hover:bg-[#EDE8F5] transition-colors"
          title="Profile Menu"
        >
          <Menu className="h-5 w-5 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-2">
          {/* Weather Pill */}
          <WeatherWidget compact={true} />

          {/* Flame Streak Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#FFF5E5] px-3.5 py-1.5 text-xs font-black text-[#FF922B] border border-[#FFE8C2] shadow-xs">
            <Flame className="h-4 w-4 fill-[#FF922B] text-[#FF922B]" />
            <span>12</span>
          </div>
        </div>
      </div>

      {/* Greeting Title */}
      <div>
        <h1 className="text-2xl font-black text-[#1E1B2E] tracking-tight">
          Hello, {profile.display_name || 'Saad'}! 👋
        </h1>
        <p className="mt-0.5 text-xs font-medium text-[#8B88A0]">
          What do you want to learn today?
        </p>
      </div>

      {/* Hero Purple Gradient Card (Pick up where you left off) */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#7C5CE7] via-[#7455E4] to-[#6C5CE7] p-5 text-white shadow-lg shadow-[#6C5CE7]/20">
        {/* Cute Floating Badge */}
        <div className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-white">
          ¡Hola!
        </div>

        <div className="relative z-10 max-w-[65%] space-y-2">
          <p className="text-[11px] font-semibold text-white/80">
            Pick up where you left off
          </p>
          <h2 className="text-lg font-black leading-snug tracking-tight text-white">
            {currentHeroTask.title}
          </h2>

          {/* Progress Bar */}
          <div className="pt-1 pb-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-white/90 mb-1">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/25 overflow-hidden">
              <div className="h-full rounded-full bg-white transition-all duration-500 w-[65%]" />
            </div>
          </div>

          <button
            onClick={() => navigate('/practice')}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#6C5CE7] shadow-sm hover:bg-[#F8F9FE] active:scale-95 transition-all"
          >
            <span>Continue Learning</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Friendly Character Vector Illustration */}
        <div className="absolute right-3 bottom-0 pointer-events-none">
          <svg width="125" height="120" viewBox="0 0 120 120" fill="none">
            {/* Hair */}
            <path d="M40 50 C35 30, 85 20, 85 50 C85 70, 75 75, 75 80 Z" fill="#3D291D" />
            {/* Face */}
            <circle cx="60" cy="55" r="22" fill="#FFDFC4" />
            {/* Hair Front */}
            <path d="M42 42 C50 35, 75 35, 78 45 C75 42, 60 40, 42 42 Z" fill="#3D291D" />
            {/* Eyes & Smile */}
            <circle cx="53" cy="53" r="2.5" fill="#3D291D" />
            <circle cx="67" cy="53" r="2.5" fill="#3D291D" />
            <path d="M57 62 Q60 65 63 62" stroke="#3D291D" strokeWidth="2" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="50" cy="57" r="3" fill="#FFA5A5" opacity="0.6" />
            <circle cx="70" cy="57" r="3" fill="#FFA5A5" opacity="0.6" />
            {/* Body / Shirt */}
            <path d="M35 110 C35 85, 85 85, 85 110 Z" fill="#FFC043" />
            {/* Book / Notebook in hand */}
            <rect x="68" y="80" width="22" height="28" rx="3" fill="#5451D8" transform="rotate(-10 68 80)" />
            {/* Waving Hand */}
            <circle cx="34" cy="72" r="7" fill="#FFDFC4" />
          </svg>
        </div>
      </div>

      {/* My Courses / Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black text-[#1E1B2E] tracking-tight">
            My Courses
          </h3>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs font-bold text-[#6C5CE7] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {projectItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/practice')}
              className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-xs border border-[#EDE8F5] hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.flag}</span>
                <div>
                  <h4 className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-semibold text-[#8B88A0] mt-0.5">
                    {item.subtitle}
                  </p>
                  <div className="w-32 h-1.5 rounded-full bg-[#F4F3F8] mt-1.5 overflow-hidden">
                    <div
                      style={{ width: `${item.progress}%` }}
                      className="h-full rounded-full bg-[#6C5CE7]"
                    />
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Today's Goal Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base font-black text-[#1E1B2E] tracking-tight">
            Today's Goal
          </h3>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="text-xs font-bold text-[#6C5CE7] hover:underline"
          >
            Edit Goal
          </button>
        </div>

        <div className="flex items-center justify-between rounded-[24px] bg-[#F0EFFF] p-4 border border-[#E4E0FA]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#6C5CE7] shadow-xs">
              <Target className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#1E1B2E]">
                Learn 20 new words
              </h4>
              <p className="text-[11px] font-bold text-[#6C5CE7] mt-0.5">
                {activeGoalProgress} / {goalTotal} words
              </p>
              <div className="w-36 h-1.5 rounded-full bg-white mt-1.5 overflow-hidden">
                <div
                  style={{ width: `${(activeGoalProgress / goalTotal) * 100}%` }}
                  className="h-full rounded-full bg-[#6C5CE7]"
                />
              </div>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFEBF3] text-[#FF5E8E]">
            <Gift className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Quick Practice Actions (4 Circular Pastel Buttons) */}
      <div>
        <div className="mb-3">
          <h3 className="text-base font-black text-[#1E1B2E] tracking-tight">
            Quick Practice
          </h3>
          <p className="text-[11px] font-medium text-[#8B88A0]">
            Practice anytime, anywhere
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Action 1: Vocabulary */}
          <button
            onClick={() => navigate('/practice')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#EBF5FF] text-[#339AF0] group-hover:scale-105 active:scale-95 transition-transform shadow-xs">
              <span className="text-base font-black">Aa</span>
            </div>
            <span className="text-[11px] font-bold text-[#1E1B2E]">Vocabulary</span>
          </button>

          {/* Action 2: Listening / Timer */}
          <button
            onClick={() => navigate('/practice')}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#FFEBF3] text-[#FF5E8E] group-hover:scale-105 active:scale-95 transition-transform shadow-xs">
              <Headphones className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-[#1E1B2E]">Listening</span>
          </button>

          {/* Action 3: Speaking / Voice Assistant */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#E8F8F0] text-[#20C997] group-hover:scale-105 active:scale-95 transition-transform shadow-xs">
              <Mic className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-[#1E1B2E]">Speaking</span>
          </button>

          {/* Action 4: Grammar / AI Assistant */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#FFF5E5] text-[#FF922B] group-hover:scale-105 active:scale-95 transition-transform shadow-xs">
              <FileText className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-[#1E1B2E]">Grammar</span>
          </button>
        </div>
      </div>

      {/* Floating Action Quick Add */}
      <div className="pt-2">
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#6C5CE7] py-3 text-xs font-black text-white shadow-md shadow-[#6C5CE7]/25 hover:bg-[#5B4BC4] active:scale-98 transition-all"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add Custom Task or Word</span>
        </button>
      </div>
    </div>
  );
};
