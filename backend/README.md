# 🚀 Taskora Backend (Node.js + Express + MongoDB on Render)

Production-ready REST API built with **Node.js**, **Express**, **TypeScript**, and **Mongoose (MongoDB)**. It is specifically designed and configured for seamless deployment on **Render** (as a Free Web Service) and connects directly to the **Vercel** frontend.

---

## 📁 Folder Structure

```
backend/
├── README.md               # Complete backend documentation & setup guide
├── .env.example            # Environment variables template
├── package.json            # Node.js dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── render.yaml             # Render Blueprint specification (at root)
├── dist/                   # Compiled JavaScript output (generated on build)
│   └── server.js           # Production server bundle
├── src/
│   ├── server.ts           # Express application entrypoint & CORS configuration
│   ├── config/
│   │   └── db.ts           # Mongoose MongoDB connection & memory fallback logic
│   ├── models/
│   │   ├── Task.ts         # Mongoose Task schema, interfaces & in-memory fallback
│   │   └── Project.ts      # Mongoose Project schema, interfaces & in-memory fallback
│   └── routes/
│       ├── healthRoutes.ts # /api/health and /healthz endpoints for Render checks
│       ├── taskRoutes.ts   # CRUD endpoints for tasks (/api/tasks)
│       └── projectRoutes.ts# CRUD endpoints for projects (/api/projects)
├── supabase/               # (Legacy/Archive) Original PostgreSQL schema & seed files
└── types/                  # Database type definitions
```

---

## ✨ Key Features & Architecture

1. **Zero-Downtime Resilience (Graceful Fallback):**
   - If `MONGODB_URI` is not yet configured or takes time to connect, the backend **does not crash**.
   - It seamlessly operates in an in-memory fallback mode so that Render's health checks (`/api/health`) pass immediately with HTTP 200 `healthy`.
   - Once a valid `MONGODB_URI` is provided in Render, it automatically connects to MongoDB Atlas.

2. **Universal CORS Support:**
   - Allows requests from local development (`http://localhost:5173`, `http://localhost:3000`).
   - Automatically permits **all Vercel preview and production deployments** (`*.vercel.app`).
   - Supports custom domains configured via `FRONTEND_URL`.

3. **Production TypeScript Build:**
   - Compiles cleanly via `npm run build` (`tsc`) into standard Node.js ES modules in `dist/`.
   - Production execution via `npm start` (`node dist/server.js`).

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status, database mode, and available endpoints |
| `GET` | `/api/health` | Health check for Render monitoring (returns DB status & uptime) |
| `GET` | `/healthz` | Secondary health check ping |
| `GET` | `/api/tasks` | Fetch all tasks (from MongoDB or memory cache) |
| `POST` | `/api/tasks` | Create a new task (`title`, `priority`, `due_at`, `status`, etc.) |
| `PUT` | `/api/tasks/:id` | Update an existing task by ID (toggle complete, edit, etc.) |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID |
| `GET` | `/api/projects` | Fetch all active projects and progress |
| `POST` | `/api/projects` | Create a new project |

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and set:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/taskora?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
```
*(If you do not have a MongoDB URI yet, leave it empty — the server will run in local in-memory mode).*

### 3. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Build & Run Production Bundle
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Render (Free Web Service)

### Method A: Using Render Blueprint (`render.yaml`)
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository: `SaAdHaQue-dev/FULL-DAY`.
4. Render will read `render.yaml` automatically and configure the service.
5. In the environment variables prompt, enter your `MONGODB_URI`.
6. Click **Apply**.

### Method B: Manual Web Service Setup
1. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your repository: `SaAdHaQue-dev/FULL-DAY`.
3. Set the following configuration:
   - **Name:** `taskora-backend`
   - **Region:** Frankfurt (EU) or Oregon (US)
   - **Root Directory:** *(leave blank)*
   - **Runtime:** `Node`
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm start`
   - **Instance Type:** `Free`
4. Add **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb+srv://admin:YourPassword@cluster0.xyz.mongodb.net/taskora?retryWrites=true&w=majority`
5. Click **Create Web Service**.
6. Render will assign you a public URL (e.g., `https://taskora-backend.onrender.com`).
   - Test it: `https://taskora-backend.onrender.com/api/health`

---

## 🍃 MongoDB Atlas Setup (Free Tier)

1. Register or sign in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a free **M0 (Shared Cluster)**.
3. Under **Security > Database Access**, create a user (e.g., `admin` with a strong password).
4. Under **Security > Network Access**, click **Add IP Address** and choose **"Allow Access from Anywhere" (`0.0.0.0/0`)** so Render can connect.
5. Click **Connect** on your cluster -> Choose **Drivers (Node.js)**.
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/taskora?retryWrites=true&w=majority
   ```
7. Paste this connection string into your Render Web Service environment variables under `MONGODB_URI`.

---

## 🔗 Connecting Frontend on Vercel to Render Backend

1. In your **Vercel Dashboard**, open your frontend project settings.
2. Go to **Settings > Environment Variables**.
3. Add a new variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-render-service.onrender.com/api`
4. Redeploy the frontend.
5. In the frontend app, open the **Profile** screen (`/profile`) — you will see a live **"Cloud Sync & Backend"** card showing:
   - `Render Backend Online` (with a pulsing green indicator)
   - `connected (mongodb)`

All tasks created, updated, or checked off will now persist directly into your MongoDB database!
