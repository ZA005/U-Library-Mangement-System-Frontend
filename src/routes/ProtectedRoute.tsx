// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have useAuth context to access the user info

interface ProtectedRouteProps {
  allowedRoles: string[];  // Define which roles are allowed for this route
  redirectPath: string;    // Path to redirect if unauthorized
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath
}) => {
  const { isAuthenticated } = useAuth(); // Use isAuthenticated to check if the user is logged in
  const role = localStorage.getItem('role'); // Get the role from localStorage (as per your context)
  console.log('ProtectedRoute: isAuthenticated =', isAuthenticated, ', role =', role);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />; // If not authenticated, redirect to the login page
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={redirectPath} />; // If user doesn't have the right role, redirect
  }

  return <Outlet />; // If authorized, render child routes
};

export default ProtectedRoute;