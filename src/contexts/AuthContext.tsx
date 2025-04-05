import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { GENERAL_ROUTES } from "../config/routeConfig";
import { useSnackbarContext } from "./SnackbarContext";
import { AuthContextType } from "../types";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const showSnackbar = useSnackbarContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const safeStorageGet = (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch (err) {
            console.warn(`Storage getItem failed for key "${key}"`, err);
            return null;
        }
    };

    const safeStorageSet = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (err) {
            console.warn(`Storage setItem failed for key "${key}"`, err);
        }
    };

    const safeStorageClear = () => {
        try {
            localStorage.clear();
        } catch (err) {
            console.warn("Storage clear failed", err);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = safeStorageGet("token");
            const savedRole = safeStorageGet("role");
            const savedId = safeStorageGet("id");

            if (token && savedRole) {
                const { isTokenExpired } = await import("../utils/jwtUtils");
                if (!isTokenExpired(token)) {
                    setIsAuthenticated(true);
                    setRole(savedRole);
                    setId(savedId);
                } else {
                    navigate(GENERAL_ROUTES.HOME);
                    showSnackbar("Your session has expired. Redirecting to the landing page...", "info");
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
        safeStorageSet("token", token);
        safeStorageSet("role", role);
        safeStorageSet("id", user_id);
        setIsAuthenticated(true);
        setRole(role);
        setId(user_id);
        const { isTokenExpired } = await import("../utils/jwtUtils");
        if (isTokenExpired(token)) {
            logout();
        }
    };

    const logout = () => {
        safeStorageClear();
        setIsAuthenticated(false);
        setRole(null);
    };

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, id, login, logout }}>
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
