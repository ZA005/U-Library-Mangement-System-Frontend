import { createApiClient } from "../../api/apiClient";

const markAsPaid = async (id: number) => {
    const apiClient = createApiClient("admin/fine")
    try {
        const response = await apiClient.put(`/paid/${id}`);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data || "An unexpected error occurred. Please try again.";
        throw new Error(errorMessage);
    }
};

export default markAsPaid