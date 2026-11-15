import React, { useState, useMemo } from 'react';
import { ListTodo, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { EmptyState } from '../components/common/EmptyState';
import { TaskPriority } from '../types';

export const AllTasksPage: React.FC = () => {
  const { tasks, projects, setIsQuickAddOpen, filters, setFilters } = useTasks();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'due_at' | 'priority' | 'created_at' | 'title'>('due_at');

  const filteredTasks = useMemo(() => {
    const query = filters.searchQuery.toLowerCase();

    return tasks.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (projectFilter !== 'all' && t.project_id !== projectFilter) return false;

      if (query) {
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'due_at') {
        if (!a.due_at) return 1;
        if (!b.due_at) return -1;
        return a.due_at.localeCompare(b.due_at);
      }
      if (sortBy === 'priority') {
        const priorityOrder: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return b.created_at.localeCompare(a.created_at);
    });
  }, [tasks, statusFilter, priorityFilter, projectFilter, sortBy, filters.searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <ListTodo className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">All Tasks</h1>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredTasks.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            A unified view of everything across your personal workload and projects.
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

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium pl-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden max-w-[150px] truncate"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Sort Selector */}
        <div className="ml-auto flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="due_at">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created_at">Created Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="Try adjusting your search query or filter options to see matching tasks."
          actionLabel="Clear Filters"
          onAction={() => {
            setStatusFilter('all');
            setPriorityFilter('all');
            setProjectFilter('all');
            setFilters((prev) => ({ ...prev, searchQuery: '' }));
          }}
        />
      )}
    </div>
  );
};
