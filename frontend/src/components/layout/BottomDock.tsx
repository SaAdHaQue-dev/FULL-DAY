import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, BarChart3, ListTodo, User } from 'lucide-react';

export const BottomDock: React.FC = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1.5 rounded-full bg-[#18171E] px-3.5 py-2 shadow-2xl backdrop-blur-md border border-white/10">
        {/* Home */}
        <NavLink
          to="/"
          title="Today's Dashboard"
          className={({ isActive }) =>
            `flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              isActive
                ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                : 'text-[#8E8B99] hover:text-white'
            }`
          }
        >
          <Home className="h-5 w-5" />
        </NavLink>

        {/* Calendar */}
        <NavLink
          to="/calendar"
          title="Calendar & Timeline"
          className={({ isActive }) =>
            `flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              isActive
                ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                : 'text-[#8E8B99] hover:text-white'
            }`
          }
        >
          <Calendar className="h-5 w-5" />
        </NavLink>

        {/* Productivity Analytics & Habits */}
        <NavLink
          to="/analytics"
          title="Productivity & Focus Stats"
          className={({ isActive }) =>
            `flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              isActive
                ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                : 'text-[#8E8B99] hover:text-white'
            }`
          }
        >
          <BarChart3 className="h-5 w-5" />
        </NavLink>

        {/* Tasks List */}
        <NavLink
          to="/tasks"
          title="All Tasks & Projects"
          className={({ isActive }) =>
            `flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              isActive
                ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                : 'text-[#8E8B99] hover:text-white'
            }`
          }
        >
          <ListTodo className="h-5 w-5" />
        </NavLink>

        {/* Settings & Profile */}
        <NavLink
          to="/settings"
          title="Settings & Personal Workstation"
          className={({ isActive }) =>
            `flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              isActive
                ? 'bg-[#7065F0] text-white shadow-md shadow-[#7065F0]/30'
                : 'text-[#8E8B99] hover:text-white'
            }`
          }
        >
          <User className="h-5 w-5" />
        </NavLink>
      </div>
    </nav>
  );
};
