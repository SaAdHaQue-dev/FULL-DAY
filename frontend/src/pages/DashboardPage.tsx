import React, { useState } from 'react';
import {
  Bell,
  Plus,
  ArrowRight,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { mockProfile, mockTeamMembers } from '../services/mockData';
import { PlanDetailModal } from '../components/tasks/PlanDetailModal';

export const DashboardPage: React.FC = () => {
  const { tasks, setIsQuickAddOpen, setIsAIModalOpen } = useTasks();
  const [selectedPlanTask, setSelectedPlanTask] = useState<{
    title: string;
    description: string;
    timeSlot: string;
  } | null>(null);

  const [activeDateIndex, setActiveDateIndex] = useState(3); // 21 Thu

  const weekDays = [
    { dayNum: 18, dayName: 'Mon' },
    { dayNum: 19, dayName: 'Tue' },
    { dayNum: 20, dayName: 'Wed' },
    { dayNum: 21, dayName: 'Thu' },
    { dayNum: 22, dayName: 'Fri' },
    { dayNum: 23, dayName: 'Sat' },
    { dayNum: 24, dayName: 'Sun' },
  ];

  const scheduleItems = [
    {
      time: '09:00 AM',
      taskTime: '09:20-10:45',
      title: 'Research Plan',
      assignedTo: 'Wade Warren',
      assignedAvatar: mockTeamMembers[0].avatar_url,
      bgColor: 'bg-[#FF5EEA]',
      textColor: 'text-white',
      cardId: 'task-2',
    },
    {
      time: '11:00 AM',
      taskTime: '11:30-12:00',
      title: 'Team Meeting',
      description: 'Discussion of tasks for the month',
      assignedTo: '8 Members',
      showAvatars: true,
      bgColor: 'bg-[#FFAE33]',
      textColor: 'text-[#18171E]',
      cardId: 'task-3',
    },
    {
      time: '01:00 PM',
      taskTime: '12:20-02:30',
      title: 'Design Review on...',
      assignedTo: 'Leslie Alexander',
      assignedAvatar: mockTeamMembers[1].avatar_url,
      bgColor: 'bg-[#54C5FF]',
      textColor: 'text-[#18171E]',
      cardId: 'task-4',
    },
  ];

  const planAgendaItems = [
    {
      title: 'Discussion on Client Requirements',
      time: '11:30 - 12:00',
      bgColor: 'bg-[#7065F0]',
      textColor: 'text-white',
    },
    {
      title: 'Organizing Team Roles for Project Success',
      time: '12:00 - 12:30',
      bgColor: 'bg-[#FFAE33]',
      textColor: 'text-[#18171E]',
    },
    {
      title: 'Meeting Outcomes and Summary',
      time: '12:30 - 01:00',
      bgColor: 'bg-[#FF5EEA]',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 3-Column Visual Layout (recreating the uploaded design) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">
        
        {/* ==================================================================== */}
        {/* SCREEN 1: MAIN DASHBOARD CARD */}
        {/* ==================================================================== */}
        <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] flex flex-col justify-between min-h-[660px]">
          <div>
            {/* Top User Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={mockProfile.avatar_url || ''}
                  alt={mockProfile.display_name || ''}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
                <div>
                  <p className="text-xs font-semibold text-[#8E8B99] tracking-wide">Good Morning !</p>
                  <p className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
                    {mockProfile.display_name}
                  </p>
                </div>
              </div>

              {/* Notification Bell with red dot */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#FF3B30] ring-2 ring-white dark:ring-[#1C1B24]" />
                </button>
              </div>
            </div>

            {/* Big Headline */}
            <div className="mt-8 mb-6">
              <h1 className="text-3xl font-normal text-[#18171E] dark:text-white leading-[1.2]">
                You have {tasks.filter((t) => t.status !== 'completed').length || 3}
                <br />
                <span className="font-extrabold text-[#18171E] dark:text-white">task for today</span>
              </h1>
            </div>

            {/* Members Section */}
            <div className="my-6">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-base font-extrabold text-[#18171E] dark:text-white">8 Members</h2>
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7065F0] text-white hover:bg-[#6055E8] shadow-xs transition-transform active:scale-95"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                </button>
              </div>

              {/* Members Avatars Row */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {mockTeamMembers.slice(0, 6).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar_url || ''}
                    alt={m.display_name || ''}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100 hover:scale-105 transition-transform shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Next Task Card */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-extrabold text-[#18171E] dark:text-white">Next Task</h2>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#7065F0] hover:underline"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>AI Plan</span>
                </button>
              </div>

              {/* Outer soft lavender container with inner purple hero card */}
              <div className="rounded-[32px] bg-[#E7E5FC] dark:bg-[#25223D] p-3 shadow-md">
                <div className="relative rounded-[26px] bg-[#7065F0] p-5 text-white overflow-hidden min-h-[190px] flex flex-col justify-between">
                  {/* Top line: Title & Team Avatars */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-white leading-tight">
                        Healthcare
                        <br />
                        Dashboard UI
                      </h3>
                      <p className="text-xs text-white/80 font-medium mt-1">Design team</p>
                    </div>

                    {/* Team Avatar Stack */}
                    <div className="flex -space-x-2">
                      {mockTeamMembers.slice(1, 4).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar_url || ''}
                          alt=""
                          className="h-7 w-7 rounded-full border border-white/60 object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  {/* 3D Illustration Graphic representation */}
                  <div className="mt-3 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-2xl">
                        💡
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[10px]">
                          ⏳
                        </span>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-white text-[10px] font-bold">
                          ✓
                        </span>
                      </div>
                    </div>

                    {/* Circular Action Arrow Button */}
                    <button
                      onClick={() =>
                        setSelectedPlanTask({
                          title: 'Healthcare Dashboard UI',
                          description: 'Design team - Core user workflows and component library',
                          timeSlot: '10:00 AM - 11:30 AM',
                        })
                      }
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7065F0] hover:bg-white/95 shadow-lg active:scale-95 transition-all"
                    >
                      <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SCREEN 2: CALENDAR & CHRONOLOGICAL SCHEDULE CARD */}
        {/* ==================================================================== */}
        <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] flex flex-col justify-between min-h-[660px]">
          <div>
            {/* Calendar Header with Navigation */}
            <div className="flex items-center justify-between pb-3">
              <button
                type="button"
                aria-label="Previous view"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-base font-extrabold text-[#18171E] dark:text-white tracking-tight">
                Calendar
              </h2>
              <button
                type="button"
                aria-label="More options"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Month Picker */}
            <div className="flex items-center justify-center gap-3 my-3">
              <button
                type="button"
                aria-label="Previous month"
                className="text-[#8E8B99] hover:text-[#18171E]"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-bold text-[#18171E] dark:text-white">February</span>
              <button
                type="button"
                aria-label="Next month"
                className="text-[#8E8B99] hover:text-[#18171E]"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Horizontal Week Scroller with Active Purple Pill */}
            <div className="flex items-center justify-between gap-1 my-4">
              {weekDays.map((item, idx) => {
                const isActive = idx === activeDateIndex;
                return (
                  <button
                    key={item.dayNum}
                    onClick={() => setActiveDateIndex(idx)}
                    className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-[22px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30 min-w-[42px]'
                        : 'text-[#8E8B99] hover:text-[#18171E]'
                    }`}
                  >
                    <span className="text-xs font-bold">{item.dayNum}</span>
                    <span className="text-[10px] font-medium mt-0.5">{item.dayName}</span>
                  </button>
                );
              })}
            </div>

            {/* Chronological Schedule Rail */}
            <div className="mt-6 space-y-4">
              {scheduleItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  {/* Time rail label */}
                  <div className="w-16 shrink-0 pt-1 text-right">
                    <span className="text-[11px] font-semibold text-[#8E8B99]">{item.time}</span>
                  </div>

                  {/* Task Card in exact vibrant color */}
                  <div
                    onClick={() =>
                      setSelectedPlanTask({
                        title: item.title,
                        description: item.description || 'Discussion of tasks for the month',
                        timeSlot: item.taskTime,
                      })
                    }
                    className={`flex-1 rounded-[26px] p-4 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-xs ${item.bgColor} ${item.textColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold leading-snug">{item.title}</h4>
                        <div className="mt-1 flex items-center gap-1.5 text-xs opacity-90">
                          <Clock className="h-3 w-3" />
                          <span>{item.taskTime}</span>
                        </div>
                      </div>
                      <MoreVertical className="h-4 w-4 opacity-75" />
                    </div>

                    {/* Card Footer: Assignee */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/10">
                      {item.showAvatars ? (
                        <div className="flex items-center -space-x-1.5">
                          {mockTeamMembers.slice(0, 3).map((m) => (
                            <img
                              key={m.id}
                              src={m.avatar_url || ''}
                              alt=""
                              className="h-6 w-6 rounded-full border border-white object-cover"
                            />
                          ))}
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18171E] text-[9px] font-bold text-white border border-white">
                            +8
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] opacity-80">Assigned to</span>
                          {item.assignedAvatar && (
                            <img
                              src={item.assignedAvatar}
                              alt=""
                              className="h-5 w-5 rounded-full object-cover"
                            />
                          )}
                          <span className="text-xs font-bold">{item.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SCREEN 3: PLAN & DETAIL AGENDA CARD */}
        {/* ==================================================================== */}
        <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833] flex flex-col justify-between min-h-[660px]">
          <div>
            {/* Top Close / Edit Header */}
            <div className="flex items-center justify-between pb-3">
              <button
                type="button"
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
              >
                ✕
              </button>
              <button
                type="button"
                aria-label="Edit"
                onClick={() => setIsQuickAddOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
              >
                ✎
              </button>
            </div>

            {/* Dark Time Pill */}
            <div className="flex justify-center my-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#18171E] px-5 py-2 text-xs font-semibold text-white tracking-wide">
                11:30 AM - 12:00 PM
              </span>
            </div>

            {/* Meeting Title & Subtitle */}
            <div className="text-center my-3">
              <h2 className="text-2xl font-extrabold text-[#18171E] dark:text-white tracking-tight">
                Team Meeting
              </h2>
              <p className="mt-1 text-xs text-[#8E8B99] font-medium">
                Discussion of tasks for the month
              </p>
            </div>

            {/* Assignees Cluster */}
            <div className="flex items-center justify-center -space-x-2 my-4">
              {mockTeamMembers.slice(0, 4).map((m) => (
                <img
                  key={m.id}
                  src={m.avatar_url || ''}
                  alt={m.display_name || ''}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs dark:border-[#1C1B24]"
                />
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#18171E] text-xs font-bold text-white shadow-xs dark:border-[#1C1B24]">
                +8
              </div>
            </div>

            {/* Plan Title */}
            <div className="mt-6 mb-3">
              <h3 className="text-xl font-extrabold text-[#18171E] dark:text-white">Plan</h3>
            </div>

            {/* 3 Stacked Colorful Cards: Purple, Yellow, Pink */}
            <div className="space-y-3.5">
              {planAgendaItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedPlanTask({
                      title: item.title,
                      description: 'Agenda item for Team Meeting',
                      timeSlot: item.time,
                    })
                  }
                  className={`rounded-[24px] p-5 shadow-xs cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] ${item.bgColor} ${item.textColor}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold leading-snug flex-1">{item.title}</span>
                    <span className="text-xs font-semibold shrink-0 opacity-90">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Plan Detail Modal */}
      {selectedPlanTask && (
        <PlanDetailModal
          isOpen={Boolean(selectedPlanTask)}
          onClose={() => setSelectedPlanTask(null)}
          taskTitle={selectedPlanTask.title}
          taskDescription={selectedPlanTask.description}
          timeSlot={selectedPlanTask.timeSlot}
        />
      )}
    </div>
  );
};
