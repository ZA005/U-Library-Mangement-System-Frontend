import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Interface for ProtectedRouteProps defines:
 * - allowedRoles: Array of roles allowed to access this route.
 * - redirectPath: Path to redirect unauthorized users.
 */
interface ProtectedRouteProps {
  allowedRoles: string[]; // Define which roles are allowed for this route.
  redirectPath: string;    // Path to redirect if unauthorized.
}

/**
 * ProtectedRoute component ensures that only authenticated users with appropriate roles
 * can access specific routes. If unauthorized, it redirects to the specified path.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath
}) => {
  // Destructure the authentication state and role from the AuthContext.
  const { isAuthenticated, role } = useAuth();

  /**
   * If the user is not authenticated, redirect them to the login or another public route.
   */
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  /**
   * If the user's role is not in the allowedRoles list, redirect them to the unauthorized path.
   */
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={redirectPath} />;
  }

  /**
   * If the user is authenticated and has an allowed role, render the child routes.
   */
  return <Outlet />;
};

export default ProtectedRoute;