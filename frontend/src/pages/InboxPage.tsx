import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { EmptyState } from '../components/common/EmptyState';

export const InboxPage: React.FC = () => {
  const { tasks, setIsQuickAddOpen, filters } = useTasks();

  const query = filters.searchQuery.toLowerCase();
  const inboxTasks = tasks.filter((t) => {
    const isUnassigned = !t.project_id;
    const isPending = t.status !== 'completed' && t.status !== 'cancelled';
    const matchesSearch = query ? t.title.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query)) : true;
    return isUnassigned && isPending && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Inbox className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Inbox</h1>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {inboxTasks.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Unsorted captures and quick thoughts. Organize them into projects or schedule deadlines.
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

      {inboxTasks.length > 0 ? (
        <div className="space-y-2">
          {inboxTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="Inbox is clear"
          description="You don't have any unassigned tasks. All your ideas and work items are organized!"
          actionLabel="Quick Capture Task"
          onAction={() => setIsQuickAddOpen(true)}
        />
      )}
    </div>
  );
};
