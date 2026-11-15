# Taskora --- Product Requirements Document (PRD)

**Product name:** Taskora\
**Working tagline:** Plan clearly. Get things done.\
**Document version:** 1.0\
**Status:** Initial product specification\
**Target build environment:** Google Antigravity

------------------------------------------------------------------------

## 1. Product Overview

Taskora is a modern, responsive productivity and task-management
application for individuals and small teams. It helps users capture
tasks, organize work into projects, prioritize what matters, plan their
day, and understand their productivity.

The first release will provide a reliable core task-management
experience. It will also include five advanced capabilities as planned
product modules:

1.  AI Task Assistant
2.  Smart Notifications
3.  Team Collaboration
4.  Productivity Analytics
5.  Voice-Controlled Tasks

The application should feel fast, focused, approachable, and polished.
It should not overwhelm users with unnecessary complexity.

## 2. Product Vision

Create one place where users can plan personal work, manage projects
with others, and make steady progress toward their goals.

## 3. Goals and Success Criteria

### Product goals

-   Make capturing and organizing a task quick and intuitive.
-   Help users understand what needs attention today.
-   Support projects, deadlines, priorities, labels, and recurring work.
-   Make collaboration possible without compromising private personal
    tasks.
-   Use AI to assist users while keeping them in control.
-   Provide useful productivity insights based on real task activity.
-   Support desktop, tablet, and mobile screen sizes.

### Initial success measures

Track the following after launch:

-   Percentage of registered users who create their first task.
-   Percentage of users who return within 7 days.
-   Tasks created and completed per active user.
-   Percentage of tasks with due dates or priorities.
-   Number of active projects and invited collaborators.
-   AI suggestions accepted, edited, or dismissed.
-   Notification delivery and interaction rates.
-   Voice command success and correction rates.

Do not invent benchmark targets before collecting baseline usage data.
Establish targets after the first usable release.

## 4. Target Users

### Primary: Individual user

A student, professional, freelancer, or busy person who needs to manage
daily tasks and personal projects.

### Secondary: Small team

A small group that needs shared projects, task assignments, status
visibility, and lightweight collaboration.

### User needs

-   Capture a task without navigating through many screens.
-   See today's tasks and upcoming deadlines.
-   Know which tasks are most important.
-   Group related tasks into projects.
-   Share work and assign responsibility.
-   Receive reminders at useful times.
-   Understand progress over time.

## 5. Scope and Release Strategy

Build in stages. The core task experience must work before advanced
automation is added.

### MVP --- Core application

-   Sign up, sign in, sign out, and account settings.
-   Personal dashboard.
-   Create, view, edit, complete, delete, and search tasks.
-   Today, Upcoming, Inbox, and All Tasks views.
-   Projects and task grouping.
-   Due dates, priorities, statuses, labels, and descriptions.
-   Responsive layout.
-   Basic task counts and completion summary.
-   Database security and user data isolation.

### Release 1 --- Productivity features

-   Calendar view.
-   Recurring tasks.
-   In-app reminders and notification preferences.
-   Productivity analytics.
-   Task filters, sorting, and bulk actions.

### Release 2 --- AI and voice

-   AI task creation from natural language.
-   AI priority and scheduling suggestions.
-   AI task breakdown and daily planning.
-   Voice task commands with user confirmation for ambiguous actions.

### Release 3 --- Collaboration

-   Shared workspaces and projects.
-   Invitations and membership roles.
-   Task assignment.
-   Comments and activity history.
-   Realtime updates.

### Out of scope for the initial release

-   Full enterprise project management.
-   Video calls or team chat platform.
-   Billing, subscriptions, and complex organization administration.
-   Native iOS and Android applications.
-   Offline-first synchronization.
-   AI actions that modify or delete data without user confirmation.

## 6. Functional Requirements

### 6.1 Authentication and Account

Users must be able to:

-   Register with email and password.
-   Sign in and sign out.
-   Reset a forgotten password.
-   Optionally sign in with Google OAuth.
-   Edit display name and profile details.
-   Configure timezone, preferred theme, and notification settings.
-   Delete their account and associated personal data, subject to
    documented retention rules.

**Acceptance criteria**

-   A signed-out user cannot access protected application data.
-   A user can only access records they own or are authorized to access.
-   Authentication errors are shown clearly without exposing sensitive
    details.

### 6.2 Dashboard

The dashboard should provide:

