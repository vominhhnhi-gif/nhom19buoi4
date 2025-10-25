import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);

  // If no token or user, redirect to login
  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
