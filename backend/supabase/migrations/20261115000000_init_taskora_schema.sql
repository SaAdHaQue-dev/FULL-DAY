-- ============================================================================
-- Taskora Complete Database Schema Migration
-- Version: 1.0.0
-- Target: PostgreSQL 15+ (Supabase)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SCHEMAS & HELPERS
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 3. TABLES DEFINITION
-- ============================================================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WORKSPACES
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WORKSPACE MEMBERS
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_workspace_member UNIQUE (workspace_id, user_id)
);

-- INVITATIONS
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    is_archived BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_at TIMESTAMPTZ,
    planned_for DATE,
    completed_at TIMESTAMPTZ,
    recurrence_rule TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LABELS
CREATE TABLE IF NOT EXISTS public.labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
    color TEXT DEFAULT '#64748b' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TASK LABELS
CREATE TABLE IF NOT EXISTS public.task_labels (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);

-- TASK COMMENTS
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    body TEXT NOT NULL CHECK (char_length(trim(body)) > 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TASK ACTIVITY
CREATE TABLE IF NOT EXISTS public.task_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    related_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT true NOT NULL,
    push_enabled BOOLEAN DEFAULT false NOT NULL,
    daily_summary_enabled BOOLEAN DEFAULT false NOT NULL,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '07:00:00',
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DEVICE TOKENS
CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_seen_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_user_device_token UNIQUE (user_id, token)
);

-- ============================================================================
-- 4. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_tasks_owner_id ON public.tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON public.tasks(due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_planned_for ON public.tasks(planned_for);
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON public.tasks(completed_at);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);

CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON public.projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_ws_id ON public.workspace_members(workspace_id);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON public.task_activity(task_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read_at) WHERE read_at IS NULL;

-- ============================================================================
-- 5. UPDATED_AT TRIGGERS
-- ============================================================================

CREATE OR REPLACE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_task_comments_updated_at BEFORE UPDATE ON public.task_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE OR REPLACE TRIGGER trg_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 6. AUTHENTICATION TRIGGER FOR AUTOMATIC PROFILE & PREFERENCES CREATION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper functions (Security Definer to prevent policy query recursion)
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID, uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = ws_id AND user_id = uid
    );
$$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Profiles: Authenticated users can read all profiles (to display collaborators); owner can update their own
CREATE POLICY "Profiles readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Workspaces
CREATE POLICY "Users can view workspaces they belong to"
    ON public.workspaces FOR SELECT
    TO authenticated
    USING (owner_id = auth.uid() OR public.is_workspace_member(id, auth.uid()));

CREATE POLICY "Users can create workspaces"
    ON public.workspaces FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update workspaces"
    ON public.workspaces FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete workspaces"
    ON public.workspaces FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

-- Workspace Members
CREATE POLICY "Members can view members in same workspace"
    ON public.workspace_members FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Owners and admins can add workspace members"
    ON public.workspace_members FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspaces WHERE id = workspace_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can remove workspace members"
    ON public.workspace_members FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces WHERE id = workspace_id AND owner_id = auth.uid()
        ) OR user_id = auth.uid()
    );

-- Projects
CREATE POLICY "Users can view accessible projects"
    ON public.projects FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
    );

CREATE POLICY "Users can insert projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (
        owner_id = auth.uid() AND (
            workspace_id IS NULL OR public.is_workspace_member(workspace_id, auth.uid())
        )
    );

CREATE POLICY "Project owners or workspace admins can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
    );

CREATE POLICY "Project owners can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

-- Tasks
CREATE POLICY "Users can view tasks"
    ON public.tasks FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR assignee_id = auth.uid()
        OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
    );

CREATE POLICY "Users can create tasks"
    ON public.tasks FOR INSERT
    TO authenticated
    WITH CHECK (
        owner_id = auth.uid() AND (
            workspace_id IS NULL OR public.is_workspace_member(workspace_id, auth.uid())
        )
    );

CREATE POLICY "Users can update authorized tasks"
    ON public.tasks FOR UPDATE
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR assignee_id = auth.uid()
        OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
    );

CREATE POLICY "Users can delete their tasks"
    ON public.tasks FOR DELETE
    TO authenticated
    USING (
        owner_id = auth.uid()
    );

-- Labels & Task Labels
CREATE POLICY "Labels readable by owner or workspace members"
    ON public.labels FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
    );

CREATE POLICY "Users can create labels"
    ON public.labels FOR INSERT
    TO authenticated
    WITH CHECK (
        owner_id = auth.uid()
    );

CREATE POLICY "Task labels readable if task is accessible"
    ON public.task_labels FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks WHERE id = task_labels.task_id AND (
                owner_id = auth.uid() OR assignee_id = auth.uid() OR
                (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
            )
        )
    );

CREATE POLICY "Users can manage task labels for accessible tasks"
    ON public.task_labels FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks WHERE id = task_labels.task_id AND (
                owner_id = auth.uid() OR assignee_id = auth.uid() OR
                (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
            )
        )
    );

-- Comments & Activity
CREATE POLICY "Comments viewable by task members"
    ON public.task_comments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks WHERE id = task_comments.task_id AND (
                owner_id = auth.uid() OR assignee_id = auth.uid() OR
                (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
            )
        )
    );

CREATE POLICY "Users can insert comments on accessible tasks"
    ON public.task_comments FOR INSERT
    TO authenticated
    WITH CHECK (
        author_id = auth.uid() AND EXISTS (
            SELECT 1 FROM public.tasks WHERE id = task_comments.task_id AND (
                owner_id = auth.uid() OR assignee_id = auth.uid() OR
                (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
            )
        )
    );

CREATE POLICY "Activity viewable by task members"
    ON public.task_activity FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks WHERE id = task_activity.task_id AND (
                owner_id = auth.uid() OR assignee_id = auth.uid() OR
                (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
            )
        )
    );

-- Notifications & Preferences
CREATE POLICY "Notifications private to user"
    ON public.notifications FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Notification preferences private to user"
    ON public.notification_preferences FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Device tokens private to user"
    ON public.device_tokens FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
