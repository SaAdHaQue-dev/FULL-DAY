import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ListTodo,
  BarChart3,
  Settings,
  Plus,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { counts, projects, setIsQuickAddOpen, setIsAIModalOpen } = useTasks();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Inbox', path: '/inbox', icon: Inbox, count: counts.inbox },
    { label: 'Today', path: '/today', icon: CalendarDays, count: counts.today, badgeColor: 'text-amber-500 font-semibold' },
    { label: 'Upcoming', path: '/upcoming', icon: CalendarRange, count: counts.upcoming },
    { label: 'All Tasks', path: '/tasks', icon: ListTodo, count: counts.all },
    { label: 'Completed', path: '/completed', icon: CheckCircle2, count: counts.completed },
  ];

  const toolItems = [
    { label: 'Calendar', path: '/calendar', icon: CalendarDays },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Taskora</span>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-3 pt-4 pb-2 space-y-1.5">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
            <kbd className="ml-auto hidden rounded bg-indigo-500/50 px-1.5 py-0.5 text-[10px] text-white/90 md:inline">⌘N</kbd>
          </button>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100/60 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-950/50 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Task Planner</span>
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main views */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tasks
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-2 py-0.5 text-xs',
                      item.badgeColor || 'bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Projects
              </span>
              <NavLink
                to="/projects"
                className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Manage
              </NavLink>
            </div>
            {projects.map((proj) => (
              <NavLink
                key={proj.id}
                to={`/projects?id=${proj.id}`}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  )
                }
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: proj.color }}
                />
                <span className="truncate flex-1">{proj.name}</span>
                <ChevronRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100" />
              </NavLink>
            ))}
            {projects.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-400">No projects yet</div>
            )}
          </div>

          {/* Views & Tools */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace
            </div>
            {toolItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer: User status */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold flex items-center justify-center text-xs">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-200 truncate">Alex Rivera</p>
              <p className="text-[11px] text-slate-400 truncate">alex@taskora.app</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
