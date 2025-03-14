import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
    allowedRoles: string[];
    redirectPath?: string;
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    allowedRoles,
    redirectPath = "/",
    children
}) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};


export default PrivateRoute;
