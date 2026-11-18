import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Task, Project, TaskFilterOptions, TaskPriority, TaskStatus } from '../types';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { isTaskOverdue, isTaskToday } from '../lib/utils';
import { isAfter, parseISO, startOfToday } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  loading: boolean;
  filters: TaskFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterOptions>>;
  selectedTask: Task | null;
  setSelectedTaskId: (id: string | null) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;
  isTimerOpen: boolean;
  setIsTimerOpen: (open: boolean) => void;
  createTask: (input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    due_at?: string | null;
    planned_for?: string | null;
    project_id?: string | null;
  }) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  toggleTaskComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createProject: (input: { name: string; description?: string; color?: string }) => Promise<Project>;
  refreshTasks: () => Promise<void>;
  counts: {
    inbox: number;
    today: number;
    upcoming: number;
    all: number;
    completed: number;
    overdue: number;
  };
}

const initialFilters: TaskFilterOptions = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
  sortBy: 'due_at',
  sortOrder: 'asc',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<TaskFilterOptions>(initialFilters);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedProjects] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects(),
      ]);
      setTasks(fetchedTasks);
      setProjects(fetchedProjects);
    } catch (err) {
      console.error('Failed to load tasks and projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find((t) => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  const createTask = async (input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    due_at?: string | null;
    planned_for?: string | null;
    project_id?: string | null;
  }) => {
    const created = await taskService.createTask(input);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updated = await taskService.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = await taskService.toggleTaskStatus(id, task.status);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };

  const createProject = async (input: { name: string; description?: string; color?: string }) => {
    const created = await projectService.createProject(input);
    setProjects((prev) => [created, ...prev]);
    return created;
  };

  const counts = useMemo(() => {
    let inbox = 0;
    let today = 0;
    let upcoming = 0;
    let all = 0;
    let completed = 0;
    let overdue = 0;

    const todayDate = startOfToday();

    tasks.forEach((t) => {
      const isDone = t.status === 'completed' || t.status === 'cancelled';
      if (isDone) {
        completed++;
        return;
      }

      all++;

      if (!t.project_id) {
        inbox++;
      }

      if (isTaskToday(t.due_at) || isTaskToday(t.planned_for)) {
        today++;
      }

      if (isTaskOverdue(t.due_at, t.status)) {
        overdue++;
      }

      if (t.due_at) {
        try {
          const date = parseISO(t.due_at);
          if (isAfter(date, todayDate) && !isTaskToday(t.due_at)) {
            upcoming++;
          }
        } catch {
          // ignore parsing error
        }
      }
    });

    return { inbox, today, upcoming, all, completed, overdue };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        loading,
        filters,
        setFilters,
        selectedTask,
        setSelectedTaskId,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isAIModalOpen,
        setIsAIModalOpen,
        isTimerOpen,
        setIsTimerOpen,
        createTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        createProject,
        refreshTasks: loadData,
        counts,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}
