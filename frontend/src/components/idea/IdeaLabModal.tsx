import React, { useState, useEffect, useRef } from 'react';
import {
  Lightbulb,
  Sparkles,
  X,
  Mic,
  MicOff,
  Check,
  TrendingUp,
  ShieldAlert,
  Layers,
  Calendar,
  Share2,
  Copy,
  PlusCircle,
  Key,
  ExternalLink,
  ChevronRight,
  History,
  RotateCcw,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  geminiService,
  IdeaAnalysisResult,
  IdeaPlanPhase,
} from '../../services/geminiService';

export const IdeaLabModal: React.FC = () => {
  const { isIdeaModalOpen, setIsIdeaModalOpen, createTask } = useTasks();

  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [resultTab, setResultTab] = useState<'plan' | 'research' | 'swot'>('plan');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SaaS & AI');

  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keySavedToast, setKeySavedToast] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<IdeaAnalysisResult | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<IdeaAnalysisResult[]>([]);

  const [isListening, setIsListening] = useState(false);
  const [tasksAddedSuccess, setTasksAddedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const recognitionRef = useRef<any>(null);

  const categories = [
    'SaaS & AI',
    'Mobile App',
    'Productivity',
    'Creator Tool',
    'E-Commerce',
    'Education',
    'Health & Fitness',
    'Other',
  ];

  const sampleIdeas = [
    {
      title: 'AI Micro-Journal for Busy Founders',
      desc: 'A 2-minute daily voice-first reflection tool that summarizes weekly mood trends and generates high-leverage focus goals using Gemini.',
      cat: 'Productivity',
    },
    {
      title: 'Local First Offline CRM for Freelancers',
      desc: 'Ultra-fast private CRM that stores client chats, payment milestones, and invoices offline with zero recurring subscription fees.',
      cat: 'SaaS & AI',
    },
    {
      title: 'Bite-sized Language Learning for Commuters',
      desc: 'Interactive 3-minute audio flashcards and speech pronunciation tutor designed specifically for people driving or walking to work.',
      cat: 'Education',
    },
  ];

  useEffect(() => {
    if (isIdeaModalOpen) {
      setApiKey(geminiService.getApiKey());
      setSavedIdeas(geminiService.getSavedIdeas());
    }
  }, [isIdeaModalOpen]);

  // Speech Recognition for speaking idea
  const toggleVoiceRecording = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcriptText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcriptText += event.results[i][0].transcript;
        }
        if (transcriptText.trim()) {
          setDescription((prev) => (prev ? `${prev} ${transcriptText.trim()}` : transcriptText.trim()));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const handleSaveApiKey = () => {
    geminiService.setApiKey(apiKey);
    setShowKeyInput(false);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 3000);
  };

  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setAnalyzing(true);
    setTasksAddedSuccess(false);

    try {
      const result = await geminiService.analyzeAndResearchIdea({
        title: title.trim(),
        description: description.trim(),
        category,
      });

      setCurrentResult(result);
      setSavedIdeas(geminiService.getSavedIdeas());
      setResultTab('plan');
    } catch (err) {
      console.error('Failed to analyze idea:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConvertPlanToTasks = async () => {
    if (!currentResult) return;
    setTasksAddedSuccess(false);

    try {
      // Loop through all tasks in each phase and insert them into Taskora
      for (const phase of currentResult.executionPlan) {
        for (const item of phase.tasks) {
          await createTask({
            title: `[${currentResult.title}] ${item.title}`,
            description: `From AI Idea Plan (${phase.phaseName} - ${phase.timeframe}): ${phase.focus}`,
            priority: item.priority,
          });
        }
      }
      setTasksAddedSuccess(true);
    } catch (err) {
      console.error('Failed to convert plan to tasks:', err);
    }
  };

  const handleCopyMarkdown = () => {
    if (!currentResult) return;

    let md = `# ${currentResult.title} - AI Idea Validation & Research Plan\n\n`;
    md += `**Category:** ${currentResult.category}\n`;
    md += `**Overall Score:** ${currentResult.score.overall}/100 (${currentResult.score.verdict})\n\n`;
    md += `## Executive Summary\n${currentResult.score.summary}\n\n`;
    md += `### Scorecard\n`;
    md += `- Technical Feasibility: ${currentResult.score.feasibility}/100\n`;
    md += `- Market Demand: ${currentResult.score.marketDemand}/100\n`;
    md += `- Innovation & Differentiation: ${currentResult.score.innovation}/100\n`;
    md += `- Monetization Potential: ${currentResult.score.monetization}/100\n\n`;
    md += `## Market Research\n`;
    md += `**Target Audience:** ${currentResult.research.targetAudience}\n\n`;
    md += `**Unique Value Proposition:** ${currentResult.research.uniqueValueProposition}\n\n`;
    md += `**Competitors & Alternatives:**\n`;
    currentResult.research.competitors.forEach((c) => (md += `- ${c}\n`));
    md += `\n**Recommended Tech Stack:**\n`;
    currentResult.research.recommendedTechStack.forEach((t) => (md += `- ${t}\n`));
    md += `\n## Phased Execution Roadmap\n`;
    currentResult.executionPlan.forEach((p) => {
      md += `\n### ${p.phaseName} (${p.timeframe})\n*${p.focus}*\n`;
      p.tasks.forEach((t) => (md += `- [ ] [${t.priority.toUpperCase()}] ${t.title}\n`));
    });

    navigator.clipboard.writeText(md);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  if (!isIdeaModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-[32px] border border-[#EDE8F5] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDE8F5] px-5 py-4 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#8070F8] text-white shadow-md shadow-[#6C5CE7]/25">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#1E1B2E]">AI Idea Lab</h3>
                <span className="rounded-full bg-[#F0EFFF] px-2 py-0.5 text-[10px] font-extrabold text-[#6C5CE7]">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-[#8B88A0] font-semibold">
                Score, Research & Plan Execution Roadmaps
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsIdeaModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F3F8] text-[#8B88A0] hover:text-[#1E1B2E] hover:bg-[#EDE8F5] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Gemini API Key Bar / Status Pill */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#F8F9FE] border-b border-[#EDE8F5] text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                geminiService.hasApiKey() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-bold text-[#1E1B2E]">
              {geminiService.hasApiKey() ? (
                <span className="text-emerald-700">Google Gemini 1.5 Flash Connected</span>
              ) : (
                <span className="text-[#8B88A0]">Smart Local AI Mode</span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[11px] font-extrabold text-[#6C5CE7] hover:underline flex items-center gap-1"
          >
            <Key className="h-3 w-3" />
            <span>{showKeyInput ? 'Close Key Settings' : 'Gemini API Key'}</span>
          </button>
        </div>

        {/* Collapsible Gemini API Key Input */}
        {showKeyInput && (
          <div className="p-4 bg-[#F0EFFF] border-b border-[#E4E0FA] space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#1E1B2E]">Your Google Gemini API Key:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
              >
                <span>Get Free Key at Google AI Studio</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste AIzaSy... key here (Stored securely in your browser)"
                className="flex-1 rounded-xl bg-white border border-[#EDE8F5] px-3 py-2 text-xs font-semibold text-[#1E1B2E] focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]/30"
              />
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="rounded-xl bg-[#6C5CE7] px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-[#5B4BC4]"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-[#8B88A0]">
              Free Google Gemini API keys never expire and enable real-time market research & scoring.
            </p>
          </div>
        )}

        {keySavedToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 text-center text-xs font-bold text-emerald-700 animate-in fade-in">
            ✓ Gemini API Key saved locally!
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Active Result View */}
          {currentResult ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Top Scorecard Banner */}
              <div className="rounded-[28px] bg-gradient-to-tr from-[#6C5CE7] to-[#8070F8] p-5 text-white shadow-xl shadow-[#6C5CE7]/20 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 pr-4">
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      {currentResult.category}
                    </span>
                    <h2 className="text-xl font-black tracking-tight leading-snug">
                      {currentResult.title}
                    </h2>
                    <p className="text-xs text-white/85 line-clamp-2">
                      {currentResult.score.summary}
                    </p>
                  </div>

                  {/* Overall Score Circle */}
                  <div className="flex flex-col items-center justify-center shrink-0 rounded-2xl bg-white/15 backdrop-blur-md px-4 py-2.5 border border-white/25">
                    <span className="text-3xl font-black">{currentResult.score.overall}</span>
                    <span className="text-[9px] uppercase tracking-widest text-white/80 font-black">
                      Score / 100
                    </span>
                    <span className="mt-1 text-[10px] font-black text-amber-200 text-center leading-none">
                      {currentResult.score.verdict}
                    </span>
                  </div>
                </div>

                {/* 4 Dimension Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/20 text-xs">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-white/80">
                      <span>Feasibility</span>
                      <span>{currentResult.score.feasibility}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full mt-1 overflow-hidden">
                      <div
                        style={{ width: `${currentResult.score.feasibility}%` }}
                        className="h-full bg-emerald-300 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-white/80">
                      <span>Market Demand</span>
                      <span>{currentResult.score.marketDemand}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full mt-1 overflow-hidden">
                      <div
                        style={{ width: `${currentResult.score.marketDemand}%` }}
                        className="h-full bg-amber-300 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-white/80">
                      <span>Innovation</span>
                      <span>{currentResult.score.innovation}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full mt-1 overflow-hidden">
                      <div
                        style={{ width: `${currentResult.score.innovation}%` }}
                        className="h-full bg-purple-200 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-white/80">
                      <span>Monetization</span>
                      <span>{currentResult.score.monetization}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full mt-1 overflow-hidden">
                      <div
                        style={{ width: `${currentResult.score.monetization}%` }}
                        className="h-full bg-rose-300 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex border-b border-[#EDE8F5] bg-[#F8F9FE] rounded-2xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setResultTab('plan')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                    resultTab === 'plan'
                      ? 'bg-white text-[#6C5CE7] shadow-xs'
                      : 'text-[#8B88A0] hover:text-[#1E1B2E]'
                  }`}
                >
                  🚀 Execution Roadmap ({currentResult.executionPlan.length} Phases)
                </button>
                <button
                  type="button"
                  onClick={() => setResultTab('research')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                    resultTab === 'research'
                      ? 'bg-white text-[#6C5CE7] shadow-xs'
                      : 'text-[#8B88A0] hover:text-[#1E1B2E]'
                  }`}
                >
                  🔍 Market Research
                </button>
                <button
                  type="button"
                  onClick={() => setResultTab('swot')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                    resultTab === 'swot'
                      ? 'bg-white text-[#6C5CE7] shadow-xs'
                      : 'text-[#8B88A0] hover:text-[#1E1B2E]'
                  }`}
                >
                  ⚖️ Pros & Risks
                </button>
              </div>

              {/* Sub-tab 1: Execution Roadmap */}
              {resultTab === 'plan' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1E1B2E]">
                      Phased Action Plan
                    </span>
                    <button
                      type="button"
                      onClick={handleConvertPlanToTasks}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#6C5CE7] px-3.5 py-1.5 text-xs font-black text-white shadow-xs hover:bg-[#5B4BC4] active:scale-95 transition-all"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Convert All to My Tasks</span>
                    </button>
                  </div>

                  {tasksAddedSuccess && (
                    <div className="rounded-2xl bg-[#E8F8F0] border border-[#D1F2DE] p-3 text-xs font-black text-[#16A34A] flex items-center gap-2">
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>All execution tasks created in Taskora! View in your Tasks tab.</span>
                    </div>
                  )}

                  {currentResult.executionPlan.map((phase, pIdx) => (
                    <div
                      key={pIdx}
                      className="rounded-2xl border border-[#EDE8F5] bg-white p-4 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F0EFFF] text-[11px] font-black text-[#6C5CE7]">
                            {pIdx + 1}
                          </span>
                          <h4 className="text-xs font-black text-[#1E1B2E]">
                            {phase.phaseName}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-[#8B88A0] bg-[#F8F9FE] px-2 py-0.5 rounded-md">
                          {phase.timeframe}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-[#6C5CE7] bg-[#F0EFFF]/60 p-2 rounded-xl">
                        🎯 Focus: {phase.focus}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        {phase.tasks.map((task, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-center justify-between p-2 rounded-xl bg-[#F8F9FE] text-xs"
                          >
                            <span className="font-bold text-[#1E1B2E] text-[11px]">
                              {task.title}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                                task.priority === 'urgent'
                                  ? 'bg-rose-100 text-rose-600'
                                  : task.priority === 'high'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Market Research */}
              {resultTab === 'research' && (
                <div className="space-y-3 animate-in fade-in text-xs">
                  {/* Target Audience */}
                  <div className="rounded-2xl border border-[#EDE8F5] bg-white p-4 shadow-2xs space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6C5CE7]">
                      🎯 Target Audience Persona
                    </span>
                    <p className="font-bold text-[#1E1B2E] text-xs">
                      {currentResult.research.targetAudience}
                    </p>
                  </div>

                  {/* UVP */}
                  <div className="rounded-2xl border border-[#EDE8F5] bg-white p-4 shadow-2xs space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#20C997]">
                      ⚡ Unique Value Proposition (UVP)
                    </span>
                    <p className="font-bold text-[#1E1B2E] text-xs">
                      {currentResult.research.uniqueValueProposition}
                    </p>
                  </div>

                  {/* Competitors & Alternatives */}
                  <div className="rounded-2xl border border-[#EDE8F5] bg-white p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF922B]">
                      🥊 Competitor & Alternative Landscape
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {currentResult.research.competitors.map((comp, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl bg-[#F8F9FE] p-2.5 font-bold text-[#1E1B2E] border border-[#EDE8F5]"
                        >
                          {comp}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Tech Stack */}
                  <div className="rounded-2xl border border-[#EDE8F5] bg-white p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#339AF0]">
                      💻 Recommended Tech Architecture
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentResult.research.recommendedTechStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-[#EBF5FF] text-[#339AF0] px-2.5 py-1 text-[11px] font-extrabold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: SWOT / Pros & Risks */}
              {resultTab === 'swot' && (
                <div className="space-y-3 animate-in fade-in text-xs">
                  {/* Strengths */}
                  <div className="rounded-2xl border border-[#D1F2DE] bg-[#E8F8F0]/50 p-4 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#16A34A] flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> Core Strengths & Advantages
                    </span>
                    <ul className="space-y-1.5">
                      {currentResult.research.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-bold text-[#1E1B2E]">
                          <Check className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="rounded-2xl border border-[#FFE3E3] bg-[#FFF5F5] p-4 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#E03131] flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5" /> Critical Risks & Hurdles to Mitigate
                    </span>
                    <ul className="space-y-1.5">
                      {currentResult.research.risksAndChallenges.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-bold text-[#1E1B2E]">
                          <span className="text-[#E03131] font-black">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#EDE8F5]">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-[#F0EFFF] py-3 text-xs font-black text-[#6C5CE7] hover:bg-[#E4E0FA] transition-all"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedSuccess ? 'Copied to Clipboard!' : 'Copy Plan (Markdown)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentResult(null);
                    setTitle('');
                    setDescription('');
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#F4F3F8] px-4 py-3 text-xs font-black text-[#8B88A0] hover:text-[#1E1B2E] hover:bg-[#EDE8F5] transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>New Idea</span>
                </button>
              </div>
            </div>
          ) : (
            /* Input View */
            <div className="space-y-4">
              {/* Tab Selector between New Idea and Saved History */}
              <div className="flex border-b border-[#EDE8F5]">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className={`pb-2.5 text-xs font-black border-b-2 mr-4 transition-colors ${
                    activeTab === 'create'
                      ? 'border-[#6C5CE7] text-[#6C5CE7]'
                      : 'border-transparent text-[#8B88A0] hover:text-[#1E1B2E]'
                  }`}
                >
                  💡 Enter Idea to Score
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`pb-2.5 text-xs font-black border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'history'
                      ? 'border-[#6C5CE7] text-[#6C5CE7]'
                      : 'border-transparent text-[#8B88A0] hover:text-[#1E1B2E]'
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Saved Ideas ({savedIdeas.length})</span>
                </button>
              </div>

              {activeTab === 'create' ? (
                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#8B88A0] mb-1.5">
                      Idea Title / Concept Name
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. AI-Powered Meal Planning App for Athletes"
                      className="w-full rounded-2xl bg-[#F8F9FE] border border-[#EDE8F5] px-4 py-3 text-xs font-extrabold text-[#1E1B2E] placeholder-[#A09CB0] focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Category Pills */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#8B88A0] mb-1.5">
                      Category / Domain
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`rounded-xl px-3 py-1.5 text-[11px] font-black transition-all ${
                            category === cat
                              ? 'bg-[#6C5CE7] text-white shadow-xs'
                              : 'bg-[#F4F3F8] text-[#8B88A0] hover:bg-[#EDE8F5] hover:text-[#1E1B2E]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Idea Pitch / Description + Voice Microphone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#8B88A0]">
                        Describe Your Idea (What problem does it solve?)
                      </label>
                      <button
                        type="button"
                        onClick={toggleVoiceRecording}
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black transition-all ${
                          isListening
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-[#E8F8F0] text-[#20C997] hover:bg-[#D3F5E7]'
                        }`}
                        title="Speak your idea with voice"
                      >
                        {isListening ? (
                          <>
                            <Mic className="h-3 w-3" />
                            <span>Listening...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="h-3 w-3" />
                            <span>Speak Idea</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Explain the core feature, target user, how it works, and how you envision making money or gaining traction..."
                        className="w-full rounded-2xl bg-[#F8F9FE] border border-[#EDE8F5] p-4 text-xs font-semibold text-[#1E1B2E] placeholder-[#A09CB0] focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] focus:bg-white transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Sample Ideas Starter Pills */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#8B88A0]">
                      Or pick an example idea to test:
                    </span>
                    <div className="space-y-1.5">
                      {sampleIdeas.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setTitle(s.title);
                            setDescription(s.desc);
                            setCategory(s.cat);
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-[#F8F9FE] hover:bg-[#F0EFFF] hover:border-[#6C5CE7]/30 border border-[#EDE8F5] transition-all group"
                        >
                          <div className="flex items-center justify-between text-xs font-black text-[#1E1B2E] group-hover:text-[#6C5CE7]">
                            <span>{s.title}</span>
                            <span className="text-[10px] text-[#8B88A0] font-semibold">{s.cat}</span>
                          </div>
                          <p className="text-[10px] text-[#8B88A0] mt-0.5 line-clamp-1">
                            {s.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={analyzing || !title.trim() || !description.trim()}
                      onClick={handleAnalyze}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#8070F8] py-3.5 text-xs font-black text-white shadow-lg shadow-[#6C5CE7]/30 hover:opacity-95 active:scale-98 disabled:opacity-40 transition-all"
                    >
                      {analyzing ? (
                        <>
                          <Sparkles className="h-4 w-4 animate-spin" />
                          <span>Gemini AI is Scoring & Researching...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Score Idea, Research & Generate Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Saved Ideas History Tab */
                <div className="space-y-2.5">
                  {savedIdeas.length === 0 ? (
                    <div className="text-center py-10 text-[#8B88A0] text-xs">
                      <p className="font-bold">No saved ideas yet.</p>
                      <p className="text-[11px] mt-1">
                        Score your first idea to see its history and roadmap here!
                      </p>
                    </div>
                  ) : (
                    savedIdeas.map((idea) => (
                      <div
                        key={idea.id}
                        className="rounded-2xl border border-[#EDE8F5] bg-white p-3.5 shadow-2xs hover:border-[#6C5CE7]/30 transition-all flex items-center justify-between group"
                      >
                        <div
                          className="flex-1 cursor-pointer pr-3"
                          onClick={() => {
                            setCurrentResult(idea);
                            setResultTab('plan');
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#1E1B2E] group-hover:text-[#6C5CE7]">
                              {idea.title}
                            </span>
                            <span className="rounded-full bg-[#F0EFFF] px-2 py-0.5 text-[9px] font-black text-[#6C5CE7]">
                              {idea.score.overall}/100
                            </span>
                          </div>
                          <p className="text-[10px] text-[#8B88A0] line-clamp-1 mt-0.5">
                            {idea.score.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentResult(idea);
                              setResultTab('plan');
                            }}
                            className="flex h-8 px-2.5 items-center justify-center rounded-xl bg-[#F0EFFF] text-[11px] font-extrabold text-[#6C5CE7] hover:bg-[#E4E0FA]"
                          >
                            View Plan
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              geminiService.deleteIdeaFromHistory(idea.id);
                              setSavedIdeas(geminiService.getSavedIdeas());
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#8B88A0] hover:text-rose-500 hover:bg-rose-50"
                            title="Delete"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
