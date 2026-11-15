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
            <CalendarDays className="h-6 w-6 text-[#FFAE33]" />
            <h1 className="text-2xl font-black tracking-tight text-[#18171E] dark:text-white">Today</h1>
            <span className="rounded-full bg-[#FFAE33]/15 px-3 py-0.5 text-xs font-bold text-[#D96B27]">
              {todayTasks.length} due
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-[#8E8B99]">
            {format(new Date(), 'EEEE, MMMM d')} • What you're getting done today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 rounded-full border border-[#7065F0]/20 bg-[#F2EDFF] px-4 py-2 text-xs font-bold text-[#7065F0] hover:bg-[#EAE4FE] dark:bg-[#7065F0]/20 dark:text-purple-300 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Plan</span>
          </button>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#7065F0] px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-[#7065F0]/25 hover:bg-[#6055E8] active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
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
