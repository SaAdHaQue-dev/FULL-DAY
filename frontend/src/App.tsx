import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { AllTasksPage } from './pages/AllTasksPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              {/* Zero Sign-in Barrier: Instant personal access */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />

              {/* 5 Core PRD Application Views */}
              {/* 1. Today's Dashboard */}
              <Route
                path="/"
                element={
                  <AppShell>
                    <DashboardPage />
                  </AppShell>
                }
              />

              {/* 2. Calendar & Chronological Timeline */}
              <Route
                path="/calendar"
                element={
                  <AppShell>
                    <CalendarPage />
                  </AppShell>
                }
              />

              {/* 3. Task Management (All Tasks, Inbox, Projects, Filtering & Sorting) */}
              <Route
                path="/tasks"
                element={
                  <AppShell>
                    <AllTasksPage />
                  </AppShell>
                }
              />

              {/* 4. Productivity Analytics (Streaks, Completion Rate, Pomodoro Timer) */}
              <Route
                path="/analytics"
                element={
                  <AppShell>
                    <AnalyticsPage />
                  </AppShell>
                }
              />

              {/* 5. Profile & Workstation Settings (Cloud Sync, MongoDB, Backups) */}
              <Route
                path="/profile"
                element={
                  <AppShell>
                    <ProfilePage />
                  </AppShell>
                }
              />

              {/* Helpful Aliases */}
              <Route path="/today" element={<Navigate to="/" replace />} />
              <Route path="/inbox" element={<Navigate to="/tasks" replace />} />
              <Route path="/projects" element={<Navigate to="/tasks" replace />} />
              <Route path="/settings" element={<Navigate to="/profile" replace />} />
              <Route path="/progress" element={<Navigate to="/analytics" replace />} />
              <Route path="/explore" element={<Navigate to="/tasks" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
