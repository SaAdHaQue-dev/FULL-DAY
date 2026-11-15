import { Task, TaskPriority, TaskStatus } from '../types';
import { mockTasks } from './mockData';

const STORAGE_KEY = 'taskora_personal_tasks';

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
    console.error('Failed to save personal tasks:', err);
  }
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    return getStoredTasks();
  },

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

    const newTask: Task = {
      id: `task-${Date.now()}`,
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

    const current = getStoredTasks();
    const updated = [newTask, ...current];
    saveStoredTasks(updated);
    return newTask;
  },

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

  async deleteTask(id: string): Promise<void> {
    const current = getStoredTasks();
    const updated = current.filter((t) => t.id !== id);
    saveStoredTasks(updated);
  },

  exportBackup(): string {
    const tasks = getStoredTasks();
    return JSON.stringify({
      version: '1.0',
      exported_at: new Date().toISOString(),
      tasks,
    }, null, 2);
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
