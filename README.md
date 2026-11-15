# Taskora — Plan Clearly. Get Things Done.

Taskora is a modern, responsive productivity and task-management application for individuals and teams, featuring intelligent AI task assistance, natural language parsing, voice commands, and productivity analytics.

---

## 📁 Repository Structure

```
.
├── Taskora_PRD.md                 # Product Requirements Document
├── DATABASE.md                    # Complete PostgreSQL Schema, Constraints & RLS Policies
├── DESIGN.md                      # Design System, Tokens, Colors, Layouts & Accessibility
├── README.md                      # Project setup & Architecture Guide
│
├── backend/                       # Backend platform (Supabase PostgreSQL, Edge Functions)
│   ├── .env.example               # Backend environment variables
│   ├── package.json               # Supabase CLI commands
│   ├── README.md                  # Detailed Supabase setup and migration guide
│   ├── supabase/
│   │   ├── config.toml            # Local Supabase configuration
│   │   ├── migrations/
│   │   │   └── 20261115000000_init_taskora_schema.sql # 13 tables + RLS + Triggers
│   │   ├── functions/
│   │   │   └── ai-assistant/      # Gemini AI Task Assistant Edge Function
│   │   │       ├── index.ts
│   │   │       └── deno.json
│   │   └── seed.sql               # Starter seed script
│   └── types/
│       └── database.types.ts      # Strongly typed TypeScript database interfaces
│
└── frontend/                      # Frontend Single Page App (React 19 + Vite 8 + Tailwind v4)
    ├── .env.example               # Frontend environment template
    ├── package.json               # Scripts & dependencies
    ├── vite.config.ts             # Vite configuration with Tailwind v4 plugin & path alias
    ├── tsconfig.json              # TypeScript root project config
    └── src/
        ├── App.tsx                # Main router with all 10+ views
        ├── main.tsx               # Entry point
        ├── index.css              # Tailwind v4 styles, themes, and CSS variables
        ├── types/                 # Frontend interfaces (Task, Project, Profile, etc.)
        ├── lib/                   # Supabase client, utilities, date formatters
        ├── services/              # TaskService, ProjectService, AIService, MockData
        ├── context/               # AuthContext, ThemeContext, TaskContext
        ├── components/
        │   ├── layout/            # Sidebar, TopBar, AppShell
        │   ├── tasks/             # TaskItem, QuickAddModal, TaskDetailDrawer
        │   ├── common/            # EmptyState, VoiceModal
        │   └── ai/                # AIAssistantModal (Natural Language & Daily Planner)
        └── pages/                 # Dashboard, Inbox, Today, Upcoming, AllTasks,
                                   # Completed, Projects, Calendar, Analytics, Settings,
                                   # Login, Register
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested with Node v24)
- npm or pnpm
- (Optional) Docker for local Supabase development

### 1. Frontend Setup & Launch
```bash
cd frontend
npm install
npm run dev
```
The app will launch at `http://localhost:5173`.

> **Note:** Taskora comes with an **instant offline/demo storage engine**. You can create, edit, prioritize, filter, check off tasks, test voice input, and run AI planning right out of the box without any initial cloud setup!

### 2. Backend & Supabase Configuration
To connect to your own Supabase project:
1. In `frontend/.env`, set:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Apply the complete database schema by executing `backend/supabase/migrations/20261115000000_init_taskora_schema.sql` in the Supabase SQL Editor.
3. Configure your server-side Gemini API key in Supabase Secrets:
   ```bash
   npx supabase secrets set GEMINI_API_KEY=your_gemini_key
   ```
4. Deploy the Edge Functions:
   ```bash
   cd backend
   npm run supabase:deploy-functions
   ```

---

## 🎨 Design System & Theme
- **Color tokens & Layouts:** Fully documented in [DESIGN.md](file:///c:/Users/hanzla/Desktop/FULL%20DAY/DESIGN.md).
- **Dark & Light Modes:** Instant toggle in the top bar or settings, with system preference auto-detection.
- **Keyboard Shortcuts:**
  - `Cmd / Ctrl + N`: Quick add task modal
  - `Cmd / Ctrl + K`: Quick search tasks

---

## 🔒 Security & Data Architecture
- **Row-Level Security (RLS):** Fully documented in [DATABASE.md](file:///c:/Users/hanzla/Desktop/FULL%20DAY/DATABASE.md).
- Every table has explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` security policies isolating personal tasks from shared workspace data.
- Gemini API keys are kept strictly on the server side in Supabase Edge Functions.
