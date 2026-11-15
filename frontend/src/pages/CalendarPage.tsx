import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
} from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { cn } from '../lib/utils';

export const CalendarPage: React.FC = () => {
  const { tasks, setSelectedTaskId, setIsQuickAddOpen } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Build 7x5 or 7x6 days grid
  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header with Month Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calendar</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Chronological calendar of deadlines, planned work, and deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-center text-xs font-semibold text-slate-500 py-2.5">
          {weekdays.map((wd) => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          {days.map((d, index) => {
            const isCurrentMonth = isSameMonth(d, monthStart);
            const isToday = isSameDay(d, new Date());

            // Find tasks due on this day
            const dayTasks = tasks.filter((t) => {
              if (!t.due_at) return false;
              try {
                return isSameDay(parseISO(t.due_at), d);
              } catch {
                return false;
              }
            });

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[110px] p-2 transition-colors relative flex flex-col',
                  !isCurrentMonth && 'bg-slate-50/40 dark:bg-slate-950/40 opacity-40',
                  isToday && 'bg-indigo-50/20 dark:bg-indigo-950/20'
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      isToday
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {format(d, 'd')}
                  </span>
                </div>

                {/* Day tasks pills */}
                <div className="space-y-1 overflow-hidden flex-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const isDone = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={cn(
                          'truncate rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer transition-colors',
                          isDone
                            ? 'bg-slate-100 text-slate-400 line-through dark:bg-slate-800 dark:text-slate-500'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300'
                        )}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] font-semibold text-slate-400 pl-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
