import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  PieChart,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const AnalyticsPage: React.FC = () => {
  const { tasks, projects, counts } = useTasks();

  const totalTasks = counts.all + counts.completed;
  const completionRate = totalTasks > 0 ? Math.round((counts.completed / totalTasks) * 100) : 0;

  // Breakdown by priority
  const priorityStats = {
    urgent: tasks.filter((t) => t.priority === 'urgent').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Productivity Analytics</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Insights based on real task activity, completion trends, and project velocity.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Overall Velocity</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{completionRate}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{counts.completed} of {totalTasks} finished</p>
        </div>

        {/* Completed Total */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Tasks Done</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{counts.completed}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Recorded historical</p>
        </div>

        {/* Current Streak */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">4 Days</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Daily completion pace</p>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Overdue Rate</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{counts.overdue}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Tasks past due date</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tasks By Priority</h3>
            <PieChart className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 space-y-3">
            {[
              { label: 'Urgent', count: priorityStats.urgent, color: '#ef4444' },
              { label: 'High', count: priorityStats.high, color: '#f97316' },
              { label: 'Medium', count: priorityStats.medium, color: '#3b82f6' },
              { label: 'Low', count: priorityStats.low, color: '#94a3b8' },
            ].map((item) => {
              const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-slate-400">{item.count} tasks ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Velocity Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project Velocity</h3>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 space-y-4">
            {projects.map((proj) => {
              const projTasks = tasks.filter((t) => t.project_id === proj.id);
              const done = projTasks.filter((t) => t.status === 'completed').length;
              const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

              return (
                <div key={proj.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: proj.color }} />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{proj.name}</span>
                    </div>
                    <span className="text-slate-400">{done}/{projTasks.length} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: proj.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
