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
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { ThemeMode } from '../types';

export const SettingsPage: React.FC = () => {
  const { profile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(profile?.display_name || 'Alex Rivera');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [dailySummary, setDailySummary] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: 'system', label: 'System', icon: Laptop },
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
  ];

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal account, notifications, and application preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Profile Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Timezone
              </label>
              <select
                defaultValue="UTC"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-hidden"
              >
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Sun className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Appearance & Theme</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-medium transition-all ${
                  theme === mode
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Smart Notifications</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">Email task reminders</p>
                <p className="text-[11px] text-slate-400">Receive an email when high-priority tasks are due</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">Browser push notifications</p>
                <p className="text-[11px] text-slate-400">Deliver real-time alerts when browser is open</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">Daily productivity summary</p>
                <p className="text-[11px] text-slate-400">Receive morning briefing of today's planned agenda</p>
              </div>
              <input
                type="checkbox"
                checked={dailySummary}
                onChange={(e) => setDailySummary(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
            </label>
          </div>
        </div>

        {/* Backend & Supabase Status */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Backend Integration Status</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Supabase Connection:</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isSupabaseConfigured ? 'Connected to Supabase' : 'Offline / Demo Storage Mode'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            To connect to a live database, paste your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> into <code>frontend/.env</code> and run migrations from <code>backend/supabase/migrations</code>.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/20 p-6 dark:border-rose-950/60 dark:bg-rose-950/10 space-y-4">
          <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Account & Data Management</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => alert('Data export initiated. Download will begin shortly.')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Task Data</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedMessage && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
