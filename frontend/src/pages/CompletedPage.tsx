import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { EmptyState } from '../components/common/EmptyState';

export const CompletedPage: React.FC = () => {
  const { tasks, filters } = useTasks();
  const query = filters.searchQuery.toLowerCase();

  const completedTasks = tasks.filter((t) => {
    if (t.status !== 'completed') return false;
    if (query) {
      return t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query));
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Completed</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {completedTasks.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Your archive of accomplished goals and resolved tasks.
          </p>
        </div>
      </div>

      {completedTasks.length > 0 ? (
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title="No completed tasks yet"
          description="Tasks marked as done will appear here as a record of your steady progress."
        />
      )}
    </div>
  );
};
