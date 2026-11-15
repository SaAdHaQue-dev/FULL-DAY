import React from 'react';
import { CalendarRange, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { EmptyState } from '../components/common/EmptyState';
import { isTaskToday } from '../lib/utils';
import { parseISO, isAfter, startOfToday } from 'date-fns';

export const UpcomingPage: React.FC = () => {
  const { tasks, setIsQuickAddOpen, filters } = useTasks();
  const query = filters.searchQuery.toLowerCase();
  const today = startOfToday();

  const upcomingTasks = tasks.filter((t) => {
    if (t.status === 'completed' || t.status === 'cancelled' || !t.due_at) return false;
    try {
      const date = parseISO(t.due_at);
      const isFuture = isAfter(date, today) && !isTaskToday(t.due_at);
      const matchesSearch = query ? t.title.toLowerCase().includes(query) : true;
      return isFuture && matchesSearch;
    } catch {
      return false;
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <CalendarRange className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Upcoming</h1>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {upcomingTasks.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Future-scheduled commitments, deadlines, and project milestones.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {upcomingTasks.length > 0 ? (
        <div className="space-y-2">
          {upcomingTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarRange}
          title="No upcoming tasks"
          description="You don't have any future tasks scheduled. Plan ahead by adding due dates to tasks."
          actionLabel="Schedule a Task"
          onAction={() => setIsQuickAddOpen(true)}
        />
      )}
    </div>
  );
};
