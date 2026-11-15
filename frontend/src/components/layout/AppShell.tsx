import React, { useEffect } from 'react';
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
    <div className="min-h-screen bg-[#F8F9FE] text-[#1E1B2E] antialiased selection:bg-[#6C5CE7]/15 selection:text-[#6C5CE7]">
      {/* Mobile-First Centered Container */}
      <div className="max-w-md mx-auto min-h-screen bg-white sm:shadow-[0_0_50px_rgba(108,92,231,0.06)] sm:border-x sm:border-[#EDE8F5] flex flex-col relative pb-20">
        <main className="flex-1 w-full p-4 sm:p-5">
          {children}
        </main>
      </div>

      {/* Clean White Bottom Navigation Dock */}
      <BottomDock />

      {/* Quick Add & Voice & AI Modals */}
      <QuickAddModal />
      <VoiceModal />
      <AIAssistantModal />
      <TaskDetailDrawer />
    </div>
  );
};
