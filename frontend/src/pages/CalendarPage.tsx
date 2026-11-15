import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Clock,
  Plus,
} from 'lucide-react';
import { mockTeamMembers } from '../services/mockData';
import { PlanDetailModal } from '../components/tasks/PlanDetailModal';
import { useTasks } from '../context/TaskContext';

export const CalendarPage: React.FC = () => {
  const { setIsQuickAddOpen } = useTasks();
  const [activeDateIndex, setActiveDateIndex] = useState(3); // 21 Thu
  const [selectedPlanTask, setSelectedPlanTask] = useState<{
    title: string;
    description: string;
    timeSlot: string;
  } | null>(null);

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
    },
    {
      time: '12:00 PM',
      taskTime: '12:20-02:30',
      title: 'Design Review on...',
      assignedTo: 'Leslie Alexander',
      assignedAvatar: mockTeamMembers[1].avatar_url,
      bgColor: 'bg-[#54C5FF]',
      textColor: 'text-[#18171E]',
    },
    {
      time: '02:30 PM',
      taskTime: '02:45-03:30',
      title: 'Sprint Planning Sync',
      assignedTo: 'Eleanor Pena',
      assignedAvatar: mockTeamMembers[2].avatar_url,
      bgColor: 'bg-[#7065F0]',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="rounded-[36px] bg-white p-7 shadow-xl dark:bg-[#1C1B24] border border-[#F0EEF6] dark:border-[#292833]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3">
          <button
            type="button"
            aria-label="Back"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-extrabold text-[#18171E] dark:text-white tracking-tight">
            Calendar
          </h1>
          <button
            type="button"
            aria-label="More options"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-4 my-4">
          <button
            type="button"
            aria-label="Previous month"
            className="text-[#8E8B99] hover:text-[#18171E]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-extrabold text-[#18171E] dark:text-white">February</span>
          <button
            type="button"
            aria-label="Next month"
            className="text-[#8E8B99] hover:text-[#18171E]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday Scroller */}
        <div className="flex items-center justify-between gap-1 my-5">
          {weekDays.map((item, idx) => {
            const isActive = idx === activeDateIndex;
            return (
              <button
                key={item.dayNum}
                onClick={() => setActiveDateIndex(idx)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-[24px] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30 min-w-[48px]'
                    : 'text-[#8E8B99] hover:text-[#18171E]'
                }`}
              >
                <span className="text-sm font-extrabold">{item.dayNum}</span>
                <span className="text-[11px] font-medium mt-0.5">{item.dayName}</span>
              </button>
            );
          })}
        </div>

        {/* Chronological Rail */}
        <div className="mt-8 space-y-5">
          {scheduleItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-20 shrink-0 pt-2 text-right">
                <span className="text-xs font-bold text-[#8E8B99]">{item.time}</span>
              </div>

              <div
                onClick={() =>
                  setSelectedPlanTask({
                    title: item.title,
                    description: item.description || 'Assigned task for the day',
                    timeSlot: item.taskTime,
                  })
                }
                className={`flex-1 rounded-[28px] p-5 cursor-pointer shadow-xs transition-transform hover:scale-[1.01] active:scale-[0.99] ${item.bgColor} ${item.textColor}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold leading-snug">{item.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs opacity-90 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.taskTime}</span>
                    </div>
                  </div>
                  <MoreVertical className="h-4 w-4 opacity-70" />
                </div>

                <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-black/10">
                  {item.showAvatars ? (
                    <div className="flex items-center -space-x-2">
                      {mockTeamMembers.slice(0, 3).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar_url || ''}
                          alt=""
                          className="h-7 w-7 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#18171E] text-[10px] font-bold text-white border-2 border-white">
                        +8
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-85">Assigned to</span>
                      {item.assignedAvatar && (
                        <img
                          src={item.assignedAvatar}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover"
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

        {/* Add Event Button */}
        <div className="mt-8 pt-4 flex justify-center">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#7065F0] px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-[#7065F0]/25 hover:bg-[#6055E8]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Schedule New Plan</span>
          </button>
        </div>
      </div>

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