-   Greeting and current date.
-   Tasks due today.
-   Overdue tasks.
-   Upcoming tasks.
-   Completed task count.
-   Progress summary.
-   Quick-add task control.
-   Recently updated projects.
-   Optional AI-generated daily plan.

Users should be able to open a task directly from dashboard cards.

### 6.3 Task Management

Each task should support:

-   Title (required).
-   Description (optional).
-   Status: `todo`, `in_progress`, `completed`, `cancelled`.
-   Priority: `low`, `medium`, `high`, `urgent`.
-   Due date and optional due time.
-   Optional start date.
-   Project (optional).
-   Labels/tags.
-   Assignee (when collaboration is enabled).
-   Creator and timestamps.
-   Optional recurrence rule.
-   Optional reminder settings.
-   Completion timestamp.

Users can create, view, edit, complete, reopen, delete, search, filter,
sort, and duplicate tasks.

**Task rules**

-   A task title cannot be empty.
-   Completing a task records `completed_at`.
-   Reopening a task clears or updates `completed_at`.
-   Deleting a task should use a confirmation step.
-   Overdue status should be derived from due date and completion state,
    not stored as a permanent status.
-   Store timestamps consistently and display them in the user's
    selected timezone.

**Acceptance criteria**

-   A task appears in the correct list after creation.
-   Changes persist after refresh and across supported devices.
-   Search and filters work together.
-   Users receive clear success and error feedback.

### 6.4 Task Views and Organization

Required views:

-   **Inbox:** tasks not assigned to a specific project.
-   **Today:** incomplete tasks due today, plus tasks the user has
    chosen to plan for today.
-   **Upcoming:** future-dated tasks.
-   **All Tasks:** all tasks the user can access.
-   **Completed:** completed tasks.
-   **Project view:** tasks belonging to a selected project.

Support filtering by status, priority, project, label, assignee, and due
date. Support sorting by due date, priority, creation date, and title.

### 6.5 Projects

Users can:

-   Create, edit, archive, and delete projects.
-   Set a project name, description, and optional color.
-   View project task totals and completion progress.
-   Add and remove tasks from a project.
-   Filter and sort tasks within a project.

For shared projects, project membership and permissions must be enforced
by database policies, not just by hiding interface controls.

### 6.6 Calendar and Scheduling

Provide month, week, and day views.

-   Display tasks with due dates.
-   Open a task from a calendar item.
-   Allow authorized users to change a task's due date.
-   Clearly distinguish completed, overdue, and upcoming tasks.
-   Respect user timezone settings.

External calendar synchronization is not required for MVP.

### 6.7 Smart Notifications

Notification types:

-   Upcoming due-date reminder.
-   Overdue task reminder.
-   Daily task summary (opt-in).
-   Task assignment and collaboration updates.
-   Invitation notifications.

Requirements:

-   Users can enable or disable notification categories.
-   Users can select reminder timing where supported.
-   Avoid duplicate reminders for the same task and reminder window.
-   Respect quiet hours and timezone.
-   Provide an in-app notification center with read/unread state.
-   Push notifications require permission and a supported
    device/browser.
-   Email notifications may be delivered through a transactional email
    provider.

Do not promise push delivery when browser permission is denied or the
device does not support it. Notification scheduling must be performed by
trusted server-side jobs/functions, not only by a browser tab.

### 6.8 AI Task Assistant

Use the Gemini API through a secure server-side function. Never expose
the API key in frontend code.

Capabilities:

1.  Convert natural-language input into a proposed task.
2.  Suggest priority based on user-provided context.
3.  Suggest a due date or time when the user gives enough information.
4.  Break a large task into smaller subtasks.
5.  Suggest a realistic daily plan using incomplete tasks, deadlines,
    priorities, and available time supplied by the user.
6.  Summarize project workload and task progress.

**AI interaction rules**

-   AI output is a suggestion, not an authoritative decision.
-   Show proposed task fields before saving.
-   Ask for clarification when a date, time, or target task is
    ambiguous.
-   Never silently delete, complete, reassign, or reschedule tasks.
-   Clearly distinguish generated suggestions from saved data.
-   Handle API failures gracefully and allow manual task management to
    continue.

**Example input:** "Prepare my presentation by Friday and split it into
research, outline, and slides."

**Expected behavior:** Present a proposed parent task and subtasks for
user review. Do not save until the user confirms.

### 6.9 Team Collaboration

Collaboration is enabled for shared workspaces/projects.

Users can:

