export interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string, role: string, user_id: string) => void;
    logout: () => void;
}

export interface AuthResponse {
    statusCode: number;
    user_id: string;
    password: string;
    token?: string;
    role?: string;
    refreshToken?: string;
    expirationTime?: string;
    message: string;
}

export interface UserData {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    role: string;
    contactNo: string;
    emailAdd: string;
    status: number;
    department: string;
    program: string;
}

export interface AccountData {
    id: number;
    user_id: string;
    password: string;
    role: string;
}