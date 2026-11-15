import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Laptop,
  Database,
  Trash2,
  Download,
  Upload,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { taskService } from '../services/taskService';
import { ThemeMode } from '../types';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { refreshTasks } = useTasks();

  const [displayName, setDisplayName] = useState(profile.display_name || 'Saad');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      display_name: displayName.trim() || 'Saad',
      avatar_url: avatarUrl.trim() || profile.avatar_url,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleExportBackup = () => {
    const dataStr = taskService.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskora_personal_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = taskService.importBackup(content);
      if (success) {
        await refreshTasks();
        alert('Backup successfully restored!');
      } else {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: 'system', label: 'System', icon: Laptop },
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-[#7065F0]" />
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18171E] dark:text-white">
            Personal Settings
          </h1>
        </div>
        <p className="mt-1 text-xs text-[#8E8B99] font-medium">
          Tailor your personal productivity workstation. All data stays private on your device.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Card */}
        <div className="rounded-[32px] bg-white p-6 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#18171E] dark:text-white">
            <User className="h-4 w-4 text-[#7065F0]" />
            <span>Profile & Identity</span>
          </div>

          <div className="flex items-center gap-4 py-2">
            <img
              src={avatarUrl || profile.avatar_url || ''}
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-4 ring-[#ECEAFE] dark:ring-[#7065F0]/20 shadow-sm"
            />
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-[#8E8B99] mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name (e.g. Saad)"
                className="w-full rounded-2xl border border-[#F0EEF6] bg-[#F4F3F8] px-3.5 py-2 text-xs font-bold text-[#18171E] focus:outline-hidden dark:border-[#292833] dark:bg-[#292833] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="rounded-[32px] bg-white p-6 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#18171E] dark:text-white">
            <Sun className="h-4 w-4 text-[#FFAE33]" />
            <span>Appearance & Theme</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition-all ${
                  theme === mode
                    ? 'border-[#7065F0] bg-[#ECEAFE] text-[#7065F0] shadow-sm dark:bg-[#7065F0]/20'
                    : 'border-[#F0EEF6] bg-[#F4F3F8] text-[#8E8B99] hover:border-slate-300 dark:border-[#292833] dark:bg-[#292833]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications & Focus */}
        <div className="rounded-[32px] bg-white p-6 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#18171E] dark:text-white">
            <Bell className="h-4 w-4 text-[#FF5EEA]" />
            <span>Productivity Reminders</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-xs font-bold text-[#18171E] dark:text-white">Task Deadline Alerts</p>
                <p className="text-[11px] text-[#8E8B99]">Sound & visual notifications when tasks are due</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="h-4 w-4 rounded-full accent-[#7065F0]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-xs font-bold text-[#18171E] dark:text-white">Daily Planning Briefing</p>
                <p className="text-[11px] text-[#8E8B99]">Morning AI recommendations based on today's tasks</p>
              </div>
              <input
                type="checkbox"
                checked={dailySummary}
                onChange={(e) => setDailySummary(e.target.checked)}
                className="h-4 w-4 rounded-full accent-[#7065F0]"
              />
            </label>
          </div>
        </div>

        {/* Data Ownership & Backup Card */}
        <div className="rounded-[32px] bg-white p-6 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#18171E] dark:text-white">
            <Database className="h-4 w-4 text-[#54C5FF]" />
            <span>Local Storage & Backup</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Private & Free. No account, sign-in, or payment required.</span>
          </div>

          <p className="text-xs text-[#8E8B99] leading-relaxed">
            All your tasks, daily plans, and notes are saved directly in your browser's private local storage. Export a backup anytime to save on your computer or transfer to another device.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-2 rounded-full bg-[#18171E] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:bg-black transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Backup (.JSON)</span>
            </button>

            <label className="flex items-center gap-2 rounded-full border border-[#F0EEF6] bg-[#F4F3F8] dark:bg-[#292833] px-5 py-2.5 text-xs font-bold text-[#18171E] dark:text-white shadow-xs cursor-pointer hover:bg-[#EAE8F2] transition-colors">
              <Upload className="h-3.5 w-3.5 text-[#7065F0]" />
              <span>Import Backup</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset your tasks to default starter items?')) {
                  localStorage.removeItem('taskora_personal_tasks');
                  window.location.reload();
                }
              }}
              className="flex items-center gap-1.5 rounded-full border border-rose-200 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30 transition-colors ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedMessage && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" /> Settings updated!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto rounded-full bg-[#7065F0] px-7 py-3 text-xs font-extrabold text-white shadow-lg shadow-[#7065F0]/25 hover:bg-[#6055E8] transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
