import { createApiClient } from "../../api/apiClient";

const removeCriteria = async (criteriaId: number): Promise<void> => {
    const apiClient = createApiClient("admin");
    try {
        const response = await apiClient.delete(`/weeding-criteria/${criteriaId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to remove weeding criteria:', error);
        throw error;
    }
}
export default removeCriteria;