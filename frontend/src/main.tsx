import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';

import Home from './pages/home';
import Workspaces from './pages/workspaces';
import AuthPage from './pages/auth';
import BoardPage from './pages/board';
import ProjectsPage from './pages/projects';
import WorkspaceFormPage from './pages/workspaces/workspace-form';
import { ProtectedRoute } from './components/auth/protected-route';
import ProjectOverviewPage from './pages/projects/project-overview';
import IssueOverviewPage from './pages/board/issue-overview';
import PasswordResetRequestPage from './pages/auth/password-reset-request';
import PasswordResetPage from './pages/auth/password-reset';
import BoardLayout from './components/board/board-layout';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/signup" element={<AuthPage type="signup" />} />
          <Route
            path="/reset-password-request"
            element={<PasswordResetRequestPage />}
          />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/workspaces/create" element={<WorkspaceFormPage />} />
            <Route
              path="/workspaces/:workspaceId/edit"
              element={<WorkspaceFormPage />}
            />
            <Route path="/workspaces/:workspaceId" element={<BoardLayout />}>
              <Route index element={<BoardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route
                path="projects/:projectId"
                element={<ProjectOverviewPage />}
              />
              <Route path="issues/:issueId" element={<IssueOverviewPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
