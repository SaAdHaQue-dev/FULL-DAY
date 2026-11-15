import React from 'react';
import { Check, Calendar, Trash2, Clock } from 'lucide-react';
import { Task } from '../../types';
import { cn, formatDate } from '../../lib/utils';
import { useTasks } from '../../context/TaskContext';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskComplete, deleteTask, setSelectedTaskId } = useTasks();
  const isCompleted = task.status === 'completed';

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'purple':
        return 'bg-[#7065F0] text-white';
      case 'pink':
        return 'bg-[#FF5EEA] text-white';
      case 'yellow':
        return 'bg-[#FFAE33] text-[#18171E]';
      case 'sky':
        return 'bg-[#54C5FF] text-[#18171E]';
      default:
        return 'bg-white text-[#18171E] border border-[#F0EEF6] dark:bg-[#1C1B24] dark:text-white dark:border-[#292833]';
    }
  };

  const isVibrant = task.color && ['purple', 'pink', 'yellow', 'sky'].includes(task.color);

  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className={cn(
        'group relative flex items-center gap-4 rounded-[26px] p-4 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer',
        getColorClasses(task.color),
        isCompleted && 'opacity-60 line-through'
      )}
    >
      {/* Circular Complete Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskComplete(task.id);
        }}
        aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
          isCompleted
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : isVibrant
            ? 'border-white/70 hover:border-white'
            : 'border-[#8E8B99] hover:border-[#7065F0]'
        )}
      >
        {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold truncate">{task.title}</p>
        {task.description && (
          <p
            className={cn(
              'text-xs truncate mt-0.5',
              isVibrant ? 'opacity-85 font-medium' : 'text-[#8E8B99]'
            )}
          >
            {task.description}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          {task.time_slot && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold',
                isVibrant ? 'opacity-90' : 'text-[#8E8B99]'
              )}
            >
              <Clock className="h-3 w-3" />
              <span>{task.time_slot}</span>
            </span>
          )}

          {task.due_at && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold',
                isVibrant ? 'opacity-90' : 'text-[#8E8B99]'
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.due_at)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Hover Delete Action */}
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          title="Delete task"
          className="rounded-full p-2 bg-black/10 hover:bg-black/20 text-current transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
