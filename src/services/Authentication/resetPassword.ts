import { UserData } from "../../types";
import { PasswordChange } from "../../types/User/PasswordChange";
import { createApiClient } from "../api/apiClient";

const resetPassword = async (userId: string, passwordChange: PasswordChange): Promise<UserData> => {
    const apiClient = createApiClient('auth');
    try {
        const response = await apiClient.post(`/reset-password/${userId}`, passwordChange);
        return response.data;
    } catch (error) {
        console.error("API error:", error);
        throw error;
    }
};

export default resetPassword;