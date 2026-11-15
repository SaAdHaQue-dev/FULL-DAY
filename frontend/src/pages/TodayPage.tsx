import React from 'react';
import { CalendarDays, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { EmptyState } from '../components/common/EmptyState';
import { isTaskOverdue, isTaskToday } from '../lib/utils';
import { format } from 'date-fns';

export const TodayPage: React.FC = () => {
  const { tasks, setIsQuickAddOpen, setIsAIModalOpen, filters } = useTasks();

  const query = filters.searchQuery.toLowerCase();

  const overdueTasks = tasks.filter(
    (t) =>
      isTaskOverdue(t.due_at, t.status) &&
      (query ? t.title.toLowerCase().includes(query) : true)
  );

  const todayTasks = tasks.filter(
    (t) =>
      (isTaskToday(t.due_at) || isTaskToday(t.planned_for)) &&
      t.status !== 'completed' &&
      (query ? t.title.toLowerCase().includes(query) : true)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Today</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {todayTasks.length} due
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {format(new Date(), 'EEEE, MMMM d')} • What you're getting done today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Plan</span>
          </button>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Overdue Attention ({overdueTasks.length})
          </h2>
          <div className="space-y-2">
            {overdueTasks.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}

      {/* Today Section */}
      <div className="space-y-3">
        {todayTasks.length > 0 ? (
          <div className="space-y-2">
            {todayTasks.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        ) : overdueTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All caught up for today!"
            description="You have completed all scheduled tasks for today. Relax or schedule tasks from upcoming."
            actionLabel="Plan a Task for Today"
            onAction={() => setIsQuickAddOpen(true)}
          />
        ) : null}
      </div>
    </div>
  );
};
