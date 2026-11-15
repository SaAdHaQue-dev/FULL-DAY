// Supabase Edge Function: AI Task Assistant (Gemini API server-side integration)
// Serves: natural language parsing, task breakdown, and daily plan generation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIRequest {
  action: "parse_task" | "breakdown_task" | "daily_plan";
  prompt?: string;
  taskTitle?: string;
  taskDescription?: string;
  existingTasks?: Array<{
    id: string;
    title: string;
    priority: string;
    due_at?: string;
    status: string;
  }>;
  availableHours?: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is not configured on the server.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: AIRequest = await req.json();
    const { action, prompt, taskTitle, existingTasks } = body;

    let systemInstruction = "";
    let userMessage = "";

    if (action === "parse_task") {
      systemInstruction = `You are Taskora's AI productivity assistant. Extract structured task properties from natural language.
Return ONLY valid JSON matching this schema:
{
  "title": string,
  "description": string | null,
  "priority": "low" | "medium" | "high" | "urgent",
  "due_date": "YYYY-MM-DD" | null,
  "due_time": "HH:MM" | null,
  "suggested_labels": string[],
  "clarification_needed": string | null
}`;
      userMessage = `Parse this user request: "${prompt || ""}"`;
    } else if (action === "breakdown_task") {
      systemInstruction = `You are Taskora's AI breakdown assistant. Break a parent task into actionable, concrete subtasks.
Return ONLY valid JSON matching this schema:
{
  "parent_title": string,
  "subtasks": [
    {
      "title": string,
      "priority": "low" | "medium" | "high" | "urgent",
      "estimated_minutes": number
    }
  ]
}`;
      userMessage = `Break down this task: Title: "${taskTitle}". Details: "${prompt || ""}"`;
    } else if (action === "daily_plan") {
      systemInstruction = `You are Taskora's Daily Planning assistant. Given a list of user tasks, organize them into a realistic chronological daily plan.
Return ONLY valid JSON matching this schema:
{
  "summary": string,
  "planned_schedule": [
    {
      "task_title": string,
      "time_block": string,
      "reason": string
    }
  ],
  "focus_recommendation": string
}`;
      userMessage = `Here are the candidate tasks: ${JSON.stringify(existingTasks || [])}. Create a plan for today.`;
    } else {
      return new Response(
        JSON.stringify({ error: `Unsupported action: ${action}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Gemini API (gemini-1.5-flash or gemini-2.0-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemInstruction + "\n\n" + userMessage }
            ]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      return new Response(
        JSON.stringify({ error: "Gemini API error", details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();
    const rawContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawContent);
    } catch {
      parsedResult = { raw: rawContent };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
