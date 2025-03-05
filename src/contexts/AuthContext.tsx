import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");
            const savedRole = localStorage.getItem("role");

            if (token && savedRole) {
                const { isTokenExpired } = await import("../utils/jwtUtils");
                if (!isTokenExpired(token)) {
                    setIsAuthenticated(true);
                    setRole(savedRole);
                } else {
                    logout();
                }
            } else {
                logout();
            }

            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

    const login = async (token: string, role: string, user_id: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", user_id);
        setIsAuthenticated(true);
        setRole(role);

        const { isTokenExpired } = await import("../utils/jwtUtils");
        if (isTokenExpired(token)) {
            logout();
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setRole(null);
    };

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
