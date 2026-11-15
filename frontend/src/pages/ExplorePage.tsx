import React, { useState } from 'react';
import { Search, ChevronRight, Compass, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const popularTopics = [
    { id: 'es', flag: '🇪🇸', title: 'Spanish', learners: '32.5K learners' },
    { id: 'fr', flag: '🇫🇷', title: 'French', learners: '28.1K learners' },
    { id: 'jp', flag: '🇯🇵', title: 'Japanese', learners: '22.4K learners' },
    { id: 'de', flag: '🇩🇪', title: 'German', learners: '18.7K learners' },
    { id: 'it', flag: '🇮🇹', title: 'Italian', learners: '15.2K learners' },
    { id: 'kr', flag: '🇰🇷', title: 'Korean', learners: '20.1K learners' },
  ];

  const categories = [
    { id: 'c1', label: 'Beginner', icon: '📖', bg: 'bg-[#FFF5E5]' },
    { id: 'c2', label: 'Travel', icon: '✈️', bg: 'bg-[#E8F8F0]' },
    { id: 'c3', label: 'Business', icon: '💼', bg: 'bg-[#EBF5FF]' },
    { id: 'c4', label: 'Personal', icon: '🎯', bg: 'bg-[#FFEBF3]' },
  ];

  const filteredTopics = popularTopics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1E1B2E] tracking-tight">
          Explore
        </h1>
        <p className="mt-0.5 text-xs font-medium text-[#8B88A0]">
          Discover new languages, skills, and topics
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09CB0]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search languages, topics, or lessons..."
          className="w-full rounded-2xl bg-[#F4F3F8] py-3 pl-11 pr-4 text-xs font-semibold text-[#1E1B2E] placeholder-[#A09CB0] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]/30 border border-transparent focus:border-[#6C5CE7]/40 transition-all"
        />
      </div>

      {/* Popular Languages Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-[#1E1B2E]">Popular Languages</h2>
          <span className="text-xs font-bold text-[#6C5CE7] cursor-pointer hover:underline">
            View All
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate('/practice')}
              className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group"
            >
              <span className="text-3xl">{topic.flag}</span>
              <div>
                <h3 className="text-xs font-extrabold text-[#1E1B2E] group-hover:text-[#6C5CE7] transition-colors">
                  {topic.title}
                </h3>
                <p className="text-[10px] font-semibold text-[#8B88A0] mt-0.5">
                  {topic.learners}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-extrabold text-[#1E1B2E]">Categories</h2>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('/practice')}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 border border-[#EDE8F5] shadow-2xs hover:border-[#6C5CE7]/30 transition-all cursor-pointer group text-center"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.bg} group-hover:scale-105 transition-transform`}>
                <span className="text-xl">{cat.icon}</span>
              </div>
              <span className="text-[11px] font-bold text-[#1E1B2E]">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="rounded-[24px] bg-gradient-to-r from-[#F0EFFF] to-[#FFEBF3] p-5 border border-[#E4E0FA] flex items-center justify-between">
        <div className="space-y-1 max-w-[70%]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6C5CE7]">
            Daily Challenge
          </span>
          <h3 className="text-xs font-black text-[#1E1B2E]">
            Speak 5 phrases with AI pronunciation coach
          </h3>
          <p className="text-[10px] text-[#8B88A0] font-medium">
            Earn +50 XP and double your daily streak
          </p>
        </div>
        <button
          onClick={() => navigate('/practice')}
          className="rounded-full bg-[#6C5CE7] px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#5B4BC4] active:scale-95 transition-all"
        >
          Start
        </button>
      </div>
    </div>
  );
};
