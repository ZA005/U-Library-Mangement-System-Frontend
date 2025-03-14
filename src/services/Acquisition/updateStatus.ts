import { createApiClient } from "../api/apiClient";

const updateStatus = async (id: number): Promise<boolean> => {
    const apiClient = createApiClient('verify')

    try {
        const response = await apiClient.post(`/acquisition/update-status/${id}`, null, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        return response.data;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default updateStatus