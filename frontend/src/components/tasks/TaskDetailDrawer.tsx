import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, FolderKanban, Check, Trash2, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskPriority, TaskStatus } from '../../types';
import { formatDateTime, getStatusBadge } from '../../lib/utils';
import { format, parseISO } from 'date-fns';

export const TaskDetailDrawer: React.FC = () => {
  const { selectedTask, setSelectedTaskId, updateTask, deleteTask, projects } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status);
      setPriority(selectedTask.priority);
      setProjectId(selectedTask.project_id || '');
      if (selectedTask.due_at) {
        try {
          setDueDate(format(parseISO(selectedTask.due_at), 'yyyy-MM-dd'));
        } catch {
          setDueDate('');
        }
      } else {
        setDueDate('');
      }
    }
  }, [selectedTask]);

  if (!selectedTask) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTask(selectedTask.id, {
        title,
        description: description || null,
        status,
        priority,
        project_id: projectId || null,
        due_at: dueDate ? `${dueDate}T18:00:00Z` : null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const statusBadge = getStatusBadge(status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedTaskId(null)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newStatus = status === 'completed' ? 'todo' : 'completed';
                  setStatus(newStatus);
                  updateTask(selectedTask.id, {
                    status: newStatus,
                    completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
                  });
                }}
                className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                  status === 'completed'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 hover:border-indigo-600 dark:border-slate-600'
                }`}
              >
                {status === 'completed' && <Check className="h-4 w-4 stroke-[3]" />}
              </button>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(selectedTask.id);
                  }
                }}
                title="Delete task"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedTaskId(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                placeholder="Task title..."
                className="w-full text-lg font-semibold text-slate-900 focus:outline-hidden dark:text-slate-100 dark:bg-transparent"
              />
            </div>

            {/* Properties Grid */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 dark:border-slate-800/80 dark:bg-slate-800/40">
              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Status</span>
                <select
                  value={status}
                  onChange={(e) => {
                    const next = e.target.value as TaskStatus;
                    setStatus(next);
                    updateTask(selectedTask.id, { status: next });
                  }}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5" /> Priority
                </span>
                <select
                  value={priority}
                  onChange={(e) => {
                    const next = e.target.value as TaskPriority;
                    setPriority(next);
                    updateTask(selectedTask.id, { priority: next });
                  }}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Due Date
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    updateTask(selectedTask.id, {
                      due_at: e.target.value ? `${e.target.value}T18:00:00Z` : null,
                    });
                  }}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Project */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <FolderKanban className="h-3.5 w-3.5" /> Project
                </span>
                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    updateTask(selectedTask.id, { project_id: e.target.value || null });
                  }}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs max-w-[160px] truncate dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">None (Inbox)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Add rich description, checklist, or notes..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
              />
            </div>

            {/* Timestamps */}
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Created: {formatDateTime(selectedTask.created_at)}</span>
              </div>
              {selectedTask.completed_at && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  <span>Completed: {formatDateTime(selectedTask.completed_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {isSaving ? 'Saving changes...' : 'Changes saved automatically'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedTaskId(null)}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
