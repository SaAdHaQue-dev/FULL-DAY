import React from 'react';
import {
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  FolderKanban,
  Sparkles,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskItem } from '../components/tasks/TaskItem';
import { isTaskOverdue, isTaskToday } from '../lib/utils';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { tasks, projects, counts, setIsQuickAddOpen, setIsAIModalOpen } = useTasks();
  const { profile } = useAuth();

  const todayTasks = tasks.filter((t) => (isTaskToday(t.due_at) || isTaskToday(t.planned_for)) && t.status !== 'completed');
  const overdueTasks = tasks.filter((t) => isTaskOverdue(t.due_at, t.status));
  const recentCompleted = tasks.filter((t) => t.status === 'completed').slice(0, 3);

  const completionRate = counts.all + counts.completed > 0
    ? Math.round((counts.completed / (counts.all + counts.completed)) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Good morning, {profile?.display_name || 'Alex'} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • Here is your productivity pulse.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Daily Plan</span>
          </button>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Due Today */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Due Today</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{counts.today}</span>
            <span className="text-xs text-slate-400">tasks</span>
          </div>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overdue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{counts.overdue}</span>
            <span className="text-xs text-slate-400">attention needed</span>
          </div>
        </div>

        {/* Total Incomplete */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Tasks</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <ListTodo className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{counts.all}</span>
            <span className="text-xs text-slate-400">in queue</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completion</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{completionRate}%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{counts.completed} done</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today & Overdue Lists vs Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today & Overdue Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Alert Section */}
          {overdueTasks.length > 0 && (
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                    Overdue Attention ({overdueTasks.length})
                  </h3>
                </div>
              </div>
              <div className="space-y-2">
                {overdueTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Today Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Focus For Today ({todayTasks.length})
                </h2>
              </div>
              <NavLink to="/today" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                View all
              </NavLink>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">You have no pending tasks due today!</p>
                <p className="text-xs text-slate-400 mt-1">Enjoy your free time or schedule tasks from upcoming.</p>
              </div>
            )}
          </div>

          {/* Recently Completed */}
          {recentCompleted.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Completed Recently
                  </h3>
                </div>
                <NavLink to="/completed" className="text-xs text-slate-400 hover:text-slate-600">
                  See all completed
                </NavLink>
              </div>
              <div className="space-y-2">
                {recentCompleted.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Projects & AI Assistant Card */}
        <div className="space-y-6">
          {/* AI Daily Planner Banner */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-purple-500/10 p-5 dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-purple-950/30">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Smart Daily Plan</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Let Taskora AI organize today's agenda based on your urgency ratings and upcoming project deadlines.
            </p>
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
            >
              <span>Build Schedule</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Active Projects Widget */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Active Projects</h3>
              </div>
              <NavLink to="/projects" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                View all
              </NavLink>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => {
                const total = proj.task_count || 1;
                const completed = proj.completed_count || 0;
                const percent = Math.round((completed / total) * 100);

                return (
                  <NavLink
                    key={proj.id}
                    to={`/projects?id=${proj.id}`}
                    className="block rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: proj.color }} />
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                          {proj.name}
                        </span>
                      </div>
                      <span className="text-slate-400">{percent}%</span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%`, backgroundColor: proj.color }}
                      />
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
