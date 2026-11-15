import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';
import { InboxPage } from './pages/InboxPage';
import { TodayPage } from './pages/TodayPage';
import { UpcomingPage } from './pages/UpcomingPage';
import { AllTasksPage } from './pages/AllTasksPage';
import { CompletedPage } from './pages/CompletedPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              {/* Personal Web App: All routes are instantly unlocked with zero sign-in friction */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />

              {/* Core Application Views wrapped in AppShell */}
              <Route
                path="/"
                element={
                  <AppShell>
                    <DashboardPage />
                  </AppShell>
                }
              />
              <Route
                path="/inbox"
                element={
                  <AppShell>
                    <InboxPage />
                  </AppShell>
                }
              />
              <Route
                path="/today"
                element={
                  <AppShell>
                    <TodayPage />
                  </AppShell>
                }
              />
              <Route
                path="/upcoming"
                element={
                  <AppShell>
                    <UpcomingPage />
                  </AppShell>
                }
              />
              <Route
                path="/tasks"
                element={
                  <AppShell>
                    <AllTasksPage />
                  </AppShell>
                }
              />
              <Route
                path="/completed"
                element={
                  <AppShell>
                    <CompletedPage />
                  </AppShell>
                }
              />
              <Route
                path="/projects"
                element={
                  <AppShell>
                    <ProjectsPage />
                  </AppShell>
                }
              />
              <Route
                path="/calendar"
                element={
                  <AppShell>
                    <CalendarPage />
                  </AppShell>
                }
              />
              <Route
                path="/analytics"
                element={
                  <AppShell>
                    <AnalyticsPage />
                  </AppShell>
                }
              />
              <Route
                path="/settings"
                element={
                  <AppShell>
                    <SettingsPage />
                  </AppShell>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
