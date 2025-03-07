import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthResponse } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';

export const useLogin = (onSuccessCallback: () => void) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login: authLogin } = useAuth();

    const login = useMutation<AuthResponse, Error, { userId: string; password: string }>({
        mutationFn: async ({ userId, password }) => {
            const { default: login } = await import("../../../services/Authentication/login")
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
            return login(userId, password);
        },
        onSuccess: (data) => {
            console.log('Login successful', data);
            if (data.token && data.role && data.user_id) {
                authLogin(data.token, data.role, data.user_id);
                onSuccessCallback();
            } else {
                setErrorMessage('Login failed: Missing token or role.');
            }
        },
        onError: () => {
            setErrorMessage('Incorrect UNC ID or Password.');
        },
    });

    return { login, errorMessage, setErrorMessage };
};
