// AdminAuthGuard.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminAuthGuard = ({ children }) => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminAuthGuard;