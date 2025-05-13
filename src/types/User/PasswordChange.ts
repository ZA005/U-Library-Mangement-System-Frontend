export interface PasswordChange {
    password: string;
    currentPassword?: string;
}

export interface ResetPasswordInput {
    userId: string;
    password: string;
    currentPassword?: string;
}