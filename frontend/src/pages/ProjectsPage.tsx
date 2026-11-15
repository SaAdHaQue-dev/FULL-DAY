import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FolderKanban, Plus, CheckCircle2, ListTodo, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { EmptyState } from '../components/common/EmptyState';

export const ProjectsPage: React.FC = () => {
  const { projects, tasks, createProject, setIsQuickAddOpen } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProjectId = searchParams.get('id');

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectTasks = tasks.filter((t) => t.project_id === selectedProjectId);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const created = await createProject({ name: name.trim(), description, color });
    setName('');
    setDescription('');
    setIsCreating(false);
    setSearchParams({ id: created.id });
  };

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <FolderKanban className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h1>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {projects.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Group related tasks, track milestones, and manage progress.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* New Project Inline Modal */}
      {isCreating && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-lg dark:border-indigo-900/60 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Create New Project</h3>
            <button onClick={() => setIsCreating(false)} className="rounded p-1 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Website Redesign"
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of project goals..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-hidden resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Accent Color</label>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`h-7 w-7 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          const total = tasks.filter((t) => t.project_id === proj.id).length;
          const completed = tasks.filter((t) => t.project_id === proj.id && t.status === 'completed').length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={proj.id}
              onClick={() => setSearchParams({ id: proj.id })}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: proj.color }} />
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{proj.name}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{percent}%</span>
              </div>

              {proj.description && (
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">{proj.description}</p>
              )}

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>{total} tasks</span>
                <span>{completed} completed</span>
              </div>

              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%`, backgroundColor: proj.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Tasks List */}
      {selectedProject && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: selectedProject.color }} />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedProject.name} Tasks</h2>
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add to this project
            </button>
          </div>

          {projectTasks.length > 0 ? (
            <div className="space-y-2">
              {projectTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ListTodo}
              title="No tasks in this project"
              description="Add tasks to this project to start tracking your deliverables."
              actionLabel="Add Task to Project"
              onAction={() => setIsQuickAddOpen(true)}
            />
          )}
        </div>
      )}
    </div>
  );
};
