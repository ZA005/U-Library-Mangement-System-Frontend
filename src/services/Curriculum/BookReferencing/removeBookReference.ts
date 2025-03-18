import { createApiClient } from "../../api/apiClient";

const removeBookReference = async (id: number): Promise<void> => {
    const apiClient = createApiClient("public/reference")
    try {
        const response = await apiClient.delete(`/remove/${id}`);
        return response.data
    } catch (e) {
        console.error(e)
        throw e
    }
}

export default removeBookReference