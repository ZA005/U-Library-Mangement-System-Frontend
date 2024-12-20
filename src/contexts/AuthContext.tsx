import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

    useEffect(() => {
        // Sync role and authentication status with localStorage on mount
        setIsAuthenticated(!!localStorage.getItem('token'));
        setRole(localStorage.getItem('role'));
    }, []);

    const login = (token: string, role: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setIsAuthenticated(true);
        setRole(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};