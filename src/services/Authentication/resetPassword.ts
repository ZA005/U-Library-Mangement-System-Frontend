import { UserData } from "../../types";
import { createApiClient } from "../api/apiClient";

const resetPassword = async (userId: string, password: string): Promise<UserData> => {
    const apiClient = createApiClient('auth');
    try {
        const response = await apiClient.post(`/reset-password/${userId}`, { password });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export default resetPassword;