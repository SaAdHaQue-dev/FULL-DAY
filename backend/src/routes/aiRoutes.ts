import { Router, Request, Response } from 'express';

export const aiRouter = Router();

// Validate and research an idea using Gemini API
aiRouter.post('/validate-idea', async (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Both title and description are required',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        source: 'local_fallback',
        message: 'No GEMINI_API_KEY set on backend, please configure in .env or pass client-side.',
      });
    }

    const prompt = `You are a world-class venture capitalist, Silicon Valley product strategist, and senior software architect.
Analyze, score, research, and create an actionable execution roadmap for this product/startup/project idea:

Title: ${title}
Category: ${category || 'General Software / Product'}
Description: ${description}

Evaluate the idea objectively. Score it across Feasibility, Market Demand, Innovation, and Monetization.
Perform market research on competitors, target audience, tech stack, strengths, and risks.
Then generate a 3-phase execution roadmap with concrete action items.

You MUST respond strictly with a valid JSON object matching this schema (no markdown, no code fences):
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `Gemini API error: ${errText}`,
      });
    }

    const geminiData: any = await response.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        success: false,
        error: 'Empty response from Gemini API',
      });
    }

    const cleanedJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);

    return res.json({
      success: true,
      source: 'gemini_api',
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error validating idea:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});
