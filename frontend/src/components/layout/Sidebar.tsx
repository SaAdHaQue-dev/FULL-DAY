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
import { mockProfile } from '../../services/mockData';
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
    { label: 'Today', path: '/today', icon: CalendarDays, count: counts.today, badgeColor: 'bg-[#FF5EEA] text-white' },
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
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-68 flex-col bg-white/95 dark:bg-[#1C1B24]/95 backdrop-blur-xl border-r border-[#F0EEF6] dark:border-[#292833] transition-transform duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#F0EEF6] dark:border-[#292833]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/25">
              <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#18171E] dark:text-white">Taskora</span>
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ECEAFE] text-[#7065F0] dark:bg-[#7065F0]/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pt-5 pb-3 space-y-2">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7065F0] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#7065F0]/20 hover:bg-[#6055E8] active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>New Task</span>
            <kbd className="ml-auto hidden rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white md:inline">⌘N</kbd>
          </button>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ECEAFE] dark:bg-[#7065F0]/20 px-4 py-2 text-xs font-bold text-[#7065F0] hover:bg-[#E0DCFC] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Task Planner</span>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8E8B99]">
              Views
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all',
                    isActive
                      ? 'bg-[#7065F0] text-white shadow-sm shadow-[#7065F0]/25'
                      : 'text-[#8E8B99] hover:bg-[#F4F3F8] hover:text-[#18171E] dark:hover:bg-[#292833] dark:hover:text-white'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold',
                      item.badgeColor || 'bg-[#ECEAFE] text-[#7065F0]'
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8B99]">
                Projects
              </span>
              <NavLink
                to="/projects"
                className="text-[11px] font-bold text-[#7065F0] hover:underline"
              >
                View
              </NavLink>
            </div>
            {projects.map((proj) => (
              <NavLink
                key={proj.id}
                to={`/projects?id=${proj.id}`}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-3.5 py-2 text-xs font-bold transition-colors',
                    isActive
                      ? 'bg-[#F4F3F8] text-[#18171E] dark:bg-[#292833] dark:text-white'
                      : 'text-[#8E8B99] hover:bg-[#F4F3F8] hover:text-[#18171E] dark:hover:bg-[#292833] dark:hover:text-white'
                  )
                }
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-white dark:ring-[#1C1B24]"
                  style={{ backgroundColor: proj.color }}
                />
                <span className="truncate flex-1">{proj.name}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </NavLink>
            ))}
          </div>

          {/* System Workspace Tools */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8E8B99]">
              Workspace
            </div>
            {toolItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all',
                    isActive
                      ? 'bg-[#7065F0] text-white shadow-sm shadow-[#7065F0]/25'
                      : 'text-[#8E8B99] hover:bg-[#F4F3F8] hover:text-[#18171E] dark:hover:bg-[#292833] dark:hover:text-white'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer User Card */}
        <div className="p-4 border-t border-[#F0EEF6] dark:border-[#292833]">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-2xl p-2.5 hover:bg-[#F4F3F8] dark:hover:bg-[#292833] transition-colors"
          >
            <img
              src={mockProfile.avatar_url || ''}
              alt={mockProfile.display_name || ''}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-[#18171E] dark:text-white truncate">
                {mockProfile.display_name}
              </p>
              <p className="text-[11px] font-medium text-[#8E8B99] truncate">Product Team</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
