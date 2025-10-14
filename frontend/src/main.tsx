import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';

import Home from './pages/home';
import Workspaces from './pages/workspaces';
import AuthPage from './pages/auth';
import WorkspaceFormPage from './pages/workspaces/workspace-form';
import { ProtectedRoute } from './components/auth/protected-route';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/signup" element={<AuthPage type="signup" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/workspaces/create" element={<WorkspaceFormPage />} />
            <Route
              path="/workspaces/:workspaceId/edit"
              element={<WorkspaceFormPage />}
            />
            {/* <Route path="/workspaces/:workspaceId" element={<Board />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
