import { Task, TaskPriority, TaskStatus } from '../types';
import { mockTasks } from './mockData';

const STORAGE_KEY = 'taskora_personal_tasks';

// Backend API Base URL from environment variable or local dev
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') || '';

function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
      return mockTasks;
    }
    return JSON.parse(raw);
  } catch {
    return mockTasks;
  }
}

function saveStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save personal tasks locally:', err);
  }
}

export const taskService = {
  // Check live connection to Render Backend
  async checkBackendHealth(): Promise<{
    connected: boolean;
    database: string;
    source: string;
  }> {
    if (!API_BASE) {
      return {
        connected: false,
        database: 'local-storage',
        source: 'No VITE_API_URL configured (running in local mode)',
      };
    }

    try {
      const res = await fetch(`${API_BASE}/health`, {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          connected: true,
          database: data.database || 'connected',
          source: data.service || 'render-backend',
        };
      }
      return {
        connected: false,
        database: 'offline',
        source: `Backend returned HTTP ${res.status}`,
      };
    } catch (err: any) {
      return {
        connected: false,
        database: 'offline',
        source: err.message || 'Network unreachable',
      };
    }
  },

  // Get all tasks (Tries Render Backend, falls back to localStorage)
  async getTasks(): Promise<Task[]> {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/tasks`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            // Save fresh copy to localStorage as cache
            saveStoredTasks(json.data);
            return json.data;
          }
        }
      } catch (err) {
        console.warn('⚠️ [taskService] Could not reach Render backend, serving cached tasks:', err);
      }
    }

    // Default to local storage
    return getStoredTasks();
  },

  // Create task (Sends to Render Backend & persists locally)
  async createTask(input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    due_at?: string | null;
    planned_for?: string | null;
    project_id?: string | null;
    color?: 'purple' | 'pink' | 'yellow' | 'sky' | 'white';
    time_slot?: string;
  }): Promise<Task> {
    const palette: Array<'purple' | 'pink' | 'yellow' | 'sky'> = ['purple', 'pink', 'yellow', 'sky'];
    const chosenColor = input.color || palette[Math.floor(Math.random() * palette.length)];

    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      owner_id: 'personal-user',
      workspace_id: null,
      project_id: input.project_id || null,
      assignee_id: 'personal-user',
      title: input.title,
      description: input.description || null,
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      due_at: input.due_at || null,
      planned_for: input.planned_for || null,
      completed_at: null,
      recurrence_rule: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      color: chosenColor,
      time_slot: input.time_slot || '11:00 - 12:00',
    };

    // Save locally first for instant optimistic UI
    const current = getStoredTasks();
    saveStoredTasks([newTask, ...current]);

    // Send to Render Backend if configured
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            // Update local task with server assigned ID
            const serverTask: Task = json.data;
            const updated = getStoredTasks().map((t) => (t.id === tempId ? serverTask : t));
            saveStoredTasks(updated);
            return serverTask;
          }
        }
      } catch (err) {
        console.warn('⚠️ [taskService] Failed to post task to backend, saved locally:', err);
      }
    }

    return newTask;
  },

  // Update task (Sends to Render Backend & persists locally)
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const current = getStoredTasks();
    const index = current.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask: Task = {
      ...current[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    current[index] = updatedTask;
    saveStoredTasks(current);

    // Sync to Render Backend
    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.warn('⚠️ [taskService] Failed to sync task update to backend:', err);
      }
    }

    return updatedTask;
  },

  async toggleTaskStatus(id: string, currentStatus: TaskStatus): Promise<Task> {
    const isCompleted = currentStatus === 'completed';
    const newStatus: TaskStatus = isCompleted ? 'todo' : 'completed';
    const completedAt = isCompleted ? null : new Date().toISOString();

    return this.updateTask(id, {
      status: newStatus,
      completed_at: completedAt,
    });
  },

  // Delete task (Deletes from Render Backend & persists locally)
  async deleteTask(id: string): Promise<void> {
    const current = getStoredTasks();
    const updated = current.filter((t) => t.id !== id);
    saveStoredTasks(updated);

    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/tasks/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('⚠️ [taskService] Failed to delete task from backend:', err);
      }
    }
  },

  exportBackup(): string {
    const tasks = getStoredTasks();
    return JSON.stringify(
      {
        version: '2.0',
        exported_at: new Date().toISOString(),
        tasks,
      },
      null,
      2
    );
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.tasks)) {
        saveStoredTasks(parsed.tasks);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
