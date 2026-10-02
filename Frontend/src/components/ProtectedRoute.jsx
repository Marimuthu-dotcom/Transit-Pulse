import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTransit } from '../context/TransitContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useTransit();
  const location = useLocation();

  // While we're still checking the session, don't redirect — show a loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center text-white">
        <div className="animate-pulse text-sm text-gray-400">Checking session…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save where the user was going, so we can return them there after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}