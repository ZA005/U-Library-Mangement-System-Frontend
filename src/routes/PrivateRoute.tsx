import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
    allowedRoles: string[];
    redirectPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    allowedRoles,
    redirectPath = "/",
}) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
