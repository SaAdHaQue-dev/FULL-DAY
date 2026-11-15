import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../types';
import { mockProjects } from './mockData';

const STORAGE_KEY = 'taskora_projects';

function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects));
      return mockProjects;
    }
    return JSON.parse(raw);
  } catch {
    return mockProjects;
  }
}

function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects:', err);
  }
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      return getStoredProjects();
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Project[];
    } catch (err) {
      console.warn('Supabase projects fetch failed, fallback to local:', err);
      return getStoredProjects();
    }
  },

  async createProject(input: {
    name: string;
    description?: string;
    color?: string;
  }): Promise<Project> {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      workspace_id: null,
      owner_id: 'usr-1001',
      name: input.name,
      description: input.description || null,
      color: input.color || '#6366f1',
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      task_count: 0,
      completed_count: 0,
    };

    if (!isSupabaseConfigured) {
      const current = getStoredProjects();
      const updated = [newProject, ...current];
      saveStoredProjects(updated);
      return newProject;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProject.name,
          description: newProject.description,
          color: newProject.color,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    } catch (err) {
      console.warn('Supabase create project failed, saving locally:', err);
      const current = getStoredProjects();
      saveStoredProjects([newProject, ...current]);
      return newProject;
    }
  },
};
