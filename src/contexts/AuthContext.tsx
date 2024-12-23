import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");
        if (token && savedRole) {
            setIsAuthenticated(true);
            setRole(savedRole);
        }
    }, []); // Runs only on initial render

    const login = (token: string, role: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setIsAuthenticated(true);
        setRole(role);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
