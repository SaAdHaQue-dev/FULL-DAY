import React, { useState } from 'react';
import {
  Flame,
  Menu,
  ChevronRight,
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Mic,
  Clock,
  ArrowRight,
  AlertCircle,
  Inbox,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { WeatherWidget } from '../components/weather/WeatherWidget';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const {
    tasks,
    projects,
    counts,
    setIsQuickAddOpen,
    setIsVoiceModalOpen,
    setIsAIModalOpen,
    setIsTimerOpen,
    toggleTaskComplete,
    createTask,
  } = useTasks();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [quickTitle, setQuickTitle] = useState('');

  // Filtering for today
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const totalTasks = tasks.length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Next Priority Task
  const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
  const sortedPending = [...pendingTasks].sort(
    (a, b) => (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1)
  );
  const nextTask = sortedPending[0] || tasks[0] || {
    id: 'sample-hero',
    title: 'Complete Project Architecture Review',
    description: 'Ensure backend, database, and frontend deployments are fully synchronized.',
    priority: 'urgent',
    time_slot: '10:00 - 11:30 AM',
    status: 'in_progress',
  };

  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    await createTask({
      title: quickTitle.trim(),
      priority: 'high',
      due_at: new Date().toISOString(),
    });
    setQuickTitle('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Bar: Menu & Streak & Weather */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button
          onClick={() => navigate('/profile')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#1E1B2E] hover:bg-[#EDE8F5] transition-colors"
          title="Profile Menu"
        >
          <Menu className="h-5 w-5 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-2">
          {/* Weather Widget */}
          <WeatherWidget compact={true} />

          {/* Streak Flame Pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#FFF5E5] px-3.5 py-1.5 text-xs font-black text-[#FF922B] border border-[#FFE8C2] shadow-xs">
            <Flame className="h-4 w-4 fill-[#FF922B] text-[#FF922B]" />
            <span>12</span>
          </div>
        </div>
      </div>

      {/* User Greeting & Current Date */}
      <div>
        <h1 className="text-2xl font-black text-[#1E1B2E] tracking-tight">
          Hello, {profile.display_name || 'Saad'}! 👋
        </h1>
        <p className="mt-0.5 text-xs font-semibold text-[#8B88A0]">
          {format(new Date(), 'EEEE, MMMM d')} • What do you want to achieve today?
        </p>
      </div>

      {/* Hero Card: Next Priority Task (Pick up where you left off) */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#7C5CE7] via-[#7455E4] to-[#6C5CE7] p-5 text-white shadow-lg shadow-[#6C5CE7]/20">
        <div className="flex items-center justify-between text-[11px] font-extrabold pb-2">
          <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 uppercase tracking-wider text-white">
            Next Priority Task
          </span>
          <span className="capitalize text-amber-200">
            🔥 {nextTask.priority} priority
          </span>
        </div>

        <div className="space-y-2 mt-1">
          <h2 className="text-lg font-black leading-snug tracking-tight text-white">
            {nextTask.title}
          </h2>
          {nextTask.description && (
            <p className="text-xs text-white/80 line-clamp-2">
              {nextTask.description}
            </p>
          )}

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
              <Clock className="h-3.5 w-3.5" />
              <span>{nextTask.time_slot || 'Today'}</span>
            </div>

            <button
              onClick={() => toggleTaskComplete(nextTask.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-[#6C5CE7] shadow-sm hover:bg-[#F8F9FE] active:scale-95 transition-all"
            >
              {nextTask.status === 'completed' ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <span>Mark as Done</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Today's Goal & Progress Summary Card */}
      <div className="flex items-center justify-between rounded-[24px] bg-[#F0EFFF] p-4 border border-[#E4E0FA]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#6C5CE7] shadow-xs">
            <Target className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#1E1B2E]">
              Today's Progress Goal
            </h4>
            <p className="text-[11px] font-bold text-[#6C5CE7] mt-0.5">
              {completedTasks.length} of {totalTasks} tasks completed ({completionPct}%)
            </p>
            <div className="w-40 h-2 rounded-full bg-white mt-1.5 overflow-hidden">
              <div
                style={{ width: `${completionPct}%` }}
                className="h-full rounded-full bg-[#6C5CE7] transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex h-10 px-3 items-center justify-center gap-1.5 rounded-2xl bg-white text-xs font-extrabold text-[#6C5CE7] shadow-xs hover:bg-[#FAF9FF] active:scale-95"
          title="Generate AI Daily Plan"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Plan</span>
        </button>
      </div>

      {/* Quick Action Navigation Grid (4 Pastel Buttons) */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Action 1: Tasks */}
        <button
          onClick={() => navigate('/tasks')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF5FF] text-[#339AF0] group-hover:scale-105 active:scale-95 transition-transform shadow-xs">
            <Check className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-[#1E1B2E]">Tasks ({pendingTasks.length})</span>
        </button>

        {/* Action 2: Focus Timer with Ambient Sound */}
        <button
          onClick={() => setIsTimerOpen(true)}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EFFF] text-[#6C5CE7] group-hover:scale-105 active:scale-95 transition-transform shadow-xs relative">
            <Clock className="h-5 w-5 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFAE33] text-[9px] font-black text-white shadow-2xs">
              🎵
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#1E1B2E]">Focus Timer</span>
        </button>

        {/* Action 3: Voice Task */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F8F0] text-[#20C997] group-hover:scale-105 active:scale-95 transition-transform shadow-xs">
            <Mic className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-[#1E1B2E]">Voice Add</span>
        </button>

        {/* Action 4: AI Plan */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF5E5] text-[#FF922B] group-hover:scale-105 active:scale-95 transition-transform shadow-xs">
            <Sparkles className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-[#1E1B2E]">AI Plan</span>
        </button>
      </div>

      {/* Inline Quick Add Task Input */}
      <form onSubmit={handleQuickAddSubmit} className="relative">
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="+ Quickly capture a task and press enter..."
          className="w-full rounded-2xl bg-white border border-[#EDE8F5] py-3 pl-4 pr-12 text-xs font-semibold text-[#1E1B2E] placeholder-[#A09CB0] shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
        />
        <button
          type="submit"
          disabled={!quickTitle.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C5CE7] text-white disabled:opacity-40"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
        </button>
      </form>

      {/* Today's Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base font-black text-[#1E1B2E] tracking-tight">
            Today's Schedule & Tasks
          </h3>
          <button
            onClick={() => navigate('/tasks')}
            className="text-xs font-bold text-[#6C5CE7] hover:underline"
          >
            View All ({tasks.length})
          </button>
        </div>

        <div className="space-y-2">
          {sortedPending.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-2xs border border-[#EDE8F5] hover:border-[#6C5CE7]/30 transition-all group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTaskComplete(task.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[#A09CB0] hover:text-[#6C5CE7] transition-colors shrink-0"
                >
                  <Circle className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-[#1E1B2E] truncate">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#8B88A0] font-semibold">
                    <span className="capitalize">{task.time_slot || 'Today'}</span>
                    <span>•</span>
                    <span
                      className={`capitalize font-bold ${
                        task.priority === 'urgent'
                          ? 'text-rose-500'
                          : task.priority === 'high'
                          ? 'text-amber-500'
                          : 'text-[#6C5CE7]'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight
                onClick={() => navigate('/tasks')}
                className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7] cursor-pointer shrink-0 ml-2"
              />
            </div>
          ))}

          {completedTasks.slice(0, 2).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl bg-[#F8F9FE] p-3 shadow-2xs border border-transparent opacity-60"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTaskComplete(task.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-500 shrink-0"
                >
                  <CheckCircle2 className="h-5 w-5 fill-emerald-100" />
                </button>
                <span className="text-xs font-bold line-through text-[#8B88A0] truncate">
                  {task.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects / Focus Areas Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-base font-black text-[#1E1B2E] tracking-tight">
            Active Projects
          </h3>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#6C5CE7]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </button>
        </div>

        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate('/tasks')}
              className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-xs font-black shadow-2xs"
                  style={{ backgroundColor: project.color || '#6C5CE7' }}
                >
                  {project.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-[#8B88A0] mt-0.5">
                    Project Workspace
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
