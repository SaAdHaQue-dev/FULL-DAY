import React, { useState } from 'react';
import {
  Bell,
  Plus,
  ArrowRight,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CloudSun,
  Smartphone,
  Layers,
  Calendar as CalendarIcon,
  Check,
  ListTodo,
  Flame,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { mockTeamMembers } from '../services/mockData';
import { PlanDetailModal } from '../components/tasks/PlanDetailModal';
import { WeatherWidget } from '../components/weather/WeatherWidget';
import { ProductivityStatsView } from '../components/analytics/ProductivityStatsView';

export const DashboardPage: React.FC = () => {
  const { tasks, setIsQuickAddOpen, setIsAIModalOpen, toggleTaskComplete } = useTasks();
  const { profile } = useAuth();

  // App tabs: 'dashboard' | 'calendar' | 'plan' | 'stats' | 'weather'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'plan' | 'stats' | 'weather'>('dashboard');

  // Desktop view mode: single phone frame vs tri-view
  const [layoutMode, setLayoutMode] = useState<'tri-view' | 'mobile-app'>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'tri-view' : 'mobile-app'
  );

  const [selectedPlanTask, setSelectedPlanTask] = useState<{
    title: string;
    description: string;
    timeSlot: string;
  } | null>(null);

  const [activeDateIndex, setActiveDateIndex] = useState(3); // 21 Thu

  const weekDays = [
    { dayNum: 18, dayName: 'Mon' },
    { dayNum: 19, dayName: 'Tue' },
    { dayNum: 20, dayName: 'Wed' },
    { dayNum: 21, dayName: 'Thu' },
    { dayNum: 22, dayName: 'Fri' },
    { dayNum: 23, dayName: 'Sat' },
    { dayNum: 24, dayName: 'Sun' },
  ];

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const nextTask = pendingTasks[0] || tasks[0] || {
    id: 'sample',
    title: 'Healthcare Dashboard UI',
    description: 'Design team - Core user workflows and component library',
    time_slot: '10:00 AM - 11:30 AM',
  };

  const getCardColorClass = (color?: string, idx = 0) => {
    if (color === 'pink') return 'bg-[#FF5EEA] text-white';
    if (color === 'yellow') return 'bg-[#FFAE33] text-[#18171E]';
    if (color === 'sky') return 'bg-[#54C5FF] text-[#18171E]';
    if (color === 'purple') return 'bg-[#7065F0] text-white';
    
    // Cycle between vibrant styles
    const cycle = [
      'bg-[#FF5EEA] text-white',
      'bg-[#FFAE33] text-[#18171E]',
      'bg-[#54C5FF] text-[#18171E]',
      'bg-[#7065F0] text-white',
    ];
    return cycle[idx % cycle.length];
  };

  const planAgendaItems = [
    {
      title: 'Discussion on Client Requirements',
      time: '11:30 - 12:00',
      bgColor: 'bg-[#7065F0]',
      textColor: 'text-white',
    },
    {
      title: 'Organizing Team Roles for Project Success',
      time: '12:00 - 12:30',
      bgColor: 'bg-[#FFAE33]',
      textColor: 'text-[#18171E]',
    },
    {
      title: 'Meeting Outcomes and Summary',
      time: '12:30 - 01:00',
      bgColor: 'bg-[#FF5EEA]',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Mobile/App Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto px-2">
        <div className="flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-[#1C1B24]/90 p-1.5 shadow-sm border border-white/60 dark:border-[#292833]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#7065F0] text-white shadow-sm'
                : 'text-[#8E8B99] hover:text-[#18171E] dark:hover:text-white'
            }`}
          >
            <span>Today</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'calendar'
                ? 'bg-[#7065F0] text-white shadow-sm'
                : 'text-[#8E8B99] hover:text-[#18171E] dark:hover:text-white'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'plan'
                ? 'bg-[#7065F0] text-white shadow-sm'
                : 'text-[#8E8B99] hover:text-[#18171E] dark:hover:text-white'
            }`}
          >
            <ListTodo className="h-3.5 w-3.5" />
            <span>Meeting Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-[#7065F0] text-white shadow-sm'
                : 'text-[#8E8B99] hover:text-[#18171E] dark:hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-[#FFAE33]" />
            <span>Focus & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'weather'
                ? 'bg-[#7065F0] text-white shadow-sm'
                : 'text-[#8E8B99] hover:text-[#18171E] dark:hover:text-white'
            }`}
          >
            <CloudSun className="h-3.5 w-3.5" />
            <span>Weather</span>
          </button>
        </div>

        {/* View Mode Toggle: Single Phone App vs 3-Screen Overview */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setLayoutMode(layoutMode === 'mobile-app' ? 'tri-view' : 'mobile-app')}
            className="flex items-center gap-2 rounded-full bg-white/90 dark:bg-[#1C1B24]/90 px-4 py-2 text-xs font-bold text-[#18171E] dark:text-white shadow-xs border border-white/60 dark:border-[#292833] hover:bg-white transition-all cursor-pointer"
          >
            {layoutMode === 'mobile-app' ? (
              <>
                <Layers className="h-4 w-4 text-[#7065F0]" />
                <span>Show All 3 Screens</span>
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 text-[#7065F0]" />
                <span>Mobile App View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      {layoutMode === 'mobile-app' ? (
        /* Mobile App Frame View (Centered, ultra-clean phone container) */
        <div className="max-w-md mx-auto">
          {activeTab === 'dashboard' && (
            <div className="rounded-[40px] bg-white p-7 shadow-2xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] min-h-[660px] flex flex-col justify-between animate-in fade-in duration-150">
              <div>
                {/* Header with User and Weather Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar_url || ''}
                      alt={profile.display_name || 'Saad'}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#8E8B99] tracking-wide">Good Morning !</p>
                      <p className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
                        {profile.display_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <WeatherWidget compact={true} />
                    <button
                      type="button"
                      aria-label="Notifications"
                      className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white transition-colors"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#FF3B30] ring-2 ring-white dark:ring-[#1C1B24]" />
                    </button>
                  </div>
                </div>

                {/* Big Headline */}
                <div className="mt-8 mb-6">
                  <h1 className="text-3xl font-normal text-[#18171E] dark:text-white leading-[1.2]">
                    You have {pendingTasks.length}
                    <br />
                    <span className="font-extrabold text-[#18171E] dark:text-white">task for today</span>
                  </h1>
                </div>

                {/* Members Section */}
                <div className="my-6">
                  <div className="flex items-center justify-between mb-3.5">
                    <h2 className="text-base font-extrabold text-[#18171E] dark:text-white">8 Members</h2>
                    <button
                      onClick={() => setIsQuickAddOpen(true)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7065F0] text-white hover:bg-[#6055E8] shadow-xs transition-transform active:scale-95"
                    >
                      <Plus className="h-4 w-4 stroke-[3]" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {mockTeamMembers.slice(0, 6).map((m) => (
                      <img
                        key={m.id}
                        src={m.avatar_url || ''}
                        alt={m.display_name || ''}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100 hover:scale-105 transition-transform shrink-0"
                      />
                    ))}
                  </div>
                </div>

                {/* Next Task Hero Card (Dynamically bound to real next task!) */}
                <div className="mt-7">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-extrabold text-[#18171E] dark:text-white">Next Task</h2>
                    <button
                      onClick={() => setIsAIModalOpen(true)}
                      className="flex items-center gap-1 text-xs font-bold text-[#7065F0] hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>AI Plan</span>
                    </button>
                  </div>

                  <div className="rounded-[32px] bg-[#E7E5FC] dark:bg-[#25223D] p-3 shadow-md">
                    <div className="relative rounded-[26px] bg-[#7065F0] p-5 text-white overflow-hidden min-h-[190px] flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-extrabold text-white leading-tight">
                            {nextTask.title}
                          </h3>
                          <p className="text-xs text-white/80 font-medium mt-1">
                            {nextTask.description || 'Personal priority task'}
                          </p>
                        </div>

                        <div className="flex -space-x-2">
                          {mockTeamMembers.slice(1, 4).map((m) => (
                            <img
                              key={m.id}
                              src={m.avatar_url || ''}
                              alt=""
                              className="h-7 w-7 rounded-full border border-white/60 object-cover"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-2xl">
                            💡
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[10px]">
                              ⏳
                            </span>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-white text-[10px] font-bold">
                              ✓
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setSelectedPlanTask({
                              title: nextTask.title,
                              description: nextTask.description || 'Focus item for today',
                              timeSlot: nextTask.time_slot || '10:00 AM - 11:30 AM',
                            })
                          }
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7065F0] hover:bg-white/95 shadow-lg active:scale-95 transition-all cursor-pointer"
                        >
                          <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="rounded-[40px] bg-white p-7 shadow-2xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] min-h-[660px] animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
                  Calendar
                </h2>
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7065F0] text-white"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                </button>
              </div>

              {/* Month Picker */}
              <div className="flex items-center justify-center gap-3 my-3">
                <button className="text-[#8E8B99] hover:text-[#18171E]">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-bold text-[#18171E] dark:text-white">February</span>
                <button className="text-[#8E8B99] hover:text-[#18171E]">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Weekday Scroller */}
              <div className="flex items-center justify-between gap-1 my-4">
                {weekDays.map((item, idx) => {
                  const isActive = idx === activeDateIndex;
                  return (
                    <button
                      key={item.dayNum}
                      onClick={() => setActiveDateIndex(idx)}
                      className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-[22px] transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30 min-w-[44px]'
                          : 'text-[#8E8B99] hover:text-[#18171E]'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.dayNum}</span>
                      <span className="text-[10px] font-medium mt-0.5">{item.dayName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Real Tasks Schedule Rail */}
              <div className="mt-6 space-y-4">
                {tasks.slice(0, 5).map((t, index) => {
                  const cardColorClass = getCardColorClass(t.color, index);
                  const isDone = t.status === 'completed';

                  return (
                    <div key={t.id} className="flex items-start gap-3">
                      <div className="w-16 shrink-0 pt-2 text-right">
                        <span className="text-[11px] font-semibold text-[#8E8B99]">
                          {index === 0 ? '09:00 AM' : index === 1 ? '11:00 AM' : index === 2 ? '01:00 PM' : '03:00 PM'}
                        </span>
                      </div>

                      <div
                        onClick={() =>
                          setSelectedPlanTask({
                            title: t.title,
                            description: t.description || 'Personal focus task',
                            timeSlot: t.time_slot || '11:00 - 12:00',
                          })
                        }
                        className={`flex-1 rounded-[26px] p-4 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-xs ${cardColorClass} ${
                          isDone && 'opacity-60 line-through'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskComplete(t.id);
                              }}
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 mt-0.5 transition-all ${
                                isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-current/60 hover:border-current'
                              }`}
                            >
                              {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                            </button>

                            <div>
                              <h4 className="text-sm font-extrabold leading-snug">{t.title}</h4>
                              <div className="mt-1 flex items-center gap-1.5 text-xs opacity-90 font-medium">
                                <Clock className="h-3 w-3" />
                                <span>{t.time_slot || '11:30 - 12:00'}</span>
                              </div>
                            </div>
                          </div>
                          <MoreVertical className="h-4 w-4 opacity-75" />
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/10">
                          <div className="flex items-center -space-x-1.5">
                            {mockTeamMembers.slice(0, 3).map((m) => (
                              <img
                                key={m.id}
                                src={m.avatar_url || ''}
                                alt=""
                                className="h-6 w-6 rounded-full border border-white object-cover"
                              />
                            ))}
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18171E] text-[9px] font-bold text-white border border-white">
                              +8
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="rounded-[40px] bg-white p-7 shadow-2xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] min-h-[660px] animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  ✕
                </button>
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  ✎
                </button>
              </div>

              <div className="flex justify-center my-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#18171E] px-5 py-2 text-xs font-semibold text-white tracking-wide">
                  11:30 AM - 12:00 PM
                </span>
              </div>

              <div className="text-center my-3">
                <h2 className="text-2xl font-extrabold text-[#18171E] dark:text-white tracking-tight">
                  Team Meeting
                </h2>
                <p className="mt-1 text-xs text-[#8E8B99] font-medium">
                  Discussion of tasks for the month
                </p>
              </div>

              <div className="flex items-center justify-center -space-x-2 my-4">
                {mockTeamMembers.slice(0, 4).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar_url || ''}
                    alt={m.display_name || ''}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs dark:border-[#1C1B24]"
                  />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#18171E] text-xs font-bold text-white shadow-xs dark:border-[#1C1B24]">
                  +8
                </div>
              </div>

              <div className="mt-6 mb-3">
                <h3 className="text-xl font-extrabold text-[#18171E] dark:text-white">Plan</h3>
              </div>

              <div className="space-y-3.5">
                {planAgendaItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setSelectedPlanTask({
                        title: item.title,
                        description: 'Agenda item for Team Meeting',
                        timeSlot: item.time,
                      })
                    }
                    className={`rounded-[24px] p-5 shadow-xs cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] ${item.bgColor} ${item.textColor}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold leading-snug flex-1">{item.title}</span>
                      <span className="text-xs font-semibold shrink-0 opacity-90">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="animate-in fade-in duration-150">
              <ProductivityStatsView />
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="rounded-[40px] bg-white p-6 shadow-2xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] min-h-[660px] animate-in fade-in duration-150 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-base font-extrabold text-[#18171E] dark:text-white">
                  Weather & Daily Context
                </h2>
                <div className="w-10" />
              </div>

              <WeatherWidget compact={false} />
            </div>
          )}
        </div>
      ) : (
        /* Tri-View Mode (All 3 screens displayed side-by-side for desktop review) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">
          {/* SCREEN 1 */}
          <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] flex flex-col justify-between min-h-[660px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar_url || ''}
                    alt={profile.display_name || 'Saad'}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#8E8B99] tracking-wide">Good Morning !</p>
                    <p className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
                      {profile.display_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <WeatherWidget compact={true} />
                  <button
                    type="button"
                    className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#FF3B30] ring-2 ring-white dark:ring-[#1C1B24]" />
                  </button>
                </div>
              </div>

              <div className="mt-8 mb-6">
                <h1 className="text-3xl font-normal text-[#18171E] dark:text-white leading-[1.2]">
                  You have {pendingTasks.length}
                  <br />
                  <span className="font-extrabold text-[#18171E] dark:text-white">task for today</span>
                </h1>
              </div>

              <div className="my-6">
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-base font-extrabold text-[#18171E] dark:text-white">8 Members</h2>
                  <button
                    onClick={() => setIsQuickAddOpen(true)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7065F0] text-white hover:bg-[#6055E8] shadow-xs transition-transform active:scale-95"
                  >
                    <Plus className="h-4 w-4 stroke-[3]" />
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {mockTeamMembers.slice(0, 6).map((m) => (
                    <img
                      key={m.id}
                      src={m.avatar_url || ''}
                      alt={m.display_name || ''}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100 hover:scale-105 transition-transform shrink-0"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-extrabold text-[#18171E] dark:text-white">Next Task</h2>
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#7065F0] hover:underline"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>AI Plan</span>
                  </button>
                </div>

                <div className="rounded-[32px] bg-[#E7E5FC] dark:bg-[#25223D] p-3 shadow-md">
                  <div className="relative rounded-[26px] bg-[#7065F0] p-5 text-white overflow-hidden min-h-[190px] flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-white leading-tight">
                          {nextTask.title}
                        </h3>
                        <p className="text-xs text-white/80 font-medium mt-1">
                          {nextTask.description || 'Personal focus task'}
                        </p>
                      </div>

                      <div className="flex -space-x-2">
                        {mockTeamMembers.slice(1, 4).map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar_url || ''}
                            alt=""
                            className="h-7 w-7 rounded-full border border-white/60 object-cover"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-2xl">
                          💡
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[10px]">
                            ⏳
                          </span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-white text-[10px] font-bold">
                            ✓
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedPlanTask({
                            title: nextTask.title,
                            description: nextTask.description || 'Personal focus task',
                            timeSlot: nextTask.time_slot || '10:00 AM - 11:30 AM',
                          })
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7065F0] hover:bg-white/95 shadow-lg active:scale-95 transition-all cursor-pointer"
                      >
                        <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SCREEN 2 */}
          <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] flex flex-col justify-between min-h-[660px]">
            <div>
              <div className="flex items-center justify-between pb-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
                  Calendar
                </h2>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 my-3">
                <button className="text-[#8E8B99] hover:text-[#18171E]">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-bold text-[#18171E] dark:text-white">February</span>
                <button className="text-[#8E8B99] hover:text-[#18171E]">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-1 my-4">
                {weekDays.map((item, idx) => {
                  const isActive = idx === activeDateIndex;
                  return (
                    <button
                      key={item.dayNum}
                      onClick={() => setActiveDateIndex(idx)}
                      className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-[22px] transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30 min-w-[42px]'
                          : 'text-[#8E8B99] hover:text-[#18171E]'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.dayNum}</span>
                      <span className="text-[10px] font-medium mt-0.5">{item.dayName}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-4">
                {tasks.slice(0, 4).map((t, index) => {
                  const cardColorClass = getCardColorClass(t.color, index);
                  const isDone = t.status === 'completed';

                  return (
                    <div key={t.id} className="flex items-start gap-3">
                      <div className="w-16 shrink-0 pt-1 text-right">
                        <span className="text-[11px] font-semibold text-[#8E8B99]">
                          {index === 0 ? '09:00 AM' : index === 1 ? '11:00 AM' : index === 2 ? '01:00 PM' : '02:30 PM'}
                        </span>
                      </div>

                      <div
                        onClick={() =>
                          setSelectedPlanTask({
                            title: t.title,
                            description: t.description || 'Assigned task for the day',
                            timeSlot: t.time_slot || '11:30 - 12:00',
                          })
                        }
                        className={`flex-1 rounded-[26px] p-4 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-xs ${cardColorClass} ${
                          isDone && 'opacity-60 line-through'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-extrabold leading-snug">{t.title}</h4>
                            <div className="mt-1 flex items-center gap-1.5 text-xs opacity-90">
                              <Clock className="h-3 w-3" />
                              <span>{t.time_slot || '11:30 - 12:00'}</span>
                            </div>
                          </div>
                          <MoreVertical className="h-4 w-4 opacity-75" />
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/10">
                          <div className="flex items-center -space-x-1.5">
                            {mockTeamMembers.slice(0, 3).map((m) => (
                              <img
                                key={m.id}
                                src={m.avatar_url || ''}
                                alt=""
                                className="h-6 w-6 rounded-full border border-white object-cover"
                              />
                            ))}
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18171E] text-[9px] font-bold text-white border border-white">
                              +8
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SCREEN 3 */}
          <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] flex flex-col justify-between min-h-[660px]">
            <div>
              <div className="flex items-center justify-between pb-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
                >
                  ✎
                </button>
              </div>

              <div className="flex justify-center my-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#18171E] px-5 py-2 text-xs font-semibold text-white tracking-wide">
                  11:30 AM - 12:00 PM
                </span>
              </div>

              <div className="text-center my-3">
                <h2 className="text-2xl font-extrabold text-[#18171E] dark:text-white tracking-tight">
                  Team Meeting
                </h2>
                <p className="mt-1 text-xs text-[#8E8B99] font-medium">
                  Discussion of tasks for the month
                </p>
              </div>

              <div className="flex items-center justify-center -space-x-2 my-4">
                {mockTeamMembers.slice(0, 4).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar_url || ''}
                    alt={m.display_name || ''}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs dark:border-[#1C1B24]"
                  />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#18171E] text-xs font-bold text-white shadow-xs dark:border-[#1C1B24]">
                  +8
                </div>
              </div>

              <div className="mt-6 mb-3">
                <h3 className="text-xl font-extrabold text-[#18171E] dark:text-white">Plan</h3>
              </div>

              <div className="space-y-3.5">
                {planAgendaItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setSelectedPlanTask({
                        title: item.title,
                        description: 'Agenda item for Team Meeting',
                        timeSlot: item.time,
                      })
                    }
                    className={`rounded-[24px] p-5 shadow-xs cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] ${item.bgColor} ${item.textColor}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold leading-snug flex-1">{item.title}</span>
                      <span className="text-xs font-semibold shrink-0 opacity-90">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Detail Modal */}
      {selectedPlanTask && (
        <PlanDetailModal
          isOpen={Boolean(selectedPlanTask)}
          onClose={() => setSelectedPlanTask(null)}
          taskTitle={selectedPlanTask.title}
          taskDescription={selectedPlanTask.description}
          timeSlot={selectedPlanTask.timeSlot}
        />
      )}
    </div>
  );
};
