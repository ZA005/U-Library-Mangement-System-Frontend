export interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string, role: string, user_id: string) => void;
    logout: () => void;
}

export interface LoginResponse {
    statusCode: number;
    user_id: string;
    token?: string;
    role?: string;
    refreshToken?: string;
    expirationTime?: string;
    message: string;
}