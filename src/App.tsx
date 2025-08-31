import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Navigation } from './components/Layout/Navigation';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { ChatInterface } from './components/Chat/ChatInterface';
import { ProgressForm } from './components/Progress/ProgressForm';
import { ProgressDashboard } from './components/Progress/ProgressDashboard';
import { PremiumUpgrade } from './components/Payments/PremiumUpgrade';
import { PaymentSuccess } from './components/Payments/PaymentSuccess';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Main App Layout
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ChatInterface />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <ProgressForm />
                  </div>
                  <div className="lg:col-span-2">
                    <ProgressDashboard />
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/premium" element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PremiumUpgrade />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

