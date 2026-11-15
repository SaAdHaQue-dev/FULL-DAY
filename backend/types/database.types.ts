export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type UserTheme = 'system' | 'light' | 'dark';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          timezone: string;
          theme: UserTheme;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          theme?: UserTheme;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          theme?: UserTheme;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: WorkspaceRole;
          joined_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role?: WorkspaceRole;
          joined_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: WorkspaceRole;
          joined_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          workspace_id: string;
          email: string;
          role: 'admin' | 'member';
          invited_by: string;
          token_hash: string;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          email: string;
          role?: 'admin' | 'member';
          invited_by: string;
          token_hash: string;
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          email?: string;
          role?: 'admin' | 'member';
          invited_by?: string;
          token_hash?: string;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string | null;
          owner_id: string;
          name: string;
          description: string | null;
          color: string;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id?: string | null;
          owner_id: string;
          name: string;
          description?: string | null;
          color?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string | null;
          owner_id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
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
        };
        Insert: {
          id?: string;
          owner_id: string;
          workspace_id?: string | null;
          project_id?: string | null;
          assignee_id?: string | null;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_at?: string | null;
          planned_for?: string | null;
          completed_at?: string | null;
          recurrence_rule?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          workspace_id?: string | null;
          project_id?: string | null;
          assignee_id?: string | null;
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_at?: string | null;
          planned_for?: string | null;
          completed_at?: string | null;
          recurrence_rule?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      labels: {
        Row: {
          id: string;
          owner_id: string | null;
          workspace_id: string | null;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          workspace_id?: string | null;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          workspace_id?: string | null;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      task_labels: {
        Row: {
          task_id: string;
          label_id: string;
        };
        Insert: {
          task_id: string;
          label_id: string;
        };
        Update: {
          task_id?: string;
          label_id?: string;
        };
      };
      task_comments: {
        Row: {
          id: string;
          task_id: string;
          author_id: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          author_id: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          author_id?: string;
          body?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      task_activity: {
        Row: {
          id: string;
          task_id: string;
          actor_id: string;
          event_type: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          actor_id: string;
          event_type: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          actor_id?: string;
          event_type?: string;
          metadata?: Json;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          related_task_id: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          related_task_id?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          related_task_id?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
      };
      notification_preferences: {
        Row: {
          user_id: string;
          email_enabled: boolean;
          push_enabled: boolean;
          daily_summary_enabled: boolean;
          quiet_hours_start: string | null;
          quiet_hours_end: string | null;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email_enabled?: boolean;
          push_enabled?: boolean;
          daily_summary_enabled?: boolean;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email_enabled?: boolean;
          push_enabled?: boolean;
          daily_summary_enabled?: boolean;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          timezone?: string;
          updated_at?: string;
        };
      };
      device_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          platform: string;
          created_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          platform: string;
          created_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          platform?: string;
          created_at?: string;
          last_seen_at?: string;
        };
      };
    };
  };
}
