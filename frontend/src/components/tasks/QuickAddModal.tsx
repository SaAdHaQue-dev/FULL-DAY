import React, { useState } from 'react';
import { X, Calendar, Flag, FolderKanban } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskPriority } from '../../types';
import { format } from 'date-fns';

export const QuickAddModal: React.FC = () => {
  const { isQuickAddOpen, setIsQuickAddOpen, createTask, projects } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [projectId, setProjectId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!isQuickAddOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_at: dueDate ? `${dueDate}T18:00:00Z` : null,
        project_id: projectId || null,
      });

      setTitle('');
      setDescription('');
      setIsQuickAddOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Create New Task</h2>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="w-full text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden dark:text-slate-100 dark:bg-transparent"
            />
          </div>

          <div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description, notes, or checklist..."
              className="w-full resize-none text-sm text-slate-600 placeholder-slate-400 focus:outline-hidden dark:text-slate-300 dark:bg-transparent"
            />
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                <FolderKanban className="h-3.5 w-3.5" /> Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">Inbox (No Project)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
