import React, { useState } from 'react';
import {
  ChevronDown,
  Flame,
  Award,
  Zap,
  BookOpen,
  Target,
  Trophy,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const ProgressPage: React.FC = () => {
  const { counts, tasks } = useTasks();
  const [timeRange, setTimeRange] = useState('This Week');

  const completedCount = counts.completed || tasks.filter((t) => t.status === 'completed').length;
  const xpEarned = completedCount * 25 + 350;

  const chartPoints = [
    { day: 'Mon', xp: 40, height: 35 },
    { day: 'Tue', xp: 55, height: 48 },
    { day: 'Wed', xp: 35, height: 30 },
    { day: 'Thu', xp: 60, height: 55 },
    { day: 'Fri', xp: 85, height: 75 },
    { day: 'Sat', xp: 65, height: 58 },
    { day: 'Sun', xp: 70, height: 65, active: true },
  ];

  const badges = [
    {
      id: 'b1',
      title: '7 Days Streak',
      icon: '🔥',
      color: 'bg-[#FFF5E5] text-[#FF922B] border-[#FFE8C2]',
    },
    {
      id: 'b2',
      title: '100 Words Learner',
      icon: '📘',
      color: 'bg-[#F0EFFF] text-[#6C5CE7] border-[#E4E0FA]',
    },
    {
      id: 'b3',
      title: 'First Lesson Complete',
      icon: '⭐',
      color: 'bg-[#FFF9DB] text-[#FAB005] border-[#FFF3BF]',
    },
    {
      id: 'b4',
      title: 'Week Goal Achiever',
      icon: '🎯',
      color: 'bg-[#E8F8F0] text-[#20C997] border-[#D1F2DE]',
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header with Dropdown */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#1E1B2E] tracking-tight">
          Progress
        </h1>

        <div className="relative inline-flex items-center gap-1 rounded-full bg-[#F4F3F8] px-3 py-1.5 text-xs font-bold text-[#1E1B2E] cursor-pointer">
          <span>{timeRange}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#8B88A0]" />
        </div>
      </div>

      {/* Main Chart Card (matching bottom-center screen) */}
      <div className="rounded-[28px] bg-white p-5 border border-[#EDE8F5] shadow-xs space-y-4">
        <div>
          <p className="text-[11px] font-bold text-[#8B88A0]">XP Earned</p>
          <p className="text-2xl font-black text-[#1E1B2E] tracking-tight mt-0.5">
            {xpEarned} <span className="text-sm font-extrabold text-[#6C5CE7]">XP</span>
          </p>
        </div>

        {/* Curvy Purple Chart with Active 70 XP badge */}
        <div className="relative h-36 pt-6">
          {/* Active Tooltip Pill on Sunday */}
          <div className="absolute right-4 top-1 rounded-full bg-[#6C5CE7] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
            70 XP
          </div>

          {/* Smooth SVG Wave Line */}
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80" fill="none">
            {/* Soft gradient fill under curve */}
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d="M 10 50 Q 50 40 90 48 T 170 30 T 230 18 T 290 22 L 290 80 L 10 80 Z"
              fill="url(#purpleGradient)"
            />

            {/* Glowing line */}
            <path
              d="M 10 50 Q 50 40 90 48 T 170 30 T 230 18 T 290 22"
              stroke="#6C5CE7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Point circles */}
            <circle cx="290" cy="22" r="5" fill="#6C5CE7" stroke="#FFFFFF" strokeWidth="2.5" />
          </svg>

          {/* Day Labels Mon - Sun */}
          <div className="flex items-center justify-between text-[10px] font-bold text-[#8B88A0] pt-2 px-1">
            {chartPoints.map((p) => (
              <span key={p.day} className={p.active ? 'text-[#6C5CE7]' : ''}>
                {p.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Metric Badges Row (Folder, Lightning, Fire) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Card 1: Lessons / Tasks */}
        <div className="rounded-2xl bg-white p-3 border border-[#EDE8F5] shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EFFF] text-[#6C5CE7] mb-1.5">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-bold text-[#8B88A0]">Lessons</span>
          <span className="text-base font-black text-[#1E1B2E]">12</span>
        </div>

        {/* Card 2: Words / Focus mins */}
        <div className="rounded-2xl bg-white p-3 border border-[#EDE8F5] shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF5E5] text-[#FF922B] mb-1.5">
            <Zap className="h-4 w-4 fill-[#FF922B]" />
          </div>
          <span className="text-[10px] font-bold text-[#8B88A0]">Words Learned</span>
          <span className="text-base font-black text-[#1E1B2E]">86</span>
        </div>

        {/* Card 3: Streak */}
        <div className="rounded-2xl bg-white p-3 border border-[#EDE8F5] shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F0] text-[#20C997] mb-1.5">
            <Flame className="h-4 w-4 fill-[#20C997]" />
          </div>
          <span className="text-[10px] font-bold text-[#8B88A0]">Streak</span>
          <span className="text-base font-black text-[#1E1B2E]">7 Days</span>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-[#1E1B2E]">Achievements</h2>
          <span className="text-xs font-bold text-[#6C5CE7] cursor-pointer hover:underline">
            View All
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-13 w-13 items-center justify-center rounded-full border text-2xl shadow-xs transition-transform hover:scale-105 ${badge.color}`}
              >
                <span>{badge.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-[#1E1B2E] leading-tight">
                {badge.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
