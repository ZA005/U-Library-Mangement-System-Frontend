export interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string, role: string) => void;
    logout: () => void;
}

export interface LoginResponse {
    statusCode: number;
    token?: string;
    role?: string;
    refreshToken?: string;
    expirationTime?: string;
    message: string;
}