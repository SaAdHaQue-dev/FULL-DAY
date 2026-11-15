import React, { useState } from 'react';
import {
  Settings,
  ChevronRight,
  BookOpen,
  Bookmark,
  Star,
  BarChart2,
  Download,
  Upload,
  User,
  Shield,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.display_name || 'Saad');
  const [backupMessage, setBackupMessage] = useState('');

  const handleExportBackup = () => {
    const json = taskService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lingua_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage('✓ Backup downloaded successfully');
    setTimeout(() => setBackupMessage(''), 3000);
  };

  const handleSaveProfile = () => {
    updateProfile({ display_name: nameInput });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Courses', value: 3 },
    { label: 'Lessons', value: 24 },
    { label: 'Words', value: 256 },
    { label: 'Streak', value: 7 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#1E1B2E] tracking-tight">
          Profile
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#1E1B2E] hover:bg-[#EDE8F5]"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* User Info Card (matching bottom-right screen) */}
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Cute Character Avatar */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-[#F0EFFF] p-1 ring-4 ring-[#6C5CE7]/20 overflow-hidden flex items-center justify-center shadow-md">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              {/* Hair Back */}
              <path d="M25 45 C20 20, 80 15, 80 45 C80 65, 75 75, 75 80 Z" fill="#3D291D" />
              {/* Face */}
              <circle cx="50" cy="50" r="22" fill="#FFDFC4" />
              {/* Hair Front */}
              <path d="M30 40 C40 32, 70 32, 75 42 C70 38, 55 36, 30 40 Z" fill="#3D291D" />
              {/* Eyes & Smile */}
              <circle cx="43" cy="48" r="2.5" fill="#3D291D" />
              <circle cx="57" cy="48" r="2.5" fill="#3D291D" />
              <path d="M47 57 Q50 60 53 57" stroke="#3D291D" strokeWidth="2" strokeLinecap="round" />
              {/* Cheeks */}
              <circle cx="40" cy="52" r="3" fill="#FFA5A5" opacity="0.6" />
              <circle cx="60" cy="52" r="3" fill="#FFA5A5" opacity="0.6" />
              {/* Shirt */}
              <path d="M25 100 C25 78, 75 78, 75 100 Z" fill="#6C5CE7" />
            </svg>
          </div>
        </div>

        {/* Display Name & Email */}
        <div>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="rounded-xl border border-[#6C5CE7] px-3 py-1 text-sm font-extrabold text-[#1E1B2E] text-center"
              />
              <button
                onClick={handleSaveProfile}
                className="rounded-xl bg-[#6C5CE7] px-3 py-1 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <h2 className="text-lg font-black text-[#1E1B2E]">
              {profile.display_name || 'Saad'}
            </h2>
          )}
          <p className="text-xs font-medium text-[#8B88A0] mt-0.5">
            saad@personal.app
          </p>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-full bg-[#6C5CE7] px-5 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#5B4BC4] active:scale-95 transition-all"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* 4 Stat Counters in horizontal row */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-xs text-center">
        {stats.map((s) => (
          <div key={s.label} className="space-y-0.5">
            <p className="text-base font-black text-[#1E1B2E]">{s.value}</p>
            <p className="text-[10px] font-bold text-[#8B88A0]">{s.label}</p>
          </div>
        ))}
      </div>

      {backupMessage && (
        <div className="rounded-xl bg-[#E8F8F0] p-2 text-center text-xs font-bold text-[#16A34A]">
          {backupMessage}
        </div>
      )}

      {/* Menu List Items with icons & chevrons (matching screenshot) */}
      <div className="space-y-2">
        {/* Item 1: My Vocabulary */}
        <div
          onClick={() => {}}
          className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EFFF] text-[#6C5CE7]">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors">
              My Vocabulary
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7]" />
        </div>

        {/* Item 2: Saved Lessons / Backup Data */}
        <div
          onClick={handleExportBackup}
          className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBF5FF] text-[#339AF0]">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors block">
                Export Local Backup (JSON)
              </span>
              <span className="text-[10px] font-semibold text-[#8B88A0]">
                All personal data is saved securely on device
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7]" />
        </div>

        {/* Item 3: Achievements */}
        <div
          onClick={() => {}}
          className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF9DB] text-[#FAB005]">
              <Star className="h-4 w-4 fill-[#FAB005]" />
            </div>
            <span className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors">
              Achievements & Badges
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7]" />
        </div>

        {/* Item 4: Statistics */}
        <div
          onClick={() => {}}
          className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F0] text-[#20C997]">
              <BarChart2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors">
              Statistics
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7]" />
        </div>

        {/* Item 5: Settings */}
        <div
          onClick={() => {}}
          className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF5E5] text-[#FF922B]">
              <Settings className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors">
              Settings
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#A09CB0] group-hover:text-[#6C5CE7]" />
        </div>
      </div>
    </div>
  );
};
