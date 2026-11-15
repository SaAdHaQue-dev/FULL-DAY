-- ============================================================================
-- Taskora Starter Seed Data
-- ============================================================================

-- Note: Since profiles and tasks link to auth.users, real seed data in Supabase 
-- runs after test users are registered, or with fixed mock UUIDs for local testing.

-- Seed some general default tags/labels for demonstration
-- (In production, default labels can be populated on user registration)
COMMENT ON TABLE public.tasks IS 'Taskora core tasks storage';
COMMENT ON TABLE public.projects IS 'Taskora project collections';
COMMENT ON TABLE public.workspaces IS 'Taskora team and collaborative workspaces';
