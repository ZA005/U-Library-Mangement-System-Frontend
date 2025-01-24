import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

/**
 * AuthContextType defines the structure for authentication-related state and methods.
 * - isAuthenticated: Tracks if the user is logged in.
 * - role: The current role of the authenticated user (e.g., LIBRARIAN, USER).
 * - login: Method to log in a user, storing the token and role in local storage.
 * - logout: Method to log out a user, clearing token and role from local storage.
 */
interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

// Helper function to decode the JWT token and extract the expiration time
const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component wraps the application to provide authentication context.
 * It manages authentication state and exposes it to child components via the AuthContext.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // State variables to track authentication and user role.
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false); // Tracks if context has been initialized.

    // check if the token is expired
    const isTokenExpired = (token: string) => {
        const decodedToken = decodeJwt(token);
        const exp = decodedToken.exp * 1000; // exp is in seconds, convert to milliseconds
        const currentTime = new Date().getTime();
        return currentTime >= exp;
    };
    /**
     * useEffect runs once during the component's lifecycle (on mount).
     * It reads token and role from local storage and sets the state accordingly.
     * The isInitialized flag ensures the app doesn't render sensitive components until context is ready.
     */

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");

        if (token && savedRole) {
            if (isTokenExpired(token)) {
                logout(); // Logout if token is expired
            } else {
                setIsAuthenticated(true);
                setRole(savedRole);
            }
        }

        setIsInitialized(true); // Mark initialization complete.
    }, []);

    /**
     * login function saves the token and role to local storage and updates the state.
     * @param token - Authentication token for the user.
     * @param role - Role of the user (e.g., LIBRARIAN).
     */

    const login = (token: string, role: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setIsAuthenticated(true);
        setRole(role);

        // Check if token is expired right after login
        if (isTokenExpired(token)) {
            logout(); // Token expired immediately after login, log out the user
        }
    };
    /**
     * logout function clears the authentication data from local storage and resets the state.
     */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
    };

    /**
     * Render a loading indicator while context is initializing.
     */
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
 * Custom hook to simplify access to AuthContext.
 * Throws an error if used outside an AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};