-   Create a workspace.
-   Invite members by email.
-   Accept or decline invitations.
-   Create shared projects.
-   Assign tasks to workspace members.
-   Add comments to tasks.
-   View project activity.
-   Receive assignment and comment notifications.

Suggested roles:

-   **Owner:** manages workspace, members, and settings.
-   **Admin:** manages projects and members, except ownership.
-   **Member:** works on shared projects and assigned tasks.

The permission model must be implemented and tested at the database
level. A user must not gain access by guessing a project or task
identifier.

Real-time updates should refresh relevant task lists, comments, and
activity without requiring a manual reload.

### 6.10 Productivity Analytics

Provide:

-   Tasks completed today, this week, and this month.
-   Completion trend over time.
-   Completed vs. incomplete task counts.
-   Tasks grouped by priority.
-   Project progress.
-   Overdue task count.
-   Optional personal completion streak.

Analytics must use actual persisted task events and clearly define each
metric. Do not label a metric as a productivity score unless its formula
is documented. Users should be able to choose a date range.

### 6.11 Voice-Controlled Tasks

Use browser speech recognition where supported.

Initial commands:

-   "Create a task called ..."
-   "Show my tasks for today."
-   "Find my task ..."
-   "Mark ... as completed."
-   "Set priority of ... to high."

Requirements:

-   Show a visible microphone state while listening.
-   Ask for confirmation before applying ambiguous or destructive
    actions.
-   Allow users to review recognized text before saving.
-   Provide typed input as a fallback.
-   Explain when voice recognition is unavailable in the current
    browser.
-   Request microphone access only after the user initiates the feature.

Speech recognition support varies by browser and operating system. Do
not make voice control a requirement for basic app usage.

## 7. UX and Design Requirements

### Design direction

-   Modern, minimal productivity SaaS interface.
-   Clear hierarchy and generous spacing.
-   Fast interactions and restrained animation.
-   Consistent typography, colors, spacing, and iconography.
-   Light and dark themes.
-   Responsive desktop, tablet, and mobile layouts.
-   Accessible contrast, keyboard navigation, and visible focus states.

### Main application layout

**Sidebar** - Dashboard - Inbox - Today - Upcoming - All Tasks -
Projects - Calendar - Analytics - Settings

**Top bar** - Global search - Quick add - Notifications - Theme
control - Profile menu

**Main content** - Page title and context - Task list, calendar, project
board, or analytics - Useful empty states and loading states

**Task detail panel** - Title and description - Status and priority -
Due date and reminder - Project and labels - Assignee (shared tasks) -
Comments and activity (shared tasks)

### UX quality requirements

-   Provide loading, empty, success, and error states.
-   Use confirmation for destructive actions.
-   Keep task creation short and easy.
-   Preserve unsaved edits where practical.
-   Support keyboard operation for core actions.
-   Avoid excessive animations and unnecessary modal dialogs.

## 8. Recommended Technology Stack

Use one consistent stack for the first implementation:

  Area                    Technology
  ----------------------- ------------------------------------------------
  Frontend                React + Vite
  Language                TypeScript
  Styling                 Tailwind CSS
  UI components           shadcn/ui
  Icons                   Lucide
  Animation               Framer Motion
  Backend platform        Supabase
  Database                Supabase PostgreSQL
  Authentication          Supabase Auth
  Authorization           PostgreSQL Row Level Security (RLS)
  Realtime                Supabase Realtime
  Server-side functions   Supabase Edge Functions
  AI                      Gemini API, called server-side
  Charts                  Recharts
  Calendar                FullCalendar
  Voice                   Browser Web Speech API, with typed fallback
  Push notifications      Firebase Cloud Messaging where supported
  Email                   Resend or another transactional email provider
  Hosting                 Vercel (frontend) and Supabase (backend)

**Architecture note:** Do not add a separate Node/Express server or
MongoDB to the initial version. Supabase already provides the database,
authentication, realtime services, and server-side functions required by
this product. Avoid maintaining two databases.

## 9. High-Level Data Model

Use PostgreSQL with UUID primary keys, foreign keys, indexes,
timestamps, and appropriate constraints.

### profiles

-   `id` --- references the authenticated user.
-   `display_name`
-   `avatar_url`
-   `timezone`
-   `theme`
-   `created_at`
-   `updated_at`

### workspaces

-   `id`
-   `name`
-   `owner_id`
-   `created_at`
-   `updated_at`

### workspace_members

-   `id`
-   `workspace_id`
-   `user_id`
-   `role`
-   `joined_at`

