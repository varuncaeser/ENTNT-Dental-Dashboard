// src/components/common/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an Admin, redirect to a different dashboard or unauthorized page
  if (!isAdmin) {
    return <Navigate to="/patient/dashboard" replace />; // Or a generic unauthorized page
  }

  return <Outlet />;
};

export default AdminRoute;