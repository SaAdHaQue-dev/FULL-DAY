import { TaskPriority } from '../types';

export interface IdeaScore {
  overall: number; // 0-100
  feasibility: number; // 0-100
  marketDemand: number; // 0-100
  innovation: number; // 0-100
  monetization: number; // 0-100
  verdict: 'Exceptional Potential' | 'Strong Potential' | 'Promising with Adjustments' | 'Needs Major Pivoting' | 'High Risk';
  summary: string;
}

export interface IdeaResearch {
  targetAudience: string;
  competitors: string[];
  uniqueValueProposition: string;
  recommendedTechStack: string[];
  strengths: string[];
  risksAndChallenges: string[];
}

export interface IdeaPlanTask {
  title: string;
  priority: TaskPriority;
  estimatedDays?: string;
}

export interface IdeaPlanPhase {
  phaseName: string;
  timeframe: string;
  focus: string;
  tasks: IdeaPlanTask[];
}

export interface IdeaAnalysisResult {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  category: string;
  score: IdeaScore;
  research: IdeaResearch;
  executionPlan: IdeaPlanPhase[];
  isGeminiPowered: boolean;
}

const LOCAL_STORAGE_KEY = 'taskora_gemini_api_key';
const SAVED_IDEAS_STORAGE_KEY = 'taskora_saved_ideas';