### projects

-   `id`
-   `workspace_id` --- nullable for personal projects if supported by
    the chosen model.
-   `owner_id`
-   `name`
-   `description`
-   `color`
-   `is_archived`
-   `created_at`
-   `updated_at`

### tasks

-   `id`
-   `owner_id`
-   `workspace_id` --- nullable for personal tasks.
-   `project_id` --- nullable.
-   `assignee_id` --- nullable.
-   `title`
-   `description`
-   `status`
-   `priority`
-   `due_at`
-   `planned_for`
-   `completed_at`
-   `recurrence_rule` --- nullable.
-   `created_at`
-   `updated_at`

### labels

-   `id`
-   `owner_id` or `workspace_id`
-   `name`
-   `color`

### task_labels

-   `task_id`
-   `label_id`

### task_comments

-   `id`
-   `task_id`
-   `author_id`
-   `body`
-   `created_at`
-   `updated_at`

### task_activity

-   `id`
-   `task_id`
-   `actor_id`
-   `event_type`
-   `metadata` (JSONB)
-   `created_at`

### notifications

-   `id`
-   `user_id`
-   `type`
-   `title`
-   `body`
-   `related_task_id`
-   `read_at`
-   `created_at`

### notification_preferences

-   `user_id`
-   `email_enabled`
-   `push_enabled`
-   `daily_summary_enabled`
-   `quiet_hours_start`
-   `quiet_hours_end`
-   `timezone`

### device_tokens

-   `id`
-   `user_id`
-   `token`
-   `platform`
-   `created_at`
-   `last_seen_at`

### invitations

-   `id`
-   `workspace_id`
-   `email`
-   `role`
-   `invited_by`
-   `token_hash`
-   `expires_at`
-   `accepted_at`
-   `created_at`

Add indexes for common queries, including tasks by owner and due date,
project, assignee, status, and workspace. Add unique constraints where
needed, such as one membership per workspace/user pair.

The final schema and migrations must be documented in a separate
`DATABASE.md` before production use.

## 10. Security, Privacy, and Reliability

-   Enable RLS on every table containing user or workspace data.
-   Write explicit SELECT, INSERT, UPDATE, and DELETE policies.
-   Enforce workspace membership and role permissions in database
    policies and server-side functions.
-   Keep Gemini, email, and other private API keys in server-side
    secrets.
-   Validate and sanitize all user input.
-   Never trust client-supplied owner IDs or role values.
-   Use secure invitation tokens; store token hashes rather than raw
    tokens.
-   Rate-limit AI and invitation endpoints.
-   Do not send private task content to AI unless needed for the
    requested operation and disclosed to the user.
-   Provide account deletion and data export paths before public launch.
-   Log operational errors without logging passwords, tokens, or
    unnecessary private task content.
-   Back up production data and document recovery procedures.

## 11. Non-Functional Requirements

-   Responsive and usable on common modern browsers.
-   Core task operations should feel immediate under normal network
    conditions.
-   Use pagination or incremental loading for large task lists.
-   Avoid unnecessary database queries and repeated AI calls.
-   Provide graceful handling of network and service failures.
-   Maintain accessible keyboard and screen-reader behavior for key
    workflows.
-   Keep the app usable when AI, voice, or push services are
    unavailable.
-   Use automated tests for authentication, permissions, task
    operations, and critical workflows.

## 12. Required Screens

1.  Sign up
2.  Sign in
3.  Forgot password / reset password
4.  Main dashboard
5.  Inbox
6.  Today
7.  Upcoming
8.  All Tasks
9.  Completed Tasks
10. Project list
11. Project detail
12. Calendar
13. Analytics
14. AI Assistant panel
15. Notifications center
16. Workspace and member management
17. User profile and settings

Use reusable components rather than implementing each screen
independently.

## 13. Core User Journeys

### Journey A: Create and complete a task

1.  User signs in.
2.  User selects Quick Add.
3.  User enters a title, due date, and priority.
4.  App validates and saves the task.
5.  Task appears in the appropriate view.
6.  User marks it completed.
7.  App records completion time and updates counts.

### Journey B: Plan a day with AI

1.  User opens AI Assistant.
2.  User asks for a plan for today.
3.  Server retrieves only the user's relevant tasks.
4.  Gemini returns a structured proposed plan.
5.  App displays the plan for review.
6.  User accepts or edits suggestions.
7.  App saves only confirmed changes.

