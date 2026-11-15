import React from 'react';
import { Check, Calendar, Trash2, Tag } from 'lucide-react';
import { Task } from '../../types';
import { cn, formatDate, getPriorityColor, isTaskOverdue, isTaskToday } from '../../lib/utils';
import { useTasks } from '../../context/TaskContext';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskComplete, deleteTask, setSelectedTaskId } = useTasks();
  const isCompleted = task.status === 'completed';
  const priorityStyle = getPriorityColor(task.priority);
  const isOverdue = isTaskOverdue(task.due_at, task.status);
  const isToday = isTaskToday(task.due_at);

  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className={cn(
        'group relative flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700',
        isCompleted && 'opacity-60 bg-slate-50/70 dark:bg-slate-900/40'
      )}
    >
      {/* Complete Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskComplete(task.id);
        }}
        aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all',
          isCompleted
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-slate-300 hover:border-indigo-600 dark:border-slate-600 dark:hover:border-indigo-400'
        )}
      >
        {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'text-sm font-medium text-slate-900 dark:text-slate-100 truncate',
              isCompleted && 'line-through text-slate-400 dark:text-slate-500'
            )}
          >
            {task.title}
          </p>
        </div>

        {/* Metadata Row: Project, Due Date, Labels */}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {/* Priority Pill */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium border',
              priorityStyle.bg,
              priorityStyle.text,
              priorityStyle.border
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', priorityStyle.dot)} />
            <span className="capitalize">{task.priority}</span>
          </span>

          {/* Project Tag */}
          {task.project && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: task.project.color }}
              />
              <span className="truncate max-w-[120px]">{task.project.name}</span>
            </span>
          )}

          {/* Due Date Badge */}
          {task.due_at && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px]',
                isOverdue
                  ? 'font-medium text-rose-600 dark:text-rose-400'
                  : isToday
                  ? 'font-medium text-amber-600 dark:text-amber-400'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.due_at)}</span>
            </span>
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {task.labels.slice(0, 2).map((lbl) => (
                <span
                  key={lbl.id}
                  className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  <Tag className="h-2.5 w-2.5" />
                  <span>{lbl.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          title="Delete task"
          className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