export const geminiService = {
  getApiKey(): string {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local && local.trim()) return local.trim();
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim()) return envKey.trim();
    return '';
  },

  setApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  },

  hasApiKey(): boolean {
    return Boolean(this.getApiKey());
  },

  getSavedIdeas(): IdeaAnalysisResult[] {
    try {
      const data = localStorage.getItem(SAVED_IDEAS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveIdeaToHistory(idea: IdeaAnalysisResult): void {
    try {
      const current = this.getSavedIdeas().filter((i) => i.id !== idea.id);
      const updated = [idea, ...current].slice(0, 20); // keep last 20
      localStorage.setItem(SAVED_IDEAS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save idea to history:', e);
    }
  },

  deleteIdeaFromHistory(id: string): void {
    try {
      const filtered = this.getSavedIdeas().filter((i) => i.id !== id);
      localStorage.setItem(SAVED_IDEAS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to delete idea from history:', e);
    }
  },

  async analyzeAndResearchIdea(input: {
    title: string;
    description: string;
    category?: string;
  }): Promise<IdeaAnalysisResult> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const result = await this.callGeminiAPI(apiKey, input);
        this.saveIdeaToHistory(result);
        return result;
      } catch (err) {
        console.warn('Gemini API call failed or timed out, using local intelligent engine:', err);
      }
    }

    // Local intelligent research & scoring fallback
    const result = this.generateLocalAnalysis(input);
    this.saveIdeaToHistory(result);
    return result;
  },

  async callGeminiAPI(
    apiKey: string,
    input: { title: string; description: string; category?: string }
  ): Promise<IdeaAnalysisResult> {
    const prompt = `You are a world-class venture capitalist, Silicon Valley product strategist, and senior software architect.
Analyze, score, research, and create an actionable execution roadmap for this product/startup/project idea:

Title: ${input.title}
Category: ${input.category || 'General Software / Product'}
Description: ${input.description}

Evaluate the idea objectively. Score it across Feasibility, Market Demand, Innovation, and Monetization.
Perform market research on competitors, target audience, tech stack, strengths, and risks.
Then generate a 3-phase execution roadmap with concrete action items that can directly be converted into daily tasks.

You MUST respond strictly with a valid JSON object matching this schema (no markdown formatting, no code fences):
{
  "score": {
    "overall": 85,
    "feasibility": 80,
    "marketDemand": 90,
    "innovation": 82,
    "monetization": 88,
    "verdict": "Strong Potential",
    "summary": "Concise 2-3 sentence executive evaluation summarizing why this is or isn't a good idea."
  },
  "research": {
    "targetAudience": "Specific description of early adopter persona and ideal customers",
    "competitors": ["Competitor A", "Competitor B", "Alternative C"],
    "uniqueValueProposition": "The core unfair advantage or differentiator",
    "recommendedTechStack": ["React/Vite", "Node.js Express", "MongoDB/PostgreSQL", "Google Gemini API"],
    "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
    "risksAndChallenges": ["Primary risk or hurdle 1", "Risk 2", "Risk 3"]
  },
  "executionPlan": [
    {
      "phaseName": "Phase 1: Validation & Rapid Prototype",
      "timeframe": "Days 1 - 14",
      "focus": "Validate core assumption and build lean clickable prototype",
      "tasks": [
        { "title": "Interview 15 target users in the niche", "priority": "urgent" },
        { "title": "Build minimal proof-of-concept MVP", "priority": "high" },
        { "title": "Set up waitlist landing page with signup tracking", "priority": "medium" }
      ]
    },
    {
      "phaseName": "Phase 2: Beta Launch & Feedback Loop",
      "timeframe": "Days 15 - 30",
      "focus": "Deliver working build to beta cohort and iterate based on metrics",
      "tasks": [
        { "title": "Onboard 50 active beta testers", "priority": "high" },
        { "title": "Integrate telemetry and user retention tracking", "priority": "medium" },
        { "title": "Refine top 3 feature friction points reported by users", "priority": "urgent" }
      ]
    },
    {
      "phaseName": "Phase 3: Public Launch & Scaling",
      "timeframe": "Days 31 - 60",
      "focus": "Public rollout, revenue activation, and organic distribution",
      "tasks": [
        { "title": "Launch on Product Hunt, Hacker News, and Twitter/X", "priority": "high" },
        { "title": "Implement monetization / Stripe payment checkout", "priority": "urgent" },
        { "title": "Establish weekly content and growth engine", "priority": "medium" }
      ]
    }
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2500,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini API returned an empty response.');
    }

    // Clean JSON markdown fences if present
    const cleanedJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);

    return {
      id: `idea_${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: input.title,
      description: input.description,
      category: input.category || 'General Product',
      score: {
        overall: Number(parsed.score?.overall) || 80,
        feasibility: Number(parsed.score?.feasibility) || 75,
        marketDemand: Number(parsed.score?.marketDemand) || 85,
        innovation: Number(parsed.score?.innovation) || 80,
        monetization: Number(parsed.score?.monetization) || 78,
        verdict: parsed.score?.verdict || 'Strong Potential',
        summary: parsed.score?.summary || 'Idea exhibits strong market fit with addressable execution milestones.',
      },
      research: {
        targetAudience: parsed.research?.targetAudience || 'Digital professionals and productivity power users',
        competitors: Array.isArray(parsed.research?.competitors) ? parsed.research.competitors : ['Market incumbents', 'Open source alternatives'],
        uniqueValueProposition: parsed.research?.uniqueValueProposition || 'High-focus streamlined execution with native AI integration',
        recommendedTechStack: Array.isArray(parsed.research?.recommendedTechStack) ? parsed.research.recommendedTechStack : ['React', 'TypeScript', 'Node.js', 'Gemini AI'],
        strengths: Array.isArray(parsed.research?.strengths) ? parsed.research.strengths : ['Clear pain point solved', 'Low initial capital needed'],
        risksAndChallenges: Array.isArray(parsed.research?.risksAndChallenges) ? parsed.research.risksAndChallenges : ['User habit inertia', 'Customer acquisition cost'],
      },
      executionPlan: Array.isArray(parsed.executionPlan)
        ? parsed.executionPlan.map((phase: any) => ({
            phaseName: phase.phaseName || 'Phase 1',
            timeframe: phase.timeframe || '2 Weeks',
            focus: phase.focus || 'Implementation',
            tasks: (phase.tasks || []).map((t: any) => ({
              title: t.title || 'Execute milestone task',
              priority: (t.priority as TaskPriority) || 'high',
            })),
          }))
        : [],
      isGeminiPowered: true,
    };
  },

  generateLocalAnalysis(input: {
    title: string;
    description: string;
    category?: string;
  }): IdeaAnalysisResult {
    const text = `${input.title} ${input.description}`.toLowerCase();
    const wordsCount = input.description.split(/\s+/).filter(Boolean).length;

    // Dynamic scoring heuristics based on idea specifics
    let feasibility = 82;
    let marketDemand = 85;
    let innovation = 78;
    let monetization = 80;

    if (text.includes('ai') || text.includes('gemini') || text.includes('llm') || text.includes('agent')) {
      innovation += 8;
      marketDemand += 6;
    }
    if (text.includes('free') || text.includes('offline') || text.includes('privacy')) {
      feasibility += 5;
      innovation += 4;
    }
    if (text.includes('b2b') || text.includes('enterprise') || text.includes('subscription') || text.includes('payment')) {
      monetization += 8;
    }
    if (wordsCount > 40) {
      feasibility += 4;
      marketDemand += 3;
    }

    feasibility = Math.min(96, Math.max(65, feasibility));
    marketDemand = Math.min(95, Math.max(60, marketDemand));
    innovation = Math.min(98, Math.max(62, innovation));
    monetization = Math.min(94, Math.max(58, monetization));

    const overall = Math.round(
      feasibility * 0.25 + marketDemand * 0.35 + innovation * 0.2 + monetization * 0.2
    );

    let verdict: IdeaScore['verdict'] = 'Strong Potential';
    if (overall >= 88) verdict = 'Exceptional Potential';
    else if (overall >= 78) verdict = 'Strong Potential';
    else if (overall >= 70) verdict = 'Promising with Adjustments';
    else verdict = 'Needs Major Pivoting';

    const category = input.category || 'Productivity & AI';

    return {
      id: `idea_${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: input.title,
      description: input.description,
      category,
      score: {
        overall,
        feasibility,
        marketDemand,
        innovation,
        monetization,
        verdict,
        summary: `Your idea for "${input.title}" targets a clear market need in ${category}. The core concept has strong execution viability with manageable technical hurdles. Rapid prototype validation is strongly recommended.`,
      },
      research: {
        targetAudience: `Primary early adopters include independent creators, tech enthusiasts, and power users looking for high-efficiency solutions in ${category}.`,
        competitors: [
          'Traditional legacy tools with bloated feature sets',
          'Niche indie web apps with fragmented workflows',
          'Manual spreadsheets and unstructured notes',
        ],
        uniqueValueProposition: `Delivers an ultra-responsive, zero-friction experience that couples automated AI synthesis with offline-first personal control.`,
        recommendedTechStack: [
          'Frontend: React 18 / Vite + Tailwind CSS',
          'Backend: Node.js Express + TypeScript',
          'Database: MongoDB Atlas / Local Storage Cache',
          'AI Intelligence: Google Gemini 1.5 Flash API',
        ],
        strengths: [
          'High demand for focused, distraction-free productivity solutions',
          'Immediate user gratification with minimal onboarding steps',
          'Cost-effective architecture with low infrastructure overhead',
        ],
        risksAndChallenges: [
          'Initial user acquisition and discovery in crowded marketplaces',
          'Ensuring consistent value retention beyond first-week novelty',
          'Balancing feature simplicity against advanced user demands',
        ],
      },
      executionPlan: [
        {
          phaseName: 'Phase 1: Validation & Lean MVP',
          timeframe: 'Days 1 – 14',
          focus: 'Build minimal clickable prototype and test with 10 real users',
          tasks: [
            {
              title: `Draft landing page pitch and core value proposition for ${input.title}`,
              priority: 'urgent',
            },
            {
              title: 'Build minimal working prototype focusing on the primary hook',
              priority: 'urgent',
            },
            {
              title: 'Conduct 5 user walkthrough interviews to collect honest friction points',
              priority: 'high',
            },
            {
              title: 'Refine UI/UX based on qualitative user feedback',
              priority: 'medium',
            },
          ],
        },
        {
          phaseName: 'Phase 2: Beta Launch & Iteration',
          timeframe: 'Days 15 – 30',
          focus: 'Expand to 50 active beta testers and harden core workflows',
          tasks: [
            {
              title: 'Deploy production build to Vercel with continuous deployment',
              priority: 'high',
            },
            {
              title: 'Connect analytics to measure user retention and feature usage',
              priority: 'high',
            },
            {
              title: 'Implement feedback capture button directly in the application',
              priority: 'medium',
            },
            {
              title: 'Perform performance audit and optimize response latency',
              priority: 'medium',
            },
          ],
        },
        {
          phaseName: 'Phase 3: Public Launch & Scaling',
          timeframe: 'Days 31 – 60',
          focus: 'Public distribution, community building, and monetization',
          tasks: [
            {
              title: 'Prepare launch kit: demo video, screenshots, and Product Hunt assets',
              priority: 'urgent',
            },
            {
              title: 'Launch on Product Hunt, Reddit communities, and Twitter/X',
              priority: 'high',
            },
            {
              title: 'Integrate payment checkout / subscription tier for power users',
              priority: 'high',
            },
            {
              title: 'Create weekly automated roadmap updates for user transparency',
              priority: 'medium',
            },
          ],
        },
      ],
      isGeminiPowered: false,
    };
  },
};
