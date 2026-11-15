import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, CheckSquare, BarChart2, User } from 'lucide-react';

export const BottomDock: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE8F5] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-3">
        {/* Today / Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#A09CB0] hover:text-[#6C5CE7]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
                Today
              </span>
            </>
          )}
        </NavLink>

        {/* Calendar */}
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#A09CB0] hover:text-[#6C5CE7]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Calendar className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
                Calendar
              </span>
            </>
          )}
        </NavLink>

        {/* All Tasks */}
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#A09CB0] hover:text-[#6C5CE7]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <CheckSquare className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
                Tasks
              </span>
            </>
          )}
        </NavLink>

        {/* Analytics */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#A09CB0] hover:text-[#6C5CE7]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <BarChart2 className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
                Analytics
              </span>
            </>
          )}
        </NavLink>

        {/* Profile / Settings */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#A09CB0] hover:text-[#6C5CE7]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
                Profile
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
