import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Zap, BarChart2, User } from 'lucide-react';

export const BottomDock: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE8F5] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-3">
        {/* Home */}
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
                Home
              </span>
            </>
          )}
        </NavLink>

        {/* Explore */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#A09CB0] hover:text-[#6C5CE7]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Compass className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
                Explore
              </span>
            </>
          )}
        </NavLink>

        {/* Practice / Focus */}
        <NavLink
          to="/practice"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6C5CE7]' : 'text-[#A09CB0] hover:text-[#6C5CE7]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Zap className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-black' : 'font-semibold'}`}>
                Practice
              </span>
            </>
          )}
        </NavLink>

        {/* Progress / Stats */}
        <NavLink
          to="/progress"
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
                Progress
              </span>
            </>
          )}
        </NavLink>

        {/* Profile */}
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
