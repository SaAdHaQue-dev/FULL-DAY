import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Mic,
  Bell,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { mockNotifications } from '../../services/mockData';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { filters, setFilters, setIsQuickAddOpen, setIsVoiceModalOpen, setIsAIModalOpen } = useTasks();
  const { isDark, setTheme, theme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
      {/* Left side: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search tasks, descriptions, or tags..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/30 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800 sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Voice Command Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          title="Voice Command"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </button>

        {/* AI Assistant Quick Pill */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          title="AI Assistant"
          className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/60 px-2.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI Assist</span>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Notifications</span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-1">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                    <div className="flex items-start gap-2.5">
                      {n.type === 'overdue' ? (
                        <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : n.type === 'due_soon' ? (
                        <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{n.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">{n.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${isDark ? 'light' : 'dark'} mode (current: ${theme})`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full ring-2 ring-indigo-500/30 overflow-hidden bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold cursor-pointer select-none">
          AR
        </div>
      </div>
    </header>
  );
};
