import { createApiClient } from "../api/apiClient";

const isActivated = async (user_id: string) => {
    const apiClient = createApiClient('auth');

    try {
        const response = await apiClient.get(`/verify/${user_id}`)
        console.log(response)
        return response.data;
    } catch (e) {
        console.error(e)
        throw e;

    }
}

export default isActivated