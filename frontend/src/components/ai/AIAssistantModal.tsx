import React, { useState } from 'react';
import { Sparkles, X, Check, Calendar, ArrowRight, BrainCircuit, ListOrdered } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { aiService, AIParsedTask } from '../../services/aiService';
import { DailyPlanResult } from '../../types';

export const AIAssistantModal: React.FC = () => {
  const { isAIModalOpen, setIsAIModalOpen, tasks, createTask } = useTasks();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Task Assistant</h3>
              <p className="text-[11px] text-slate-400">Powered by server-side Gemini intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Create from Natural Language</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'plan'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <ListOrdered className="h-4 w-4" />
            <span>Smart Daily Planner</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'create' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Describe what you want to achieve. Taskora will extract the title, deadline, priority, and tags for your confirmation.
              </p>

              <div>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Prepare client onboarding deck by tomorrow 3 PM with urgent priority and gather requirements..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={loading || !prompt.trim()}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{loading ? 'Analyzing with Gemini...' : 'Analyze Task'}</span>
                </button>
              </div>

              {parsedResult && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3 dark:border-indigo-900/50 dark:bg-indigo-950/30 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      Proposed Task (Review before saving)
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 capitalize">
                      {parsedResult.priority} Priority
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{parsedResult.title}</p>
                    {parsedResult.description && (
                      <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">{parsedResult.description}</p>
                    )}
                  </div>

                  {parsedResult.due_date && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Due: {new Date(parsedResult.due_date).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveParsedTask}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Accept & Save Task</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Daily Workload Analysis
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Gemini analyzes your pending deadlines and priorities to synthesize an achievable, focused timetable for your workday.
                </p>
                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  disabled={loading}
                  className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{loading ? 'Synthesizing Plan...' : 'Generate Today\'s Plan'}</span>
                </button>
              </div>

              {dailyPlan && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 text-xs dark:border-indigo-900/50 dark:bg-indigo-950/30">
                    <p className="font-semibold text-indigo-700 dark:text-indigo-300">{dailyPlan.summary}</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{dailyPlan.focus_recommendation}</p>
                  </div>

                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                    {dailyPlan.planned_schedule.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.task_title}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">{item.time_block}</span>
                            <span>•</span>
                            <span>{item.reason}</span>
                          </div>
                        </div>
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
