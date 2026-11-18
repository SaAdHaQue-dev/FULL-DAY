import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Smile,
  Zap,
  Play,
  Pause,
  RotateCcw,
  BarChart2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

export const ProductivityStatsView: React.FC = () => {
  const { tasks, counts, setIsTimerOpen } = useTasks();
  const { profile } = useAuth();

  const [timeframe, setTimeframe] = useState<'Week' | 'Month' | 'Quarter'>('Week');
  const [selectedTag, setSelectedTag] = useState<string>('Deep Flow');

  const completedCount = counts.completed || tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = counts.all || tasks.filter((t) => t.status !== 'completed').length;
  const totalTasks = completedCount + pendingCount;
  const score = completedCount * 125 + 500; // dynamic personal productivity score

  const weekDayDots = [
    { day: 'S', date: '17', status: 'done', score: 85 },
    { day: 'M', date: '18', status: 'done', score: 90 },
    { day: 'T', date: '19', status: 'done', score: 95 },
    { day: 'W', date: '20', status: 'active', score: 98, activeValue: '2.5' },
    { day: 'T', date: '21', status: 'pending', score: 60 },
    { day: 'F', date: '22', status: 'upcoming', score: 0 },
    { day: 'S', date: '23', status: 'upcoming', score: 0 },
  ];

  const tagPills = [
    { label: 'Deep Flow', icon: '😊', bg: 'bg-[#FFF3E8] text-[#D96B27] border-[#FFE2C9]' },
    { label: 'High Focus', icon: '⚡', bg: 'bg-[#F2EDFF] text-[#7065F0] border-[#E2D8FF]' },
    { label: 'Zero Distraction', icon: '🎯', bg: 'bg-[#FFF0F5] text-[#E02475] border-[#FFD6E5]' },
    { label: 'Sprint Review', icon: '🌙', bg: 'bg-[#EBF7FF] text-[#0284C7] border-[#CFEEFF]' },
    { label: 'Wellness Break', icon: '🌿', bg: 'bg-[#EDFAF2] text-[#16A34A] border-[#D1F2DE]' },
  ];

  const barChartDays = [
    { label: 'Mon', height: '65%', score: 65, active: false },
    { label: 'Tue', height: '80%', score: 80, active: false },
    { label: 'Wed', height: '92%', score: 92, active: false },
    { label: 'Thu', height: '100%', score: 98, active: true },
    { label: 'Fri', height: '70%', score: 70, active: false },
    { label: 'Sat', height: '40%', score: 40, active: false },
    { label: 'Sun', height: '50%', score: 50, active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Container matching Image 1: rounded-[36px] white card */}
      <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833]">
        {/* Header Title with Segmented Filter */}
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold text-[#8E8B99] uppercase tracking-wider">
            Personal Performance
          </p>
          <h2 className="text-2xl font-extrabold text-[#18171E] dark:text-white tracking-tight">
            Our advanced focus tracking feature
          </h2>

          {/* Segmented Period Tabs (Week | Month | Quarter) */}
          <div className="inline-flex rounded-full bg-[#F4F3F8] dark:bg-[#292833] p-1 shadow-inner">
            {(['Week', 'Month', 'Quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all ${
                  timeframe === period
                    ? 'bg-[#18171E] text-white shadow-sm dark:bg-white dark:text-[#18171E]'
                    : 'text-[#8E8B99] hover:text-[#18171E] dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Week Days Circle Ring Strip (matching Image 1) */}
        <div className="mt-8 mb-6 flex items-center justify-between gap-1 px-1">
          {weekDayDots.map((item, idx) => {
            const isToday = item.day === 'W';
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#8E8B99]">{item.day}</span>
                <div
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                    isToday
                      ? 'bg-[#FFAE33] text-white shadow-md shadow-[#FFAE33]/30 scale-105 ring-4 ring-[#FFECC7] dark:ring-[#FFAE33]/20'
                      : item.status === 'done'
                      ? 'bg-[#F4F3F8] text-[#18171E] border-2 border-[#7065F0] dark:bg-[#292833] dark:text-white'
                      : 'bg-[#F4F3F8] text-[#8E8B99] dark:bg-[#292833]'
                  }`}
                >
                  {isToday ? (
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-xs font-black">W</span>
                      <span className="text-[8px] font-semibold">{item.activeValue}</span>
                    </div>
                  ) : item.status === 'done' ? (
                    <CheckCircle2 className="h-4 w-4 text-[#7065F0]" />
                  ) : (
                    <span className="text-xs font-semibold">{item.date}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Habit & Mood Tag Pills (matching Image 1) */}
        <div className="flex flex-wrap items-center justify-center gap-2 my-5">
          {tagPills.map((tag) => (
            <button
              key={tag.label}
              onClick={() => setSelectedTag(tag.label)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-transform active:scale-95 ${
                tag.bg
              } ${selectedTag === tag.label ? 'ring-2 ring-current scale-105' : 'opacity-85 hover:opacity-100'}`}
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>

        {/* Whimsical Motivation Banner (Peach to Coral Gradient with Hand Vector Art) */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#FFE8DE] via-[#FFF1E8] to-[#FFE6EE] p-6 text-[#18171E] shadow-sm my-6 border border-[#FFE2D6]">
          <div className="relative z-10 max-w-[70%] space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D96B27]">
              Productivity Log
            </p>
            <h3 className="text-lg font-black leading-tight tracking-tight text-[#18171E]">
              Control you're looking to track progress,
            </h3>
            <p className="text-xs font-medium text-[#7A5B51]">
              Here to support every step of your deep work flow.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsTimerOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-[#18171E] shadow-sm hover:bg-[#FDFBF7] active:scale-95 transition-all"
              >
                <Zap className="h-3.5 w-3.5 text-[#FFAE33]" />
                <span>Start Focus Timer with Soundscape</span>
              </button>
            </div>
          </div>

          {/* Whimsical SVG Hand Line Illustration in Background */}
          <div className="absolute right-2 -bottom-2 pointer-events-none opacity-85">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#18171E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 80 C40 60, 45 45, 45 30 C45 25, 48 20, 52 20 C56 20, 59 25, 59 35 L59 55" />
              <path d="M59 38 C60 32, 64 28, 68 28 C72 28, 75 32, 75 40 L75 58" />
              <path d="M75 42 C76 38, 79 34, 83 34 C87 34, 90 38, 90 45 L90 65 C90 85, 60 95, 40 95" />
              <circle cx="30" cy="40" r="1.5" fill="#18171E" />
              <circle cx="20" cy="55" r="2" fill="#18171E" />
              <path d="M22 30 L26 34 M26 30 L22 34" stroke="#FFAE33" strokeWidth="2" />
              <path d="M85 20 L89 24 M89 20 L85 24" stroke="#FF5EEA" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* 2x2 Metric Breakdown Grid (matching "Weight Breakdown" in Image 1) */}
        <div className="my-6">
          <h3 className="text-lg font-extrabold text-[#18171E] dark:text-white mb-4 tracking-tight">
            Focus Breakdown
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Card 1: Tasks Done */}
            <div className="rounded-[24px] bg-[#F9F8FC] p-4 dark:bg-[#252430] border border-[#F0EEF6] dark:border-[#2E2D3B]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E8B99]">
                <span className="rounded-md bg-[#FFF0E8] p-1 text-[#D96B27]">🗂️</span>
                <span>Tasks Done</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#18171E] dark:text-white">
                  {completedCount}
                </span>
                <span className="text-xs font-semibold text-[#8E8B99]">/ {totalTasks}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-emerald-600">
                +18% vs last week
              </p>
            </div>

            {/* Card 2: Current Focus Time */}
            <div className="rounded-[24px] bg-[#F9F8FC] p-4 dark:bg-[#252430] border border-[#F0EEF6] dark:border-[#2E2D3B]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E8B99]">
                <span className="rounded-md bg-[#F2EDFF] p-1 text-[#7065F0]">⏱️</span>
                <span>Deep Work</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#18171E] dark:text-white">
                  28.5
                </span>
                <span className="text-xs font-semibold text-[#8E8B99]">Hrs</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-[#7065F0]">
                Goal: 30.0 Hrs
              </p>
            </div>

            {/* Card 3: Productivity Score */}
            <div className="rounded-[24px] bg-[#F9F8FC] p-4 dark:bg-[#252430] border border-[#F0EEF6] dark:border-[#2E2D3B]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E8B99]">
                <span className="rounded-md bg-[#EBF7FF] p-1 text-[#0284C7]">⚡</span>
                <span>Score</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#18171E] dark:text-white">
                  {score.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-[#8E8B99]">pts</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-sky-600">
                Top 5% performer
              </p>
            </div>

            {/* Card 4: Streak */}
            <div className="rounded-[24px] bg-[#F9F8FC] p-4 dark:bg-[#252430] border border-[#F0EEF6] dark:border-[#2E2D3B]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E8B99]">
                <span className="rounded-md bg-[#FFF0F5] p-1 text-[#E02475]">🔥</span>
                <span>Streak</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#18171E] dark:text-white">
                  5
                </span>
                <span className="text-xs font-semibold text-[#8E8B99]">Days</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-amber-500">
                Personal best: 12d
              </p>
            </div>
          </div>
        </div>

        {/* Consistency Bar Chart (matching "By tracking these area consistently score" in Image 1) */}
        <div className="my-7 rounded-[28px] bg-[#FDFCFE] dark:bg-[#22212C] p-5 border border-[#F0EEF6] dark:border-[#2E2D3B]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#8E8B99]">Daily Velocity</p>
              <h4 className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
                By tracking daily your consistency score grows
              </h4>
            </div>
            <span className="rounded-full bg-[#18171E] px-3 py-1 text-[10px] font-extrabold text-white">
              Avg 82.4%
            </span>
          </div>

          {/* Bar Columns */}
          <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
            {barChartDays.map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-[#8E8B99] opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.score}%
                </span>
                <div className="w-full max-w-[28px] rounded-t-xl bg-[#F0EEF6] dark:bg-[#2E2D3B] h-full flex items-end overflow-hidden">
                  <div
                    style={{ height: col.height }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      col.active
                        ? 'bg-[#FFAE33] shadow-md shadow-[#FFAE33]/30'
                        : 'bg-[#7065F0]/60 group-hover:bg-[#7065F0]'
                    }`}
                  />
                </div>
                <span className={`text-[11px] font-bold ${col.active ? 'text-[#FFAE33]' : 'text-[#8E8B99]'}`}>
                  {col.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard & Achievements Section (matching Bottom Screen in Image 1) */}
        <div className="mt-6 pt-4 border-t border-[#F0EEF6] dark:border-[#292833]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
              Personal Best Milestones
            </h4>
            <span className="text-xs font-bold text-[#7065F0]">All Badges</span>
          </div>

          <div className="space-y-3">
            {/* Item 1 */}
            <div className="flex items-center justify-between rounded-2xl bg-[#F9F8FC] p-3.5 dark:bg-[#252430]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFECC7] text-[#D96B27]">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#18171E] dark:text-white">
                    {profile.display_name || 'Saad'}
                  </p>
                  <p className="text-[10px] font-bold text-[#8E8B99]">
                    Score: {score.toLocaleString()} pts • Level 4 Achiever
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#8E8B99]" />
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="rounded-xl bg-[#F4F3F8] py-2 dark:bg-[#292833]">
                <p className="text-[10px] font-bold text-[#8E8B99]">Sessions</p>
                <p className="text-xs font-extrabold text-[#18171E] dark:text-white">28 h</p>
              </div>
              <div className="rounded-xl bg-[#F4F3F8] py-2 dark:bg-[#292833]">
                <p className="text-[10px] font-bold text-[#8E8B99]">Completed</p>
                <p className="text-xs font-extrabold text-[#18171E] dark:text-white">{completedCount}</p>
              </div>
              <div className="rounded-xl bg-[#F4F3F8] py-2 dark:bg-[#292833]">
                <p className="text-[10px] font-bold text-[#8E8B99]">Accuracy</p>
                <p className="text-xs font-extrabold text-[#18171E] dark:text-white">96%</p>
              </div>
              <div className="rounded-xl bg-[#F4F3F8] py-2 dark:bg-[#292833]">
                <p className="text-[10px] font-bold text-[#8E8B99]">Rank</p>
                <p className="text-xs font-extrabold text-[#7065F0]">#1 Solo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
