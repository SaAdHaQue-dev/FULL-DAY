import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { PracticePage } from './pages/PracticePage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              {/* Zero Sign-in Barrier */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />

              {/* 5 Primary App Shell Views matching image */}
              <Route
                path="/"
                element={
                  <AppShell>
                    <DashboardPage />
                  </AppShell>
                }
              />
              <Route
                path="/explore"
                element={
                  <AppShell>
                    <ExplorePage />
                  </AppShell>
                }
              />
              <Route
                path="/practice"
                element={
                  <AppShell>
                    <PracticePage />
                  </AppShell>
                }
              />
              <Route
                path="/progress"
                element={
                  <AppShell>
                    <ProgressPage />
                  </AppShell>
                }
              />
              <Route
                path="/profile"
                element={
                  <AppShell>
                    <ProfilePage />
                  </AppShell>
                }
              />

              {/* Aliases for quick compatibility */}
              <Route path="/tasks" element={<Navigate to="/explore" replace />} />
              <Route path="/calendar" element={<Navigate to="/practice" replace />} />
              <Route path="/analytics" element={<Navigate to="/progress" replace />} />
              <Route path="/settings" element={<Navigate to="/profile" replace />} />

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
