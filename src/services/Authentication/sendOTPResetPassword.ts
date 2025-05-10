import { UserData } from "../../types";
import { createApiClient } from "../api/apiClient";

const sendOTPResetpass = async (user_id: string, isActivation: boolean): Promise<UserData> => {
    const apiClient = createApiClient('verify');
    try {
        const response = await apiClient.get(`reset-password/${user_id}/${isActivation}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default sendOTPResetpass;