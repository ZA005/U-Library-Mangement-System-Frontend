import { createApiClient } from "../api/apiClient";
import { AuthResponse } from "../../types";

const login = async (user_id: string, password: string): Promise<AuthResponse> => {
    const apiClient = createApiClient('auth');
    try {
        const response = await apiClient.post<AuthResponse>('/login', {
            user_id,
            password,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default login;