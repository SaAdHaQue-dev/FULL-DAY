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
import { mockNotifications, mockProfile } from '../../services/mockData';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { filters, setFilters, setIsQuickAddOpen, setIsVoiceModalOpen, setIsAIModalOpen } = useTasks();
  const { isDark, setTheme, theme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between px-6 bg-transparent">
      {/* Left side: Mobile Toggle & Search Pill */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#18171E] shadow-sm hover:bg-[#F4F3F8] dark:bg-[#1C1B24] dark:text-white md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Pill */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8B99]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search tasks, meetings, or notes..."
            className="w-full rounded-full border border-white/60 bg-white/90 py-2.5 pl-11 pr-10 text-xs font-medium text-[#18171E] placeholder-[#8E8B99] shadow-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7065F0]/30 dark:border-[#292833] dark:bg-[#1C1B24]/90 dark:text-white"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden rounded-md bg-[#F4F3F8] px-1.5 py-0.5 text-[10px] font-semibold text-[#8E8B99] dark:bg-[#292833] sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Actions, Theme, Bell & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Voice Command Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          title="Voice Command"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#18171E] shadow-xs hover:bg-[#F4F3F8] dark:bg-[#1C1B24] dark:text-white transition-colors"
        >
          <Mic className="h-4 w-4 text-[#7065F0]" />
        </button>

        {/* AI Assistant Pill */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          title="AI Planner"
          className="hidden sm:flex h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-[#7065F0] shadow-xs hover:bg-[#F4F3F8] dark:bg-[#1C1B24] transition-colors"
        >
          <Sparkles className="h-4 w-4 text-[#7065F0]" />
          <span>AI Assist</span>
        </button>

        {/* Quick Add Purple Button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex h-11 items-center gap-2 rounded-full bg-[#7065F0] px-5 text-xs font-extrabold text-white shadow-md shadow-[#7065F0]/25 hover:bg-[#6055E8] active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#18171E] shadow-xs hover:bg-[#F4F3F8] dark:bg-[#1C1B24] dark:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#FF3B30] ring-2 ring-white dark:ring-[#1C1B24]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-[28px] border border-[#F0EEF6] bg-white p-4 shadow-2xl dark:border-[#292833] dark:bg-[#1C1B24] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEF6] dark:border-[#292833]">
                <span className="font-extrabold text-xs text-[#18171E] dark:text-white">Notifications</span>
                <span className="text-[11px] font-bold text-[#7065F0] hover:underline cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-[#F0EEF6] dark:divide-[#292833] max-h-72 overflow-y-auto mt-2">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-[#F4F3F8] dark:hover:bg-[#292833]/50 rounded-2xl transition-colors">
                    <div className="flex items-start gap-2.5">
                      {n.type === 'overdue' ? (
                        <AlertCircle className="h-4 w-4 text-[#FF3B30] shrink-0 mt-0.5" />
                      ) : n.type === 'due_soon' ? (
                        <Clock className="h-4 w-4 text-[#FFAE33] shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-[#7065F0] shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs">
                        <p className="font-bold text-[#18171E] dark:text-white">{n.title}</p>
                        <p className="text-[#8E8B99] text-[11px] mt-0.5 leading-relaxed">{n.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#18171E] shadow-xs hover:bg-[#F4F3F8] dark:bg-[#1C1B24] dark:text-white transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4 text-[#FFAE33]" /> : <Moon className="h-4 w-4 text-[#7065F0]" />}
        </button>

        {/* User Avatar */}
        <img
          src={mockProfile.avatar_url || ''}
          alt={mockProfile.display_name || ''}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs cursor-pointer select-none hover:scale-105 transition-transform"
        />
      </div>
    </header>
  );
};
