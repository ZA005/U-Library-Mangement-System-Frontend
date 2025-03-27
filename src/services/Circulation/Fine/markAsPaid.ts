import { createApiClient } from "../../api/apiClient";

const markAsPaid = async (id: number) => {
    const apiClient = createApiClient("admin/fine")
    try {
        const response = await apiClient.put(`/paid/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

export default markAsPaid