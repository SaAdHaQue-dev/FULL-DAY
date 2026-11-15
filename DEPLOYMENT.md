# 🚀 Full Deployment Guide: Vercel (Frontend) + Render (Backend) + MongoDB

Is guide ki madad se aapka **Frontend Vercel** par aur **Backend Render** par host ho jayega aur dono aapas me MongoDB ke sath seamlessly connect rahenge!

---

## 📋 Architecture Overview
- **Frontend:** React 19 + Vite + Tailwind CSS v4 hosted on **Vercel**
- **Backend:** Node.js + Express REST API hosted on **Render** (free web service)
- **Database:** **MongoDB Atlas** (Free M0 Cluster)
- **Fallback Resilience:** Agar internet ya backend down bhi ho, to frontend ka koi bhi feature stop nahi hoga (`localStorage` fallback caching automatic chalu rehta hai).

---

## Step 1: MongoDB Setup (Free 5-Minute Setup)
Agar aapke paas pehle se MongoDB Atlas account hai, to aap direct connection string use kar sakte hain. Agar nahi hai:

1. **MongoDB Atlas** par jayein: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Free **M0 (Shared Cluster)** select karein (FREE forever).
3. **Database Access** me jakar ek Database User banayein:
   - Username: `admin` (ya apna pasandida)
   - Password: `YourSecurePassword123`
4. **Network Access** me jakar `Add IP Address` -> Select **"Allow Access from Anywhere" (`0.0.0.0/0`)** (Render se connect karne ke liye ye zaruri hai).
5. Cluster ke **"Connect"** button par click karein -> Choose **"Drivers" (Node.js)**:
   - Aapko ek connection string milegi aisi:
     ```
     mongodb+srv://admin:YourSecurePassword123@cluster0.abcde.mongodb.net/taskora?retryWrites=true&w=majority
     ```
   *(Is string ko copy karke rakh lein, ye hum Render par dalenge)*.

---

## Step 2: Deploy Backend on Render

1. **Render.com** par jayein: [https://dashboard.render.com](https://dashboard.render.com)
2. **New +** button par click karein aur **"Web Service"** choose karein.
3. Apna GitHub repository connect karein: `SaAdHaQue-dev/FULL-DAY`
4. Configuration settings me ye values enter karein:
   - **Name:** `taskora-backend` (ya jo aap chahein)
   - **Region:** Frankfurt ya Singapore ya Oregon
   - **Root Directory:** (leave blank ya `backend`)
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     cd backend && npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     cd backend && npm start
     ```
   - **Instance Type:** `Free`
5. **Environment Variables** add karein:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: *[Apna Step 1 wala MongoDB Atlas connection string yahan paste karein]*
6. **"Create Web Service"** par click karein.
7. Deployment complete hone ke baad Render aapko ek live URL dega, jaise:
   ```
   https://taskora-backend-xxxx.onrender.com
   ```
   *Test karein browser me:* `https://taskora-backend-xxxx.onrender.com/api/health`
   Aapko `"status": "healthy"`, `"database": "connected (mongodb)"` response dikhega!

---

## Step 3: Deploy Frontend on Vercel

1. **Vercel.com** par jayein: [https://vercel.com/new](https://vercel.com/new)
2. Apna GitHub repository import karein: `SaAdHaQue-dev/FULL-DAY`
3. Configure Project screen par:
   - **Framework Preset:** `Vite` (automatic detect ho jayega)
   - **Root Directory:** Click "Edit" and select **`frontend`**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables** expand karein:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://taskora-backend-xxxx.onrender.com/api` *(Step 2 wala Render backend URL jisme aage `/api` laga ho)*
5. **"Deploy"** par click karein!

Vercel 30 seconds ke andar aapka frontend live kar dega, jaise: `https://full-day-xxxx.vercel.app`.

---

## Step 4: Verify Both Are Connected!

1. Apna live Vercel URL open karein.
2. Bottom dock me **Profile** par jayein.
3. Profile screen par **"Cloud Sync & Backend"** card me **"Render Backend Online"** aur **"connected (mongodb)"** green dot ke sath dikhega!
4. **"Add Custom Task or Word"** button se koi naya task banayein.
5. Task instantly frontend me render hoga aur Render backend ke through aapke MongoDB database me save ho jayega!
