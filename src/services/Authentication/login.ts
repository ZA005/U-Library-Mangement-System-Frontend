import { createApiClient } from "../api/apiClient";
import { LoginResponse } from "../../types";
/**
 * Logs in the user by calling the authentication API and returns the response.
 * @param user_id The user's ID
 * @param password The user's password
 * @returns A promise that resolves with the login response
 */

export const login = async (user_id: string, password: string): Promise<LoginResponse> => {
    const apiClient = createApiClient('auth');
    try {
        const response = await apiClient.post<LoginResponse>('/login', {
            user_id,
            password,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};