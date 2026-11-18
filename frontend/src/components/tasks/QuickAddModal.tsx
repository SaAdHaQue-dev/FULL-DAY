import React, { useState } from 'react';
import { X, Calendar, Clock, FolderKanban, Mic } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskPriority } from '../../types';
import { format } from 'date-fns';

export const QuickAddModal: React.FC = () => {
  const { isQuickAddOpen, setIsQuickAddOpen, setIsVoiceModalOpen, createTask, projects } = useTasks();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl border border-[#EDE8F5] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE8F5]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#1E1B2E]">Create New Task</h2>
            <button
              type="button"
              onClick={() => {
                setIsQuickAddOpen(false);
                setIsVoiceModalOpen(true);
              }}
              className="flex items-center gap-1 rounded-full bg-[#E8F8F0] px-2.5 py-1 text-[11px] font-extrabold text-[#20C997] hover:bg-[#D3F5E7] active:scale-95 transition-all"
              title="Dictate with voice"
            >
              <Mic className="h-3 w-3 stroke-[2.5]" />
              <span>Voice</span>
            </button>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F3F8] text-[#8B88A0] hover:text-[#1E1B2E] hover:bg-[#EAE8F2] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-5 space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is your plan or task?"
              required
              className="w-full text-base font-extrabold text-[#18171E] placeholder-[#8E8B99] focus:outline-hidden dark:text-white dark:bg-transparent"
            />
          </div>

          <div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, discussion points, or agenda..."
              className="w-full resize-none text-xs text-[#57534E] placeholder-[#8E8B99] focus:outline-hidden dark:text-slate-300 dark:bg-transparent"
            />
          </div>

          {/* Properties row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F0EEF6] dark:border-[#292833]">
            <div>
              <label className="block text-[11px] font-bold text-[#8E8B99] mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-[#F0EEF6] bg-[#F4F3F8] px-3 py-2 text-xs font-semibold text-[#18171E] focus:outline-hidden dark:border-[#292833] dark:bg-[#292833] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8E8B99] mb-1 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-2xl border border-[#F0EEF6] bg-[#F4F3F8] px-3 py-2 text-xs font-semibold text-[#18171E] focus:outline-hidden dark:border-[#292833] dark:bg-[#292833] dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8E8B99] mb-1 flex items-center gap-1">
                <FolderKanban className="h-3.5 w-3.5" /> Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-2xl border border-[#F0EEF6] bg-[#F4F3F8] px-3 py-2 text-xs font-semibold text-[#18171E] focus:outline-hidden dark:border-[#292833] dark:bg-[#292833] dark:text-white truncate"
              >
                <option value="">Inbox</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EEF6] dark:border-[#292833]">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="rounded-full px-5 py-2.5 text-xs font-bold text-[#8E8B99] hover:bg-[#F4F3F8] dark:hover:bg-[#292833]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="rounded-full bg-[#6C5CE7] px-6 py-2.5 text-xs font-black text-white shadow-md shadow-[#6C5CE7]/25 hover:bg-[#5B4BC4] disabled:opacity-50 transition-all"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
