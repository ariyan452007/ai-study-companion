import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { Layout } from '@/components/layout/Layout';

// Lazy load Pages for better performance
const Login = React.lazy(() => import('@/pages/Login').then((module) => ({ default: module.Login })));
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Subjects = React.lazy(() => import('@/pages/Subjects').then((module) => ({ default: module.Subjects })));
const Tasks = React.lazy(() => import('@/pages/Tasks').then((module) => ({ default: module.Tasks })));
const AITools = React.lazy(() => import('@/pages/AITools').then((module) => ({ default: module.AITools })));

// Loading fallback component
const PageLoader = () =>
<div className="flex h-screen w-full items-center justify-center bg-background/50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>;


function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
              
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="subjects" element={<Subjects />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="ai-tools" element={<AITools />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </DataProvider>
    </AuthProvider>);

}

export default App;