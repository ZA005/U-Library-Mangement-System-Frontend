import { createApiClient } from "../../api/apiClient";

export const getIndividualFine = async (id: string): Promise<number> => {
    const apiClient = createApiClient("public")

    try {
        const response = await apiClient.get(`/fine/active/${id}`)
        return response.data
    } catch (e) {
        console.error(e)
        throw e
    }
}
