import { createApiClient } from "../api/apiClient";
import { UserData } from "../../types";

const uploadUsers = async (users: UserData[]): Promise<UserData[]> => {
    const apiClient = createApiClient('public/users')

    try {
        console.log("TO BE UPLOADED", users)
        const response = await apiClient.post<UserData[]>(`/upload`, users, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default uploadUsers