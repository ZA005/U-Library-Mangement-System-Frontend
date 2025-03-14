import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import AppRoutes from "./AppRoutes";

const RoutesWrapper = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default RoutesWrapper;
