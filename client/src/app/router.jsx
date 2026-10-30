// client/src/app/router.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { LandingPage } from '../pages/LandingPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { CreateCasePage } from '../pages/CreateCasePage.jsx';
import { InvestigationPage } from '../pages/InvestigationPage.jsx';
import { CaseRevealPage } from '../pages/CaseRevealPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-noir-950 flex items-center justify-center text-xs font-mono text-noir-400">Loading credentials...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <LandingPage />
      </AppLayout>
    )
  },
  {
    path: '/login',
    element: (
      <AppLayout hideFooter>
        <LoginPage />
      </AppLayout>
    )
  },
  {
    path: '/register',
    element: (
      <AppLayout hideFooter>
        <RegisterPage />
      </AppLayout>
    )
  },
  {
    path: '/dashboard',
    element: (
      <AppLayout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </AppLayout>
    )
  },
  {
    path: '/create',
    element: (
      <AppLayout>
        <CreateCasePage />
      </AppLayout>
    )
  },
  {
    path: '/investigation/:caseId',
    element: (
      <AppLayout hideFooter>
        <InvestigationPage />
      </AppLayout>
    )
  },
  {
    path: '/reveal/:caseId',
    element: (
      <AppLayout>
        <CaseRevealPage />
      </AppLayout>
    )
  },
  {
    path: '*',
    element: (
      <AppLayout>
        <NotFoundPage />
      </AppLayout>
    )
  }
]);
