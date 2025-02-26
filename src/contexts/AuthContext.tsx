import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthContextType } from "../types";
import { isTokenExpired } from "../utils/jwtUtils";

/**
 * AuthContext provides authentication state and methods.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component wraps the app and provides authentication context.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");

        if (token && savedRole && !isTokenExpired(token)) {
            setIsAuthenticated(true);
            setRole(savedRole);
        } else {
            logout(); // Logout if token is expired or doesn't exist
        }

        setIsInitialized(true); // Mark initialization complete.
    }, []);

    /**
     * login function saves token and role in localStorage and updates state.
     */
    const login = (token: string, role: string, user_id: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", user_id)
        setIsAuthenticated(true);
        setRole(role);

        if (isTokenExpired(token)) {
            logout(); // Log out immediately if token is expired
        }
    };

    /**
     * logout function clears the authentication data from local storage and resets state.
     */
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

/**
 * Custom hook for consuming authentication context.
 * Throws an error if used outside AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
