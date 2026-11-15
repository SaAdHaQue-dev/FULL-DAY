# Taskora Backend (Supabase Engine)

This folder contains the complete database schema, migrations, RLS security policies, seed scripts, Supabase Edge Functions (Gemini AI assistant), and TypeScript database typings for **Taskora**.

## Folder Structure

```
backend/
├── README.md               # Backend documentation and deployment guides
├── .env.example            # Backend environment variables template
├── package.json            # Scripts for Supabase CLI and typing generation
├── supabase/
│   ├── config.toml         # Supabase local development CLI configuration
│   ├── migrations/
│   │   └── 20261115000000_init_taskora_schema.sql  # 13 tables + RLS + Triggers
│   ├── functions/
│   │   └── ai-assistant/   # Edge Function calling Gemini API server-side
│   │       ├── index.ts
│   │       └── deno.json
│   └── seed.sql            # Initial test and setup data
└── types/
    └── database.types.ts   # Strongly-typed TypeScript interfaces
```

## Quick Start: Local Development with Supabase CLI

1. **Install Supabase CLI:**
   ```bash
   npm install
   ```

2. **Start Local Supabase (requires Docker):**
   ```bash
   npm run supabase:start
   ```
   This spins up:
   - PostgreSQL on `localhost:54322`
   - Supabase Studio GUI at `http://localhost:54323`
   - Supabase API at `http://localhost:54321`

3. **Apply Migrations and Seed Data:**
   ```bash
   npm run supabase:reset
   ```

4. **Regenerate TypeScript Types:**
   ```bash
   npm run supabase:gen-types
   ```

## Connecting to Cloud Supabase

If connecting to an existing Supabase Cloud Project:
1. Copy `20261115000000_init_taskora_schema.sql` into the Supabase **SQL Editor** and run it.
2. Under **Project Settings > API**, retrieve your `Project URL` and `anon public` key.
3. Configure the frontend's `.env` file with these values.
4. For AI Edge Functions, set your Gemini secret in Supabase:
   ```bash
   npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   ```
   And deploy:
   ```bash
   npm run supabase:deploy-functions
   ```

## Security & Row Level Security (RLS)

- Every table has Row Level Security enabled.
- All access is strictly partitioned by user identity (`auth.uid()`) and workspace membership.
- Private tasks and profiles cannot be accessed by unauthorized users.
- Gemini API keys and sensitive operations are kept entirely on the server side in Edge Functions.
