import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { DailyPlanResult, Task, TaskPriority } from '../types';
import { format, addDays } from 'date-fns';

export interface AIParsedTask {
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_date: string | null;
  suggested_labels: string[];
}

export const aiService = {
  async parseNaturalLanguageTask(prompt: string): Promise<AIParsedTask> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
          body: { action: 'parse_task', prompt },
        });
        if (!error && data?.data) {
          return data.data as AIParsedTask;
        }
      } catch (err) {
        console.warn('Edge function invoke failed, using smart local parser:', err);
      }
    }

    // Smart heuristic fallback parser
    const lower = prompt.toLowerCase();
    let priority: TaskPriority = 'medium';
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('critical')) {
      priority = 'urgent';
    } else if (lower.includes('important') || lower.includes('high priority')) {
      priority = 'high';
    } else if (lower.includes('low priority') || lower.includes('someday') || lower.includes('whenever')) {
      priority = 'low';
    }

    let dueDate: string | null = null;
    const now = new Date();
    if (lower.includes('today')) {
      dueDate = format(now, "yyyy-MM-dd'T'18:00:00'Z'");
    } else if (lower.includes('tomorrow')) {
      dueDate = format(addDays(now, 1), "yyyy-MM-dd'T'18:00:00'Z'");
    } else if (lower.includes('by friday') || lower.includes('friday')) {
      dueDate = format(addDays(now, 3), "yyyy-MM-dd'T'17:00:00'Z'");
    } else if (lower.includes('next week')) {
      dueDate = format(addDays(now, 7), "yyyy-MM-dd'T'10:00:00'Z'");
    }

    // Clean prompt title
    let title = prompt
      .replace(/^(create|add|schedule|set up|please create)\s+/i, '')
      .replace(/\s+(by|due|for)\s+(today|tomorrow|friday|next week)/i, '')
      .replace(/\s+with\s+(urgent|high|low)\s+priority/i, '');

    title = title.charAt(0).toUpperCase() + title.slice(1);

    return {
      title: title.trim() || prompt,
      description: `Created via Taskora AI Assistant from prompt: "${prompt}"`,
      priority,
      due_date: dueDate,
      suggested_labels: ['AI-Assisted'],
    };
  },

  async generateDailyPlan(tasks: Task[]): Promise<DailyPlanResult> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
          body: {
            action: 'daily_plan',
            existingTasks: tasks.map((t) => ({
              id: t.id,
              title: t.title,
              priority: t.priority,
              due_at: t.due_at || undefined,
              status: t.status,
            })),
          },
        });
        if (!error && data?.data) {
          return data.data as DailyPlanResult;
        }
      } catch (err) {
        console.warn('Edge function daily_plan failed, generating local plan:', err);
      }
    }

    // Heuristic daily plan based on pending tasks
    const pendingTasks = tasks.filter((t) => t.status !== 'completed');
    const schedule = pendingTasks.slice(0, 4).map((task, idx) => {
      const times = ['09:00 AM - 10:30 AM', '11:00 AM - 12:30 PM', '02:00 PM - 03:30 PM', '04:00 PM - 05:00 PM'];
      return {
        task_title: task.title,
        time_block: times[idx] || '05:00 PM - 06:00 PM',
        reason: task.priority === 'urgent' ? 'High priority urgent deadline' : 'Focused deep work block',
      };
    });

    return {
      summary: `Analyzed ${pendingTasks.length} pending tasks. Prioritized ${schedule.length} core items for maximum focus.`,
      planned_schedule: schedule,
      focus_recommendation: 'Tackle the top urgent item early in the morning before scheduled meetings.',
    };
  },
};
