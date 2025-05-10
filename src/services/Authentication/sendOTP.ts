import { createApiClient } from "../api/apiClient";
import { UserData } from "../../types";
// accept user_id as an argument then use the user_id in the backend to send otp on the user email
const sendOTP = async (user_id: string, isActivation: boolean): Promise<UserData> => {
    const apiClient = createApiClient('verify');
    try {
        const response = await apiClient.get(`/${user_id}/${isActivation}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default sendOTP;