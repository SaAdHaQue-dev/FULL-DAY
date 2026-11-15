export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  theme: ThemeMode;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
  profile?: Profile;
}

export interface Project {
  id: string;
  workspace_id: string | null;
  owner_id: string;
  name: string;
  description: string | null;
  color: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  task_count?: number;
  completed_count?: number;
}

export interface Label {
  id: string;
  owner_id: string | null;
  workspace_id: string | null;
  name: string;
  color: string;
  created_at: string;
}

export interface Task {
  id: string;
  owner_id: string;
  workspace_id: string | null;
  project_id: string | null;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: string | null;
  planned_for: string | null;
  completed_at: string | null;
  recurrence_rule: string | null;
  created_at: string;
  updated_at: string;
  project?: Project;
  labels?: Label[];
  assignee?: Profile;
  color?: 'purple' | 'pink' | 'yellow' | 'sky' | 'white';
  time_slot?: string;
  assignees?: Profile[];
}

export interface TaskComment {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  actor_id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
  actor?: Profile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'due_soon' | 'overdue' | 'assigned' | 'mention' | 'daily_summary';
  title: string;
  body: string | null;
  related_task_id: string | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  daily_summary_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
  updated_at: string;
}

export interface TaskFilterOptions {
  searchQuery: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  projectId: string | 'all';
  sortBy: 'due_at' | 'priority' | 'created_at' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface DailyPlanItem {
  task_title: string;
  time_block: string;
  reason: string;
}

export interface DailyPlanResult {
  summary: string;
  planned_schedule: DailyPlanItem[];
  focus_recommendation: string;
}
