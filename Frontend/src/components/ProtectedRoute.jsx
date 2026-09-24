import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTransit } from '../context/TransitContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useTransit();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
