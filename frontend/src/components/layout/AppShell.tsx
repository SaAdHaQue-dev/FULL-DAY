import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomDock } from './BottomDock';
import { QuickAddModal } from '../tasks/QuickAddModal';
import { VoiceModal } from '../common/VoiceModal';
import { AIAssistantModal } from '../ai/AIAssistantModal';
import { TaskDetailDrawer } from '../tasks/TaskDetailDrawer';
import { useTasks } from '../../context/TaskContext';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setIsQuickAddOpen } = useTasks();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsQuickAddOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsQuickAddOpen]);

  return (
    <div className="flex min-h-screen bg-[#EAE8F2] dark:bg-[#121118] text-[#18171E] dark:text-[#F5F4F9] antialiased transition-colors duration-200">
      {/* Sidebar for desktop/mobile navigation */}
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28">
          {children}
        </main>
      </div>

      {/* Floating Bottom Dock (matching Screen 1) */}
      <BottomDock />

      {/* Modals & Drawers */}
      <QuickAddModal />
      <VoiceModal />
      <AIAssistantModal />
      <TaskDetailDrawer />
    </div>
  );
};
