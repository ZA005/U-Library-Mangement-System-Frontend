import { createApiClient } from "../api/apiClient";
import { UserData } from "../../types";

const getUserData = async (user_id: string): Promise<UserData> => {
    const apiClient = createApiClient('public/user')

    try {
        const response = await apiClient.get(`/${user_id}`)
        console.log(response.data)
        return response.data;
    } catch (e) {
        console.error(e)
        throw (e)
    }
}

export default getUserData