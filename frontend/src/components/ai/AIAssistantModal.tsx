import React, { useState } from 'react';
import { Sparkles, X, Check, Calendar, BrainCircuit, ListOrdered, Lightbulb } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { aiService, AIParsedTask } from '../../services/aiService';
import { DailyPlanResult } from '../../types';

export const AIAssistantModal: React.FC = () => {
  const { isAIModalOpen, setIsAIModalOpen, setIsIdeaModalOpen, tasks, createTask } = useTasks();
  const [activeTab, setActiveTab] = useState<'create' | 'plan'>('create');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<AIParsedTask | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlanResult | null>(null);

  if (!isAIModalOpen) return null;

  const handleParse = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.parseNaturalLanguageTask(prompt);
      setParsedResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const plan = await aiService.generateDailyPlan(tasks);
      setDailyPlan(plan);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveParsedTask = async () => {
    if (!parsedResult) return;
    try {
      await createTask({
        title: parsedResult.title,
        description: parsedResult.description,
        priority: parsedResult.priority,
        due_at: parsedResult.due_date,
      });
      setIsAIModalOpen(false);
    } catch (err) {
      console.error('Failed to create AI task:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-[28px] border border-[#EDE8F5] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDE8F5] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EFFF] text-[#6C5CE7]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-[#1E1B2E]">AI Task Assistant</h3>
              <p className="text-[10px] text-[#8B88A0]">Powered by intelligent task synthesis</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIModalOpen(false)}
            className="rounded-full p-1.5 text-[#8B88A0] hover:bg-[#F4F3F8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EDE8F5] px-6 bg-[#F8F9FE]">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-[#8B88A0] hover:text-[#1E1B2E]'
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Create from Natural Language</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'plan'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-[#8B88A0] hover:text-[#1E1B2E]'
            }`}
          >
            <ListOrdered className="h-4 w-4" />
            <span>Smart Daily Planner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAIModalOpen(false);
              setIsIdeaModalOpen(true);
            }}
            className="flex items-center gap-1.5 py-3 px-3 text-xs font-black border-b-2 border-transparent text-[#6C5CE7] hover:bg-[#F0EFFF]/60 rounded-t-lg transition-colors ml-auto"
            title="Open Gemini Idea Lab"
          >
            <Lightbulb className="h-4 w-4 text-[#FFAE33]" />
            <span>Idea Lab & Plan ✨</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'create' ? (
            <div className="space-y-4">
              <p className="text-xs text-[#8B88A0] leading-relaxed">
                Describe what you want to achieve. Lingua/Taskora will extract title, deadline, priority, and tags.
              </p>

              <div>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Finish vocabulary flashcards by tomorrow 4 PM with high priority..."
                  className="w-full rounded-2xl border border-[#EDE8F5] bg-[#F8F9FE] p-3 text-xs text-[#1E1B2E] placeholder-[#A09CB0] focus:border-[#6C5CE7] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={loading || !prompt.trim()}
                  className="flex items-center gap-2 rounded-full bg-[#6C5CE7] px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-[#5B4BC4] disabled:opacity-50 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{loading ? 'Analyzing with AI...' : 'Analyze Task'}</span>
                </button>
              </div>

              {parsedResult && (
                <div className="rounded-2xl border border-[#E4E0FA] bg-[#F0EFFF] p-4 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6C5CE7]">
                      Proposed Task (Review before saving)
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#6C5CE7] capitalize shadow-xs">
                      {parsedResult.priority} Priority
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#1E1B2E]">{parsedResult.title}</p>
                    {parsedResult.description && (
                      <p className="text-xs text-[#8B88A0] mt-1">{parsedResult.description}</p>
                    )}
                  </div>

                  {parsedResult.due_date && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6C5CE7]">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Due: {new Date(parsedResult.due_date).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveParsedTask}
                      className="flex items-center gap-1.5 rounded-full bg-[#6C5CE7] px-5 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#5B4BC4] transition-colors"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Accept & Save Task</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#EDE8F5] bg-[#F8F9FE] p-4">
                <h4 className="text-xs font-extrabold text-[#1E1B2E]">
                  Daily Workload Synthesis
                </h4>
                <p className="text-xs text-[#8B88A0] mt-1 leading-relaxed">
                  AI analyzes your pending tasks and deadlines to synthesize an achievable, focused timetable for your day.
                </p>
                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  disabled={loading}
                  className="mt-3 flex items-center gap-2 rounded-full bg-[#6C5CE7] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#5B4BC4] disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{loading ? 'Generating schedule...' : 'Generate Today\'s Optimal Schedule'}</span>
                </button>
              </div>

              {dailyPlan && (
                <div className="rounded-2xl border border-[#E4E0FA] bg-[#F0EFFF] p-4 space-y-3">
                  <p className="text-xs font-bold text-[#6C5CE7]">Daily Summary</p>
                  <p className="text-xs font-semibold text-[#1E1B2E]">{dailyPlan.summary}</p>
                  <div className="space-y-1.5 pt-2">
                    {dailyPlan.planned_schedule.map((slot, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs text-xs">
                        <span className="font-extrabold text-[#1E1B2E]">{slot.task_title}</span>
                        <span className="text-[10px] font-bold text-[#6C5CE7]">{slot.time_block}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