### Journey C: Collaborate on a project

1.  Workspace owner creates a workspace.
2.  Owner invites a teammate.
3.  Teammate accepts the invitation.
4.  Owner or authorized member creates a shared project.
5.  A task is assigned to a member.
6.  Members see authorized realtime updates and activity.

### Journey D: Use a voice command

1.  User starts voice input.
2.  Browser requests microphone permission if needed.
3.  App displays recognized text.
4.  App resolves the intended action and target task.
5.  App asks for confirmation if ambiguous or consequential.
6.  App executes the confirmed action and shows the result.

## 14. Acceptance Criteria for MVP

The MVP is ready for user testing when:

-   A user can register, sign in, and sign out.
-   Protected pages require authentication.
-   Users can create, edit, complete, reopen, delete, and search their
    own tasks.
-   Users can create projects and organize tasks.
-   Today, Upcoming, Inbox, and All Tasks show the correct records.
-   Due dates and priorities are saved and displayed correctly.
-   Data remains available after refresh and a new session.
-   One user's private tasks cannot be read or modified by another user.
-   Empty, loading, and error states are implemented.
-   The interface works on desktop and mobile layouts.
-   Critical flows have automated tests.

Advanced features are accepted separately against the requirements in
Section 6. They must not block delivery of the core MVP.

## 15. Testing Plan

### Unit tests

-   Task validation and status transitions.
-   Date and timezone handling.
-   Priority and filter logic.
-   Analytics calculations.
-   AI response parsing and validation.

### Integration tests

-   Authentication and profile creation.
-   Task and project database operations.
-   RLS access restrictions.
-   Realtime updates.
-   Notification creation and preferences.
-   AI Edge Function behavior.

### End-to-end tests

-   Sign up and sign in.
-   Create and complete a task.
-   Create a project and add tasks.
-   Search and filter tasks.
-   Use the app at mobile viewport sizes.
-   Confirm one user cannot access another user's private data.

## 16. Google Antigravity Implementation Instructions

Treat this PRD as the source of truth for product behavior.

1.  Read this PRD fully before generating code.
2.  First create an implementation plan and proposed folder structure.
3.  Create `DATABASE.md` with the complete PostgreSQL schema,
    relationships, indexes, constraints, and RLS policies.
4.  Create `DESIGN.md` with design tokens, layout rules, component
    patterns, responsive behavior, and accessibility requirements.
5.  Implement the MVP in small, testable milestones.
6.  Use TypeScript types that match the database schema.
7.  Keep Supabase access in a dedicated service/data layer; do not
    scatter raw database calls throughout UI components.
8.  Keep secrets and privileged operations on the server side.
9.  Do not use mock data as if it were persisted production data.
    Clearly label any temporary seed/demo data.
10. Do not leave buttons or navigation items that appear functional but
    do nothing. Hide unfinished features or label them as coming soon.
11. Add migrations and tests as features are implemented.
12. Verify RLS policies with at least two separate test users.
13. Run linting, type checks, and tests before considering a milestone
    complete.
14. Do not implement all advanced features in one pass. Complete and
    verify the core MVP first.
15. Update the README with setup, environment variables, migrations,
    development, testing, and deployment instructions.

### Suggested implementation milestones

-   **Milestone 1:** Project setup, design system, routing, responsive
    shell.
-   **Milestone 2:** Supabase setup, authentication, profiles, RLS.
-   **Milestone 3:** Tasks, task views, projects, search, filters.
-   **Milestone 4:** Calendar, recurring tasks, in-app notifications.
-   **Milestone 5:** Analytics.
-   **Milestone 6:** AI Assistant.
-   **Milestone 7:** Voice commands.
-   **Milestone 8:** Workspaces, invitations, assignments, comments,
    realtime collaboration.
-   **Milestone 9:** Security review, testing, accessibility,
    deployment.

## 17. Open Product Decisions

Resolve these before the relevant implementation milestone:

-   Whether workspaces are available to all users or only invited/team
    users.
-   Whether AI planning uses a user-defined working-hours schedule.
-   Which push-notification browsers/devices are supported at launch.
-   Whether recurring tasks create the next occurrence on completion or
    on a scheduled job.
-   Whether analytics include only completed tasks or also time
    estimates and tracked time.
-   Data retention and account deletion behavior.

Until decided, choose the simplest secure behavior and document the
decision. Do not silently add paid services or subscriptions.

------------------------------------------------------------------------

**End of PRD**
