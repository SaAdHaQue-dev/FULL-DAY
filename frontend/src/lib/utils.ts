import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isPast, isToday as checkIsToday, isTomorrow, parseISO } from 'date-fns';
import { TaskPriority, TaskStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (checkIsToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
}

export function isTaskOverdue(dueAt: string | null | undefined, status: TaskStatus): boolean {
  if (!dueAt || status === 'completed' || status === 'cancelled') return false;
  try {
    const date = parseISO(dueAt);
    return isPast(date) && !checkIsToday(date);
  } catch {
    return false;
  }
}

export function isTaskToday(dueAt: string | null | undefined): boolean {
  if (!dueAt) return false;
  try {
    const date = parseISO(dueAt);
    return checkIsToday(date);
  } catch {
    return false;
  }
}

export function getPriorityColor(priority: TaskPriority) {
  switch (priority) {
    case 'urgent':
      return {
        bg: 'bg-red-500/10 dark:bg-red-500/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-900/50',
        dot: 'bg-red-500',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10 dark:bg-orange-500/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-900/50',
        dot: 'bg-orange-500',
      };
    case 'medium':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-900/50',
        dot: 'bg-blue-500',
      };
    case 'low':
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-800',
        dot: 'bg-slate-400',
      };
  }
}

export function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40',
      };
    case 'todo':
    default:
      return {
        label: 'To Do',
        className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
      };
  }
}
