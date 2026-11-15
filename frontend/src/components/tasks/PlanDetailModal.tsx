import React from 'react';
import { X, Edit2, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { mockTeamMembers } from '../../services/mockData';

interface PlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle?: string;
  taskDescription?: string;
  timeSlot?: string;
}

export const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  isOpen,
  onClose,
  taskTitle = 'Team Meeting',
  taskDescription = 'Discussion of tasks for the month',
  timeSlot = '11:30 AM - 12:00 PM',
}) => {
  const { setIsQuickAddOpen } = useTasks();

  if (!isOpen) return null;

  const planItems = [
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[36px] bg-white p-6 shadow-2xl dark:bg-[#1C1B24] overflow-hidden flex flex-col relative">
        {/* Top Header Buttons */}
        <div className="flex items-center justify-between pb-4">
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              onClose();
              setIsQuickAddOpen(true);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F3F8] text-[#18171E] hover:bg-[#EAE8F2] dark:bg-[#292833] dark:text-white transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        {/* Time Pill */}
        <div className="flex justify-center my-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#18171E] px-6 py-2 text-xs font-semibold text-white tracking-wide">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeSlot}</span>
          </span>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center my-4">
          <h2 className="text-2xl font-extrabold text-[#18171E] dark:text-white tracking-tight">
            {taskTitle}
          </h2>
          <p className="mt-1.5 text-xs text-[#8E8B99] font-medium leading-relaxed">
            {taskDescription}
          </p>
        </div>

        {/* Members Cluster */}
        <div className="flex items-center justify-center -space-x-2 my-3">
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

        {/* Plan Section Title */}
        <div className="mt-6 mb-3">
          <h3 className="text-xl font-extrabold text-[#18171E] dark:text-white">Plan</h3>
        </div>

        {/* Stacked Colorful Plan Cards */}
        <div className="space-y-3.5 pb-2">
          {planItems.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-[26px] p-5 shadow-xs transition-transform active:scale-[0.99] cursor-pointer ${item.bgColor} ${item.textColor}`}
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
  );
};
