import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Task, TaskPriority, TaskStatus } from '../types';
import { mockTasks } from './mockData';

const STORAGE_KEY = 'taskora_tasks';

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
    console.error('Failed to save tasks to local storage:', err);
  }
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    if (!isSupabaseConfigured) {
      return getStoredTasks();
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          labels:task_labels(label:labels(*))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Task[];
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local tasks:', err);
      return getStoredTasks();
    }
  },

  async createTask(input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    due_at?: string | null;
    planned_for?: string | null;
    project_id?: string | null;
  }): Promise<Task> {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      owner_id: 'usr-1001',
      workspace_id: null,
      project_id: input.project_id || null,
      assignee_id: 'usr-1001',
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
    };

    if (!isSupabaseConfigured) {
      const current = getStoredTasks();
      const updated = [newTask, ...current];
      saveStoredTasks(updated);
      return newTask;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: newTask.status,
          due_at: newTask.due_at,
          planned_for: newTask.planned_for,
          project_id: newTask.project_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    } catch (err) {
      console.warn('Supabase create failed, saving locally:', err);
      const current = getStoredTasks();
      saveStoredTasks([newTask, ...current]);
      return newTask;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (!isSupabaseConfigured) {
      const current = getStoredTasks();
      const index = current.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Task not found');
      
      const updatedTask = {
        ...current[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      current[index] = updatedTask;
      saveStoredTasks(current);
      return updatedTask;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    } catch (err) {
      console.warn('Supabase update failed, updating locally:', err);
      const current = getStoredTasks();
      const index = current.findIndex((t) => t.id === id);
      if (index !== -1) {
        current[index] = { ...current[index], ...updates };
        saveStoredTasks(current);
        return current[index];
      }
      throw err;
    }
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

  async deleteTask(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const current = getStoredTasks();
      const updated = current.filter((t) => t.id !== id);
      saveStoredTasks(updated);
      return;
    }

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase delete failed, deleting locally:', err);
      const current = getStoredTasks();
      saveStoredTasks(current.filter((t) => t.id !== id));
    }
  },
};
